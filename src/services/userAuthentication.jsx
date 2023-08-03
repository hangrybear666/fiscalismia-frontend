import { useState, useContext, createContext, useEffect} from "react";
import {
  Navigate,
  useLocation,
  Outlet
} from 'react-router-dom';
import jwt_decode from "jwt-decode";

/**
 * // TODO
 */
const AuthContext = createContext(null)

/**
 * // TODO
 * @param {*} param0 
 * @returns 
 */
export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(window.localStorage.getItem('jwt-token') || null);
  const [loginUserName, setLoginUserName] = useState(window.localStorage.getItem('loginUserName') || null)
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
 * // TODO
 * @returns 
 */
export const useAuth = () => {
  return useContext(AuthContext)
}

/**
 * // TODO
 * @returns 
 */
export const isUserAuthenticated = (token, loginUserName = null) => {
  if (!token) {
    console.log("TOKEN UNDEFINED")
    return false
  }
  const decodedToken = jwt_decode(token)
  if (decodedToken?.user?.userName === loginUserName) {
    console.log(`User [${loginUserName}] successfully authenticated`)
    return true
  } else {
    console.error('Token Authentication failed.')
    return false
  }
}

/**
 * // TODO
 * @param {*} param0 
 * @returns 
 */
export const ProtectedRoute = ({
  redirectPath = '/login',
  children
}) => {
  const location = useLocation();
  const { token, loginUserName } = useAuth()
  // const token = window.localStorage.getItem('jwt-token')
  // const loginUserName = window.localStorage.getItem('loginUserName')

  if (!isUserAuthenticated(token, loginUserName)) {
    console.error("PROTECTED ROUTE ACCESS [DENIED]")
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};