import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface SocialVerificationContextType {
  isVerified: boolean;
  setVerified: (verified: boolean) => void;
  checkVerification: () => boolean;
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
  const [isVerified, setIsVerified] = useState(false);

  // Check verification status from localStorage
  useEffect(() => {
    if (user) {
      const verificationKey = `social_verified_${user.id}`;
      const verified = localStorage.getItem(verificationKey) === 'true';
      setIsVerified(verified);
    }
  }, [user]);

  const setVerified = (verified: boolean) => {
    if (user) {
      const verificationKey = `social_verified_${user.id}`;
      localStorage.setItem(verificationKey, verified.toString());
      setIsVerified(verified);
    }
  };

  const checkVerification = () => {
    if (!user) return false;
    const verificationKey = `social_verified_${user.id}`;
    return localStorage.getItem(verificationKey) === 'true';
  };

  return (
    <SocialVerificationContext.Provider value={{
      isVerified,
      setVerified,
      checkVerification
    }}>
      {children}
    </SocialVerificationContext.Provider>
  );
};
