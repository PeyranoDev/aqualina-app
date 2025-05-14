import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, LoginCredentials } from '../services/auth-service';
import { userService, User } from '../services/user-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../services/notification-service';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setIsLoading: (loading: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    try {
      const userData = await userService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          await loadUser();
          setIsAuthenticated(true);
          const pushToken = await notificationService.getPushToken();
          if (pushToken) {
            await notificationService.registerDevice(pushToken);
          }
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const token = await authService.login(credentials);
      if (token) {
        setIsAuthenticated(true);
        await loadUser();

        try {
          const pushToken = await notificationService.getPushToken();
          console.log(pushToken)
          if (pushToken) {
            await notificationService.registerDevice(pushToken);
          }
        } catch (error) {
          console.error('Error registrando push token:', error);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      await notificationService.unregisterDevice();
      await AsyncStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout, refreshUser, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
