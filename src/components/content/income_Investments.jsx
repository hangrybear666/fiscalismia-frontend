
import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { getAllInvestments, getAllDividends } from '../../services/pgConnections';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { resourceProperties as res } from '../../resources/resource_properties';

const STYLE_LIGHT = "ag-theme-quartz"
const STYLE_DARK = "ag-theme-quartz-dark"

const CustomBoughtSoldChip = (props) => {
  return props.value === 'buy' ? <Chip label="bought" variant="outlined" color="primary" /> : <Chip label="sold" variant="outlined"  color="success" />
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
  const { palette } = useTheme();
  const [allInvestments, setAllInvestments] = useState(null)
  const [allDividends, setAllDividends] = useState(null)
  const [investmentRowData, setInvestmentRowData] = useState([]);
  const [dividendRowData, setDividendRowData] = useState([]);

  const [investmentColumnDefinitions, setInvestmentColumnDefinitions] = useState([
    /* { field: "id", }, */
    { headerName: 'Order Type', field: "execution_type", cellRenderer: p => <CustomBoughtSoldChip value={p.value}/> , floatingFilter: false},
    { field: "description", flex: 2, },
    { headerName: "ISIN", field: "isin", cellRenderer: IsinNationalFlagRenderer, filter: false },
    { headerName: "Type", field: "investment_type", },
    { field: "marketplace", },
    { field: "units",  valueFormatter: unitsFormatter, floatingFilter: false, filter: false },
    { headerName: "Unit Price", field: "price_per_unit", valueFormatter: currencyFormatter, floatingFilter: false },
    { field: "fees", valueFormatter: currencyFormatter, floatingFilter: false, filter: false },
    { headerName: "Total", field: "total_price", valueFormatter: currencyFormatter, floatingFilter: false  },
    { headerName: "Date", field: "execution_date", },
  ]);

  const [dividendColumnDefinitions, setDividendColumnDefinitions] = useState([
    /* { field: "id", }, */
    { field: "cnt", },
    { field: "description", flex:2, },
    { headerName: "ISIN", field: "isin", cellRenderer: IsinNationalFlagRenderer, filter: false },
    { headerName: "Dividend", field: "dividend_amount", valueFormatter: currencyFormatter, },
    { headerName: "Pct of Total", field: "pct_of_total", valueFormatter: percentageFormatter,  },
    { headerName: "Average Price", field: "avg_ppu", valueFormatter: currencyFormatter, },
    { field: "units", valueFormatter: unitsFormatter, },
    { headerName: "Total", field: "total_price", valueFormatter: currencyFormatter, },
    { field: "fees", valueFormatter: currencyFormatter, },
    { headerName: "Date", field: "dividend_date", },
    /* { field: "investments", } */
  ]);

  const defaultColDef = useMemo(() => ({
    filter: true,
    floatingFilter: true,
    flex: 1
  }))

  useEffect(() => {
    const getInvestmentData = async() => {
      let allInvestments = await getAllInvestments();
      let allDividends = await getAllDividends();
      console.log(Object.keys(allDividends.results[0]))
      console.log(typeof allDividends.results[0].pct_of_total)
      setInvestmentRowData(allInvestments.results)
      setDividendRowData(allDividends.results)
      setAllDividends(allDividends)
    }
    getInvestmentData();
  }, []
  )


  return (
    <>
      <div
        className={palette.mode === 'light' ? STYLE_LIGHT : STYLE_DARK } // applying the grid theme
        style={{ height: 500 }} // the grid will fill the size of the parent container
      >
        <AgGridReact
            rowData={investmentRowData}
            columnDefs={investmentColumnDefinitions}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={20}
            paginationPageSizeSelector={[20,50,100]}
        />
        <AgGridReact
            rowData={dividendRowData}
            columnDefs={dividendColumnDefinitions}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={20}
            paginationPageSizeSelector={[20,50,100]}
        />
      </div>
    </>
  );
}