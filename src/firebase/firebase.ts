import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAxo_gObFf0Kj-hkkkSj-eLGDXiqKfdK6o",
  authDomain: "vailankanni-82ea6.firebaseapp.com",
  projectId: "vailankanni-82ea6",
  storageBucket: "vailankanni-82ea6.firebasestorage.app",
  messagingSenderId: "713519722298",
  appId: "1:713519722298:web:d99e476c75bf7171f56a03",
  measurementId: "G-NRNCJZLEML"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);

// ----------------------------------------------------
// FINAL WORKING FCM TOKEN FUNCTION
// ----------------------------------------------------
export const requestFCMToken = async () => {
  try {
    // Permission must be from user click
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return null;
    }

    // Register service worker (VERY IMPORTANT)
    const swRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    // Generate FCM Token
    const token = await getToken(messaging, {
      vapidKey: "BJ3Kn2VvhMLcIektjTLv52rZt8--E9ZLhxGqelfjO3TLwQvOzO1VTk9XOZQSFxJQN7lacTXmMsBLlj-UmtcE6AQ",
      serviceWorkerRegistration: swRegistration,
    });

    console.log("🔥 FCM Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Token Error:", error);
    return null;
  }
};

// Foreground notification listener
export const listenToNotifications = (callback: (payload: any) => void) => {
  onMessage(messaging, callback);
};
