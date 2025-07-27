import { Stack } from 'expo-router';
import { RoleGuard } from '@/lib/guards/RoleGuard';

export default function SecurityLayout() {
  return (
    <RoleGuard allowedRoles={['security']}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="patrol" />
        <Stack.Screen name="incidents" />
      </Stack>
    </RoleGuard>
  );
}