import { Navigate, useNavigate, useRouteError,  useLocation, NavLink, isRouteErrorResponse } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { paths } from '../resources/router_navigation_paths';
import { resourceProperties as res } from '../resources/resource_properties'
import Stack from '@mui/material/Stack';
import HomeIcon from '@mui/icons-material/Home';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function ErrorPage( {isNoMatch} ) {
  let error = useRouteError()
  let location = useLocation()
  if (!isRouteErrorResponse(error)) {
    error.status = 400
    error.statusText = res.BAD_REQUEST
    error.data = res.ERROR_FALLBACK_MESSAGE
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
      <h1>{error?.status || res.STATUS_NOT_DEFINED} | {error?.statusText || res.STATUSTEXT_NOT_DEFINED}</h1>
      <h2>
        {res.PATH_DOES_NOT_EXIST(location.pathname)}
      </h2>
      <hr/>
      <NavBtns/>
      <hr/>
    </div>
  )
}

function GenericError({error}) {
  return (
    <div id="error-page">
      <h1>{res.GENERIC_ERROR_MESSAGE}</h1>
      <p><u>{res.STATUS}:</u> {error?.status || res.NOT_DEFINED}</p>
      <p><u>{res.STATUSTEXT}:</u> {error?.statusText || res.NOT_DEFINED}</p>
      <p><u>{res.DATA}:</u> {error?.data || res.NOT_DEFINED}</p>
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
        onClick={() => {navigate(paths.APP_ROOT_PATH)}}>
        <HomeIcon />
        {res.HOME}
      </IconButton>
      <IconButton
        color="primary"
        variant="text"
        onClick={() => {navigate(paths.LOGIN)}}>
        <VpnKeyIcon />
        {res.LOGIN}
      </IconButton>
    </Stack>
  )
}