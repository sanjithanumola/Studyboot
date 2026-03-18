import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  const value = import.meta.env[key] || (typeof process !== 'undefined' ? process.env[key] : '');
  if (!value || value === 'undefined' || value === 'null') return '';
  // Strip quotes if they exist
  return String(value).replace(/^["']|["']$/g, '');
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname !== 'placeholder.supabase.co';
  } catch {
    return false;
  }
};

const isStripeKeyError = !!supabaseAnonKey && (supabaseAnonKey.startsWith('sb_publishable') || supabaseAnonKey.startsWith('pk_'));
const isConfigured = isValidUrl(supabaseUrl) && !!supabaseAnonKey && supabaseAnonKey.length > 20 && !isStripeKeyError;

if (isStripeKeyError) {
  console.warn('Configuration Note: The VITE_SUPABASE_ANON_KEY provided appears to be a Stripe key. Supabase keys typically start with "eyJ". Cloud sync will be disabled until a valid Supabase key is provided.');
}

const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = isConfigured ? supabaseAnonKey : 'placeholder';

export const supabase = createClient(finalUrl, finalKey);

// Helper to check if we should use local storage fallback
export const useLocalStorage = !isConfigured;

export { isConfigured, isStripeKeyError, supabaseUrl, supabaseAnonKey };
