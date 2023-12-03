import React, { useState } from 'react'
import { menuEntries } from '../components/minor/MenuEntries';
import { paths } from '../resources/router_navigation_paths';
import { Route, Routes, Navigate } from "react-router-dom";
import TestData from './content/TestData'
import DATAGRID_DEMO_BASIC from './content/DATAGRID_DEMO_BASIC';
import FixedCosts_Overview from './content/fixedCosts_Overview';
import FixedCosts_LivingEssentials from './content/fixedCosts_LivingEssentials';
import FixedCosts_Leisure from './content/fixedCosts_Leisure';
import Deals_Overview from './content/deals_Overview';
import Deals_FoodPrices from './content/deals_FoodPrices';
import Deals_GroceryDeals from './content/deals_GroceryDeals';
import Box from '@mui/material/Box';
import TESTDELETETABLE from './content/TESTDELETETABLE';
import TEST_DATAGRID from './content/TEST_DATAGRID';
import { contentMaxWidth } from './styling/Theme';
import PaletteAndThemeTest from './content/PaletteAndThemeTest';
import Income_Overview from './content/income_Overview';
import Income_Monthly_Budget from './content/income_MonthlyBudget';
import Income_Sales from './content/income_Sales';
import VariableExpenses_Overview from './content/variableExpenses_Overview';

export default function Content( props ) {

  const renderedElement = (parentId, childId, path) => {
    const value = {
      header: parentId,
      subHeader: childId,
      path: path
    }
    switch (path) {
      case paths.VARIABLE_EXPENSES_OVERVIEW :
        return <VariableExpenses_Overview value={value}/>
      case paths.VARIABLE_EXPENSES_STORES :
        return <TestData value={value}/>
      case paths.VARIABLE_EXPENSES_INDULGENCES :
        return <TestData value={value}/>
      case paths.FIXED_COSTS_OVERVIEW :
        return <FixedCosts_Overview/>
      case paths.FIXED_COSTS_LIVING_ESSENTIALS :
        return <FixedCosts_LivingEssentials value={value}/>
      case paths.FIXED_COSTS_RECREATION_RELAXATION :
        return <FixedCosts_Leisure value={value}/>
      case paths.INCOME_OVERVIEW :
        return <Income_Overview value={value}/>
      case paths.INCOME_MONTHLY_BUDGET :
        return <Income_Monthly_Budget value={value}/>
      case paths.INCOME_SALES :
        return <Income_Sales value={value}/>
      case paths.INCOME_INVESTMENTS :
        return <TestData value={value}/>
      case paths.DEALS_OVERVIEW :
        return <Deals_Overview value={value}/>
      case paths.DEALS_FOOD_PRICES :
        return <Deals_FoodPrices value={value}/>
      case paths.DEALS_GROCERY_DEALS :
        return <Deals_GroceryDeals value={value}/>
      case paths.ADMIN_UPLOAD_AREA :
        return <TestData value={value}/>
      case "admin/test1" :
        return <TEST_DATAGRID value={value}/>
      case "admin/test2" :
        return <DATAGRID_DEMO_BASIC value={value}/>
      case "admin/test3" :
        return <TESTDELETETABLE value={value}/>
      default:
        <React.Fragment>
        </React.Fragment>
        break;
    }
  }

  return (
    <Box component="main" sx={{
      flex: 1,
      py: 3,
      px: 3, }}
    >
        <Box id="content" sx={{ maxWidth: contentMaxWidth, margin:'0 auto' }}>
          <PaletteAndThemeTest show={false}/>
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
    </Box>
  );
}