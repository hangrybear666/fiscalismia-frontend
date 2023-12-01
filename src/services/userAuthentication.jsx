import { useState, useContext, createContext, useEffect} from "react";
import axios from 'axios'
import {
  Navigate,
  useLocation,
  Outlet
} from 'react-router-dom';
import { paths } from "../resources/router_navigation_paths";
import { resourceProperties as res, localStorageKeys } from "../resources/resource_properties";
import jwt_decode from "jwt-decode";

/**
 * React Router context receiving token, authenticated loginUserName and respective setters as values
 */
const AuthContext = createContext(null)

/**
 * TODO  CONTEXT IS LOST ON PAGE REFRESH (F5) -> ENSURE THAT THIS IS NOT A BUG AT SOME POINT
 * The React Context Provider containing contextual values available to all of its children components
 * @param {*} param0 the children being nested within the React Context
 * @returns The Authentication Context containing a context value and all children components within the Route
 */
export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(window.localStorage.getItem(localStorageKeys.token) || null);
  const [loginUserName, setLoginUserName] = useState(window.localStorage.getItem(localStorageKeys.loginUserName) || null)

  const loggedInAs = {
    token: token,
    setToken: setToken,
    loginUserName: loginUserName,
    setLoginUserName: setLoginUserName,
  }

  return (
    <AuthContext.Provider value={loggedInAs}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * helper method for getting the AuthContext
 * @returns AuthContext containing token, loginUserName and respective setters as values
 */
export const useAuth = () => {
  return useContext(AuthContext)
}

/**
 * attempts to decode a provided token
 * @param {*} token a string containing a supposed jwt-token for decoding
 * @returns true if decoded token contains userName
 */
export const isJwtToken = (token) => {
  if (!token) {
    return false
  }
  const { user } = jwt_decode(token)
  return user.userName ? true : false
}

export const invalidateSession = ( setToken, setLoginUserName ) => {
  window.localStorage.removeItem(localStorageKeys.token)
  window.localStorage.removeItem(localStorageKeys.loginUserName)
  window.localStorage.removeItem(localStorageKeys.authenticated)
  window.localStorage.removeItem(localStorageKeys.selectedMode)
  window.localStorage.removeItem(localStorageKeys.selectedPalette)
  setToken(null)
  setLoginUserName(null)
  console.info('Invalidated session.')
}

/**
 * decodes a provided token and compares the contained user objects userName field with the loginUserName parameter
 * @param {*} token jwt-token
 * @param {*} loginUserName username supplied during login process
 * @returns true if loginUserName === token.user.userName
 */
export const isUserTokenValid = (token, loginUserName = null) => {
  if (!token) {
    console.error("Token undefined.")
    return false
  }
  const decodedToken = jwt_decode(token)
  if (decodedToken?.user?.userName === loginUserName) {
    const secondsSinceEpoch = Math.floor(new Date().getTime() / 1000)
    const tokenExpiresAt = decodedToken.exp
    if (tokenExpiresAt < secondsSinceEpoch) {
      console.error(`Token expired [${secondsSinceEpoch - tokenExpiresAt}] seconds ago.`)
      return false
    }
    console.info(`Token of user [${loginUserName}] is valid.`)
    return true
  } else {
    console.error('Token Authentication failed.')
    return false
  }
}

/**
 * 1) calls the helper function isUserTokenValid to guarantee that the token's user's userName and loginUserName match
 * 2) Intercepts HTTP API RESPONSES to check for status 401 = UNAUTHORIZED which gets thrown by authentication.js in backend
 * @param {*} param0 an object containing the optional redirectPath and all of the children components being rendered
 * @returns all children Routes being Protected if true; Navigates to redirectPath if false
 */
export const ProtectedRoute = ({ redirectPath = paths.LOGIN, children}) => {
  const location = useLocation();
  const { token, loginUserName, setToken, setLoginUserName } = useAuth()
  // intercepts each axios response and in case of error and status code 401 = UNAUTHORIZED, invalidates session
  axios.interceptors.response.use(response => {
    // to log all AXIOS responses
    // console.log("RESPONSE INTERCEPTED")
    // console.log(response)
    return response;
  }, error => {
   if (error.response.status === 401) {
    console.info("USER NOT AUTHENTICATED WITH DB")
    window.localStorage.setItem(localStorageKeys.authenticated, "false")
   }
   return error;
  });
  if (!isUserTokenValid(token, loginUserName)){
    console.info("PROTECTED ROUTE ACCESS [DENIED]")
    window.localStorage.setItem(localStorageKeys.authenticated, "false")
  }
  if (window.localStorage.getItem(localStorageKeys.authenticated) !== "true") {
    invalidateSession(setToken, setLoginUserName)
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  } else {
    return children ? children : <Outlet />;
  }
};