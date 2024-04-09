import { useNavigate, useRouteError, useLocation, isRouteErrorResponse, Location } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { paths } from '../resources/router_navigation_paths';
import { resourceProperties as res } from '../resources/resource_properties';
import Stack from '@mui/material/Stack';
import HomeIcon from '@mui/icons-material/Home';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

class CustomError extends Error {
  status: number;
  statusText: string;
  data: any;

  constructor(message: string, options: { status: number; statusText: string; data: any }) {
    super(message);
    this.status = options.status;
    this.statusText = options.statusText;
    this.data = options.data;
  }
}

export default function ErrorPage({ isNoMatch }: { isNoMatch?: boolean }) {
  let error = useRouteError();
  let customError: CustomError;
  let location = useLocation();
  if (!isRouteErrorResponse(error)) {
    customError = new CustomError(error instanceof Error ? error.message : res.ERROR_FALLBACK_MESSAGE, {
      status: 400,
      statusText: res.BAD_REQUEST,
      data: res.ERROR_FALLBACK_MESSAGE
    });
  } else {
    customError = new CustomError(error instanceof Error ? error.message : res.ERROR_FALLBACK_MESSAGE, {
      status: error.status,
      statusText: error.statusText,
      data: error.data
    });
  }
  console.error(`ErrorPage routerError is: ${error}`);

  if (isNoMatch) {
    return <RoutingError error={customError} location={location} />;
  } else {
    return <GenericError error={customError} />;
  }
}

function RoutingError({ error, location }: { error: CustomError; location: Location }) {
  return (
    <div id="error-page">
      <h1>
        {error?.status || res.STATUS_NOT_DEFINED} | {error?.statusText || res.STATUSTEXT_NOT_DEFINED}
      </h1>
      <h2>{res.PATH_DOES_NOT_EXIST(location.pathname)}</h2>
      <hr />
      <NavBtns />
      <hr />
    </div>
  );
}

function GenericError({ error }: { error: CustomError }) {
  return (
    <div id="error-page">
      <h1>{res.GENERIC_ERROR_MESSAGE}</h1>
      <p>
        <u>{res.STATUS}:</u> {error?.status || res.NOT_DEFINED}
      </p>
      <p>
        <u>{res.STATUSTEXT}:</u> {error?.statusText || res.NOT_DEFINED}
      </p>
      <p>
        <u>{res.DATA}:</u> {error?.data || res.NOT_DEFINED}
      </p>
      <hr />
      <NavBtns />
      <hr />
    </div>
  );
}

function NavBtns() {
  const navigate = useNavigate();
  return (
    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
      <IconButton
        color="primary"
        onClick={() => {
          navigate(paths.APP_ROOT_PATH);
        }}
      >
        <HomeIcon />
        {res.HOME}
      </IconButton>
      <IconButton
        color="primary"
        onClick={() => {
          navigate(paths.LOGIN);
        }}
      >
        <VpnKeyIcon />
        {res.LOGIN}
      </IconButton>
    </Stack>
  );
}
