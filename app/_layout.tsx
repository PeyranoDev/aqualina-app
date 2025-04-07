import { useEffect, useState } from 'react';
import { Slot, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return null;
  }

  // Si no hay sesión, mostrar la pantalla de login
  if (!session) {
    return (
      <>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </>
    );
  }

  // Si hay sesión, mostrar la aplicación principal
  return (
    <>
      <StatusBar style="auto" />
      <Slot />
    </>
  );
}