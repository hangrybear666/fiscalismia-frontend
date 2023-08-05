import { resourceProperties as res } from '../../resources/resource_properties'
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
// good icons for ADD functionality
import AddCardIcon from '@mui/icons-material/AddCard';
import AddchartIcon from '@mui/icons-material/Addchart';

export const menuEntries = [
  {
    id: res.VARIABLE_EXPENSES,
    path: 'variable_expenses',
    children: [
      { id: res.OVERVIEW, path: 'overview', icon: <AnalyticsIcon />, active: true }, // TODO active weg
      { id: res.STORES, path: 'stores', icon: <StorefrontIcon />},
      { id: res.INDULGENCES, path: 'indulgences', icon: <LiquorIcon /> },
    ],
  },
  {
    id: res.FIXED_COSTS,
    path: 'fixed_costs',
    children: [
      { id: res.OVERVIEW, path: 'overview', icon: <AnalyticsIcon /> },
      { id: res.LIVING_ESSENTIALS, path: 'essentials', icon: <CottageIcon /> },
      { id: res.RECREATION_RELAXATION, path: 'leisure', icon: <SportsEsportsIcon /> },
    ],
  },
  {
    id: res.INCOME,
    path: 'income',
    children: [
      { id: res.OVERVIEW, path: 'overview', icon: <AnalyticsIcon /> },
      { id: res.MONTHLY_BUDGET, path: 'budget', icon: <EuroIcon />},
      { id: res.SALES, path: 'sales', icon: <CreditScoreIcon /> },
      { id: res.SAVINGS, path: 'savings', icon: <SavingsIcon /> },
    ],
  },
  ,
  {
    id: res.DEALS,
    path: 'deals',
    children: [
      { id: res.OVERVIEW, path: 'overview', icon: <PercentIcon /> },
      { id: res.FOOD_PRICES, path: 'food_prices', icon: <ShoppingCartIcon />},
      { id: res.GROCERY_DEALS, path: 'grocery_deals', icon: <AddShoppingCartIcon />},
    ],
  },
]