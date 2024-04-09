import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Navigator from '../components/Navigator';
import Header from '../components/Header';
import ContentHandler from '../components/ContentHandler';
import CustomThemeProvider from '../components/styling/Theme';
import { resourceProperties as res } from '../resources/resource_properties'
import { paths } from '../resources/router_navigation_paths';

function Footer() {
  return (
    <Box component="footer" sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {`${res.COPYRIGHT} `}
        <Link color="inherit" href={res.APP_URL}>
          {res.APP_NAME}
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  );
}

const drawerWidth = 256;

export default function Fiscalismia() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contentHeader, setContentHeader] = useState({header: res.HOME, subHeader: '', path: paths.APP_ROOT_PATH})
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <CustomThemeProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              setContentHeader={setContentHeader}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}

          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            setContentHeader={setContentHeader}
            sx={{ display: { sm: 'block', xs: 'none' } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onDrawerToggle={handleDrawerToggle} contentHeader={contentHeader}/>
          <ContentHandler/>
          <Footer />
        </Box>
      </Box>
    </CustomThemeProvider>
  );
}