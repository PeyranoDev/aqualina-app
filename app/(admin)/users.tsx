import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { userService } from '@/lib/services/user-service';
import { User, UserFilterParams } from '@/lib/interfaces/user';
import { Ionicons } from '@expo/vector-icons';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<UserFilterParams>({});
  const pageSize = 10;

  const fetchUsers = async (page: number, filters: UserFilterParams) => {
    setLoading(true);
    try {

      const result = await userService.getUsers(filters, { pageNumber: page, pageSize });
      if (result) {
        setUsers(result.data);
        setTotalPages(result.totalPages);
        setPageNumber(page);
      }
    } catch (err) {
      console.error('Error al traer usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, {});
  }, []);

  const handleApplyFilters = () => {
    const newFilters: UserFilterParams = { name: searchQuery };
    setActiveFilters(newFilters);
    fetchUsers(1, newFilters);
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilters({});
    fetchUsers(1, {});
  };

  const handlePrev = async () => {
    if (pageNumber <= 1) return;
    const prevPage = pageNumber - 1;
    await fetchUsers(prevPage, activeFilters);
  };

  const handleNext = async () => {
    if (pageNumber >= totalPages) return;
    const nextPage = pageNumber + 1;
    await fetchUsers(nextPage, activeFilters);
  };

  return (
    <View style={styles.container}>
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
            <Pressable onPress={handleApplyFilters} style={styles.filterButton}>
                <Text style={styles.buttonText}>Filtrar</Text>
            </Pressable>
            <Pressable onPress={handleClearFilters} style={[styles.filterButton, styles.clearButton]}>
                <Text style={styles.buttonText}>Limpiar</Text>
            </Pressable>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
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
                <View
                  style={[
                    styles.roleBadge,
                    item.role === 'admin' && styles.adminBadge,
                    item.role === 'security' && styles.securityBadge
                  ]}
                >
                  <Text style={styles.roleText}>{item.role}</Text>
                </View>
              </View>
            )}
          />

          <View style={styles.pagination}>
            <Pressable
              onPress={handlePrev}
              disabled={pageNumber === 1}
              style={[styles.pageButton, pageNumber === 1 && styles.disabledButton]}
            >
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text style={styles.buttonText}>Anterior</Text>
            </Pressable>

            <Text style={styles.pageInfo}>Página {pageNumber} de {totalPages}</Text>

            <Pressable
              onPress={handleNext}
              disabled={pageNumber === totalPages}
              style={[styles.pageButton, pageNumber === totalPages && styles.disabledButton]}
            >
              <Text style={styles.buttonText}>Siguiente</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </Pressable>
          </View>
        </>
      )}

      <Link href="/" style={styles.backLink}>
        Volver al panel
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
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
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: 'white',
    marginHorizontal: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 14,
    color: '#2c3e50',
  },
  backLink: {
    marginTop: 20,
    color: '#0066cc',
    textAlign: 'center',
    padding: 10,
  },
});
