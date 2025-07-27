import { Tabs } from 'expo-router/tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserGuard } from '@/lib/guards/UserGuard';
import { RoleGuard } from '@/lib/guards/RoleGuard';

type TabBarIconProps = {
  color: string;
  size: number;
};

export default function UserTabsLayout() {
  return (
    <UserGuard 
      fallbackRoute="/login"
      loadingComponent={
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      }>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#888',
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
      </SafeAreaView>
    </UserGuard>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4'
  },
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f4f4f4' 
  },
});