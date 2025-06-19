
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { initializeUserStats } from '@/utils/setupDatabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  showFollowFlow: boolean;
  setShowFollowFlow: (show: boolean) => void;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFollowFlow, setShowFollowFlow] = useState(false);

  useEffect(() => {
    // Set timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('Auth loading timeout - setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        clearTimeout(loadingTimeout);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Initialize user stats when user signs in (non-blocking)
        if (event === 'SIGNED_IN' && session?.user) {
          initializeUserStats(session.user.id).catch(error => {
            console.log('Failed to initialize user stats:', error);
            // Don't block the auth flow if this fails
          });
        }
      }
    );

    // Check for existing session with timeout
    const getSessionWithTimeout = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        clearTimeout(loadingTimeout);

        if (error) {
          console.error('Error getting session:', error);
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Initialize user stats for existing session (non-blocking)
        if (session?.user) {
          initializeUserStats(session.user.id).catch(error => {
            console.log('Failed to initialize user stats:', error);
            // Don't block the auth flow if this fails
          });
        }
      } catch (error) {
        console.error('Session check failed:', error);
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    };

    getSessionWithTimeout();

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      showFollowFlow,
      setShowFollowFlow,
      signUp,
      signIn,
      signOut,
      resetPassword,
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
