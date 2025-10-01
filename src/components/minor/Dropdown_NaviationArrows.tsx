// import React, { useState, useEffect } from 'react';
// import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { Container, IconButton, Stack, Tooltip } from '@mui/material';
import SelectDropdown from '../minor/SelectDropdown';
import { locales } from '../../utils/localeConfiguration';

interface Dropdown_NaviationArrowsProps {
  selectedValue: string;
  handleSelect: any;
  selectItems: string[];
}

/**
 * A Dropdown with entries that can be clicked or navigated via left and right arrows
 * @param {Dropdown_NaviationArrowsProps} props
 * @returns
 */
export default function Dropdown_NaviationArrows(props: Dropdown_NaviationArrowsProps) {
  const { selectedValue, handleSelect, selectItems } = props;

  /**
   * changes selected entry in dropdown in ascending (right) or descending order (left)
   * Does nothing if we are at the first, or last entry.
   * @param direction left or right
   */
  const handleDirectionalChange = (direction: 'left' | 'right') => {
    const isPriorSelection = direction === 'left' ? true : false;
    let selectedIndex = -1;
    selectItems.forEach((e: any, i: number) => {
      if (e === selectedValue) {
        selectedIndex = i;
      }
    });
    if (isPriorSelection && selectedIndex > 0) {
      handleSelect(selectItems[selectedIndex - 1]);
    } else if (!isPriorSelection && selectedIndex < selectItems.length - 1) {
      handleSelect(selectItems[selectedIndex + 1]);
    }
  };

  return (
    <Grid xs={12}>
      <Stack direction="row">
        <Tooltip title={locales().GENERAL_PRIOR_SELECTION_BTN_TOOLTIP}>
          <IconButton
            color="inherit"
            onClick={() => handleDirectionalChange('left')}
            sx={{ paddingX: 2, width: 1 / 9 }}
          >
            <AssignmentReturnIcon />
          </IconButton>
        </Tooltip>
        <Container maxWidth={false} sx={{ width: 7 / 9 }}>
          <SelectDropdown
            selectLabel={locales().GENERAL_DATE}
            selectItems={selectItems}
            selectedValue={selectedValue}
            handleSelect={handleSelect}
          />
        </Container>
        <Tooltip title={locales().GENERAL_NEXT_SELECTION_BTN_TOOLTIP}>
          <IconButton
            color="inherit"
            onClick={() => handleDirectionalChange('right')}
            sx={{ paddingX: 2, width: 1 / 9 }}
          >
            <AssignmentReturnIcon
              sx={{
                transform: 'scaleX(-1)'
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>
    </Grid>
  );
}
