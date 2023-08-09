import React, { useState } from 'react'
import { menuEntries } from '../components/minor/MenuEntries';
import { paths } from '../resources/router_navigation_paths';
import { resourceProperties as res } from '../resources/resource_properties';
import { Route, Routes, Navigate } from "react-router-dom";
import TestData from './content/TestData'
import VariableExpenses_OVERVIEW from './content/variableExpenses_OVERVIEW';
import FixedCosts_OVERVIEW from './content/fixedCosts_OVERVIEW';
import Box from '@mui/material/Box';

export default function Content( props ) {

  const renderedElement = (parentId, childId, path) => {
    const value = {
      header: parentId,
      subHeader: childId,
      path: path
    }
    switch (path) {
      case paths.VARIABLE_EXPENSES_OVERVIEW :
        return <VariableExpenses_OVERVIEW value={value}/>
      case paths.VARIABLE_EXPENSES_STORES :
        return <TestData value={value}/>
      case paths.VARIABLE_EXPENSES_INDULGENCES :
        return <TestData value={value}/>
      case paths.FIXED_COSTS_OVERVIEW :
        return <FixedCosts_OVERVIEW/>
      case paths.FIXED_COSTS_LIVING_ESSENTIALS :
        return <TestData value={value}/>
      case paths.FIXED_COSTS_RECREATION_RELAXATION :
        return <TestData value={value}/>
      case paths.INCOME_OVERVIEW :
        return <TestData value={value}/>
      case paths.INCOME_MONTHLY_BUDGET :
        return <TestData value={value}/>
      case paths.INCOME_SALES :
        return <TestData value={value}/>
      case paths.INCOME_SAVINGS :
        return <TestData value={value}/>
      case paths.DEALS_OVERVIEW :
        return <TestData value={value}/>
      case paths.DEALS_FOOD_PRICES :
        return <TestData value={value}/>
      case paths.DEALS_GROCERY_DEALS :
        return <TestData value={value}/>
      default:
        <React.Fragment>
        </React.Fragment>
        break;
    }
  }

  return (
    <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
      <Routes>
        {menuEntries.map(({ id: parentId, children }) =>(
          <React.Fragment key={parentId}>
            {children.map(({ id: childId, icon, path }) => (
              <Route
                path={path}
                element={renderedElement(parentId, childId, path)}
                key={childId}
              />
              ))
            }
          </React.Fragment>
          ))
        }
      </Routes>
    </Box>
  );
}