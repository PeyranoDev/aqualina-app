import { Stack } from 'expo-router';
import { AdminGuard } from '@/lib/guards/AdminGuard';

export default function AdminLayout() {
  return (
    <AdminGuard>
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'fade'
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="users" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="settings" />
      </Stack>
    </AdminGuard>
  );
}