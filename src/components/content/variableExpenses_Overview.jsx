
import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function VariableExpenses_Overview( props ) {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        {...data}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </div>
  );
}