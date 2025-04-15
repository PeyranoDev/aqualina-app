import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { vehicleService, Vehicle, VehicleRequest } from '../../services/vehicle-service';

export default function GarageScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState<string | null>(null);

  // Función para cargar vehículos
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getUserVehicles();
      setVehicles(data);
    } catch (error) {
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
      const request = await vehicleService.requestVehicle(vehicle.id);
      
      if (request) {
        Alert.alert(
          'Solicitud enviada', 
          'Seguridad ha sido notificado y preparará su vehículo.'
        );
      } else {
        throw new Error('No se pudo crear la solicitud');
      }
    } catch (error) {
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

  // Función para agregar un nuevo vehículo
  const handleAddVehicle = () => {
    // Aquí podrías navegar a una pantalla para agregar un vehículo
    // Por ahora, solo mostraremos un mensaje
    Alert.alert('Próximamente', 'Funcionalidad en desarrollo');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Mis Vehículos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddVehicle}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
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
                style={styles.emptyAddButton}
                onPress={handleAddVehicle}
              >
                <Text style={styles.emptyAddButtonText}>Agregar Vehículo</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#0066cc',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyAddButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});