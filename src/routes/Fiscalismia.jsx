import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Navigator from '../components/Navigator';
import Header from '../components/Header';
import ContentHandler from '../components/ContentHandler';
import { theme } from '../components/styling/Theme';
import { resourceProperties as res } from '../resources/resource_properties'
import { paths } from '../resources/router_navigation_paths';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {`${res.COPYRIGHT} `}
      <Link color="inherit" href={res.APP_URL}>
        {res.APP_NAME}
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const drawerWidth = 256;

export default function Fiscalismia() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contentHeader, setContentHeader] = useState({header: res.HOME, subHeader: '', path: paths.APP_ROOT_PATH})
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
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
          <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
            <ContentHandler/>
          </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}