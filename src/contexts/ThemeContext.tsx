
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light'; // Always light now
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme] = useState<Theme>('light');
  const [actualTheme] = useState<'light'>('light');

  // Always apply light theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add('light');
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#ffffff');
    }
  }, []);

  // Remove theme from localStorage to prevent confusion
  useEffect(() => {
    localStorage.removeItem('theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: () => {}, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
