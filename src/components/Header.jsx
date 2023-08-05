import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import GitHubIcon from '@mui/icons-material/GitHub';
import LogoutBtn from './minor/LogoutBtn';
import { resourceProperties as res } from '../resources/resource_properties'
import { Divider } from '@mui/material';

const headerBgColor = '#012731' // Daintree
// const headerBgColor = '#2a2f23' // Pine Tree
function Header(props) {
  const { onDrawerToggle } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleGithubMenuDropdown = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <React.Fragment>
      {/* Header Settings, Link and Logout Btn Toolbar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
                <Tooltip title={res.GITHUB_REPOS}>
                  <IconButton
                    color="inherit"
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleGithubMenuDropdown}
                    size="large">
                    <GitHubIcon />
                  </IconButton>
                </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={res.SETTINGS}>
                <IconButton color="inherit">
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <LogoutBtn/>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {/* Content Header Text */}
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Grid container alignItems="center" spacing={0}>
          <Grid item xs sx={{ mt: '25px', ml:2 }}>
            <Divider/>
            <Typography color="inherit" variant="h5" sx={{ paddingTop:'5px',paddingBottom:'4px', ml:2 }}>
              Content Header Placeholer
            </Typography>
            <Divider/>
          </Grid>
        </Grid>
      </AppBar>
      {/* Content Header relative Tab Navigation */}
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}>
        <Tabs value={0} textColor="inherit">
          <Tab label="Tab 1" />
          <Tab label="Tab 2" />
          <Tab label="Tab 3" />
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;