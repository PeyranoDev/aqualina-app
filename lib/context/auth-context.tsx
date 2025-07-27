import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { User } from '../interfaces/user';
import { useNotifications } from '../hooks/use-notifications'; // Importamos el hook
import NotificationService from '../services/notification-service'; // Importamos el servicio
import { authService, LoginCredentials } from '../services/auth-service';

const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

interface AuthContextType {
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
  user: User | null;
  isAuthenticated: boolean;
  activeTowerId: string | null;
  setActiveTowerId: (towerId: string) => void;
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
  const [activeTowerId, setActiveTowerIdState] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();
  
  // Usamos nuestro hook de notificaciones para acceder a su funcionalidad.
  const { registerForPushNotificationsAsync } = useNotifications();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_DATA_KEY);
        
        if (token && storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          // Opcional: podrías guardar y cargar también el activeTowerId
        }
      } catch (error) {
        console.error("Error cargando datos de autenticación:", error);
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
        // Redirigir basado en rol
        switch (user.role) {
            case "admin":
                router.replace('/(admin)');
                break;
            case "security":
                router.replace('/(security)');
                break;
            default:
                router.replace('/(user)');
                break;
        }
    }
  }, [user, segments]);

  const signIn = async (credentials: LoginCredentials) => {
    try {
      const authResponse = await authService.login(credentials);
      
      setUser(authResponse.user);
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, authResponse.token);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(authResponse.user));
      
      // --- ORQUESTACIÓN DE NOTIFICACIONES ---
      // 1. Justo después del login, intentamos registrar para notificaciones.
      const deviceToken = await registerForPushNotificationsAsync();

      // 2. Si obtenemos un token, se lo pasamos al servicio para que lo envíe al backend.
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
        setUser(null);
        setActiveTowerIdState(null);
        // Opcional: Informar al backend que el usuario cerró sesión para invalidar el token de notificación.
    } catch (error) {
        console.error("Error durante el cierre de sesión:", error);
    }
  };

  const setActiveTowerId = (towerId: string) => {
    // Aquí podrías guardar el ID en SecureStore si quieres que sea persistente
    setActiveTowerIdState(towerId);
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isAuthenticated: !!user, activeTowerId, setActiveTowerId }}>
      {children}
    </AuthContext.Provider>
  );
};
