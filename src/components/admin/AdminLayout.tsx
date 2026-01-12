import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Removed ui/button and ui/scroll-area imports; using custom elements
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  BarChart3,
  Tag,
  Image,
  Menu,
  LogOut,
  TrendingUp,
  Workflow,
  MessageCircle,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// Removed avatar UI import; using simple circle instead
import logo from "@/assets/logo.jpg";
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, name, email } = useAuth();
  // console.log(name, email);
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Product Management", href: "/admin/products", icon: Package },
    { name: "Order Management", href: "/admin/orders", icon: ShoppingCart },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Gold Rate Management", href: "/admin/rates", icon: TrendingUp },
    { name: "Coupon Management", href: "/admin/coupons", icon: Tag },
    { name: "Banner Management", href: "/admin/banners", icon: Image },
    { name: "Scheme Management", href: "/admin/schemes", icon: Workflow },
    { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Queries", href: "/admin/queries", icon:  MessageCircle },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // Derive dynamic page title from current path
  const pageTitle = (() => {
    const path = location.pathname;
    const sortedBySpecificity = [...navigation].sort(
      (a, b) => b.href.length - a.href.length
    );
    const matched = sortedBySpecificity.find((item) =>
      path.startsWith(item.href)
    );
    if (matched) return matched.name;
    if (path === "/admin") return "Dashboard";
    return "Dashboard";
  })();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  const Sidebar = () => (
    <div className="flex h-full flex-col">
      <div className=" px-4 py-4 flex gap-4 items-center">
        <img src={logo} alt="" className="h-10 rounded-full" />
        <div className="text-xs font-serif ">
          <p className="text-[#084526] font-semibold">Vailankanni Jewellers</p>
          <p className="text-[#8e6e00] ">Admin Panel</p>
        </div>
      </div>

      <div className="flex-1 px-4  overflow-y-auto">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                isActive(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium leading-tight capitalize">
              {name || "Admin"}
            </div>
            <div className="text-xs text-muted-foreground leading-tight">
              {email || "admin@example.com"}
            </div>
          </div>
          <Link to="/admin/profile" aria-label="View profile">
            <div className="h-9 w-9 rounded-full bg-accent/40 flex items-center justify-center text-sm font-semibold">
              {(name || "A").charAt(0).toUpperCase()}
            </div>
          </Link>
        </div>
        <button
          className="w-full justify-start text-left text-sm px-3 py-2 rounded hover:bg-accent flex items-center gap-2"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-background z-50">
        <Sidebar />
      </div>

      {/* Mobile/ Desktop Top Bar */}
      <div className=" p-5  absolute top-0 w-full md:left-64 md:w-[calc(100%-16rem)] z-40 flex justify-between bg-[#F8F8F6]">
        <p className="text-[#005B2F]">
          <span className=" text-sm font-semibold">Admin Panel</span> •{" "}
          <span className="text-gray-500 text-xs font-semibold">
            {pageTitle}
          </span>
        </p>
        <button
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r md:hidden transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col w-full md:ml-64  ">
        <main className="flex-1 overflow-y-auto pt-16">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
