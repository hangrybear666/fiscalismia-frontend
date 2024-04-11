import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectDropdownProps {
  selectLabel: string,
  selectItems: string[],
  selectedValue: string,
  handleSelect: (selection: string) => void
}

export default function SelectDropdown( { selectLabel, selectItems, selectedValue, handleSelect } : SelectDropdownProps ) {

  const handleChange = (event: SelectChangeEvent) => {
    handleSelect(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={selectLabel.replace(/\s/g, "").concat('-inputLabel')}>{selectLabel}</InputLabel>
        <Select
          id={selectLabel.replace(/\s/g, "").concat('-selectItems')}
          value={selectedValue}
          label={selectLabel}
          onChange={handleChange}
          color="primary"
          sx={{
            borderRadius: 0,
            boxShadow: 4
          }}
        >
          {selectItems
            ? selectItems.map(e => <MenuItem key={e} value={e}>{e.substring(0,40)}</MenuItem>)
            : null}
        </Select>
      </FormControl>
    </Box>
  );
}