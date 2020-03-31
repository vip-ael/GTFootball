
// buttons for push notifications
const pushToggle = document.querySelector('#push-toggle');
const sendPush = document.querySelector('#send-push');

// variables for push notification configurations
let isSubscribed = false;
let swRegistration = null;
const applicationServerPublicKey = 'BAC7OQ6Vc9I_O340QkIaDMhyhxxxAmws5Tz3Ziyf09vMnZkv7xHOnOJfnsPdEC145AOgr4z23ckJZnRmRxq6nws';
let subscription = null; 

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function updateApp() {
    if (Notification.permission === 'denied') {
        pushToggle.textContent = 'Push Messaging Blocked';
        pushToggle.disabled = true;
        return;
    }

    if (isSubscribed) {
        pushToggle.textContent = 'Disable Push Messaging';
    } else {
        pushToggle.textContent = 'Enable Push Messaging';
    }

    pushToggle.disabled = false;

    // send message to service worker with isSubscribed data
    const worker = swRegistration.active;
    if (worker) {
        worker.postMessage({
            isSubscribed
        });
    }
    console.log('Subscription: ', subscription);
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function (sub) {
            if (sub) {
                subscription = null; 
                return sub.unsubscribe();
            }
        })
        .catch(function (error) {
            console.log('Error unsubscribing: ', error);
        })
        .then(function () {
            isSubscribed = false;
            updateApp();
        });
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function (sub) {
            isSubscribed = true;
            subscription = sub; 
            updateApp();
        })
        .catch(function (err) {
            console.log('Error in subscribing: ', err);
            updateApp();
        });
}

function initializeUI() {
    pushToggle.addEventListener('click', function () {
        pushToggle.disabled = true;
        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    // set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);
            updateApp();
        });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('JavaScript/sw.js')
        .then(function (swReg) {
            swRegistration = swReg;
            initializeUI();
        })
        .catch(function (error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');
    pushToggle.textContent = 'Push Not Supported';
}

sendPush.addEventListener('click', async e => {
    e.preventDefault(); 
    if (subscription) {
        await fetch("http://localhost:5000/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(subscription)
        }).catch(err => {
          console.error("Unable to send subcription data to server");
        }); 
    }
}); 

