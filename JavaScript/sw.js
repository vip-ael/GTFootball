// service worker
let isSubscribed = false;

self.addEventListener('message', function handler (event) {
    isSubscribed = event.data.isSubscribed;
});

self.addEventListener('push', function (event) {
    if (isSubscribed) {
        const title = 'GT Football';
        const options = {
            body: 'Welcome to GT Football!',
            icon: '../Assets/buzz.png',
            badge: '../Assets/badge.png'
        };

        event.waitUntil(self.registration.showNotification(title, options));
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://ramblinwreck.com/sports/m-footbl/')
    );
});


