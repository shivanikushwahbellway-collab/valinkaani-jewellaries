import { useEffect } from "react";
import { listenToNotifications, requestFCMToken } from "@/firebase/firebase";
import { useNotifications } from "@/context/NotificationContext";
import { saveDeviceToken } from "@/lib/api/notificationApi";
import { useUserAuth } from "@/context/UserAuthContext";

const NotificationListener = () => {
    const { addNotification } = useNotifications();
    const { token } = useUserAuth(); // ✅ USER TOKEN

    // Save FCM token
    useEffect(() => {
        if (!token) return;

        requestFCMToken().then((fcmToken) => {
            if (fcmToken) {
                saveDeviceToken(fcmToken, token);
            }
        });
    }, [token]);

    // Listen to foreground notifications
    useEffect(() => {
        listenToNotifications((payload) => {
            addNotification({
                id: Date.now().toString(),
                title: payload?.notification?.title,
                body: payload?.notification?.body,
                created_at: new Date().toISOString(),
                read: false,
            });
        });
    }, []);

    return null;
};

export default NotificationListener;
