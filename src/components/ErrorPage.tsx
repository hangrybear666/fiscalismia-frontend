import { useNavigate, useRouteError, useLocation, isRouteErrorResponse, Location } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { paths } from '../resources/router_navigation_paths';
import { resourceProperties as res } from '../resources/resource_properties';
import Stack from '@mui/material/Stack';
import HomeIcon from '@mui/icons-material/Home';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

/**
 * Extended Error class containing http status and arbitrary data
 */
class CustomError extends Error {
  status: number;
  statusText: string;
  data: any;

  /**
   *
   * @param message Error message
   * @param options object containing status information and arbitrary data
   * @param options.status status number
   * @param options.statusText status string
   * @param options.data arbitrary data
   */
  constructor(message: string, options: { status: number; statusText: string; data: any }) {
    super(message);
    this.status = options.status;
    this.statusText = options.statusText;
    this.data = options.data;
  }
}

/**
 * Page rendered as fallback when an unhandled error is encountered.
 * @param {boolean} isNoMatch
 * @returns either RoutingError or GenericError JSX HTML container
 */
export default function ErrorPage(isNoMatch?: boolean): JSX.Element {
  const error = useRouteError();
  let customError: CustomError;
  const location = useLocation();
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

interface RoutingErrorProps {
  error: CustomError;
  location: Location;
}
/**
 * Error container rendered in response to User navigating to nonexistent path.
 * @param {RoutingErrorProps} props
 * @returns JSX.Element, specifically HTML div container containing router error info
 */
function RoutingError(props: RoutingErrorProps): JSX.Element {
  return (
    <div id="error-page">
      <h1>
        {props.error?.status || res.STATUS_NOT_DEFINED} | {props.error?.statusText || res.STATUSTEXT_NOT_DEFINED}
      </h1>
      <h2>{res.PATH_DOES_NOT_EXIST(location.pathname)}</h2>
      <hr />
      <NavBtns />
      <hr />
    </div>
  );
}

interface GenericErrorProps {
  error: CustomError;
}

/**
 * Error container rendered in response to User producing unhandled Error.
 * @param {GenericErrorProps} props
 * @returns JSX.Element, specifically HTML div container containing generic error info
 */
function GenericError(props: GenericErrorProps) {
  const { error } = props;
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

/**
 * @returns Navigation Buttons to Home or Login Page.
 */
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
