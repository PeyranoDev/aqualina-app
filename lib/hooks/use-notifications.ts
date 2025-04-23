import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService } from '../services/notification-service';
import { useAuth } from '../context/auth-context';
import { router } from 'expo-router';

export const useNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    const setupNotifications = async () => {
      if (user) {
        await notificationService.registerPushToken();
      }

      const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notificación recibida:', notification);
      });

      const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        if (data?.url) {
          router.push(data.url as string);
        }
      });

      return () => {
        receivedSubscription.remove();
        responseSubscription.remove();
      };
    };

    setupNotifications();
  }, [user]);

  return {
    scheduleNotification: notificationService.scheduleNotification,
    checkPermissions: notificationService.checkPermissions
  };
};