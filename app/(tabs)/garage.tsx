import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

// Tipo para los vehículos
type Vehicle = {
  id: string;
  plate: string;
  model: string;
  color: string;
  is_parked: boolean;
};

export default function GarageScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState<string | null>(null);

  // Función para cargar vehículos desde Supabase
  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setVehicles(data);
      }
    } catch (error : any) {
        console.error('Error fetching vehicles:', error.message);
        Alert.alert('Error', 'No se pudieron cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar vehículos al montar el componente
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Función para solicitar un vehículo
  const requestVehicle = async (vehicle: Vehicle) => {
    setRequestLoading(vehicle.id);
    try {
      // Obtener el ID del usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuario no autenticado');

      // Crear una nueva solicitud
      const { error } = await supabase
        .from('vehicle_requests')
        .insert({
          vehicle_id: vehicle.id,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      Alert.alert(
        'Solicitud enviada', 
        'Seguridad ha sido notificado y preparará su vehículo.'
      );
    } catch (error : any) {
        console.error('Error requesting vehicle:', error.message);
        Alert.alert('Error', 'No se pudo enviar la solicitud');
    } finally {
      setRequestLoading(null);
    }
  };

  // Renderizar cada vehículo
  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.carItem}>
      <View style={styles.carInfo}>
        <Text style={styles.carPlate}>{item.plate}</Text>
        <Text style={styles.carModel}>{item.model} - {item.color}</Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: item.is_parked ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={styles.statusText}>
            {item.is_parked ? 'Estacionado' : 'Fuera'}
          </Text>
        </View>
      </View>
      {item.is_parked && (
        <TouchableOpacity 
          style={styles.callButton}
          onPress={() => {
            Alert.alert(
              'Llamar a seguridad',
              `¿Desea que seguridad prepare su vehículo ${item.plate}?`,
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Llamar', onPress: () => requestVehicle(item) }
              ]
            );
          }}
          disabled={requestLoading === item.id}
        >
          {requestLoading === item.id ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="call-outline" size={24} color="white" />
              <Text style={styles.callButtonText}>Solicitar</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Mis Vehículos</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes vehículos registrados</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => {
                  // Aquí iría la navegación a una pantalla para agregar vehículos
                  Alert.alert('Próximamente', 'Funcionalidad en desarrollo');
                }}
              >
                <Text style={styles.addButtonText}>Agregar Vehículo</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  carItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  carInfo: {
    flex: 1,
  },
  carPlate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  carModel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#444',
  },
  callButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  callButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});