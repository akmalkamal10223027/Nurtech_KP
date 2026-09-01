import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, getToken, setToken, removeToken, getUser, setUser, removeUser } from '../api';
import { IUser } from '../types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<IUser | null>(getUser());
  const [token, setTokenState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const profile = await api.getMe();
          setUserState(profile);
          setUser(profile);
        } catch (e: any) {
          console.warn('Session expired or invalid:', e.message);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();

    const handleUserChange = () => {
      const updatedUser = getUser();
      if (updatedUser) {
        setUserState(updatedUser);
      }
    };
    window.addEventListener('admin_user_changed', handleUserChange);
    return () => window.removeEventListener('admin_user_changed', handleUserChange);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setToken(res.jwt);
    setUser(res.user);
    setTokenState(res.jwt);
    setUserState(res.user);
    return res.user;
  };

  const logout = () => {
    removeToken();
    removeUser();
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
