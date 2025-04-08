import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

// Tipo para las noticias
type News = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

export default function NewsScreen() {
  const [news, setNews] = useState<News[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setNews(data);
      }
    } catch (error : any) {
      console.error('Error fetching news:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar noticias al montar el componente
  useEffect(() => {
    fetchNews();
  }, []);

  // Función para refrescar noticias
  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  // Renderizar cada noticia
  const renderNewsItem = ({ item }: { item: News }) => (
    <View style={styles.newsItem}>
      {item.image_url && (
        <Image 
          source={{ uri: item.image_url }} 
          style={styles.newsImage} 
          resizeMode="cover"
        />
      )}
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.newsText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Noticias</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : (
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay noticias disponibles</Text>
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
  },
  newsItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  newsImage: {
    width: '100%',
    height: 150,
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  newsDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  newsText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});