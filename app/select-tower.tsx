import React, { useState, useEffect } from 'react';
// 1. Nos aseguramos de que SafeAreaView esté importado
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { getTowers } from '../lib/services/tower-service';

import { useAuth } from '../lib/context/auth-context';
import { Tower } from '@/lib/interfaces/tower';

const SelectTowerScreen = () => {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTowerUI, setSelectedTowerUI] = useState<Tower | null>(null);
  const router = useRouter();
  const { selectTower } = useAuth();

  useEffect(() => {
    const fetchTowers = async () => {
      try {
        const fetchedTowers = await getTowers();
        setTowers(fetchedTowers);
      } catch (error) {
        console.error("Error fetching towers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTowers();
  }, []);

  const handleSelectTower = (tower: Tower) => {
    setSelectedTowerUI(tower);
  };

  const handleConfirmSelection = async () => {
    if (selectedTowerUI) {
      await selectTower(selectedTowerUI);
      // Pasamos los datos de la torre como parámetro a la siguiente pantalla
      router.push({
        pathname: '/login',
        params: { towerName: selectedTowerUI.name, towerId: selectedTowerUI.id }
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderTowerItem = ({ item }: { item: Tower }) => (
    <TouchableOpacity
      style={[
        styles.card,
        selectedTowerUI?.id === item.id && styles.selectedCard,
      ]}
      onPress={() => handleSelectTower(item)}>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    // 2. Cambiamos el View principal de vuelta a un SafeAreaView
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu torre</Text>
      <FlatList
        data={towers}
        renderItem={renderTowerItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={[styles.button, !selectedTowerUI && styles.buttonDisabled]}
        onPress={handleConfirmSelection}
        disabled={!selectedTowerUI}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#0066cc',
  },
  cardText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SelectTowerScreen;
