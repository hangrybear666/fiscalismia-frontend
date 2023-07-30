import { useRouteError } from "react-router-dom";
import { Navigate, useNavigate, useLocation, NavLink } from 'react-router-dom';

export default function ErrorPage( {isNoMatch} ) {
  const error = useRouteError();
  // const navigate = useNavigate(); // TODO Sign in Bug
  // const location = useLocation(); // TODO Sign in Bug
  console.error(error);

  if (isNoMatch) {
    return (
      <div id="error-page">
        <h1>Sorry, the requested URL does not exist.</h1>
        <p>Navigate Home: </p><NavLink to="/home">Home</NavLink>
        <p>Login: </p><NavLink to="/login">Login</NavLink>
      </div>
    )
  } else {
    return (
      <div id="error-page">
        <h1>Sorry, an unexpected error has occurred.</h1>
        <p><u>Status:</u> {error?.status || 'Not defined'}</p>
        <p><u>StatusText:</u> {error?.statusText || 'Not defined'}</p>
        <p><u>Data:</u> {error?.data || 'Not defined'}</p>
        <hr/>
        <p>Navigate Home: </p><NavLink to="/home">Home</NavLink>
      </div>
    );
  }
}