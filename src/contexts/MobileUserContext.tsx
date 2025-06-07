import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MobileUserState {
  hasCompletedOnboarding: boolean;
  currentStep: 'splash' | 'onboarding' | 'signup' | 'home';
  isFirstVisit: boolean;
}

interface MobileUserContextType {
  userState: MobileUserState;
  completeOnboarding: () => void;
  setCurrentStep: (step: MobileUserState['currentStep']) => void;
  resetOnboarding: () => void;
}

const MobileUserContext = createContext<MobileUserContextType | undefined>(undefined);

const STORAGE_KEY = 'mobile_user_onboarding_state';

export const MobileUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<MobileUserState>({
    hasCompletedOnboarding: false,
    currentStep: 'splash',
    isFirstVisit: true,
  });

  // Load user state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setUserState(prev => ({
          ...prev,
          hasCompletedOnboarding: parsedState.hasCompletedOnboarding || false,
          isFirstVisit: false,
        }));
      } catch (error) {
        console.error('Error parsing saved user state:', error);
      }
    }
  }, []);

  // Save user state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      hasCompletedOnboarding: userState.hasCompletedOnboarding,
    }));
  }, [userState.hasCompletedOnboarding]);

  const completeOnboarding = () => {
    setUserState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      currentStep: 'home',
      isFirstVisit: false,
    }));
  };

  const setCurrentStep = (step: MobileUserState['currentStep']) => {
    setUserState(prev => ({
      ...prev,
      currentStep: step,
    }));
  };

  const resetOnboarding = () => {
    setUserState({
      hasCompletedOnboarding: false,
      currentStep: 'splash',
      isFirstVisit: true,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <MobileUserContext.Provider value={{
      userState,
      completeOnboarding,
      setCurrentStep,
      resetOnboarding,
    }}>
      {children}
    </MobileUserContext.Provider>
  );
};

export const useMobileUser = () => {
  const context = useContext(MobileUserContext);
  if (context === undefined) {
    throw new Error('useMobileUser must be used within a MobileUserProvider');
  }
  return context;
};
