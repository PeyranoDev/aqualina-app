import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

export const useNotifications = () => {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true, 
      }),
    });

    const received = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    const response = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (typeof data?.url === 'string') {
        router.push(data.url);
      } else {
        console.log('No se encontró una URL válida en los datos de la notificación');
      }
    });

    return () => {
      received.remove();
      response.remove();
    };
  }, []);
};
