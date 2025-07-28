import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { userService } from '../../lib/services/user-service';
import { useAuth } from '@/lib/context/auth-context';
import { router } from 'expo-router';
import { User } from '@/lib/interfaces/user';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [apartment, setApartment] = useState('');

  const { user, signOut } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
  
      try {
        const userProfile = await userService.getUser();
        console.log('userProfile:', userProfile);
        setProfile(userProfile);
        setName(userProfile.name);
        setSurname(userProfile.surname);
        setApartment(userProfile.apartment);
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
        Alert.alert('Error', 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
  
    loadProfile();
  }, [user]);

  const updateProfile = async () => {
    try {
      setUpdating(true);
      const updated = await userService.updateUser({
        name: name,
        surname: surname,
      });
      if (updated) {
        await refreshUser();
        console.log("ola")
        Alert.alert('Perfil actualizado', 'Tu perfil ha sido actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setUpdating(false);
    }
  };
  

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.screenTitle}>Mi Perfil</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={profile?.email || ''}
            editable={false}
          />
          
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ingrese su nombre completo"
          />

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={surname}
            onChangeText={setSurname}
            placeholder="Ingrese su nombre completo"
          />
          
          
          <TouchableOpacity 
            style={styles.updateButton} 
            onPress={updateProfile}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Actualizar Perfil</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => {
            Alert.alert(
              'Cerrar Sesión',
              '¿Está seguro que desea cerrar sesión?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar Sesión', onPress: handleLogout, style: 'destructive' }
              ]
            );
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  updateButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});