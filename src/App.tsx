import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import CollectionPage from "./pages/CollectionPage";
import Schemes from "./pages/Schemes";
import GoldServices from "./pages/GoldServices";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PlanDetails from "./pages/PlanDetails";
import Payments from "./pages/Payments";
import PaymentSuccess from "./pages/PaymentSuccess";
import BridalCollection from "./pages/BridalCollection";
import ExploreCollection from "./pages/ExploreCollection";
import Policies from "./pages/Policies";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import OrderDetails from "./pages/admin/OrderDetails";
import UserManagement from "./pages/admin/UserManagement";
import BannerManagement from "./pages/admin/BannerManagement";
import CouponManagement from "./pages/admin/CouponManagement";
import RateManagement from "./pages/admin/RateManagement";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import NotificationManagement from "./pages/admin/NotificationManagement";
import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { UserAuthProvider } from "./context/UserAuthContext";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProfile from "./pages/admin/AdminProfile";
import Profile from "./pages/Profile";
import GoldInvestments from "./pages/GoldInvestments";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import UserOrderDetails from "./pages/OrderDetails";
import CustomOrder from "./pages/CustomOrder";
import Wallet from "./pages/Wallet";
import SchemeManagement from "./pages/admin/SchemeManagement";
import UserOverview from "./pages/admin/users/UserOverview";
import UserOrders from "./pages/admin/users/UserOrders";
import UserCustomOrders from "./pages/admin/users/UserCustomOrders";
import UserSchemes from "./pages/admin/users/UserSchemes";
import UserCustomPlans from "./pages/admin/users/UserCustomPlans";
import CustomOrderDetails from "./pages/admin/CustomOrderDetails";
import UserWallet from "./pages/admin/users/UserWallet";
import UserGoldVault from "./pages/admin/users/UserGoldVault";
import ScrollToTop from "./hooks/ScrollToTop";
import ViewSchemeDetails from "./pages/admin/users/ViewSchemeDetails";
import ViewCustomPlanDetails from "./pages/admin/users/ViewCustomPlanDetails";
import MyPlanDetails from "./pages/MyPlanDetails";
import AdminQueries from "./pages/admin/AdminQueries";
import AboutSection from "./components/AboutSection";
import ReviewsSection from "./components/ReviewsSection";
import ContactSection from "./components/ContactSection";
import AllCategories from "./pages/AllCategories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <UserAuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/collection/:collectionId" element={<CollectionPage />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/gold-services" element={<GoldServices />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/plan/:planName" element={<PlanDetails />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/bridal-collection" element={<BridalCollection />} />
              <Route path="/explore-collection" element={<ExploreCollection />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/categories" element={<AllCategories />} />
              <Route
                path="/profile"
                element={
                  <ProtectedUserRoute>
                    <Profile />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/my-plans/:planId/details"
                element={
                  <ProtectedUserRoute>
                    <MyPlanDetails />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/gold-investments"
                element={
                  <ProtectedUserRoute>
                    <GoldInvestments />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedUserRoute>
                    <Cart />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedUserRoute>
                    <Checkout />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedUserRoute>
                    <Orders />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedUserRoute>
                    <Wishlist />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/wallet"
                element={
                  <ProtectedUserRoute>
                    <Wallet />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/order-details/:orderId"
                element={
                  <ProtectedUserRoute>
                    <UserOrderDetails />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/custom-order"
                element={
                  <ProtectedUserRoute>
                    <CustomOrder />
                  </ProtectedUserRoute>
                }
              />
              <Route path="/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ProductManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <OrderManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders/:orderId"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <OrderDetails />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/custom-orders/:orderId"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <CustomOrderDetails />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UserManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId/overview"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UserOverview />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId/orders"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UserOrders />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId/custom-orders"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UserCustomOrders />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId/schemes"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UserSchemes />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId/schemes/:userSchemeId/details"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ViewSchemeDetails />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId/custom-plans/:customPlanId/details"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ViewCustomPlanDetails />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId/custom-plans"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UserCustomPlans />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId/wallet"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UserWallet />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId/gold-vault"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UserGoldVault />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/banners"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <BannerManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/schemes"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <SchemeManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/coupons"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <CouponManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/rates"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <RateManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ReportsAnalytics />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/queries"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminQueries />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <NotificationManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Settings />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminProfile />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* <div id="about">
        <AboutSection />
      </div>
      <div id="reviews">
        <ReviewsSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div> */}
          </BrowserRouter>
        </UserAuthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
