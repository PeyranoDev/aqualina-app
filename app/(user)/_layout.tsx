import { Tabs, router, usePathname } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../lib/context/auth-context';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 1. Importar el hook

// Definir constantes de estilo para mantener la consistencia.
const BG_COLOR = '#ffffff'; // Fondo blanco para la sección de usuario
const ACTIVE_TINT_COLOR = '#2f95dc'; // Color activo para los íconos

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome5>['name']; color: string }) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Componente para el fondo de la StatusBar
function CustomStatusBarBackground() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ height: insets.top, backgroundColor: BG_COLOR }}>
      <StatusBar style="dark" />
    </View>
  );
}

export default function UserTabsLayout() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  // Muestra un loader mientras se carga la autenticación o el enrutador no está listo.
  if (isLoading || !pathname) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG_COLOR }}>
        {/* Usamos el nuevo componente de StatusBar aquí también */}
        <CustomStatusBarBackground />
        <ActivityIndicator size="large" color={ACTIVE_TINT_COLOR} />
      </View>
    );
  }

  useEffect(() => {
    // Si no se está cargando y el usuario no existe o no tiene el rol correcto, redirige.
    if (!isLoading && (!user || user.role.toUpperCase() !== 'USER')) {
      router.replace('/unauthorized');
    }
  }, [user, isLoading]);
  
  const getHeaderTitle = () => {
    switch (pathname) {
      case '/(user)':
        return 'Inicio';
      case '/(user)/amenities':
        return 'Amenities';
      case '/(user)/garage':
        return 'Garage';
      case '/(user)/profile':
        return 'Perfil';
      default:
        return 'Aqualina';
    }
  };

  // Mientras se redirige, muestra un loader para evitar renderizar contenido incorrecto.
  if (!user || user.role.toUpperCase() !== 'USER') {
     return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG_COLOR }}>
        <CustomStatusBarBackground />
        <ActivityIndicator size="large" color={ACTIVE_TINT_COLOR} />
      </View>
    );
  }

  // Si todo es correcto, renderiza las pestañas.
  return (
    <View style={{ flex: 1, backgroundColor: BG_COLOR }}>
      {/* 2. Renderizar el fondo personalizado para la StatusBar */}
      <CustomStatusBarBackground />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: ACTIVE_TINT_COLOR,
          headerShown: false,
          headerTitle: getHeaderTitle(),
          // Aplicamos estilos consistentes
          headerStyle: { backgroundColor: BG_COLOR, elevation: 0, shadowOpacity: 0 },
          tabBarStyle: { backgroundColor: BG_COLOR, borderTopWidth: 0 },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="amenities"
          options={{
            title: 'Amenities',
            tabBarIcon: ({ color }) => <TabBarIcon name="calendar-alt" color={color} />,
          }}
        />
        <Tabs.Screen
          name="garage"
          options={{
            title: 'Garage',
            tabBarIcon: ({ color }) => <TabBarIcon name="car" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
