import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import pgConnections from '../services/pgConnections';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { resourceProperties as res } from '../resources/resource_properties'
import { paths } from '../resources/router_navigation_paths';
import { useAuth, isUserAuthenticated, isJwtToken } from '../services/userAuthentication';


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
  },
});



export default function SignInSide() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { loginUserName, setToken, setLoginUserName, authenticated, setAuthenticated } = useAuth()
  useEffect(() => {
    if (authenticated)
    navigate(paths.APP_ROOT_PATH, { replace: true })
  }, [authenticated])

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = { username:username, password:password }
    const response = await pgConnections.login(user)
    if (isJwtToken(response)) {
      window.localStorage.setItem('jwt-token', response)
      window.localStorage.setItem('loginUserName', username)
      setLoginUserName(username)
      setToken(response)
      if (isUserAuthenticated(response, username)) {
        setAuthenticated(true)
      }
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

  if (window.localStorage.getItem('loginUserName')) {
    return (
      <>
        <p>User <b>{window.localStorage.getItem('loginUserName')}</b> is already logged in.</p>
        <IconButton
          color="primary"
          variant="text"
          onClick={() => {navigate(paths.APP_ROOT_PATH)}}>
          <HomeIcon />
          Home
        </IconButton>
      </>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random/?forest)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
            <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={inputChangeListener}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={inputChangeListener}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 2, bgcolor: 'primary.main'}}
              >
                Sign In
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}