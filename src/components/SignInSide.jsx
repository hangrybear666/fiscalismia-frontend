import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { login, getUserSpecificSettings } from '../services/pgConnections';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { resourceProperties as res, localStorageKeys } from '../resources/resource_properties'
import { paths } from '../resources/router_navigation_paths';
import { useAuth, isUserTokenValid, isJwtToken } from '../services/userAuthentication';
import CreateAccountModal from './minor/CreateAccountModal';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href={res.APP_URL}>
        {res.APP_NAME}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#63ccff',
      main: '#63ccff',
      dark: '#006db3',
    },
    secondary: {
      light: '#68456e',
      main: '#bd9fc2',
      dark: '#d3bcd6',
    },
  },
});

export default function SignInSide() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(window.localStorage.getItem(localStorageKeys.token)  === "true" ?  true : false)
  const navigate = useNavigate()
  const { loginUserName, setToken, setLoginUserName } = useAuth()
  // After successfully logging in and authenticating the token, user settings are queried from the DB and redirect to Homepage is triggered
  useEffect(() => {
    const getUserSettings = async() => {
      try {
        const response = await getUserSpecificSettings(loginUserName);
        if (response?.results?.length > 0) {
          let userSettingsMap = new Map();
          response.results.forEach(e=> {
            userSettingsMap.set(e.setting_key, e.setting_value)
          })
          window.localStorage.setItem(localStorageKeys.selectedMode, userSettingsMap.get(localStorageKeys.selectedMode))
          window.localStorage.setItem(localStorageKeys.selectedPalette, userSettingsMap.get(localStorageKeys.selectedPalette))
        }
      } finally {
        navigate(paths.APP_ROOT_PATH, { replace: true });
      }
    }
    if (authenticated) {
      getUserSettings();
    }
  }, [authenticated])

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = { username:username, password:password }
    const response = await login(user)
    if (isJwtToken(response)) {
      window.localStorage.setItem(localStorageKeys.token, response)
      window.localStorage.setItem(localStorageKeys.loginUserName, username)
      setLoginUserName(username)
      setToken(response)
      if (isUserTokenValid(response, username)) {
        window.localStorage.setItem(localStorageKeys.authenticated, "true")
        setAuthenticated(true)
      }
    } else {
      // TODO notify user of failed login
    }
  };

  const inputChangeListener = (e) => {
    e.preventDefault();
    switch (e.target.id) {
      case "username":
        setUsername(e.target.value)
        break;
      case "password":
        setPassword(e.target.value)
        break;
    }
  }

  // because user settings are still being loaded after loginUserName has been set, only display this page after a timeout
  // if useNavigate has already forwarded to a different page, nothing is rendered for the user
  if (window.localStorage.getItem(localStorageKeys.loginUserName)) {
    setTimeout(function(){
      return (
        <>
          <p>User <b>{window.localStorage.getItem(localStorageKeys.loginUserName)}</b> is already logged in.</p>
          <IconButton
            color="primary"
            variant="text"
            onClick={() => {navigate(paths.APP_ROOT_PATH, { replace: true })}}>
            <HomeIcon />
            Home
          </IconButton>
        </>
      )
  }, 2000);
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          xs={false}
          sm={false}
          md={6}
          lg={8}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random/?forest)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid xs={12} md={6} lg={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              mx: 4,
              mb: 8,
              mt: '20vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1,  bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label={res.USERNAME}
                autoComplete="username"
                autoFocus
                value={username}
                onChange={inputChangeListener}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label={res.PASSWORD}
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={inputChangeListener}
              />
              <Button
                onClick={handleLogin}
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb:2.5, bgcolor: 'primary.main'}}
              >
                {res.LOGIN}
              </Button>
              <CreateAccountModal/>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}