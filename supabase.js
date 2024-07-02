import 'react-native-url-polyfill/auto';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ezfhxtmmxenlorblnhqk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6Zmh4dG1teGVubG9yYmxuaHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMzI4MzgsImV4cCI6MjAzMzcwODgzOH0.4pN3B9hPZKkdN1gafAut8H1jDibsdMtnS011LCD_lJo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    console.log(state)
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})