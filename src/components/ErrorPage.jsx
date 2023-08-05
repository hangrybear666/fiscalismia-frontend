import { Navigate, useNavigate, useRouteError,  useLocation, NavLink, isRouteErrorResponse } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { resourceProperties as res } from '../resources/resource_properties';
import Stack from '@mui/material/Stack';
import HomeIcon from '@mui/icons-material/Home';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function ErrorPage( {isNoMatch} ) {
  let error = useRouteError()
  let location = useLocation()
  if (!isRouteErrorResponse(error)) {
    error.status = 400
    error.statusText = 'Bad Request'
    error.data = 'Error has not been handled explicitly. Implementation should catch this properly. '
  }
  console.error(`ErrorPage routerError is: ${error}`);

  if (isNoMatch) {
    return (
      <RoutingError error={error} location={location}/>
    )
  } else {
    return (
      <GenericError error={error}/>
    )
  }
}

function RoutingError({error, location}) {
  return (
    <div id="error-page">
      <h1>{error?.status || 'Status Not defined'} | {error?.statusText || 'StatusText Not defined'}</h1>
      <h2>Sorry, the requested path '{location.pathname}' does not exist.</h2>
      <hr/>
      <NavBtns/>
      <hr/>
    </div>
  )
}

function GenericError({error}) {
  return (
    <div id="error-page">
      <h1>Sorry, an unexpected error has occurred.</h1>
      <p><u>Status:</u> {error?.status || 'Not defined'}</p>
      <p><u>StatusText:</u> {error?.statusText || 'Not defined'}</p>
      <p><u>Data:</u> {error?.data || 'Not defined'}</p>
      <hr/>
      <NavBtns/>
      <hr/>
    </div>
  )
}

function NavBtns() {
  const navigate = useNavigate();
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="flex-start"
      spacing={2}>
      <IconButton
        color="primary"
        variant="text"
        onClick={() => {navigate(res.APP_ROOT_PATH)}}>
        <HomeIcon />
        Home
      </IconButton>
      <IconButton
        color="primary"
        variant="text"
        onClick={() => {navigate('/login')}}>
        <VpnKeyIcon />
        Login
      </IconButton>
    </Stack>
  )
}