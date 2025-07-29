import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../interfaces/user';
import { useNotifications } from '../hooks/use-notifications';
import NotificationService from '../services/notification-service';
import { authService } from '../services/auth-service';
import { Credentials } from '../interfaces/auth';
import { Tower } from '../interfaces/tower';

const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';
const TOWER_KEY = 'selectedTower'; 

interface AuthContextType {
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => void;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; 
  selectedTower: Tower | null; 
  selectTower: (tower: Tower) => void; 
  clearSelectedTower: () => void; // Añadimos la función para limpiar la torre
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  
  const { registerForPushNotificationsAsync } = useNotifications();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_DATA_KEY);
        const storedTower = await SecureStore.getItemAsync(TOWER_KEY); 
        
        if (token && storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        }

        if (storedTower) { 
          const parsedTower: Tower = JSON.parse(storedTower);
          setSelectedTower(parsedTower);
        }

      } catch (error) {
        console.error("Error cargando datos de autenticación:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    loadAuthData();
  }, []);


  const signIn = async (credentials: Credentials) => {
    try {
      const authResponse = await authService.login(credentials);
      
      setUser(authResponse.user);

      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, authResponse.accessToken);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(authResponse.user));
      
      const deviceToken = await registerForPushNotificationsAsync();

      if (deviceToken) {
        await NotificationService.registerToken(deviceToken);
      }
      
    } catch (error) {
      console.error('Fallo en el inicio de sesión:', error);
      throw new Error('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
    }
  };

  const signOut = async () => {
    try {
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_DATA_KEY);
        await SecureStore.deleteItemAsync(TOWER_KEY); 
        setUser(null);
        setSelectedTower(null); 
    } catch (error) {
        console.error("Error durante el cierre de sesión:", error);
    }
  };

  const selectTower = async (tower: Tower) => {
    try {
      await SecureStore.setItemAsync(TOWER_KEY, JSON.stringify(tower));
      setSelectedTower(tower);
    } catch (error) {
      console.error("Error guardando la torre seleccionada:", error);
    }
  };


  const clearSelectedTower = async () => {
    try {
      await SecureStore.deleteItemAsync(TOWER_KEY);
      setSelectedTower(null);

    } catch (error) {
      console.error("Error al limpiar la torre seleccionada:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isAuthenticated: !!user, isLoading, selectedTower, selectTower, clearSelectedTower }}>
      {children}
    </AuthContext.Provider>
  );
};
