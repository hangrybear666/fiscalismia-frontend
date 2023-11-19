import { useState, useContext, createContext, useEffect} from "react";
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
 * The React Context Provider containing contextual values available to all of its children components
 * @param {*} param0 the children being nested within the React Context
 * @returns The Authentication Context containing a context value and all children components within the Route
 */
export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(window.localStorage.getItem(localStorageKeys.token) || null);
  const [loginUserName, setLoginUserName] = useState(window.localStorage.getItem(localStorageKeys.loginUserName) || null)
  const [authenticated, setAuthenticated] = useState(false)

  const loggedInAs = {
    token: token,
    setToken: setToken,
    authenticated: authenticated,
    setAuthenticated: setAuthenticated,
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
 * @returns AuthContext containing token, authenticated loginUserName and respective setters as values
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

export const invalidateSession = ( setToken, setLoginUserName,  setAuthenticated ) => {
  window.localStorage.removeItem(localStorageKeys.token)
  window.localStorage.removeItem(localStorageKeys.loginUserName)
  window.localStorage.removeItem(localStorageKeys.selectedMode)
  window.localStorage.removeItem(localStorageKeys.selectedPalette)
  setToken(null)
  setLoginUserName(null)
  setAuthenticated(false)
  console.info('Invalidated session.')
}

/**
 * decodes a provided token and compares the contained user objects userName field with the loginUserName parameter
 * @param {*} token jwt-token
 * @param {*} loginUserName username supplied during login process
 * @returns true if loginUserName === token.user.userName
 */
export const isUserAuthenticated = (token, loginUserName = null) => {
  if (!token) {
    console.error("Token undefined.")
    return false
  }
  const decodedToken = jwt_decode(token)
  if (decodedToken?.user?.userName === loginUserName) {
    const secondsSinceEpoch = Math.floor(new Date().getTime() / 1000)
    const tokenExpiresAt = decodedToken.exp
    if (tokenExpiresAt < secondsSinceEpoch) {
      console.info(`Token expired [${secondsSinceEpoch - tokenExpiresAt}] seconds ago.`)
      return false
    }
    console.info(`User [${loginUserName}] successfully authenticated`)
    return true
  } else {
    console.error('Token Authentication failed.')
    return false
  }
}

/**
 * calls the helper function isUserAuthenticated to guarantee that the token's user's userName and loginUserName match
 * @param {*} param0 an object containing the optional redirectPath and all of the children components being rendered
 * @returns all children Routes being Protected if true; Navigates to redirectPath if false
 */
export const ProtectedRoute = ({
  redirectPath = paths.LOGIN,
  children
}) => {
  const location = useLocation();
  const { token, loginUserName, setToken, setLoginUserName,  setAuthenticated } = useAuth()
  if (!isUserAuthenticated(token, loginUserName)) {
    console.info("PROTECTED ROUTE ACCESS [DENIED]")
    invalidateSession(setToken, setLoginUserName,  setAuthenticated)
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};