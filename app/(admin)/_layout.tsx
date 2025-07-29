import { Tabs, router, usePathname } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../lib/context/auth-context';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';

const BG_COLOR = '#f8f9fa';
const ACTIVE_TINT_COLOR = '#c0392b';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome5>['name']; color: string }) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading || !pathname) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG_COLOR }}>
        <ActivityIndicator size="large" color={ACTIVE_TINT_COLOR} />
      </View>
    );
  }

  useEffect(() => {
    if (!isLoading && (!user || user.role.toUpperCase() !== 'ADMIN')) {
      router.replace('/unauthorized');
    }
  }, [user, isLoading]);
  
  const getHeaderTitle = () => {
    switch (pathname) {
      case '/(admin)':
        return 'Panel de Admin';
      case '/(admin)/users':
        return 'Gestión de Usuarios';
      default:
        return 'Admin';
    }
  };

  if (!user || user.role.toUpperCase() !== 'ADMIN') {
     return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG_COLOR }}>
        <ActivityIndicator size="large" color={ACTIVE_TINT_COLOR} />
      </View>
    );
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: ACTIVE_TINT_COLOR,
          headerShown: false,
          headerTitle: getHeaderTitle(),
          headerStyle: { backgroundColor: BG_COLOR },
          tabBarStyle: { backgroundColor: BG_COLOR },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <TabBarIcon name="tachometer-alt" color={color} />,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Usuarios',
            tabBarIcon: ({ color }) => <TabBarIcon name="users-cog" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
