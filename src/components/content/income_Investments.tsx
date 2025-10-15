import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import { getAllInvestments, getAllDividends, deleteDividend, deleteInvestment } from '../../services/pgConnections';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { resourceProperties as res, investmentInputCategories } from '../../resources/resource_properties';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { DateCellFormatter, HtmlTooltip, toastOptions } from '../../utils/sharedFunctions';
import { IconButton, Stack, Theme } from '@mui/material';
import InputInvestmentTaxesModal from '../minor/Modal_InputInvestmentTaxes';
import InputInvestmentDividendsModal from '../minor/Modal_InputInvestmentDividends';
import { InvestmentAndTaxes, RouteInfo, TwelveCharacterString } from '../../types/custom/customTypes';
import { locales } from '../../utils/localeConfiguration';
import { toast } from 'react-toastify';
import { themeMaterial } from 'ag-grid-community';
import ConfirmationDialog from '../minor/Dialog_Confirmation';

interface SellRowBtnProps {
  data: any;
  setIsInputInvestmentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOrderType: React.Dispatch<React.SetStateAction<string>>;
  setIsOrderTypeSale: React.Dispatch<React.SetStateAction<boolean>>;
  setPreInitializeInvestmentSaleObj: React.Dispatch<React.SetStateAction<InvestmentAndTaxes | undefined>>;
}
const SellRowBtn = (props: SellRowBtnProps) => {
  const renderSellBtn = props.data?.execution_type === res.INCOME_INVESTMENTS_EXECUTION_TYPE_BUY_KEY;

  const initializeInvestmentSale = async () => {
    props.setIsInputInvestmentModalOpen(true);
    props.setSelectedOrderType(investmentInputCategories.ARRAY_ORDER_TYPE[1]); // SELL - I know this index access is bad code.
    props.setIsOrderTypeSale(true);
    const preInitObject: InvestmentAndTaxes = {
      execution_type: `${props.data.execution_type}`,
      description: `${props.data.description}`,
      isin: props.data.isin as TwelveCharacterString,
      investment_type: `${props.data.investment_type}`,
      marketplace: `${props.data.marketplace}`,
      units: parseInt(props.data.units),
      price_per_unit: parseFloat(Number(props.data.price_per_unit).toFixed(2)),
      total_price: parseFloat(parseInt(props.data.total_price).toFixed(2)),
      fees: parseFloat(Number(props.data.fees).toFixed(2)),
      execution_date: new Date(props.data.execution_date),
      pct_of_profit_taxed: parseFloat(Number(props.data.pct_of_profit_taxed).toFixed(2)),
      profit_amt: parseFloat(Number(props.data.profit_amt).toFixed(2))
    };
    props.setPreInitializeInvestmentSaleObj(preInitObject);
  };
  return renderSellBtn ? (
    <React.Fragment>
      <Tooltip placement="left" title={locales().INCOME_INVESTMENTS_TOOLTIP_SELL_ROW_BTN}>
        <IconButton
          color="info"
          sx={{ paddingY: 0.2, paddingX: 1, marginRight: 0, marginY: 0, marginLeft: 0.5, align: 'right' }}
          onClick={() => initializeInvestmentSale()}
        >
          <MoneyOffIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  ) : null;
};

