import { apiClient } from '@/lib/api-client';

export const notificationService = {
  async registerTokenOnServer(token: string, platform: string, deviceId: string) {
    return apiClient.post('/notifications/register-token', {
      token,
      platform,
      deviceId,
    });
  },
};