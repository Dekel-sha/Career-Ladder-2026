import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

// Create client with error handling disabled for fetch errors
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'x-client-info': 'career-ladder-app',
    },
    // Suppress fetch errors from being logged
    fetch: (url, options) => {
      return fetch(url, options).catch((err) => {
        // Silently handle fetch errors to prevent console spam
        return Promise.reject(err);
      });
    },
  },
  db: {
    schema: 'public',
  },
});