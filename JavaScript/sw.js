// service worker 
self.addEventListener('push', function (event) {
    // TODO: get user permission choice, handle push sending accordingly

    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'GT Football';
    const options = {
        body: 'Welcome to GT Football!',
        icon: '../Assets/buzz.png',
        badge: '../Assets/badge.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));       
});

self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://www.google.com/')
    );
});