import React from 'react'
import ReactDOM from 'react-dom/client'
import Fiscalismia from './routes/Fiscalismia'
import SignInSide from './components/SignInSide';
import { AuthProvider } from './services/userAuthentication';
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
        // element={<SignInSide/>}
        // loader={rootLoader}
        // action={rootAction}
        errorElement={<ErrorPage />}
        >
      </Route>
    )
  );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
