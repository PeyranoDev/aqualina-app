import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, LoginCredentials } from '../services/auth-service';
import { userService, UserProfile, User } from '../services/user-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../services/notification-service';

export type UserRole = 'user' | 'security' | 'admin';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  userRole: UserRole | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  updateUserProfile: (updateData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const loadUser = async () => {
    try {
      const userData = await userService.getUser();
      setUser(userData);
      setUserRole(userData?.role || null);
      setIsAuthenticated(true);
      console.log(userRole)
      try {
        const pushToken = await notificationService.getPushToken();
        if (pushToken) {
          await notificationService.registerDevice(pushToken);
        }
      } catch (error) {
        console.error('Error registrando push token:', error);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updateData: Partial<User>) => {
    try {
      const updatedUser = await userService.updateUser(updateData);
      if (updatedUser) {
        setUser(prev => prev ? {...prev, ...updatedUser} : null);
        if (updatedUser.role) {
          setUserRole(updatedUser.role);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          await loadUser();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { success } = await authService.login(credentials);
      if (success) {
        await loadUser();
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
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        isLoading, 
        user,
        userRole,
        login, 
        logout, 
        refreshUser: loadUser,
        setIsLoading,
        updateUserProfile
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};