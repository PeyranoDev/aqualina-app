// lib/services/notification-service.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { apiClient } from '@/lib/api-client';

export const notificationService = {
  async registerPushToken(): Promise<string | null> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Permisos de notificación no concedidos');
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      await apiClient.post('/notifications/register-token', {
        token,
        platform: Platform.OS,
        deviceId: Device.modelName
      });

      return token;
    } catch (error) {
      console.error('Error al registrar token push:', error);
      return null;
    }
  },

  async scheduleNotification(title: string, body: string, seconds: number): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: { 
        seconds,
        type: 'timeInterval' 
      },
    });
  },

  async checkPermissions(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  },

  // Opcional: Método para notificaciones con fecha específica
  async scheduleNotificationAtDate(title: string, body: string, date: Date): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: {
        type: 'date', // Tipo diferente para fecha específica
        date: date.getTime(),
      },
    });
  }
};