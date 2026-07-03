/*
 * Service Worker for Shree Chamunda Associates Browser Push Notifications
 */

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'New Update',
        body: event.data.text()
      };
    }
  }

  const title = data.title || 'Notification from Shree Chamunda Associates';
  const options = {
    body: data.body || 'You have a new alert.',
    icon: data.icon || '/assets/logo_new.png',
    badge: data.badge || '/assets/logo_new.png',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/' }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there is already a window open with the target URL
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
