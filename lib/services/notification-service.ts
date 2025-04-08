import { apiClient } from '@/lib/api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const notificationService = {
  async getPushToken(): Promise<string | null> {
    let { status } = await Notifications.getPermissionsAsync();
    console.log('Notification permission status:', status);

  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    status = newStatus;
  }

  if (status !== 'granted') return null;

  const token = (await Notifications.getDevicePushTokenAsync()).data;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  },

  async registerDevice(token: string): Promise<void> {
    try {
      await apiClient.post('/notification/register', {
        Token: token,
        Platform: Platform.OS,
        DeviceModel: Device.modelName
      });
      
      await AsyncStorage.setItem('pushToken', token);
    } catch (error) {
      console.error('Error registrando dispositivo:', error);
      throw error;
    }
  },

  async checkPermissions(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  },

  async unregisterDevice(): Promise<void> {
    const token = await AsyncStorage.getItem('pushToken');
    if (!token) return;
    
    try {
      await apiClient.post('/notification/unregister', { Token: token });
      await AsyncStorage.removeItem('pushToken');
    } catch (error) {
      console.error('Error al desregistrar dispositivo:', error);
    }
  }
};
