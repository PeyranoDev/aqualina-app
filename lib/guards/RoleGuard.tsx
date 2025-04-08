import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/lib/context/auth-context';
import { RoleGuardProps } from './types';

export const RoleGuard = ({ 
  allowedRoles, 
  children, 
  fallbackRoute = '/unauthorized',
  loadingComponent = (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  )
}: RoleGuardProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return loadingComponent;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Redirect href={fallbackRoute} />;
  }

  return <>{children}</>;
};