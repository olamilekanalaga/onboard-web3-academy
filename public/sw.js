// Simple, robust service worker for Academia PWA
const CACHE_NAME = 'academia-v5'; // Updated with push notifications and enhanced social features
const STATIC_CACHE_URLS = [
  '/',
  '/academia mobile.png',
  '/academia web display.png'
];

// Install event - cache only essential static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static resources');
        // Cache resources individually to handle failures gracefully
        return Promise.allSettled(
          STATIC_CACHE_URLS.map(url => 
            cache.add(url).catch(err => {
              console.log(`[SW] Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Installation complete');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        // Take control of all pages immediately
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('[SW] Activation failed:', error);
      })
  );
});

// Fetch event - network first strategy with graceful fallbacks
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Skip development server hot reload requests
  if (request.url.includes('/@vite/') || 
      request.url.includes('/@react-refresh') ||
      request.url.includes('/node_modules/') ||
      request.url.includes('?import') ||
      request.url.includes('&import')) {
    return;
  }
  
  // Skip API requests (let them go to network)
  if (request.url.includes('/api/') || 
      request.url.includes('supabase.co') ||
      request.url.includes('/auth/')) {
    return;
  }
  
  event.respondWith(
    // Try network first
    fetch(request)
      .then((response) => {
        // If network succeeds, cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            })
            .catch((error) => {
              console.log('[SW] Cache put failed:', error);
            });
        }
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Serving from cache:', request.url);
              return cachedResponse;
            }
            
            // If it's a navigation request and we have no cache, return the main page
            if (request.destination === 'document') {
              return caches.match('/').then(response => {
                return response || new Response(
                  '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
                  { headers: { 'Content-Type': 'text/html' } }
                );
              });
            }
            
            // For other resources, return a simple offline response
            return new Response('Offline', { 
              status: 503, 
              statusText: 'Service Unavailable' 
            });
          });
      })
  );
});

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  if (!event.data) {
    console.log('[SW] No data in push event');
    return;
  }

  try {
    const data = event.data.json();
    console.log('[SW] Push data:', data);

    const options = {
      body: data.body || data.message || 'New notification from Academia',
      icon: data.icon || '/ACADEMIA MOBILE.PNG',
      badge: data.badge || '/ACADEMIA MOBILE.PNG',
      data: data.data || {},
      actions: data.actions || [
        {
          action: 'view',
          title: 'View'
        }
      ],
      requireInteraction: true,
      tag: 'academia-notification'
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Academia Notification',
        options
      )
    );
  } catch (error) {
    console.error('[SW] Error handling push notification:', error);

    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('Academia Notification', {
        body: 'You have a new notification',
        icon: '/ACADEMIA MOBILE.PNG',
        badge: '/ACADEMIA MOBILE.PNG'
      })
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification);

  event.notification.close();

  const data = event.notification.data || {};
  const url = data.url || '/social';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            // Focus existing window and navigate to the URL
            client.focus();
            if (client.navigate) {
              return client.navigate(url);
            }
            return client;
          }
        }

        // No existing window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
      .catch((error) => {
        console.error('[SW] Error handling notification click:', error);
      })
  );
});

// Background sync for offline notifications (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-notifications') {
    console.log('[SW] Background sync for notifications');
    // Handle any queued notifications when back online
  }
});

// Handle background sync (optional)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
});

// Handle push notifications (optional)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('[SW] Push notification received:', data);
    
    const options = {
      body: data.body || 'New notification from Academia',
      icon: '/academia mobile.png',
      badge: '/academia mobile.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        timestamp: Date.now()
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Academia', 
        options
      )
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise, open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received:', event);

  let notificationData = {
    title: 'Academia Notification',
    body: 'You have a new notification',
    icon: '/ACADEMIA MOBILE.PNG',
    badge: '/ACADEMIA MOBILE.PNG',
    data: {}
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
      notificationData.body = event.data.text();
    }
  }

  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    data: notificationData.data,
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationOptions)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url.includes(location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        const targetUrl = event.notification.data?.url || '/';
        return clients.openWindow(targetUrl);
      }
    })
  );
});

console.log('[SW] Service worker script loaded with push notifications');
