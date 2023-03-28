import { resourceProperties as res } from '../../resources/resource_properties'
import SavingsIcon from '@mui/icons-material/Savings';
import EuroIcon from '@mui/icons-material/Euro';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LiquorIcon from '@mui/icons-material/Liquor';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import PublicIcon from '@mui/icons-material/Public';
import CottageIcon from '@mui/icons-material/Cottage';
// good icons for ADD functionality
import AddCardIcon from '@mui/icons-material/AddCard';
import AddchartIcon from '@mui/icons-material/Addchart';

export const menuEntries = [
  {
    id: res.VARIABLE_EXPENSES,
    children: [
      { id: res.OVERVIEW, icon: <AnalyticsIcon />, active: true },
      { id: res.STORES, icon: <StorefrontIcon />},
      { id: res.SENSITIVITIES, icon: <LiquorIcon /> },
    ],
  },
  {
    id: res.FIXED_COSTS,
    children: [
      { id: res.OVERVIEW, icon: <AnalyticsIcon /> },
      { id: res.LIVING_ESSENTIALS, icon: <CottageIcon /> },
      { id: res.RECREATION_RELAXATION, icon: <SportsEsportsIcon /> },
    ],
  },
  {
    id: res.INCOME,
    children: [
      { id: res.OVERVIEW, icon: <AnalyticsIcon /> },
      { id: res.MONTHLY_BUDGET, icon: <EuroIcon />},
      { id: res.SAVINGS, icon: <SavingsIcon /> },
    ],
  },
]