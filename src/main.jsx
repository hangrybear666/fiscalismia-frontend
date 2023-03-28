import React from 'react'
import ReactDOM from 'react-dom/client'
import Fiscalismia from './routes/Fiscalismia'
import ErrorPage from './components/ErrorPage';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route } from "react-router-dom";

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<Fiscalismia/>}
        // loader={rootLoader}
        // action={rootAction}
        errorElement={<ErrorPage />}
      >
      </Route>
    )
  );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
