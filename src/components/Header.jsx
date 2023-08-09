import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Unstable_Grid2';
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
  const { header, subHeader } = props.contentHeader

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
            <Grid sx={{ display: { sm: 'none', xs: 'block' } }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid xs />
            <Grid>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid>
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
            <Grid>
              <Tooltip title={res.SETTINGS}>
                <IconButton color="inherit">
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid>
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
          <Grid xs sx={{ mt: '25px', ml:2 }}>
            <Divider/>
            {/* HEADER */}
            <Typography
              color="inherit"
              variant="h4"
              fontWeight={300}
              sx={{ paddingTop:'1px',paddingBottom:'1px', ml:2 }}>
              {header}
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
        sx={{ zIndex: 0,
              borderBottom: '6px solid #756244' }}>
          {/* SUBHEADER */}
          <Typography
            variant="h5"
            letterSpacing={2}
            fontSize={24}
            textTransform={'uppercase'}
            fontWeight={300}
            sx={{ ml:4, paddingTop:1.5,paddingBottom:0.5 }} >
            {subHeader}
          </Typography>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;