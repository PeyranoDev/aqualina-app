/**
 * Define la estructura para registrar un token de notificación push.
 * Corresponde a `NotificationTokenCreateDTO` del backend.
 */
export interface RegisterPushTokenPayload {
  token: string;
}