import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

interface NotificationBellProps {
  className?: string; // allow passing color/size/alignment classes
}

const NotificationBell = ({ className }: NotificationBellProps) => {
  const { notifications } = useNotifications();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className={`relative flex items-center ${className}`}>
      <NotificationDropdown>
        <button className="relative flex items-center">
          <Bell className="w-5 h-5" /> {/* you can also override size via className if needed */}

          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {unread}
            </span>
          )}
        </button>
      </NotificationDropdown>
    </div>
  );
};

export default NotificationBell;
