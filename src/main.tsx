import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// AGGRESSIVE SERVICE WORKER CLEANUP
console.log('🧹 Starting aggressive service worker cleanup...');

// Force unregister ALL service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    console.log(`Found ${registrations.length} service worker registrations`);
    registrations.forEach((registration, index) => {
      registration.unregister().then((success) => {
        console.log(`✅ Unregistered service worker ${index + 1}:`, success);
      });
    });
  });

  // Also try to unregister from specific scope
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.unregister().then(() => {
      console.log('✅ Force unregistered sw.js');
    });
  }).catch(() => {
    console.log('ℹ️ No sw.js to unregister (good!)');
  });
}

// Clear ALL caches aggressively
if ('caches' in window) {
  caches.keys().then((cacheNames) => {
    console.log(`Found ${cacheNames.length} caches to delete`);
    cacheNames.forEach((cacheName) => {
      caches.delete(cacheName).then((success) => {
        console.log(`✅ Deleted cache "${cacheName}":`, success);
      });
    });
  });
}

// Clear localStorage and sessionStorage
try {
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ Cleared localStorage and sessionStorage');
} catch (e) {
  console.log('ℹ️ Could not clear storage:', e);
}

console.log('🧹 Cleanup complete! Please hard refresh the page.');

createRoot(document.getElementById("root")!).render(<App />);
