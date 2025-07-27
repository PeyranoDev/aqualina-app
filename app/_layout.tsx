import { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Platform, StatusBar } from 'react-native';
import { Slot, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/lib/context/auth-context';
import { useNotifications } from '@/lib/hooks/use-notifications';

function AppNavigator() {
  const { userRole, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!userRole) {
      router.replace('/login');
    } else {
      const initialRoute = {
        admin: '/(admin)',
        security: '/(security)',
        user: '/(user)',
      }[userRole] || '/(user)';

      router.replace(initialRoute);
    }
  }, [userRole, isLoading]);

  return <Slot />;
}

export default function RootLayout() {
  useNotifications();

  const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const fadeSplash = useRef(new Animated.Value(1)).current;
  const fadeContent = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const randomPhrase = useMemo(() => {
    const index = Math.floor(Math.random() * phrases.length);
    return phrases[index];
  }, []);

  useEffect(() => {
    const animation = Animated.loop(
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
    );

    animationRef.current = animation;
    animation.start();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeSplash, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeContent, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <AuthProvider>
        <View style={[styles.container, { paddingTop }]}>
          <Animated.View style={{ flex: 1, opacity: fadeContent }}>
            <AppNavigator />
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { opacity: fadeSplash, zIndex: 10 }]}
          >
            <LinearGradient
              colors={['#a1c4fd', '#c2e9fb']}
              style={[styles.splashContainer, { paddingTop }]}
            >
              <Animated.Text
                style={[styles.title, { transform: [{ scale: scaleAnim }] }]}
              >
                {randomPhrase}
              </Animated.Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const phrases = [
  "Preparando tu espacio de bienestar...",
  "Conectando con tu comunidad...",
  "Organizando la comodidad del hogar...",
  "Tu día comienza con Aqualina...",
  "Optimizando tu experiencia residencial...",
  "Trayendo calma a tu rutina...",
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'center',
  },
});
