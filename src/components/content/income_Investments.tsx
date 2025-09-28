import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid
import { getAllInvestments, getAllDividends } from '../../services/pgConnections';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { resourceProperties as res } from '../../resources/resource_properties';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import { DateCellFormatter, HtmlTooltip } from '../../utils/sharedFunctions';
import { Stack, Theme } from '@mui/material';
import InputInvestmentTaxesModal from '../minor/Modal_InputInvestmentTaxes';
import InputInvestmentDividendsModal from '../minor/Modal_InputInvestmentDividends';
import { RouteInfo, TwelveCharacterString } from '../../types/custom/customTypes';
import { locales } from '../../utils/localeConfiguration';

interface CustomBoughtSoldChipProps {
  value: string;
}

const CustomBoughtSoldChip = (props: CustomBoughtSoldChipProps) => {
  return props.value === res.INCOME_INVESTMENTS_EXECUTION_TYPE_BUY_KEY ? (
    <Chip
      sx={{ borderWidth: 0, fontWeight: 600 }}
      label={res.INCOME_INVESTMENTS_EXECUTION_TYPE_BUY_KEY}
      variant="outlined"
      color="primary"
    />
  ) : (
    <Chip
      sx={{ borderWidth: 0, fontWeight: 600 }}
      label={res.INCOME_INVESTMENTS_EXECUTION_TYPE_SELL_KEY}
      variant="outlined"
      color="success"
    />
  );
};

interface IsinNationalFlagRendererProps {
  value: string;
}
/**
 * Custom Cell Renderer displaying unicode country flags based on first two letters of ISIN
 * @param {IsinNationalFlagRendererProps} props
 * @returns Flag + whitespace + ISIN
 */
const IsinNationalFlagRenderer = (props: IsinNationalFlagRendererProps) => (
  <span style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center' }}>
    {props.value && props.value.length > 2 ? getUnicodeFlagIcon(props.value.substring(0, 2)) : null}
    <p style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>&nbsp;{props.value}</p>
  </span>
);

const currencyFormatter = (params: any) => {
  return params.value.toFixed(2) + ' ' + res.CURRENCY_EURO;
};

const unitsFormatter = (params: any) => {
  return Number(params.value) + ' ' + res.PIECES_SHORT;
};

const percentageFormatter = (params: any) => {
  return params.value.toFixed(2) + ' ' + res.SYMBOL_PERCENT;
};

interface Income_InvestmentsProps {
  routeInfo: RouteInfo;
}

/**
 * Contains two ag-grid datatables that can be filtered, sorted, searched and clicked for additional (overlay) information:
 * - One for Investments such as stocks and ETFs, that can simply be inserted as BUY or SELL
 * - One for dividends that relate to specific investments. Which investments they relate to is calculated with an algorithm utilizing the date of purchases and sales
 * of applicable investments and the date of dividend distribution.
 * Contains a Modal for adding new Investments and new Dividends to the DB. Dividend Addition is dependent on Investments and uses ISIN as JOIN criteria.
 * @param {Income_InvestmentsProps} _props
 * @returns
 */
