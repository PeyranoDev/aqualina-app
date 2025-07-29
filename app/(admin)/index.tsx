import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/context/auth-context';
import { StatusBar } from 'expo-status-bar';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  
  const menuItems = [
    { 
      title: 'Gestión de Usuarios', 
      icon: 'people-outline',
      route: '/(admin)/users',
      description: 'Administra todos los usuarios del sistema'
    },
    { 
      title: 'Reportes', 
      icon: 'document-text-outline',
      route: '/(admin)/reports',
      description: 'Visualiza reportes y estadísticas'
    },
    { 
      title: 'Configuración', 
      icon: 'settings-outline',
      route: '/(admin)/settings',
      description: 'Configuración del sistema'
    },
    { 
      title: 'Solicitudes de Vehículos', 
      icon: 'car-outline',
      route: '/(admin)/vehicle-requests',
      description: 'Administra solicitudes de vehículos'
    },
    {
      title: 'Noticias y Anuncios', 
      icon: 'megaphone-outline',
      route: '/(admin)/news',
      description: 'Publica y gestiona noticias y anuncios'
    },
    {
      title: 'Mantenimiento de Amenidades', 
      icon: 'home-outline',
      route: '/(admin)/amenities',
      description: 'Administra las amenidades del edificio'
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>Bienvenido, {user?.name}</Text>
      </View>
      
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <Link href={item.route} key={index} asChild>
            <TouchableOpacity style={styles.card}>
              <Ionicons name={item.icon as any} size={32} color="#0066cc" />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 5,
  },
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  cardDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});