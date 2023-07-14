import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Sorry, an unexpected error has occurred.</h1>
      <p><u>Status:</u> {error.status}</p>
      <p><u>StatusText:</u> {error.statusText}</p>
      <p><u>Data:</u> {error.data}</p>
    </div>
  );
}