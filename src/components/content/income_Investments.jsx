
import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { getAllInvestments } from '../../services/pgConnections';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

const STYLE_LIGHT = "ag-theme-quartz"
const STYLE_DARK = "ag-theme-quartz-dark"

const CustomBoughtSoldChip = (props) => {
  return props.value === 'buy' ? <Chip label="bought" variant="outlined" color="primary" /> : <Chip label="sold" variant="outlined"  color="success" />
}


// Custom Cell Renderer (Display flags based on cell value)
const IsinNationalFlagRenderer = ({ value }) => (
  <span style={{ display: "flex", height: "100%", width: "100%", alignItems: "center" }}>
    {value && value.length > 2 ? getUnicodeFlagIcon(String(value).substring(0,2)) : null}
    <p style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>&nbsp;{value}</p>
  </span>
 );

const currencyFormatter = (params) => {
  return params.value.toFixed(2) + ' €';
};

export default function Income_Investments( props ) {
  const { palette } = useTheme();
  const [allInvestments, setAllInvestments] = useState(null)
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const getInvestments = async() => {
      let allInvestments = await getAllInvestments();
      console.log(allInvestments.results[0])
      setRowData(allInvestments.results)
      setAllInvestments(allInvestments)
    }
    getInvestments();
  }, []

  )

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    /* { field: "id", }, */
    { headerName: 'Order Type', field: "execution_type", cellRenderer: p => <CustomBoughtSoldChip value={p.value}/> , floatingFilter: false}, 
    { field: "description", flex: 2, },
    { headerName: "ISIN", field: "isin", cellRenderer: IsinNationalFlagRenderer, filter: false },
    { headerName: "Type", field: "investment_type", },
    { field: "marketplace", },
    { field: "units",  valueFormatter: p => p.value + ' pcs', floatingFilter: false, filter: false },
    { headerName: "Unit Price", field: "price_per_unit", valueFormatter: currencyFormatter, floatingFilter: false },
    { headerName: "Fees", field: "fees", valueFormatter: currencyFormatter, floatingFilter: false, filter: false },
    { headerName: "Total", field: "total_price", valueFormatter: currencyFormatter, floatingFilter: false  },
    { headerName: "Date", field: "execution_date", },
/*     { field: "company", cellRenderer: CompanyLogoRenderer, flex: 2},
    { field: "model", floatingFilter: false },
    { field: "price", valueFormatter: p =>  Math.floor(p.value).toLocaleString() + ' €' },
    { field: "type", cellRenderer: p => <CustomBoughtSoldChip value={p.value}/> },
    { field: "toggle", filter: false},
    { field: "button",  cellRenderer: CustomButtonComponent }, */
  ]);

  const defaultColDef = useMemo(() => ({
    filter: true,
    floatingFilter: true,
    flex: 1
  }))

  return (
    <>
      <div
        className={palette.mode === 'light' ? STYLE_LIGHT : STYLE_DARK } // applying the grid theme
        style={{ height: 500 }} // the grid will fill the size of the parent container
      >
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={20}
            paginationPageSizeSelector={[20,50,100]}
        />
      </div>
    </>
  );
}