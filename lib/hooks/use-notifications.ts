import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

// Configuración global para cómo se deben manejar las notificaciones cuando la app está en primer plano.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Hook para gestionar toda la lógica de notificaciones push del dispositivo.
 * Se encarga de permisos, obtención de token y listeners de eventos.
 */
export const useNotifications = () => {
  const [devicePushToken, setDevicePushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const router = useRouter();

  useEffect(() => {
    // Listener para cuando se recibe una notificación mientras la app está abierta.
    const notificationReceivedListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log('Notificación recibida en primer plano:', notification);
    });

    // Listener para cuando el usuario interactúa con una notificación (la toca).
    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuario interactuó con la notificación:', response);
      const data = response.notification.request.content.data;
      // Si la notificación trae una URL, navega a esa pantalla.
      if (data && data.url) {
        router.push(data.url as any);
      }
    });

    // Función de limpieza para remover los listeners cuando el componente se desmonte.
    return () => {
      notificationReceivedListener.remove();
      notificationResponseListener.remove();
    };
  }, []);

  /**
   * Registra el dispositivo para notificaciones push. Pide permisos y obtiene el token nativo.
   * @returns El token del dispositivo (string) o undefined si falla.
   */
  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    if (!Device.isDevice) {
      console.warn('Las notificaciones push solo funcionan en dispositivos físicos.');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.error('El usuario no concedió permisos para notificaciones.');
      return;
    }
    
    // Configuración del canal de notificación para Android (obligatorio).
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    try {
      const token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log('Token de dispositivo nativo obtenido:', token);
      setDevicePushToken(token);
      return token;
    } catch (error) {
      console.error('Error al obtener el token de notificación del dispositivo:', error);
    }
  };

  return {
    devicePushToken,
    notification,
    registerForPushNotificationsAsync,
  };
};
