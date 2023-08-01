import { useState, useContext, createContext } from "react";
import {
  Navigate,
  useLocation,
  Outlet
} from 'react-router-dom';
import jwt_decode from "jwt-decode";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(window.localStorage.getItem('jwt-token'));

  const loggedInAs = {
    userName: 'admin', // TODO
    userEmail: 'arschfresse1@hotmail.de', // TODO
    token: token
  }

  return (
    <AuthContext.Provider value={loggedInAs}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)
}

export const isUserAuthenticated = () => {

  const { token } = useAuth();
  const decodedToken = jwt_decode(token)
  if (decodedToken?.user?.userName === 'admin') { // TODO
    console.log(`User [${decodedToken?.user?.userName}] successfully authenticated`)
    return true
  } else {
    console.log('Token Authentication failed. Token is as follows:')
    console.log(token)
    return false
  }
}

export const ProtectedRoute = ({
  redirectPath = '/login',
  children
}) => {
  const location = useLocation();

  if (!isUserAuthenticated()) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};