import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../types/database';
import { supabase, signIn, signUp, signOut } from '../services/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      initialize: async () => {
        try {
          set({ isLoading: true });
          
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            set({
              user: session.user,
              session,
              profile,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              session: null,
              profile: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              set({
                user: session.user,
                session,
                profile,
                isAuthenticated: true,
              });
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                session: null,
                profile: null,
                isAuthenticated: false,
              });
            }
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          const { data, error } = await signIn(email, password);
          
          if (error) throw error;
          
          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            set({
              user: data.user,
              session: data.session,
              profile,
              isAuthenticated: true,
            });
          }
          
          return { error: null };
        } catch (error) {
          return { error: error as Error };
        }
      },

      register: async (email: string, password: string, fullName: string) => {
        try {
          const { error } = await signUp(email, password, fullName);
          
          if (error) throw error;
          
          return { error: null };
        } catch (error) {
          return { error: error as Error };
        }
      },

      logout: async () => {
        await signOut();
        set({
          user: null,
          session: null,
          profile: null,
          isAuthenticated: false,
        });
      },

      updateProfile: async (updates: Partial<Profile>) => {
        try {
          const user = get().user;
          if (!user) throw new Error('No user logged in');

          const { error } = await supabase
            .from('profiles')
            // @ts-ignore: supabase typings can infer never for dynamic table updates in this setup
            .update(updates as any)
            .eq('id', user.id);

          if (error) throw error;

          set((state) => ({
            profile: state.profile ? { ...state.profile, ...updates } : null,
          }));

          return { error: null };
        } catch (error) {
          return { error: error as Error };
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ session }),
    }),
    {
      name: 'smartspend-auth',
    }
  )
);
