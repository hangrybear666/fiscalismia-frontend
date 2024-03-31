
import React, { useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

const STYLE_LIGHT = "ag-theme-quartz"
const STYLE_DARK = "ag-theme-quartz-dark"

const CustomButtonComponent = (props) => {
  return <button onClick={() => window.alert('clicked') }>Click</button>;
};

const CustomBoughtSoldChip = (props) => {
  return props.value === 'buy' ? <Chip label="bought" variant="outlined" color="primary" /> : <Chip label="sold" variant="outlined"  color="success" />
}

// Custom Cell Renderer (Display flags based on cell value)
const CompanyLogoRenderer = ({ value }) => (
  <span style={{ display: "flex", height: "100%", width: "100%", alignItems: "center" }}>{value && <img alt={`${value} Flag`} src={`https://www.ag-grid.com/example-assets/space-company-logos/${value.toLowerCase()}.png`} style={{display: "block", width: "25px", height: "auto", maxHeight: "50%", marginRight: "12px", filter: "brightness(1.1)"}} />}<p style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{value}</p></span>
 );

export default function Income_Investments( props ) {
  const { palette } = useTheme();
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([
    { company: "SpaceX", model: "Model Y", price: 64950, type: 'buy', toggle: true },
    { company: "Rocket Lab", model: "F-Series", price: 33850, type: 'sell', toggle: false },
    { company: "Roscosmos", model: "Corolla", price: 29600, type: 'buy', toggle: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "company", cellRenderer: CompanyLogoRenderer, flex: 2},
    { field: "model", floatingFilter: false },
    { field: "price", valueFormatter: p =>  Math.floor(p.value).toLocaleString() + ' €' },
    { field: "type", cellRenderer: p => <CustomBoughtSoldChip value={p.value}/> },
    { field: "toggle", filter: false},
    { field: "button",  cellRenderer: CustomButtonComponent },
  ]);

  const defaultColDef = useMemo(() => ({
    filter: true,
    floatingFilter: true,
    flex: 1
     // Enable filtering on all columns
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