import { useState, useContext, createContext } from "react";
import {
  Navigate,
  useLocation,
  Outlet
} from 'react-router-dom';

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState('jwt-get');

  return (
    <AuthContext.Provider value={token}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)
}

export const ProtectedRoute = ({
  redirectPath = '/login',
  children
}) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};