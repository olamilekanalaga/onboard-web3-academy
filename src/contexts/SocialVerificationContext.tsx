
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SocialVerificationContextType {
  isVerified: boolean;
  setVerified: (verified: boolean) => void;
  checkVerification: () => boolean;
  loading: boolean;
}

const SocialVerificationContext = createContext<SocialVerificationContextType | undefined>(undefined);

export const useSocialVerification = () => {
  const context = useContext(SocialVerificationContext);
  if (!context) {
    throw new Error('useSocialVerification must be used within a SocialVerificationProvider');
  }
  return context;
};

interface SocialVerificationProviderProps {
  children: React.ReactNode;
}

export const SocialVerificationProvider: React.FC<SocialVerificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isVerified, setIsVerified] = useState(true); // Default to true - only show when needed
  const [loading, setLoading] = useState(true);

  // Check verification status from database and localStorage
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!user) {
        setIsVerified(true); // Don't block unauthenticated users
        setLoading(false);
        return;
      }

      try {
        // First check the database for follow_flow_completed
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('follow_flow_completed')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking follow flow status:', error);
          // Fallback to localStorage if database check fails
          const verificationKey = `social_verified_${user.id}`;
          const localVerified = localStorage.getItem(verificationKey) === 'true';
          setIsVerified(localVerified || true); // Default to true if no record
        } else {
          // Use database value as the source of truth
          const verified = profile?.follow_flow_completed || true; // Default to true
          setIsVerified(verified);
          
          // Sync with localStorage for consistency
          const verificationKey = `social_verified_${user.id}`;
          localStorage.setItem(verificationKey, verified.toString());
        }
      } catch (error) {
        console.error('Error in verification check:', error);
        // Fallback to localStorage
        const verificationKey = `social_verified_${user.id}`;
        const localVerified = localStorage.getItem(verificationKey) === 'true';
        setIsVerified(localVerified || true); // Default to true
      } finally {
        setLoading(false);
      }
    };

    checkVerificationStatus();
  }, [user]);

  const setVerified = async (verified: boolean) => {
    if (!user) return;

    const verificationKey = `social_verified_${user.id}`;
    localStorage.setItem(verificationKey, verified.toString());
    setIsVerified(verified);

    // Also update the database
    try {
      await supabase
        .from('profiles')
        .update({ 
          follow_flow_completed: verified,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      console.log('Follow flow completion status updated in database');
    } catch (error) {
      console.error('Error updating follow flow status:', error);
    }
  };

  const checkVerification = () => {
    if (!user) return true; // Don't block unauthenticated users
    return isVerified;
  };

  return (
    <SocialVerificationContext.Provider value={{
      isVerified,
      setVerified,
      checkVerification,
      loading
    }}>
      {children}
    </SocialVerificationContext.Provider>
  );
};
