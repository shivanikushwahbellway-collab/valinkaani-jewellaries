/* -------------------------------------------------------------

   Firebase App + Messaging (Compat needed for Service Worker)

--------------------------------------------------------------*/

importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");

importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");
 
/* -------------------------------------------------------------

   Initialize Firebase

--------------------------------------------------------------*/

firebase.initializeApp({

    apiKey: "AIzaSyAxo_gObFf0Kj-hkkkSj-eLGDXiqKfdK6o",

    authDomain: "vailankanni-82ea6.firebaseapp.com",

    projectId: "vailankanni-82ea6",

    storageBucket: "vailankanni-82ea6.firebasestorage.app",

    messagingSenderId: "713519722298",

    appId: "1:1:713519722298:web:d99e476c75bf7171f56a03",

});
 
/* -------------------------------------------------------------

   Messaging Instance

--------------------------------------------------------------*/

const messaging = firebase.messaging();
 
/* -------------------------------------------------------------

   Background Notification Handler

--------------------------------------------------------------*/

messaging.onBackgroundMessage((payload) => {

    console.log("🔥 Background message:", payload);
 
    const title = payload?.notification?.title || "New Notification";

    const body = payload?.notification?.body || "";

    const icon = payload?.notification?.icon || "/logo.png";
 
    // ⭐ Order ID yaha set kar diya

    const orderId = payload?.data?.order_id || null;
 
    self.registration.showNotification(title, {

        body,

        icon,

        vibrate: [200, 100, 200],

        data: {

            orderId: orderId, // ⭐ click event me yahi milega

        },

    });

});
 
/* -------------------------------------------------------------

   When User Clicks Notification → Open Order Details Page

--------------------------------------------------------------*/

self.addEventListener("notificationclick", (event) => {

    event.notification.close();
 
    const orderId = event.notification.data?.orderId;

    const url = orderId ? `/order-details/${orderId}` : "/";
 
    event.waitUntil(

        clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {

            for (const client of windowClients) {

                if (client.url.includes(url) && "focus" in client) {

                    return client.focus();

                }

            }

            return clients.openWindow(url);

        })

    );

});

 