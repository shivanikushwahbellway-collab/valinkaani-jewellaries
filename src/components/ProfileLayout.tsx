import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, User, Package, LogOut, Layers, Sparkles, Wallet as WalletIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";

type ProfileLayoutProps = {
  children: React.ReactNode;
  activeSection?: "profile" | "plans" | "wallet" | "vault" | "customOrders" | "orders" | "wishlist";
  setActiveSection?: (section: "profile" | "plans" | "wallet" | "vault" | "customOrders" | "orders" | "wishlist") => void;
  profile?: any;
  wishlistCount?: number;
  ordersCount?: number;
  customOrdersCount?: number;
};

const ProfileLayout = ({ 
  children, 
  activeSection, 
  setActiveSection,
  profile,
  wishlistCount = 0,
  ordersCount = 0,
  customOrdersCount = 0
}: ProfileLayoutProps) => {
    const navigate = useNavigate();
    const { logout } = useUserAuth();

    const goto = (section: "profile" | "plans" | "wallet" | "vault" | "customOrders" | "orders" | "wishlist") => {
      if (section === "wallet") {
        navigate("/wallet");
        return;
      }
      if (section === "vault") {
        navigate("/gold-investments");
        return;
      }
      if (section === "orders") {
        navigate("/orders");
        return;
      }
      if (section === "wishlist") {
        navigate("/wishlist");
        return;
      }
      if (setActiveSection) {
        setActiveSection(section);
      } else {
        navigate("/profile", { state: { activeSection: section } });
      }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen font-serif bg-gray-50">
                <div className="mx-auto  ">
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                        {/* Sidebar */}
                        <div className="w-full lg:w-80 flex-shrink-0">
                            <div className="bg-white rounded-lg border p-4 lg:p-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h2 className="text-base lg:text-lg font-semibold text-gray-800">
                                        {profile?.data?.name || ""}
                                    </h2>
                                    <p className="text-gray-500 text-xs lg:text-sm">
                                        {profile?.data?.user_code || ""}
                                    </p>
                                </div>
                                <nav className="space-y-2">
                                    <button 
                                        type="button"
                                        onClick={() => goto("profile")}
                                        className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-sm lg:text-base ${activeSection === 'profile' ? 'bg-[#084526] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <User className="w-4 h-4 lg:w-5 lg:h-5" />
                                        <span>View Profile</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => goto("plans")}
                                        className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-sm lg:text-base ${activeSection === 'plans' ? 'bg-[#084526] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <Layers className="w-4 h-4 lg:w-5 lg:h-5" />
                                        <span>My Plans</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => goto("wallet")}
                                        className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-sm lg:text-base ${activeSection === 'wallet' ? 'bg-[#084526] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <WalletIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                                        <span>Wallet</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => goto("vault")}
                                        className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-sm lg:text-base ${activeSection === 'vault' ? 'bg-[#084526] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 10.5L12 6L20 10.5V18C20 18.8284 19.3284 19.5 18.5 19.5H5.5C4.67157 19.5 4 18.8284 4 18V10.5Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M9 19.5V13.5H15V19.5" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                        <span>Gold Vault</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => goto("customOrders")}
                                        className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-sm lg:text-base ${activeSection === 'customOrders' ? 'bg-[#084526] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <Sparkles className="w-4 h-4 lg:w-5 lg:h-5" />
                                        <span>Custom Orders ({customOrdersCount})</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => goto("wishlist")}
                                        className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-sm lg:text-base ${activeSection === 'wishlist' ? 'bg-[#084526] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                                        <span>Wishlist ({wishlistCount})</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => goto("orders")}
                                        className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-sm lg:text-base ${activeSection === 'orders' ? 'bg-[#084526] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <Package className="w-4 h-4 lg:w-5 lg:h-5" />
                                        <span>Orders ({ordersCount || 0})</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            logout();
                                            window.location.href = "/signin";
                                        }}
                                        className="w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50 text-sm lg:text-base"
                                    >
                                        <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                                        <span>Logout</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfileLayout;