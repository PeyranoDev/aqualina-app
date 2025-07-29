import { useEffect, useRef, useMemo, useState } from 'react';
import { View, StyleSheet, Animated, SafeAreaView } from 'react-native'; // 1. Importamos SafeAreaView
import { Slot, router, useSegments } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/lib/context/auth-context';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { StatusBar } from 'expo-status-bar';

function AppNavigator() {
  const { user, isLoading, selectedTower } = useAuth(); 
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inApp = segments.length > 0 && segments[0] !== 'login' && segments[0] !== 'select-tower';

    if (!selectedTower && segments[0] !== 'select-tower') {
      router.replace('/select-tower');
      return;
    }
    
    if (selectedTower) {
      if (user && !inApp) {
        const upperCaseRole = user.role.toUpperCase();
        const targetRoute = {
          ADMIN: '/(admin)',
          SECURITY: '/(security)',
          USER: '/(user)',
        }[upperCaseRole];
        
        if (targetRoute) {
          router.replace(targetRoute);
        }
      } 
      else if (!user && inApp) {
        router.replace('/login');
      }
    }
  }, [user, selectedTower, segments, isLoading]); 

  if (isLoading) {
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  useNotifications();

  const fadeSplash = useRef(new Animated.Value(1)).current;
  const fadeContent = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

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
      ]).start(() => {
        setSplashAnimationFinished(true);
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        {/* 2. Reemplazamos el View por un SafeAreaView */}
        <SafeAreaView style={styles.container}>
          <StatusBar style='dark'></StatusBar>
          <Animated.View style={{ flex: 1, opacity: fadeContent }}>
            <AppNavigator />
          </Animated.View>

          <Animated.View
            pointerEvents={splashAnimationFinished ? 'none' : 'auto'}
            style={[StyleSheet.absoluteFill, { opacity: fadeSplash, zIndex: 10 }]}
          >
            <LinearGradient
              colors={['#a1c4fd', '#c2e9fb']}
              style={[styles.splashContainer]}
            >
              <Animated.Text
                style={[styles.title, { transform: [{ scale: scaleAnim }] }]}
              >
                {randomPhrase}
              </Animated.Text>
            </LinearGradient>
          </Animated.View>
        </SafeAreaView>
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
    paddingHorizontal: 20,
  },
});
