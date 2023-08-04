import React from 'react'
import ReactDOM from 'react-dom/client'
import Fiscalismia from './routes/Fiscalismia'
import SignInSide from './components/SignInSide';
import Content from './components/Content';
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
        {/* Level 0 */}
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
          {/* Level 1 */}
          <Route
            path="/fiscalismia"
            element={<Fiscalismia/>}
            // loader={rootLoader}
            // action={rootAction}
            errorElement={<ErrorPage />}
          >
            {/* Level 2 */}
            {/* <Route
              path="test"
              element={<ErrorPage/>}
              errorElement={<ErrorPage />}
            /> */}

          </Route>
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
