import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { Slot, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { authService } from '../services/auth-service';

const phrases = [
  "Preparando tu espacio de bienestar...",
  "Conectando con tu comunidad...",
  "Organizando la comodidad del hogar...",
  "Tu día comienza con Aqualina...",
  "Optimizando tu experiencia residencial...",
  "Trayendo calma a tu rutina...",
];

export default function RootLayout() {
  const [randomPhrase] = useState(() => {
    const index = Math.floor(Math.random() * phrases.length);
    return phrases[index];
  });

  const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const [fadeSplash] = useState(new Animated.Value(1));
  const [fadeContent] = useState(new Animated.Value(0));
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const init = async () => {
      try {
        const isAuth = await authService.isAuthenticated();

        setTimeout(() => {
          Animated.timing(fadeSplash, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }).start();

          Animated.timing(fadeContent, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();

          if (isAuth) {
            router.replace('/(tabs)');
          } else {
            router.replace('/login');
          }
        }, 3000);
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        router.replace('/login');
      }
    };

    init();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, paddingTop, backgroundColor: '#c2e9fb' }}>
        {/* Contenido principal */}
        <Animated.View style={{ flex: 1, opacity: fadeContent }}>
          <Slot />
        </Animated.View>

        {/* Splash screen */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { opacity: fadeSplash, zIndex: 10 }]}
        >
          <LinearGradient
            colors={['#a1c4fd', '#c2e9fb']}
            style={styles.splashContainer}
          >
            <Animated.Text style={[styles.title, { transform: [{ scale: scaleAnim }] }]}>
              {randomPhrase}
            </Animated.Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'center',
  },
});
