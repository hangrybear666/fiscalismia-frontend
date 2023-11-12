import { resourceProperties as res } from '../../resources/resource_properties'
import { paths } from '../../resources/router_navigation_paths';
import SavingsIcon from '@mui/icons-material/Savings';
import EuroIcon from '@mui/icons-material/Euro';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LiquorIcon from '@mui/icons-material/Liquor';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import PercentIcon from '@mui/icons-material/Percent';
import CottageIcon from '@mui/icons-material/Cottage';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FileUploadIcon from '@mui/icons-material/FileUpload';
// good icons for ADD functionality
import AddCardIcon from '@mui/icons-material/AddCard';
import AddchartIcon from '@mui/icons-material/Addchart';

export const menuEntries = [
  {
    id: res.VARIABLE_EXPENSES,
    children: [
      { id: res.OVERVIEW, path: paths.VARIABLE_EXPENSES_OVERVIEW, icon: <AnalyticsIcon />, },
      { id: res.STORES, path: paths.VARIABLE_EXPENSES_STORES, icon: <StorefrontIcon />},
      { id: res.INDULGENCES, path: paths.VARIABLE_EXPENSES_INDULGENCES, icon: <LiquorIcon /> },
    ],
  },
  {
    id: res.FIXED_COSTS,
    children: [
      { id: res.OVERVIEW, path: paths.FIXED_COSTS_OVERVIEW, icon: <AnalyticsIcon /> },
      { id: res.LIVING_ESSENTIALS, path: paths.FIXED_COSTS_LIVING_ESSENTIALS, icon: <CottageIcon /> },
      { id: res.RECREATION_RELAXATION, path: paths.FIXED_COSTS_RECREATION_RELAXATION, icon: <SportsEsportsIcon /> },
    ],
  },
  {
    id: res.INCOME,
    children: [
      { id: res.OVERVIEW, path: paths.INCOME_OVERVIEW, icon: <AnalyticsIcon /> },
      { id: res.MONTHLY_BUDGET, path: paths.INCOME_MONTHLY_BUDGET, icon: <EuroIcon />},
      { id: res.SALES, path: paths.INCOME_SALES, icon: <CreditScoreIcon /> },
      { id: res.SAVINGS, path: paths.INCOME_SAVINGS, icon: <SavingsIcon /> },
    ],
  },
  {
    id: res.DEALS,
    children: [
      { id: res.OVERVIEW, path: paths.DEALS_OVERVIEW, icon: <PercentIcon /> },
      { id: res.FOOD_PRICES, path: paths.DEALS_FOOD_PRICES, icon: <ShoppingCartIcon />},
      { id: res.GROCERY_DEALS, path: paths.DEALS_GROCERY_DEALS, icon: <AddShoppingCartIcon />},
    ],
  },
  ,
  {
    id: res.ADMIN_PANEL,
    children: [
      { id: res.UPLOAD_AREA, path: paths.ADMIN_UPLOAD_AREA, icon: <FileUploadIcon /> },
    ],
  },
]