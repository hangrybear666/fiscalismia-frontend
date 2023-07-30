import { useState, useContext, createContext } from "react";
import {
  Navigate,
  useLocation,
  Outlet
} from 'react-router-dom';

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(window.localStorage.getItem('jwt-token'));

  return (
    <AuthContext.Provider value={token}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)
}

export const isUserAuthenticated = () => {

  const token = useAuth();
  if (token?.startsWith('Bearer')) {
    console.log("User successfully authenticated")
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