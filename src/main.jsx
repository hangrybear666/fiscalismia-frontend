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
  Route,
  Navigate  } from "react-router-dom";

  const router = createBrowserRouter(
    createRoutesFromElements(
      <React.Fragment>
        <Route
          index
          path="/"
          element={<Navigate to="/login" />}
          // loader={rootLoader}
          // action={rootAction}
          errorElement={<ErrorPage />}
        />
        <Route
          path="/login"
          element={<SignInSide/>}
          // loader={rootLoader}
          // action={rootAction}
          errorElement={<ErrorPage />}
        />
        <Route
          element={<ProtectedRoute/>}
          errorElement={<ErrorPage />}
        >
          <Route
            path="/home"
            element={<Fiscalismia/>}
            // loader={rootLoader}
            // action={rootAction}
            errorElement={<ErrorPage />}
          />
        </Route>
        <Route
          path="*"
          element={<></>}
          errorElement={<ErrorPage isNoMatch={true}/>}
          loader={
            () => {throw new Response(null, { status: 404, statusText: 'not found' })}
          }
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
