import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Authentication features will be disabled.');
  // Create a dummy client that throws errors for auth operations
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        }),
      }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    }),
  };
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export { supabase };

const getProfileById = async (userId: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data;
};

const createProfileRow = async (user: User) => {
  const profileData = {
    id: user.id,
    email: user.email || '',
    full_name: (user.user_metadata?.full_name as string | null) ?? null,
    currency: 'USD',
    timezone: 'UTC',
  };

  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const ensureProfile = async (user: User) => {
  const profile = await getProfileById(user.id);
  if (profile) return profile;
  return createProfileRow(user);
};

export const updateUserMetadata = async (fullName: string | null) => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  });

  return { data, error };
};

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (!error && data?.user) {
    try {
      await createProfileRow(data.user);
    } catch (profileError) {
      console.warn('Failed to create profile row after sign up:', profileError);
    }
  }

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};
