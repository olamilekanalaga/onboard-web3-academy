import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Smart PWA Service Worker Registration (Production Only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    })
    .then((registration) => {
      console.log('✅ [PWA] Service Worker registered successfully:', registration.scope);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('🔄 [PWA] New service worker version available');
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('📱 [PWA] New content available, reload to update');
            }
          });
        }
      });
    })
    .catch((error) => {
      console.log('❌ [PWA] Service Worker registration failed:', error);
    });
  });
} else if (import.meta.env.DEV) {
  console.log('🔧 [PWA] Service Worker disabled in development mode');
}

createRoot(document.getElementById("root")!).render(<App />);
