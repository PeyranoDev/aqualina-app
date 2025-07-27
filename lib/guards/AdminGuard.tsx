import { RoleGuard } from './RoleGuard';
import { ActivityIndicator, View } from 'react-native';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard 
    allowedRoles={['admin']} 
    fallbackRoute="/unauthorized"
    loadingComponent={
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    }
  >
    {children}
  </RoleGuard>
);