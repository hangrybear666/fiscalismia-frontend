import { useRouteError } from "react-router-dom";

export default function ErrorPage( {isNoMatch} ) {
  const error = useRouteError();
  console.error(error);

  if (isNoMatch) {
    return (
      <div id="error-page">
        <h1>Sorry, the requested URL does not exist.</h1>
        <p>Navigate Home: </p><a href="/home">Click</a>
        <p>Login: </p><a href="/login">Click</a>
      </div>
    )
  } else {
    return (
      <div id="error-page">
        <h1>Sorry, an unexpected error has occurred.</h1>
        <p><u>Status:</u> {error?.status || 'Not defined'}</p>
        <p><u>StatusText:</u> {error?.statusText || 'Not defined'}</p>
        <p><u>Data:</u> {error?.data || 'Not defined'}</p>
      </div>
    );
  }
}