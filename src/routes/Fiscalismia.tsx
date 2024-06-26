import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navigator from '../components/Navigator';
import Header from '../components/Header';
import ContentHandler from '../components/ContentHandler';
import CustomThemeProvider from '../components/styling/Theme';
import { resourceProperties as res } from '../resources/resource_properties';
import { paths } from '../resources/router_navigation_paths';
import { Stack } from '@mui/material';
import { ToastContainer } from 'react-toastify';

/**
 * Footer with current year, App Name
 * @returns
 */
function Footer(): JSX.Element {
  return (
    <Box component="footer" sx={{ p: 2, margin: '0 auto' }}>
      <Stack direction="row">
        <Typography color="text.secondary" sx={{ fontWeight: 300, letterSpacing: 2 }}>
          {res.APP_NAME}&nbsp;
        </Typography>
        <Typography color="text.secondary" sx={{ fontWeight: 300, letterSpacing: 3 }}>
          {new Date().getFullYear()}
        </Typography>
      </Stack>
    </Box>
  );
}

const drawerWidth = 256;

/**
 * Root of the App accessed after authentication via SignInSide. Menu Selection changes react-router paths and renders Content based on selection.
 * - Is wrapped in a Custom theme
 * - contains the vertical side Navigator menu (Admin Panel style)
 * - Header rendering the route header and subheader with a User Settings Icon Bar
 * - Content rendered based on selected menu entry (route)
 * - Basic Footer
 * @returns
 */
export default function Fiscalismia() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contentHeader, setContentHeader] = useState({ header: res.HOME, subHeader: '', path: paths.APP_ROOT_PATH });
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <CustomThemeProvider>
      {/* React Toastify User Notifications */}
      <ToastContainer newestOnTop pauseOnFocusLoss position="top-right" />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          {isSmUp ? null : (
            <Navigator
              drawerWidth={drawerWidth}
              setContentHeader={setContentHeader}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}

          <Navigator
            drawerWidth={drawerWidth}
            setContentHeader={setContentHeader}
            variant="permanent"
            sxProps={{ display: { sm: 'block', xs: 'none' } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onDrawerToggle={handleDrawerToggle} contentHeader={contentHeader} />
          <ContentHandler />
          <Footer />
        </Box>
      </Box>
    </CustomThemeProvider>
  );
}
