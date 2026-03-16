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

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is missing or incomplete.');
} else {
  console.log('Supabase attempting connection to:', supabaseUrl.substring(0, 20) + '...');
}

const isConfigured = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey.length > 10;

const isStripeKeyError = !!supabaseAnonKey && (supabaseAnonKey.startsWith('sb_publishable') || supabaseAnonKey.startsWith('pk_'));

if (isStripeKeyError) {
  console.error('CRITICAL: The VITE_SUPABASE_ANON_KEY provided looks like a Stripe Publishable Key, not a Supabase Anon Key. Supabase keys usually start with "eyJ".');
}

const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(finalUrl, finalKey);

// Helper to check if we should use local storage fallback
export const useLocalStorage = !isConfigured || isStripeKeyError;

export { isConfigured, isStripeKeyError };
