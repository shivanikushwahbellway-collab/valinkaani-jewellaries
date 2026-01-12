import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "@/lib/api/orderController";
import { useUserAuth } from "@/context/UserAuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Gift,
  MessageSquare,
  User,
  Phone,
  Mail,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/config";
import ProfileLayout from "@/components/ProfileLayout";
import { getUserProfile } from "@/lib/api/userController";
import { Loader2 } from "lucide-react";

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { token } = useUserAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const resp = await getUserProfile(token);
      setProfile(resp);
    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  }, [token]);

  const fetchOrderDetails = useCallback(async () => {
    if (!token || !orderId) {
      navigate("/signin");
      return;
    }

    setLoading(true);
    try {
      const data = await getOrderById(parseInt(orderId), token);
      if (data.success) {
        setOrder(data.data);
      } else {
        toast({
          title: "Error",
          description: "Order not found",
          variant: "destructive",
        });
        navigate("/orders");
      }
    } catch (err: any) {
      console.error("Order fetch error:", err);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  }, [token, orderId, toast, navigate]);

  useEffect(() => {
    fetchProfile();
    fetchOrderDetails();
  }, [fetchProfile, fetchOrderDetails]);

  const handleSectionChange = (
    section: "profile" | "plans" | "wallet" | "vault" | "customOrders" | "orders" | "wishlist"
  ) => {
    if (section === "orders") {
      navigate("/orders");
      return;
    }
    if (section === "wallet") {
      navigate("/wallet");
      return;
    }
    if (section === "wishlist") {
      navigate("/wishlist");
      return;
    }
    navigate("/profile", { state: { activeSection: section } });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "processing":
        return "⚙️";
      case "confirmed":
        return "✅";
      case "shipped":
        return "🚚";
      case "delivered":
        return "🎉";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  const getProductImages = (product: any) => {
    try {
      const imageData = JSON.parse(product.image || "[]");
      if (Array.isArray(imageData) && imageData.length > 0) {
        return getImageUrl(imageData[0]);
      }
    } catch (error) {
      console.error("Error parsing product images:", error);
    }
    return "/placeholder.svg";
  };

  if (loading) {
    return (
      <ProfileLayout
        activeSection="orders"
        setActiveSection={handleSectionChange}
        profile={profile}
      >
        <div className="flex items-center justify-center h-80">
          <Loader2 className="w-6 h-6 animate-spin text-[#084526]" />
        </div>
      </ProfileLayout>
    );
  }

  if (!order) {
    return (
      <ProfileLayout
        activeSection="orders"
        setActiveSection={handleSectionChange}
        profile={profile}
      >
        <div className="text-center space-y-6 border p-6 rounded-2xl bg-gray-50 shadow-sm">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-12 h-12 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Order not found</h3>
          <p className="text-gray-600">The order you're looking for doesn't exist</p>
          <Button
            onClick={() => navigate("/orders")}
            className="bg-[#084526] hover:bg-[#0a5a2e] text-white px-8 py-3 text-lg font-semibold rounded-xl"
          >
            Back to Orders
          </Button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout
      activeSection="orders"
      setActiveSection={handleSectionChange}
      profile={profile}
    >
      <div className="space-y-6 border p-6 rounded-2xl bg-gray-50 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#084526] rounded-2xl shadow-md">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#084526] tracking-tight">
                Order Details
              </h1>
              <p className="text-gray-600 text-sm">Order #{order.order_code}</p>
              
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/orders")}
            className="text-[#084526] border-[#084526]/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {order.items && order.items.length > 0 && (
              <div className="space-y-5">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 p-5"
                  >
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={getProductImages(item.product)}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-xl border border-gray-100"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.product.name}
                        </h3>
                        <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                          {/* <p>SKU: {item.product.sku|| "N/A"}</p> */}
                          <p>Category: {item.product.category.name|| "N/A"}
                            
                          </p>
                        
                         <p>Purity: {item.product.purity || "—"}</p>
                          <p>Weight: {item.product.weight} g</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#084526]">
                          {/* ₹{Number(item.price).toLocaleString("en-IN")} */}
                         
            
                               <span>₹{Number(order.final_amount).toLocaleString("en-IN")}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h4 className="text-lg font-semibold text-[#084526]">Order Summary</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>- ₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Total Paid</span>
                  <span>₹{Number(order.final_amount).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h4 className="text-lg font-semibold text-[#084526] flex items-center gap-2">
                <User className="w-4 h-4" /> Customer Details
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{order.customer?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{order.customer?.mobile}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Placed on {new Date(order.order_date).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h4 className="text-lg font-semibold text-[#084526]">Shipping & Payment</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <div className="flex items-center space-x-2 font-medium text-gray-700">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </div>
                  <p className="pl-6 mt-1">{order.delivery_address}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 font-medium text-gray-700">
                    <CreditCard className="w-4 h-4" />
                    Payment Method
                  </div>
                  <p className="pl-6 mt-1">{order.payment_method}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 font-medium text-gray-700">
                    <Clock className="w-4 h-4" />
                    Expected Delivery
                  </div>
                  <p className="pl-6 mt-1">
                    {new Date(order.expected_delivery).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {(order.notes || order.coupon) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h4 className="text-lg font-semibold text-[#084526]">Additional Information</h4>
                {order.notes && (
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-700">Special Instructions:</span>
                      <p className="mt-1">{order.notes}</p>
                    </div>
                  </div>
                )}
                {order.coupon && (
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <Gift className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-700">Coupon Applied:</span>
                      <p className="mt-1">
                        {order.coupon.coupon_code} ({
                          order.coupon.discount_type === "percentage"
                            ? order.coupon.value + "%"
                            : "₹" + order.coupon.value
                        } off)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

       
      </div>
    </ProfileLayout>
  );
};

export default OrderDetails;
