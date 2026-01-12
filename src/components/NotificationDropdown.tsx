import { ReactNode } from "react";
import { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ArrowRightCircle } from "lucide-react"; // small icon

const NotificationDropdown = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { notifications } = useNotifications();
  const navigate = useNavigate();
console.log(notifications);

  const handleOrderClick = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>{children}</div>

      {open && (
        <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="bg-[#084426] text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <span className="bg-white bg-opacity-20 px-2 py-0.5 text-xs rounded-full">
              {notifications.length}
            </span>
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => {
                  const orderId = n.data?.order_id || n.title?.match(/#ORD(\d+)/)?.[1];
                  const timeAgo = formatDistanceToNow(new Date(n.created_at), { addSuffix: true });

                  return (
                    <div
                      key={n.id}
                      className="p-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{n.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{n.body}</p>
                        <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
                      </div>

                      {orderId && (
                        <button
                          onClick={() => handleOrderClick(orderId)}
                          className="text-[#084426] hover:text-[#063620] ml-2 p-1 rounded-full transition-colors"
                          title="View Order"
                        >
                          <ArrowRightCircle size={20} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
            <button
              onClick={() => setOpen(false)}
              className="w-full bg-[#084426] text-white py-2 rounded-md text-sm hover:bg-[#063620] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
