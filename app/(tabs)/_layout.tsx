import { Tabs } from 'expo-router/tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Definir el tipo para la función tabBarIcon
type TabBarIconProps = {
  color: string;
  size: number;
};

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#0066cc',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#999',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Noticias',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="garage"
        options={{
          title: 'Garage',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="amenities"
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}