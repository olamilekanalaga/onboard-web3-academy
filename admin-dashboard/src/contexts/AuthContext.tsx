import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);

      // TEMPORARY: Allow your specific user ID to be admin
      if (userId === 'a0547db9-5fde-477e-93a7-91bbef3f3825') {
        console.log('Granting admin access to owner');
        return true;
      }

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Admin check timeout')), 5000)
      );

      const queryPromise = supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      const { data: adminUser, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      console.log('Admin check result:', { adminUser, error });

      if (error) {
        console.log('Admin check error:', error.message);
        // If table doesn't exist or user not found, return false but don't crash
        if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log('Admin table might not exist or user not found - treating as non-admin');
          return false;
        }
        return false;
      }

      const isAdmin = !!adminUser;
      console.log('User admin status:', isAdmin);
      return isAdmin;
    } catch (err: any) {
      console.error('Error checking admin status:', err.message);
      // Don't crash on admin check failure - just treat as non-admin
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const isAdminUser = await checkAdminStatus(session.user.id);
          if (mounted) {
            setIsAdmin(isAdminUser);
            console.log('User is admin:', isAdminUser);
          }
        } else {
          if (mounted) {
            setIsAdmin(false);
          }
        }

        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('Initial session:', session?.user?.email);

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const isAdminUser = await checkAdminStatus(session.user.id);
          if (mounted) {
            setIsAdmin(isAdminUser);
            console.log('Initial admin check:', isAdminUser);
          }
        } else {
          if (mounted) {
            setIsAdmin(false);
          }
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in result:', { data: data?.user?.email, error });

      if (error) {
        console.error('Sign in error:', error.message);
        return { error };
      }

      if (data?.user) {
        // Check admin status immediately after successful login
        const isAdminUser = await checkAdminStatus(data.user.id);
        console.log('Admin status after login:', isAdminUser);

        if (!isAdminUser) {
          // Sign out if not admin
          await supabase.auth.signOut();
          return {
            error: {
              message: 'Access denied. Admin privileges required.'
            }
          };
        }
      }

      return { error: null };
    } catch (err: any) {
      console.error('Sign in exception:', err);
      return { error: { message: err.message || 'An unexpected error occurred' } };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
