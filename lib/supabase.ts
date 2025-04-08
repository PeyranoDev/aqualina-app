import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Reemplaza con tus propias credenciales de Supabase
const supabaseUrl = 'https://qinaxyqaxsqxmbzdnuix.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbmF4eXFheHNxeG1iemRudWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NzM2OTcsImV4cCI6MjA1OTM0OTY5N30.7heo88IiAS-_3f94sohyNFWBuapeV4LoQPPVqBcl2a0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});