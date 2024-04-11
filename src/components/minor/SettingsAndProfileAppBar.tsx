import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import PreviewIcon from '@mui/icons-material/Preview';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { resourceProperties as res, localStorageKeys } from '../../resources/resource_properties';
import GitHubIcon from '@mui/icons-material/GitHub';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import HubIcon from '@mui/icons-material/Hub';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutBtn from './LogoutBtn';
import Link from '@mui/material/Link';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { postUpdatedUserSettings } from '../../services/pgConnections';
import { useAuth } from '../../services/userAuthentication';
import { AppBar, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { AuthInfo } from '../../types/custom/customTypes';

interface SettingsAndProfileAppBarProps {
  onDrawerToggle: () => void;
}

function SettingsAndProfileAppBar(props: SettingsAndProfileAppBarProps) {
  const { palette } = useTheme();
  const { onDrawerToggle } = props;
  const navigate = useNavigate();

  // DROPDOWN MENUS
  const [githubAnchorElement, setGithubAnchorElement] = useState<HTMLElement>();
  const githubMenuOpen = Boolean(githubAnchorElement);
  const [settingsAnchorElement, setSettingsAnchorElement] = useState<HTMLElement>();
  const settingsMenuOpen = Boolean(settingsAnchorElement);
  // COLOR AND THEME
  const { loginUserName } = useAuth() as unknown as AuthInfo; // TODO fix as unknown
  const isDarkMode = window.localStorage.getItem(localStorageKeys.selectedMode) === 'dark';
  const currentPalette = window.localStorage.getItem(localStorageKeys.selectedPalette);
  const currentColorMode = window.localStorage.getItem(localStorageKeys.selectedMode);
  const currentLanguage = window.localStorage.getItem(localStorageKeys.selectedLanguage);

  const handleGithubMenuDropdown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setGithubAnchorElement(event.currentTarget);
  };

  const handleGithubMenuClose = () => {
    setGithubAnchorElement(undefined);
  };

  const handleSettingsMenuDropdown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setSettingsAnchorElement(event.currentTarget);
  };

  const handleColorModeChange = async () => {
    if (!loginUserName) {
      console.error('loginUserName not set. Settings Change denied.'); // TODO critical error. notify admin
      return;
    }
    setSettingsAnchorElement(undefined);
    let newColorMode = isDarkMode ? 'light' : 'dark';
    const result = await postUpdatedUserSettings(loginUserName, localStorageKeys.selectedMode, newColorMode);
    if (result?.results[0]?.username == loginUserName) {
      window.localStorage.setItem(localStorageKeys.selectedMode, newColorMode);
      navigate(0);
    }
  };

  const handlePaletteChange = async () => {
    if (!loginUserName) {
      console.error('loginUserName not set. Settings Change denied.'); // TODO critical error. notify admin
      return;
    }
    setSettingsAnchorElement(undefined);
    let newPalette = currentPalette === 'default' ? 'pastel' : 'default';
    const result = await postUpdatedUserSettings(loginUserName, localStorageKeys.selectedPalette, newPalette);
    if (result?.results[0]?.username == loginUserName) {
      window.localStorage.setItem(localStorageKeys.selectedPalette, newPalette);
      navigate(0);
    }
  };

  const handleLanguageChange = async () => {
    if (!loginUserName) {
      console.error('loginUserName not set. Settings Change denied.'); // TODO critical error. notify admin
      return;
    }
    setSettingsAnchorElement(undefined);
    let newLanguage = currentLanguage === 'en_US' ? 'de_DE' : 'en_US';
    const result = await postUpdatedUserSettings(loginUserName, localStorageKeys.selectedLanguage, newLanguage);
    if (result?.results[0]?.username == loginUserName) {
      window.localStorage.setItem(localStorageKeys.selectedLanguage, newLanguage);
      navigate(0);
    }
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorElement(undefined);
  };

  return (
    <>
      {/* Header Settings, Link and Logout Btn Toolbar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'end' }}>
          {/* Mobile Drawer Toggle*/}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerToggle}
            edge="start"
            sx={{
              display: { sm: 'none', xs: 'block' },
              position: 'absolute',
              left: '15px',
              top: '5px'
            }}
          >
            <MenuIcon />
          </IconButton>
          {/* Notification Bell */}
          <Tooltip title="Alerts • No alerts">
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          {/* GITHUB Icon */}
          <Tooltip title={res.GITHUB_REPOS}>
            <IconButton
              color="inherit"
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleGithubMenuDropdown(e)}
              size="large"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          {/* Dropdown Menu for GITHUB Icon */}
          <Menu anchorEl={githubAnchorElement} open={githubMenuOpen} onClose={handleGithubMenuClose}>
            <MenuItem onClick={handleGithubMenuClose} component={Link} href={res.GITHUB_FRONTEND_URL}>
              <ListItemIcon sx={{ color: palette.text.primary, margin: 0 }}>
                <PreviewIcon />
              </ListItemIcon>
              {res.FRONTEND}
            </MenuItem>
            <MenuItem onClick={handleGithubMenuClose} component={Link} href={res.GITHUB_BACKEND_URL}>
              <ListItemIcon sx={{ color: palette.text.primary, margin: 0 }}>
                <HubIcon />
              </ListItemIcon>
              {res.BACKEND}
            </MenuItem>
          </Menu>

          {/* SETTINGS Icon */}
          <Tooltip title={res.SETTINGS}>
            <IconButton color="inherit" onClick={handleSettingsMenuDropdown} size="large">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          {/* Dropdown Menu for SETTINGS Icon */}
          <Menu anchorEl={settingsAnchorElement} open={settingsMenuOpen} onClose={handleSettingsMenuClose}>
            <MenuItem
              disabled={true}
              sx={{
                '&.Mui-disabled': {
                  opacity: 1,
                  color: palette.text.disabled
                }
              }}
            >
              <ListItemIcon
                sx={{
                  '&.Mui-disabled': {
                    opacity: 1,
                    color: palette.text.disabled
                  },
                  margin: 0
                }}
              >
                <AccountCircleIcon />
              </ListItemIcon>
              <Typography
                sx={{
                  whiteSpace: 'pre'
                }}
              >
                {`${res.LOGGED_IN_AS}  ${window.localStorage.getItem(localStorageKeys.loginUserName)}`}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleColorModeChange}>
              <ListItemIcon sx={{ color: palette.text.primary, margin: 0 }}>
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </ListItemIcon>
              <Typography sx={{ whiteSpace: 'pre' }}>
                {`${res.SELECTED_MODE}    ${currentColorMode ? currentColorMode : ''}`}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handlePaletteChange}>
              <ListItemIcon sx={{ color: palette.text.primary, margin: 0 }}>
                <ColorLensIcon />
              </ListItemIcon>
              <Typography sx={{ whiteSpace: 'pre' }}>
                {`${res.SELECTED_PALETTE}    ${currentPalette ? currentPalette : ''}`}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLanguageChange}>
              <ListItemIcon sx={{ color: palette.text.primary, margin: 0 }}>
                <FlagCircleIcon />
              </ListItemIcon>
              <Typography sx={{ whiteSpace: 'pre' }}>
                {`${res.SELECTED_LANGUAGE}    ${
                  currentLanguage === 'en_US'
                    ? getUnicodeFlagIcon('US') + ' ' + currentLanguage
                    : getUnicodeFlagIcon('DE') + ' ' + currentLanguage
                }`}
              </Typography>
            </MenuItem>
          </Menu>

          {/* LOGOUT BUTTON */}
          <LogoutBtn fullWidth={false} />
        </Toolbar>
      </AppBar>
    </>
  );
}
SettingsAndProfileAppBar.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired
};
export default SettingsAndProfileAppBar;