export default function Income_Investments(_props: Income_InvestmentsProps) {
  const { palette } = useTheme();
  // db data
  const [allInvestments, setAllInvestments] = useState<any>();
  const [allDividends, setAllDividends] = useState<any>();
  const [uniqueIsinArray, setUniqueIsinArray] = useState<TwelveCharacterString[]>([]);
  // ag-grid
  const [investmentRowData, setInvestmentRowData] = useState([]);
  const [dividendRowData, setDividendRowData] = useState([]);
  const [investmentColumnDefinitions, setInvestmentColumnDefinitions] = useState<any[]>([]);
  const [dividendColumnDefinitions, setDividendColumnDefinitions] = useState<any[]>([]);
  const [updatedOrAddedItemFlag, setUpdatedOrAddedItemFlag] = useState<React.SetStateAction<number>>();
  // Reference to grid API
  const investmentGridRef = useRef<AgGridReact>(null);
  const dividendGridRef = useRef<AgGridReact>(null);

  // ON PAGE LOAD
  useEffect(() => {
    const getInvestmentData = async () => {
      const allInvestments = await getAllInvestments();
      const allDividends = await getAllDividends();
      setInvestmentRowData(allInvestments.results);
      setDividendRowData(allDividends.results);
      setAllInvestments(allInvestments.results);
      setAllDividends(allDividends.results);
      setUniqueIsinArray(Array.from(new Set(allInvestments.results.map((e: any) => e.isin))));
    };
    getInvestmentData();
  }, [updatedOrAddedItemFlag]);

  /**
   * Reads Profits, Taxes and Calculates Net Gain of any Sales, otherwise just returns the formatted Total Value
   * @param {*} props
   * @returns
   * For Sales: Custom React Component listing Sales Price, with a Tooltip Overlay containing Profit and Tax Information
   * For Purchases: Total Value in € for Purchases
   */
  const SalesProfitMinusTaxes = (props: any) => {
    if (allInvestments && props?.data?.execution_type === res.INCOME_INVESTMENTS_EXECUTION_TYPE_SELL_KEY) {
      const grossProfit = props?.data?.profit_amt ? parseFloat(props.data.profit_amt) : null;
      const taxPaid = props?.data?.tax_paid ? parseFloat(props.data.tax_paid) : null;
      const netProfit = grossProfit && taxPaid ? grossProfit - taxPaid : grossProfit;
      return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Stack>
                <Typography sx={{ color: palette.primary.main }}>
                  {locales().INCOME_INVESTMENTS_TOOLTIP_PROFIT_AMT_GROSS +
                    grossProfit?.toFixed(2) +
                    ' ' +
                    res.CURRENCY_EURO}
                </Typography>
                <Typography sx={{ color: palette.error.main }}>
                  {locales().INCOME_INVESTMENTS_TOOLTIP_TAXED_AMT + taxPaid?.toFixed(2) + ' ' + res.CURRENCY_EURO}
                </Typography>
                <Typography sx={{ color: palette.success.main }}>
                  {locales().INCOME_INVESTMENTS_TOOLTIP_PROFIT_AMT_NET +
                    netProfit?.toFixed(2) +
                    ' ' +
                    res.CURRENCY_EURO}
                </Typography>
              </Stack>
            </React.Fragment>
          }
        >
          <Box>
            {props.value.toFixed(2) + ' ' + res.CURRENCY_EURO}
            <Chip
              sx={{
                marginLeft: 0.8,
                marginBottom: 0.8,
                marginTop: 0.4,
                fontWeight: 500,
                fontSize: '120%',
                borderWidth: 2,
                float: 'right'
              }}
              label="i"
              variant="outlined"
              color="success"
            />
          </Box>
        </HtmlTooltip>
      );
    } else {
      return props.value.toFixed(2) + ' ' + res.CURRENCY_EURO;
    }
  };

  /**
   * After clicking on the number displaying aggregated Row Count a new Grid is displayed containing individual rows within the aggregate
   * @param {*} props
   * @returns Chip with onClick Listener displaying a DataGrid Modal with individual rows
   */
  const VisualizeOnAggregateRows = ({ value, investments }: any) => {
    const [open, setOpen] = useState(false);
    const [aggregateRowsColumnDefinitions, setAggregateRowsColumnDefinitions] = useState<any[]>([]);
    // breakpoints
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

    useEffect(() => {
      setAggregateRowsColumnDefinitions([
        { field: res.INCOME_INVESTMENTS_DB_COL_NAME_DESCRIPTION, flex: 1.5, minWidth: 200 },
        {
          field: res.INCOME_INVESTMENTS_DB_COL_NAME_ISIN,
          headerName: locales().INCOME_INVESTMENTS_COL_HEADER_ISIN,
          cellRenderer: IsinNationalFlagRenderer,
          minWidth: 150
        },
        {
          field: res.INCOME_INVESTMENTS_DB_COL_NAME_INVESTMENT_TYPE,
          headerName: locales().INCOME_INVESTMENTS_COL_HEADER_TYPE,
          flex: 0.5
        },
        { field: res.INCOME_INVESTMENTS_DB_COL_NAME_UNITS, valueFormatter: unitsFormatter, flex: 0.5 },
        {
          field: res.INCOME_INVESTMENTS_DB_COL_NAME_PRICE_PER_UNIT,
          headerName: locales().INCOME_INVESTMENTS_COL_HEADER_UNIT_PRICE,
          valueFormatter: currencyFormatter,
          flex: 0.5
        },
        { field: res.INCOME_INVESTMENTS_DB_COL_NAME_FEES, valueFormatter: currencyFormatter, flex: 0.5 },
        {
          field: res.INCOME_INVESTMENTS_DB_COL_NAME_TOTAL_PRICE,
          headerName: locales().INCOME_INVESTMENTS_COL_HEADER_TOTAL,
          valueFormatter: currencyFormatter,
          flex: 0.5
        },
        {
          field: res.INCOME_INVESTMENTS_DB_COL_NAME_EXECUTION_DATE,
          headerName: locales().INCOME_INVESTMENTS_COL_HEADER_DATE,
          cellRenderer: DateCellFormatter,
          minWidth: 135
        }
      ]);
    }, [allInvestments, open]);

    if (allInvestments && value && value > 1) {
      // Filter all Investments to the Ids contained within aggregated dividends
      const investmentIds = investments.split(',').map(Number); // Map String Array to Number Array
      const filteredInvestments = allInvestments.filter((e: any) => investmentIds.includes(Number(e.id)));
      return (
        <>
          <Tooltip title="Click to reveal individual positions." placement="left">
            <Chip
              sx={{ borderWidth: 2 }}
              onClick={() => setOpen(true)}
              label={value}
              variant="outlined"
              color="secondary"
            />
          </Tooltip>
          <Modal open={open} onClose={() => setOpen(false)}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isSmallScreen ? '100%' : '70%',
                boxShadow: 24
              }}
            >
              <div
                className={palette.mode === 'light' ? res.AG_GRID_STYLE_LIGHT : res.AG_GRID_STYLE_DARK} // applying the grid theme
              >
                {allInvestments ? (
                  <AgGridReact
                    domLayout="autoHeight"
                    rowData={filteredInvestments}
                    columnDefs={aggregateRowsColumnDefinitions}
                    defaultColDef={{
                      filter: false,
                      floatingFilter: false,
                      flex: 1,
                      resizable: false,
                      minWidth: 95,
                      wrapText: true,
                      autoHeight: true
                    }}
                    pagination={false}
                  />
                ) : null}
              </div>
            </Box>
          </Modal>
        </>
      );
    } else {
      // if no aggregate is present, display nothing
      return null;
    }
  };

  /**
   * Resets the Grid to the initial state after page load.
   */
  const resetAgGridToInitialState = useCallback((gridRef: any) => {
    gridRef.current.api.setFilterModel(null); // Reset Filters
    gridRef.current.api.resetColumnState(); // Reset Sorting
  }, []);

  const defaultColDef = useMemo(
    () => ({
      filter: true,
      floatingFilter: true,
      flex: 1,
      resizable: false,
      minWidth: 100,
      wrapText: false,
      autoHeight: false
    }),
    []
  );

  // AFTER allInvestments have been filled on page load
  useEffect(() => {
    setInvestmentColumnDefinitions([
      { field: res.INCOME_INVESTMENTS_DB_COL_NAME_ID },
      {
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_EXECUTION_TYPE,
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_EXECUTION_TYPE,
        cellRenderer: (p: any) => <CustomBoughtSoldChip value={p.value} />,
        minWidth: 80,
        cellStyle: () => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_DESCRIPTION,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_DESCRIPTION,
        flex: 2,
        minWidth: 200
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_ISIN,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_ISIN,
        cellRenderer: IsinNationalFlagRenderer,
        minWidth: 160
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_INVESTMENT_TYPE,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_TYPE
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_MARKETPLACE,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_MARKETPLACE,
        floatingFilter: false
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_UNITS,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_UNITS,
        valueFormatter: unitsFormatter,
        floatingFilter: false,
        filter: false
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_PRICE_PER_UNIT,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_UNIT_PRICE,
        valueFormatter: currencyFormatter,
        floatingFilter: false
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_FEES,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_FEES,
        valueFormatter: currencyFormatter,
        floatingFilter: false,
        filter: false
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_TOTAL_PRICE,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_TOTAL,
        cellRenderer: SalesProfitMinusTaxes,
        floatingFilter: false,
        minWidth: 140
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_EXECUTION_DATE,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_DATE,
        cellRenderer: DateCellFormatter,
        minWidth: 150
      }
    ]);
  }, [allInvestments]);

  // AFTER allDividends have been filled on page load
  useEffect(() => {
    setDividendColumnDefinitions([
      // { field: "id", },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_COUNT,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_AGGREGATE,
        cellRenderer: (p: any) => <VisualizeOnAggregateRows value={p.value} investments={p.data.investments} />,
        filter: false,
        minWidth: 70,
        cellStyle: () => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_DESCRIPTION,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_DESCRIPTION,
        flex: 2,
        minWidth: 200
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_ISIN,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_ISIN,
        cellRenderer: IsinNationalFlagRenderer,
        minWidth: 160
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_DIVIDEND_AMOUNT,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_DIVIDEND,
        filter: false,
        valueFormatter: currencyFormatter
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_PCT_OF_TOTAL,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_PCT_OF_TOTAL,
        filter: false,
        valueFormatter: percentageFormatter
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_AVG_PPU,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_AVG_PRICE,
        filter: false,
        valueFormatter: currencyFormatter
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_UNITS,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_UNITS,
        filter: false,
        valueFormatter: unitsFormatter
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_TOTAL_PRICE,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_TOTAL,
        filter: false,
        valueFormatter: currencyFormatter
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_FEES,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_FEES,
        filter: false,
        valueFormatter: currencyFormatter
      },
      {
        field: res.INCOME_INVESTMENTS_DB_COL_NAME_DIVIDEND_DATE,
        headerName: locales().INCOME_INVESTMENTS_COL_HEADER_DATE,
        cellRenderer: DateCellFormatter,
        minWidth: 150
      }
      /* { field: "investments", } */
    ]);
  }, [allInvestments, allDividends]);

  return (
    <>
      <Stack>
        <InputInvestmentTaxesModal refreshParent={setUpdatedOrAddedItemFlag} />
      </Stack>
      <Button color="error" variant="outlined" onClick={() => resetAgGridToInitialState(investmentGridRef)}>
        {res.RESET}
      </Button>
      <div
        className={palette.mode === 'light' ? res.AG_GRID_STYLE_LIGHT : res.AG_GRID_STYLE_DARK} // applying the grid theme
      >
        {allInvestments ? (
          <AgGridReact
            ref={investmentGridRef}
            rowData={investmentRowData}
            columnDefs={investmentColumnDefinitions}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
            pagination={true}
            paginationPageSize={12}
            paginationPageSizeSelector={[12, 20, 50]}
          />
        ) : null}
      </div>
      {uniqueIsinArray ? (
        <Stack sx={{ mt: 2 }}>
          <InputInvestmentDividendsModal
            refreshParent={setUpdatedOrAddedItemFlag}
            isinSelection={uniqueIsinArray}
            allInvestments={allInvestments}
          />
        </Stack>
      ) : null}
      <Button color="error" variant="outlined" onClick={() => resetAgGridToInitialState(dividendGridRef)}>
        {res.RESET}
      </Button>
      <div
        className={palette.mode === 'light' ? res.AG_GRID_STYLE_LIGHT : res.AG_GRID_STYLE_DARK} // applying the grid theme
      >
        {allInvestments && allDividends ? (
          <AgGridReact
            ref={dividendGridRef}
            rowData={dividendRowData}
            columnDefs={dividendColumnDefinitions}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
            pagination={true}
            paginationPageSize={12}
            paginationPageSizeSelector={[12, 20, 50]}
          />
        ) : null}
      </div>
    </>
  );
}
