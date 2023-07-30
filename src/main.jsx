import React from 'react'
import ReactDOM from 'react-dom/client'
import Fiscalismia from './routes/Fiscalismia'
import SignInSide from './components/SignInSide';
import { AuthProvider, ProtectedRoute } from './services/userAuthentication';
import ErrorPage from './components/ErrorPage';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route } from "react-router-dom";

  const router = createBrowserRouter(
    createRoutesFromElements(
      <React.Fragment>
        <Route
          path="login"
          element={<SignInSide/>}
          // loader={rootLoader}
          // action={rootAction}
          errorElement={<ErrorPage />}
        />
        <Route element={<ProtectedRoute/>}>
          <Route
            path="home"
            element={<Fiscalismia/>}
            // loader={rootLoader}
            // action={rootAction}
            errorElement={<ErrorPage />}
          />
        </Route>
        <Route
          path="*"
          element={<ErrorPage isNoMatch={true}/>}
          // loader={rootLoader}
          // action={rootAction}
        />
      </React.Fragment>
    )
  );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
