import { Tabs, router, usePathname } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../lib/context/auth-context';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'; // <-- 1. Importar StatusBar

const BG_COLOR_SECURITY = '#f8f9fa';
const ACTIVE_TINT_COLOR_SECURITY = '#f39c12';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome5>['name']; color: string }) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function SecurityLayout() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  
  if (isLoading || !pathname) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG_COLOR_SECURITY }}>
        {/* 2. Añadir StatusBar para la pantalla de carga */}
        <StatusBar backgroundColor={BG_COLOR_SECURITY} style="dark" />
        <ActivityIndicator size="large" color={ACTIVE_TINT_COLOR_SECURITY} />
      </View>
    );
  }

  useEffect(() => {
    if (!isLoading && (!user || user.role.toUpperCase() !== 'SECURITY')) {
      router.replace('/unauthorized');
    }
  }, [user, isLoading]);

   if (!user || user.role.toUpperCase() !== 'SECURITY') {
     return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG_COLOR_SECURITY }}>
        <StatusBar backgroundColor={BG_COLOR_SECURITY} style="dark" />
        <ActivityIndicator size="large" color={ACTIVE_TINT_COLOR_SECURITY} />
      </View>
    );
  }

  return (
    <>
      {/* 3. Añadir StatusBar para el layout principal */}
      <StatusBar backgroundColor={BG_COLOR_SECURITY} style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: ACTIVE_TINT_COLOR_SECURITY,
          headerShown: false,
          tabBarStyle: { backgroundColor: BG_COLOR_SECURITY },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Control',
            tabBarIcon: ({ color }) => <TabBarIcon name="shield-alt" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}