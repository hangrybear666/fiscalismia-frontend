
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { getAllInvestments, getAllDividends } from '../../services/pgConnections';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { resourceProperties as res , investmentInputCategories } from '../../resources/resource_properties';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import { DateCellFormatter, HtmlTooltip } from '../../utils/sharedFunctions';
import { Stack } from '@mui/material';
import InputInvestmentTaxesModal from '../minor/Modal_InputInvestmentTaxes';
import InputInvestmentDividendsModal from '../minor/Modal_InputInvestmentDividends'

const CustomBoughtSoldChip = (props) => {
  return props.value === res.INCOME_INVESTMENTS_EXECUTION_TYPE_BUY_KEY
    ? <Chip sx={{ borderWidth:0, fontWeight:600 }} label={res.INCOME_INVESTMENTS_EXECUTION_TYPE_BUY_KEY} variant="outlined" color="primary" />
    : <Chip sx={{ borderWidth:0, fontWeight:600 }} label={res.INCOME_INVESTMENTS_EXECUTION_TYPE_SELL_KEY} variant="outlined"  color="success" />
}

/**
 * Custom Cell Renderer displaying unicode country flags based on first two letters of ISIN
 * @param {} param0 ISIN
 * @returns Flag + whitespace + ISIN
 */
const IsinNationalFlagRenderer = ({ value }) => (
  <span style={{ display: "flex", height: "100%", width: "100%", alignItems: "center" }}>
    {value && value.length > 2 ? getUnicodeFlagIcon(String(value).substring(0,2)) : null}
    <p style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>&nbsp;{value}</p>
  </span>
 );

const currencyFormatter = (params) => {
  return params.value.toFixed(2) + ' ' + res.CURRENCY_EURO;
}

const unitsFormatter = (params) => {
  return Number(params.value) + ' ' + res.PIECES_SHORT;
}

const percentageFormatter = (params) => {
  return params.value.toFixed(2) + ' ' + res.SYMBOL_PERCENT;
}

