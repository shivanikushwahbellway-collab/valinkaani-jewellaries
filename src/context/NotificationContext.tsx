import { createContext, useContext, useState, ReactNode } from "react";

export interface NotifyType {
    id: string;
    title: string;
    body: string;
    created_at: string;
    read: boolean;
    data?: {
        order_id?: string;
        order_code?: string;
        status?: string;
        type?: string;
    };
}

interface NotificationContextType {
    notifications: NotifyType[];
    addNotification: (n: NotifyType) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<NotifyType[]>([]);

    const addNotification = (n: NotifyType) => {
        setNotifications((prev) => [n, ...prev]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext)!;