interface DeleteRowBtnProps {
  type: 'Investment' | 'Dividend';
  data: any;
  refreshParent: React.Dispatch<React.SetStateAction<number>>;
}
const DeleteRowBtn = (props: DeleteRowBtnProps) => {
  const { type, data, refreshParent } = props;
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const confirmationDialogText =
    type === 'Investment'
      ? data.description.substring(0, 15) +
        ' | ' +
        data.execution_type +
        ' | ' +
        data.execution_date +
        ' | ' +
        data.total_price +
        res.CURRENCY_EURO
      : data.description.substring(0, 15) +
        ' | ' +
        data.dividend_date +
        ' | ' +
        data.dividend_amount +
        res.CURRENCY_EURO;

  const deleteRow = async () => {
    const response = type === 'Investment' ? await deleteInvestment(data.id) : await deleteDividend(data.id);
    if ((response?.results[0]?.id && response.results[0].id) === data.id) {
      toast.success(locales().NOTIFICATIONS_INVESTMENT_OR_DIVIDEND_DELETED_SUCCESSFULLY(type, data.id), toastOptions);
      // to refresh parent's table based on returned id after successful DELETE request
      refreshParent(response.results[0].id);
    } else {
      toast.error(locales().NOTIFICATIONS_INVESTMENT_OR_DIVIDEND_DELETED_ERROR(type), toastOptions);
    }
  };
  return (
    <React.Fragment>
      <Tooltip placement="left" title={locales().GENERAL_DELETE_ROW_TOOLTIP}>
        <IconButton
          color="error"
          sx={{ paddingY: 0.2, paddingX: 1, marginRight: 0, marginY: 0, marginLeft: 0.5, align: 'right' }}
          onClick={() => setConfirmDeleteOpen(true)}
        >
          <ClearIcon />
        </IconButton>
      </Tooltip>
      <ConfirmationDialog
        title={locales().CONFIRMATION_DIALOG_TITLE_DELETE}
        text={confirmationDialogText}
        textColor="secondary"
        confirmBtnText={locales().GENERAL_DELETE}
        open={confirmDeleteOpen}
        setOpen={setConfirmDeleteOpen}
        handleConfirm={deleteRow}
      />
    </React.Fragment>
  );
};

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
  // INVESTMENTS INPUT MODAL BUY/SELL STATE
  const [isInputInvestmentModalOpen, setIsInputInvestmentModalOpen] = React.useState<boolean>(false);
  const [selectedInvestmentType, setSelectedInvestmentType] = React.useState(
    investmentInputCategories.ARRAY_INVESTMENT_TYPE[0]
  );
  const [selectedOrderType, setSelectedOrderType] = React.useState(investmentInputCategories.ARRAY_ORDER_TYPE[0]);
  const [isOrderTypeSale, setIsOrderTypeSale] = React.useState<boolean>(false);
  const [preInitializeInvestmentSaleObj, setPreInitializeInvestmentSaleObj] = React.useState<InvestmentAndTaxes>();
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
  // to refresh table based on deleted food item after DB deletion
  const [deletedInvestment, setDeletedInvestment] = useState<React.SetStateAction<number>>();
  const [deletedDividend, setDeletedDividend] = useState<React.SetStateAction<number>>();
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
  }, [updatedOrAddedItemFlag, deletedInvestment, deletedDividend]);

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
        <div
          data-ag-theme-mode={palette.mode} // applying light or dark mode
        >
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
              {allInvestments ? (
                <AgGridReact
                  theme={themeMaterial} // themeMaterial, themeQuartz, themeAlpine, themeBalham
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
            </Box>
          </Modal>
        </div>
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
      },
      {
        headerName: '',
        cellRenderer: (p: any) => (
          <SellRowBtn
            setPreInitializeInvestmentSaleObj={setPreInitializeInvestmentSaleObj}
            setIsOrderTypeSale={setIsOrderTypeSale}
            setIsInputInvestmentModalOpen={setIsInputInvestmentModalOpen}
            setSelectedOrderType={setSelectedOrderType}
            data={p.data}
          />
        ),
        filter: false,
        floatingFilter: false,
        minWidth: 60,
        flex: 0.4
      },
      {
        headerName: '',
        cellRenderer: (p: any) => (
          <DeleteRowBtn type={'Investment'} data={p.data} refreshParent={setDeletedInvestment} />
        ),
        filter: false,
        floatingFilter: false,
        minWidth: 60,
        flex: 0.4
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
      },
      {
        headerName: '',
        cellRenderer: (p: any) => <DeleteRowBtn type={'Dividend'} data={p.data} refreshParent={setDeletedDividend} />,
        filter: false,
        floatingFilter: false,
        minWidth: 60,
        flex: 0.4
      }
      /* { field: "investments", } */
    ]);
  }, [allInvestments, allDividends]);

  return (
    <div
      data-ag-theme-mode={palette.mode} // applying light or dark mode
    >
      <Stack>
        <InputInvestmentTaxesModal
          preInitializeInvestmentSaleObj={preInitializeInvestmentSaleObj}
          isOrderTypeSale={isOrderTypeSale}
          setIsOrderTypeSale={setIsOrderTypeSale}
          selectedOrderType={selectedOrderType}
          setSelectedOrderType={setSelectedOrderType}
          selectedInvestmentType={selectedInvestmentType}
          setSelectedInvestmentType={setSelectedInvestmentType}
          isInputInvestmentModalOpen={isInputInvestmentModalOpen}
          setIsInputInvestmentModalOpen={setIsInputInvestmentModalOpen}
          allInvestments={allInvestments}
          refreshParent={setUpdatedOrAddedItemFlag}
        />
      </Stack>
      <Button color="error" variant="outlined" onClick={() => resetAgGridToInitialState(investmentGridRef)}>
        {res.RESET}
      </Button>
      {allInvestments ? (
        <AgGridReact
          // enableCellTextSelection={true} // breaks styling somewhat
          // ensureDomOrder={true} // necessary for cell text selection
          theme={themeMaterial} // themeMaterial, themeQuartz, themeAlpine, themeBalham
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
      {allInvestments && allDividends ? (
        <AgGridReact
          // enableCellTextSelection={true} // breaks styling somewhat
          // ensureDomOrder={true} // necessary for cell text selection
          theme={themeMaterial} // themeMaterial, themeQuartz, themeAlpine, themeBalham
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
  );
}