export default function Income_Investments( props ) {
  const { palette, breakpoints, mode } = useTheme();
  // db data
  const [allInvestments, setAllInvestments] = useState(null)
  const [allDividends, setAllDividends] = useState(null)
  const [uniqueIsinArray, setUniqueIsinArray] = useState(null)
  // ag-grid
  const [investmentRowData, setInvestmentRowData] = useState([]);
  const [dividendRowData, setDividendRowData] = useState([]);
  const [investmentColumnDefinitions, setInvestmentColumnDefinitions] = useState([]);
  const [dividendColumnDefinitions, setDividendColumnDefinitions] = useState([]);
  const [updatedOrAddedItemFlag, setUpdatedOrAddedItemFlag] = useState(null)
  // Reference to grid API
  const investmentGridRif = useRef();
  const dividendGridRif = useRef();
  // breakpoints
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("lg"))

  // ON PAGE LOAD
  useEffect(() => {
    const getInvestmentData = async() => {
      let allInvestments = await getAllInvestments();
      let allDividends = await getAllDividends();
      setInvestmentRowData(allInvestments.results)
      setDividendRowData(allDividends.results)
      setAllInvestments(allInvestments.results)
      setAllDividends(allDividends.results)
      setUniqueIsinArray(Array.from(new Set(allInvestments.results.map(e => e.isin))))
    }
    getInvestmentData();
  }, [updatedOrAddedItemFlag]
  )

  /**
   * Reads Profits, Taxes and Calculates Net Gain of any Sales, otherwise just returns the formatted Total Value
   * @param {*} props
   * @returns
   * For Sales: Custom React Component listing Sales Price, with a Tooltip Overlay containing Profit and Tax Information
   * For Purchases: Total Value in € for Purchases
   */
  const SalesProfitMinusTaxes = (props) => {
    if (allInvestments && props?.data?.execution_type === res.INCOME_INVESTMENTS_EXECUTION_TYPE_SELL_KEY) {
      const grossProfit = props?.data?.profit_amt ? Number(props.data.profit_amt).toFixed(2) : null
      const taxPaid =  props?.data?.tax_paid ? Number(props.data.tax_paid).toFixed(2) : null
      const netProfit = grossProfit && taxPaid ? Number((grossProfit - taxPaid)).toFixed(2) : grossProfit
      return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Stack>
                <Typography sx={{ color: palette.primary.main}}>{res.INCOME_INVESTMENTS_TOOLTIP_PROFIT_AMT_GROSS + String(grossProfit) + ' ' + res.CURRENCY_EURO}</Typography>
                <Typography sx={{ color: palette.error.main}}>{res.INCOME_INVESTMENTS_TOOLTIP_TAXED_AMT + String(taxPaid) + ' ' + res.CURRENCY_EURO}</Typography>
                <Typography sx={{ color: palette.success.main}}>{res.INCOME_INVESTMENTS_TOOLTIP_PROFIT_AMT_NET + String(netProfit) + ' ' + res.CURRENCY_EURO}</Typography>
              </Stack>
            </React.Fragment>
          }
        >
          <Box>
            <span>{props.value.toFixed(2) + ' ' + res.CURRENCY_EURO}</span>
            <Chip
              sx={{ marginLeft:0.8, marginBottom:0.8, fontWeight:600, fontSize:'125%', borderWidth:2  }}
              label="i"
              variant="outlined"
              color="success"
            />
          </Box>
        </HtmlTooltip>
      )
    } else {
      return props.value.toFixed(2) + ' ' + res.CURRENCY_EURO
    }
  }

  /**
   * After clicking on the number displaying aggregated Row Count a new Grid is displayed containing individual rows within the aggregate
   * @param {*} props
   * @returns Chip with onClick Listener displaying a DataGrid Modal with individual rows
   */
  const VisualizeOnAggregateRows = ({value, investments}) => {
    const [open, setOpen] = useState(false);
    // breakpoints
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("lg"))

    if (allInvestments && value && Number(value) > 1) {
      // Filter all Investments to the Ids contained within aggregated dividends
      const investmentIds = investments.split(',')
        .map(Number) // Map String Array to Number Array
      const filteredInvestments = allInvestments.filter(e => investmentIds.includes(Number(e.id)))
      return (
        <>
          <Tooltip
            title="Click to reveal individual positions."
            placement="left"
          >
            <Chip
              sx={{borderWidth:2}}
              onClick={() => setOpen(true)}
              label={value}
              variant="outlined"
              color="secondary"
            />
          </Tooltip>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
          >
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isSmallScreen ? '100%' : '70%' ,
              boxShadow: 24,
            }}>
              <div
                className={palette.mode === 'light' ? res.AG_GRID_STYLE_LIGHT : res.AG_GRID_STYLE_DARK } // applying the grid theme
                >
              {allInvestments ?
              <AgGridReact
                domLayout='autoHeight'
                rowData={filteredInvestments}
                columnDefs={[
                  { field: "description", flex: 1.5, minWidth:200},
                  { field: "isin", headerName: res.INCOME_INVESTMENTS_COL_HEADER_ISIN, cellRenderer: IsinNationalFlagRenderer, minWidth:150, },
                  { field: "investment_type", headerName: res.INCOME_INVESTMENTS_COL_HEADER_TYPE,  flex: 0.5 },
                  { field: "units",  valueFormatter: unitsFormatter, flex: 0.5 },
                  { field: "price_per_unit", headerName: res.INCOME_INVESTMENTS_COL_HEADER_UNIT_PRICE, valueFormatter: currencyFormatter, flex: 0.5},
                  { field: "fees", valueFormatter: currencyFormatter, flex: 0.5 },
                  { field: "total_price", headerName: res.INCOME_INVESTMENTS_COL_HEADER_TOTAL, valueFormatter: currencyFormatter, flex: 0.5 },
                  { field: "execution_date", headerName: res.INCOME_INVESTMENTS_COL_HEADER_DATE, cellRenderer: DateCellFormatter, minWidth: 135 },
                ]}
                defaultColDef={{
                  filter: false,
                  floatingFilter: false,
                  flex:1,
                  resizable: false,
                  minWidth: 95,
                  wrapText: true,
                  autoHeight: true,}
                }
                pagination={false}
              />
              : null}
              </div>
            </Box>
          </Modal>
        </>
      )
    } else {
      // if no aggregate is present, display nothing
      return null
    }
  }

  /**
   * Resets the Grid to the initial state after page load.
   */
  const resetAgGridToInitialState  = useCallback((gridRef) => {
    gridRef.current.api.setFilterModel(null); // Reset Filters
    gridRef.current.api.resetColumnState(); // Reset Sorting
  }, []);

  const defaultColDef = useMemo(() => ({
    filter: true,
    floatingFilter: true,
    flex: 1,
    resizable: false,
    minWidth: 100,
    wrapText: false,
    autoHeight: false,
  }))

  // AFTER allInvestments have been filled on page load
  useEffect(() => {
    setInvestmentColumnDefinitions([
      { field: "id", },
      { headerName: 'Order Type',
        field: "execution_type",
        cellRenderer: p => <CustomBoughtSoldChip value={p.value}/>,
        minWidth: 80,
        cellStyle: () => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        })
      },
      { field: "description", flex: 2, minWidth:200 },
      { field: "isin", headerName: res.INCOME_INVESTMENTS_COL_HEADER_ISIN, cellRenderer: IsinNationalFlagRenderer, filter: false, minWidth:160 },
      { field: "investment_type", headerName: res.INCOME_INVESTMENTS_COL_HEADER_TYPE, },
      { field: "marketplace", floatingFilter: false, },
      { field: "units",  valueFormatter: unitsFormatter, floatingFilter: false, filter: false },
      { field: "price_per_unit", headerName: res.INCOME_INVESTMENTS_COL_HEADER_UNIT_PRICE, valueFormatter: currencyFormatter, floatingFilter: false },
      { field: "fees", valueFormatter: currencyFormatter, floatingFilter: false, filter: false },
      { field: "total_price", headerName: res.INCOME_INVESTMENTS_COL_HEADER_TOTAL, cellRenderer: SalesProfitMinusTaxes, floatingFilter: false, minWidth: 140  },
      { field: "execution_date", headerName: res.INCOME_INVESTMENTS_COL_HEADER_DATE, cellRenderer: DateCellFormatter, minWidth:150 },
    ])
  }, [allInvestments]);

  // AFTER allDividends have been filled on page load
  useEffect(() => {
    setDividendColumnDefinitions([
      // { field: "id", },
      { field: "cnt",headerName: res.INCOME_INVESTMENTS_COL_HEADER_AGGREGATE,
        cellRenderer: p=> <VisualizeOnAggregateRows value={p.value} investments={p.data.investments} />,
        filter: false,
        minWidth:70,
        cellStyle: () => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        })
      },
      { field: "description", flex:2, minWidth:200  },
      { field: "isin", headerName: res.INCOME_INVESTMENTS_COL_HEADER_ISIN, cellRenderer: IsinNationalFlagRenderer, filter: false, minWidth:160 },
      { field: "dividend_amount", headerName: res.INCOME_INVESTMENTS_COL_HEADER_DIVIDEND, valueFormatter: currencyFormatter, },
      { field: "pct_of_total", headerName: res.INCOME_INVESTMENTS_COL_HEADER_PCT_OF_TOTAL, valueFormatter: percentageFormatter,  },
      { field: "avg_ppu", headerName: res.INCOME_INVESTMENTS_COL_HEADER_AVG_PRICE, valueFormatter: currencyFormatter, },
      { field: "units", valueFormatter: unitsFormatter, },
      { field: "total_price", headerName: res.INCOME_INVESTMENTS_COL_HEADER_TOTAL, valueFormatter: currencyFormatter, },
      { field: "fees", valueFormatter: currencyFormatter, },
      { field: "dividend_date", headerName: res.INCOME_INVESTMENTS_COL_HEADER_DATE, cellRenderer: DateCellFormatter, minWidth:150 },
      /* { field: "investments", } */
    ])
  }, [allInvestments, allDividends]);

  return (
    <>
      <Stack>
        <InputInvestmentTaxesModal refreshParent={setUpdatedOrAddedItemFlag}/>
      </Stack>
      <Button
        color="error"
        variant="outlined"
        onClick={() => resetAgGridToInitialState(investmentGridRif)}>
          {res.RESET}
      </Button>
      <div
        className={palette.mode === 'light' ? res.AG_GRID_STYLE_LIGHT : res.AG_GRID_STYLE_DARK } // applying the grid theme
      >
        {allInvestments ?
        <AgGridReact
          ref={investmentGridRif}
          rowData={investmentRowData}
          columnDefs={investmentColumnDefinitions}
          defaultColDef={defaultColDef}
          domLayout='autoHeight'
          pagination={true}
          paginationPageSize={12}
          paginationPageSizeSelector={[12,20,50]}
        />
      : null}
      </div>
        {uniqueIsinArray ?
          <Stack sx={{mt:2}}>
            <InputInvestmentDividendsModal refreshParent={setUpdatedOrAddedItemFlag} isinSelection={uniqueIsinArray} allInvestments={allInvestments} />
          </Stack>
        : null}
      <Button
        color="error"
        variant="outlined"
        onClick={() => resetAgGridToInitialState(dividendGridRif)}>
          {res.RESET}
      </Button>
      <div
        className={palette.mode === 'light' ? res.AG_GRID_STYLE_LIGHT : res.AG_GRID_STYLE_DARK } // applying the grid theme
      >
      {allInvestments && allDividends ?
        <AgGridReact
          ref={dividendGridRif}
          rowData={dividendRowData}
          columnDefs={dividendColumnDefinitions}
          defaultColDef={defaultColDef}
          domLayout='autoHeight'
          pagination={true}
          paginationPageSize={12}
          paginationPageSizeSelector={[12,20,50]}
        />
        : null}
      </div>
    </>
  );
}