import { useState, useContext, createContext } from "react";
import {
  Navigate,
  useLocation,
  Outlet
} from 'react-router-dom';

const AuthContext = createContext(null)

export const AuthProvider = ( {children} ) =>  {
  const [user, setUser] = useState(null)

  const login = user => {
    setUser(user)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => {
  return useContext(AuthContext)
}

const ProtectedRoute = ({
  redirectPath = '/home',
  children
}) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};