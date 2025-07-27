import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { userService } from '@/lib/services/user-service';
import { UserForResponse } from '@/lib/interfaces/user';
import { Ionicons } from '@expo/vector-icons';

export default function Users() {
  const [users, setUsers] = useState<UserForResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const result = await userService.getUsers({}, { pageNumber: page, pageSize });
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
    fetchUsers(1);
  }, []);

  const handlePrev = async () => {
    if (pageNumber <= 1) return;
    const prevPage = pageNumber - 1;
    await fetchUsers(prevPage);
    setPageNumber(prevPage);
  };

  const handleNext = async () => {
    if (pageNumber >= totalPages) return;
    const nextPage = pageNumber + 1;
    await fetchUsers(nextPage);
    setPageNumber(nextPage);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>

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

          {/* Paginación */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
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
