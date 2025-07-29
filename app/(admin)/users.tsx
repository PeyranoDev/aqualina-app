import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, TextInput, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { userService } from '@/lib/services/user-service';
import { User, UserFilterParams } from '@/lib/interfaces/user';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; 

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState(''); 
  const [activeFilters, setActiveFilters] = useState<UserFilterParams>({});
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState<UserFilterParams>({
    sortBy: 'name',
    isSortAscending: true,
  });

  const pageSize = 15;

const fetchUsers = async (page: number, filters: UserFilterParams) => {
  setLoading(true);
  try {
    const result = await userService.getUsers(filters, { pageNumber: page, pageSize });
    if (result) {
      setUsers(result.data);
      setTotalPages(result.totalPages);
    }
  } catch (err) {
    console.error('Error al traer usuarios:', err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchUsers(pageNumber, activeFilters);
}, [pageNumber, activeFilters]);

  const handleLoadMore = () => {
    if (loadingMore || pageNumber >= totalPages) {
      return;
    }
    fetchUsers(pageNumber + 1, activeFilters, false);
  };

  const handleApplyFilters = () => {
    const newFilters: UserFilterParams = { 
      ...tempFilters,
      name: searchQuery 
    };
    setActiveFilters(newFilters);
    fetchUsers(1, newFilters, true);
    setIsModalVisible(false);
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    const defaultFilters: UserFilterParams = { sortBy: 'name', isSortAscending: true };
    setTempFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    fetchUsers(1, defaultFilters, true);
  };

  const openFilterModal = () => {
    setTempFilters(activeFilters);
    setIsModalVisible(true);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  };
  
  const renderUserCard = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.name} {item.surname}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      {item.apartmentInfo ? (
        <Text style={styles.apartmentInfo}>
          Dept: {item.apartmentInfo.identifier}
        </Text>
      ) : (
        <Text style={styles.apartmentInfo}>Sin información de departamento</Text>
      )}
      <View style={[styles.roleBadge, item.role === 'admin' && styles.adminBadge, item.role === 'security' && styles.securityBadge]}>
        <Text style={styles.roleText}>{item.role}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <StatusBar hidden />
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ordenar y Filtrar</Text>

            <Text style={styles.modalSectionTitle}>Ordenar por:</Text>
            <View style={styles.optionGroup}>
              {['name', 'surname', 'username'].map((field) => (
                <Pressable
                  key={field}
                  style={[styles.optionButton, tempFilters.sortBy === field && styles.optionButtonSelected]}
                  onPress={() => setTempFilters(prev => ({ ...prev, sortBy: field as 'name' | 'surname' | 'username' }))}
                >
                  <Text style={[styles.optionButtonText, tempFilters.sortBy === field && styles.optionButtonTextSelected]}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.modalSectionTitle}>Dirección:</Text>
            <View style={styles.optionGroup}>
              <Pressable
                style={[styles.optionButton, tempFilters.isSortAscending === true && styles.optionButtonSelected]}
                onPress={() => setTempFilters(prev => ({ ...prev, isSortAscending: true }))}
              >
                <Text style={[styles.optionButtonText, tempFilters.isSortAscending === true && styles.optionButtonTextSelected]}>Ascendente</Text>
              </Pressable>
              <Pressable
                style={[styles.optionButton, tempFilters.isSortAscending === false && styles.optionButtonSelected]}
                onPress={() => setTempFilters(prev => ({ ...prev, isSortAscending: false }))}
              >
                <Text style={[styles.optionButtonText, tempFilters.isSortAscending === false && styles.optionButtonTextSelected]}>Descendente</Text>
              </Pressable>
            </View>

            <Pressable onPress={handleApplyFilters} style={[styles.filterButton, { width: '100%', marginTop: 20 }]}>
              <Text style={styles.buttonText}>Aplicar Filtros</Text>
            </Pressable>
             <Pressable onPress={() => setIsModalVisible(false)} style={styles.closeModalButton}>
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Gestión de Usuarios</Text>
        </View>
        
        <View style={styles.filterContainer}>
          <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleApplyFilters}
          />
          <View style={styles.buttonGroup}>
            <Pressable onPress={openFilterModal} style={[styles.filterButton, styles.optionsButton]}>
                <Ionicons name="options-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Filtros</Text>
            </Pressable>
            <Pressable onPress={handleClearFilters} style={[styles.filterButton, styles.clearButton]}>
                <Text style={styles.buttonText}>Limpiar</Text>
            </Pressable>
          </View>
        </View>

        {loading && pageNumber === 1 ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }}/>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item, index) => `${item.id.toString()}-${index}`}
            renderItem={renderUserCard}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: { 
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
  },
  optionsButton: {
    backgroundColor: '#2c3e50'
  },
  clearButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    marginHorizontal: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  userCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  apartmentInfo: {
    marginTop: 5,
    fontSize: 14,
    color: '#34495e',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#3498db',
  },
  adminBadge: {
    backgroundColor: '#9b59b6',
  },
  securityBadge: {
    backgroundColor: '#e67e22',
  },
  roleText: {
    color: 'white',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    paddingBottom: 40, 
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  optionGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  optionButtonText: {
    color: '#333',
  },
  optionButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeModalButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#e74c3c',
    fontSize: 16,
  }
});
