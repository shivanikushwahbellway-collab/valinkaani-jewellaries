import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ShoppingCart, Heart, User, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.jpg";
import { useUserAuth } from "@/context/UserAuthContext";
import NotificationBell from "./NotificationBell";
import { getPublicCollections } from "@/lib/api/publicController";
import { getCartItems } from "@/lib/api/cartController";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useUserAuth();

  const isHome = location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [collections, setCollections] = useState<any[]>([]);

  // Handle scroll effect only on home route
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await getPublicCollections();
        if (res.data.success) setCollections(res.data.data || []);
      } catch {}
    };
    fetchCollections();
  }, []);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return setCartCount(0);
      try {
        const res = await getCartItems(token);
        if (res?.success) setCartCount(res.data.items?.length || 0);
      } catch {}
    };
    fetchCart();
    const handleCartUpdated = () => fetchCart();
    window.addEventListener("cart:updated", handleCartUpdated);
    return () => window.removeEventListener("cart:updated", handleCartUpdated);
  }, [token]);

  // Main menu items
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "#about" },
    { name: "Reviews", path: "#reviews" },
    { name: "Contact", path: "#contact" }
  ];

  const handleMenuClick = (path: string) => {
    if (path.startsWith("#")) {
      const section = document.getElementById(path.slice(1));
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
    setMenuOpen(false);
  };

  const textColor = isHome
    ? isScrolled
      ? "text-[#084526]"
      : "text-black"
    : "text-black";

  const bgColor = isHome
    ? isScrolled
      ? "bg-white shadow-md"
      : "bg-transparent"
    : "bg-white shadow-md";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${bgColor}`}>
      {/* Top bar */}
      <div className="hidden md:flex justify-between items-center bg-primary text-primary-foreground text-sm px-6 py-2">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> +91 95451 11124</div>
          <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> vailankannijewellers89@gmail.com</div>
        </div>
        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Panjim, Goa</div>
      </div>

      {/* Main navbar */}
      <div className="flex items-center justify-between h-20 px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-white flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-12 w-12 object-cover" />
          </div>
          <div>
            <h1 className={`font-serif text-2xl font-bold ${textColor}`}>Vailankanni</h1>
            <p className={`text-xs uppercase tracking-widest ${textColor}`}>Jewellers</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map(item => (
            <button
              key={item.name}
              onClick={() => handleMenuClick(item.path)}
              className={`font-medium relative group ${textColor}`}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-secondary group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}

          {/* Schemes */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center gap-1 font-medium ${textColor}`}>
              <span>Schemes</span> <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white shadow-lg">
              <DropdownMenuItem asChild><Link to="/schemes">Easy monthly installments</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/plan/custom">Gold saving scheme</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Collections */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center gap-1 font-medium ${textColor}`}>
              <span>Collections</span> <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white shadow-lg">
              {collections.map(col => (
                <DropdownMenuItem key={col.id} asChild>
                  <Link to={`/collection/${col.id}`}>{col.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4">
  {!isAuthenticated ? (
    <Link to="/signin" className="bg-[#084526] text-white px-4 py-2 rounded-full hover:opacity-80 transition">Sign In</Link>
  ) : (
    <div className="flex items-center gap-4">
      <Link to="/cart" className="relative flex items-center">
        <ShoppingCart className={`w-5 h-5 ${textColor}`} />
        <span className="absolute -top-2 -right-2 text-xs h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white">{cartCount}</span>
      </Link>
      <Link to="/wishlist" className="flex items-center"><Heart className={`w-5 h-5 ${textColor}`} /></Link>
      <Link to="/profile" className="flex items-center"><User className={`w-5 h-5 ${textColor}`} /></Link>
      <div className={`flex items-center ${textColor}`}>
        <NotificationBell className={`w-5 h-5 ${textColor}`} />
      </div>
    </div>
  )}
</div>


        {/* Mobile Menu & Notification */}
        <div className="lg:hidden flex items-center gap-4">
  <div className={`flex items-center ${textColor}`}>
    <NotificationBell className={`w-6 h-6 ${textColor}`} />
  </div>
  <button onClick={() => setMenuOpen(!menuOpen)}>
    {menuOpen ? <X className={`${textColor} w-6 h-6`} /> : <Menu className={`${textColor} w-6 h-6`} />}
  </button>
</div>

      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden px-6 py-4 border-t border-gray-200 flex flex-col gap-3 bg-white shadow-lg">
          {menuItems.map(item => (
            <button key={item.name} onClick={() => handleMenuClick(item.path)} className="text-left text-black font-medium py-2 hover:text-primary transition">
              {item.name}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-200">
            <h3 className="text-gray-700 font-semibold mb-2">Schemes</h3>
            <Link to="/schemes" onClick={() => setMenuOpen(false)} className="block py-1 pl-4 hover:text-primary">Easy monthly installments</Link>
            <Link to="/plan/custom" onClick={() => setMenuOpen(false)} className="block py-1 pl-4 hover:text-primary">Gold saving scheme</Link>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <h3 className="text-gray-700 font-semibold mb-2">Collections</h3>
            {collections.map(col => (
              <Link key={col.id} to={`/collection/${col.id}`} onClick={() => setMenuOpen(false)} className="block py-1 pl-4 hover:text-primary">
                {col.name}
              </Link>
            ))}
          </div>
          {!isAuthenticated && (
            <Link to="/signin" onClick={() => setMenuOpen(false)} className="mt-4 block bg-[#084526] text-white text-center px-4 py-2 rounded-full hover:opacity-80 transition">Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
