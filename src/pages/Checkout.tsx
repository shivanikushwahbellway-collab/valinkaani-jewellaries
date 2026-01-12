import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCartItems } from "@/lib/api/cartController";
import { createOrder } from "@/lib/api/orderController";
import { useUserAuth } from "@/context/UserAuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getImageUrl } from "@/config";

const Checkout = () => {
  const navigate = useNavigate();
  const { token } = useUserAuth();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [serverCartTotal, setServerCartTotal] = useState<number | null>(null);
  const [serverFinalTotal, setServerFinalTotal] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    order_date: "",
    payment: "COD",
    notes: "",
    h_no: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 🔹 Fetch cart data (with coupon)
  const fetchCartItems = async () => {
    if (!token) {
      navigate("/signin");
      return;
    }

    setLoading(true);
    try {
      const response = await getCartItems(token);
      if (response.success && response.data) {
        const data = response.data;
        setCartId(data.cart_id);
        setCartItems(data.items || []);
        setServerCartTotal(Number(data.total_amount || 0));
        setServerFinalTotal(Number(data.final_amount || 0));

        if (data.coupon) {
          setAppliedCoupon({
            code: data.coupon.coupon_code,
            description: data.coupon.description,
            discountType: data.coupon.discount_type,
            value: Number(data.coupon.value),
          });
          setCouponDiscount(Number(data.total_amount) - Number(data.final_amount));
        } else {
          setAppliedCoupon(null);
          setCouponDiscount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        title: "Error",
        description: "Failed to load cart details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.order_date ||
      !formData.h_no ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    const delivery_address = `${formData.h_no}, ${formData.street}, ${formData.landmark}, ${formData.city}, ${formData.state}, ${formData.pincode}`;
    const orderDate = new Date(formData.order_date);
    const expectedDelivery = new Date(orderDate);
    expectedDelivery.setDate(expectedDelivery.getDate() + 7);

    const orderData = {
      cart_id: cartId,
      delivery_address,
      order_date: formData.order_date,
      expected_delivery: expectedDelivery.toISOString().split("T")[0],
      payment: formData.payment,
      notes: formData.notes,
    };

    setSubmitting(true);
    try {
      const response = await createOrder(orderData, token!);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Order placed successfully!",
        });
        navigate("/orders");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to place order.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to place order.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const getProductImages = (product: any) => {
    try {
      const imgs = JSON.parse(product.image || "[]");
      if (Array.isArray(imgs) && imgs.length > 0) return getImageUrl(imgs[0]);
    } catch {
      return "/placeholder.svg";
    }
    return "/placeholder.svg";
  };

  const uiSubtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.total_price),
    0
  );
  const totalAmount = serverCartTotal ?? uiSubtotal;
  const finalAmount = serverFinalTotal ?? totalAmount - couponDiscount;

  if (loading)
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#084526]"></div>
        </div>
        <Footer />
      </>
    );

  if (cartItems.length === 0)
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="text-center">
            <CreditCard className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No items to checkout</h2>
            <p className="text-gray-600 mb-6">
              Add some beautiful jewelry to your cart first.
            </p>
            <Button
              onClick={() => navigate("/cart")}
              className="bg-[#084526] hover:bg-[#0a5a2e]"
            >
              View Cart
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <div className="min-h-screen font-serif">
        <div className="mx-auto px-4 py-10">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-[#084526] hover:text-[#0a5a2e]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#084526] rounded-full">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#084526]">Checkout</h1>
                <p className="text-gray-600">Complete your jewelry purchase</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Order Details */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border">
                  <div className="flex items-center space-x-2 mb-6">
                    <Calendar className="w-6 h-6 text-[#084526]" />
                    <h2 className="text-2xl font-bold text-[#084526]">
                      Order Details
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Order Date *</Label>
                      <Input
                        type="date"
                        value={formData.order_date}
                        onChange={(e) =>
                          handleInputChange("order_date", e.target.value)
                        }
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="mt-2 focus:border-[#084526] focus:ring-[#084526]"
                      />
                    </div>
                    <div>
                      <Label>Payment Mode *</Label>
                      <Select
                        value={formData.payment}
                        onValueChange={(v) => handleInputChange("payment", v)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COD">
                            Cash on Delivery (COD)
                          </SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="card">Card Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border">
                  <div className="flex items-center space-x-2 mb-6">
                    <MapPin className="w-6 h-6 text-[#084526]" />
                    <h2 className="text-2xl font-bold text-[#084526]">
                      Delivery Address
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      ["h_no", "House/Flat No. *", "e.g., 123"],
                      ["street", "Street/Area *", "e.g., Main Street"],
                      ["landmark", "Landmark", "e.g., Near City Mall"],
                      ["city", "City *", "e.g., Mumbai"],
                      ["state", "State *", "e.g., Maharashtra"],
                      ["pincode", "Pincode *", "e.g., 400001"],
                    ].map(([key, label, placeholder]) => (
                      <div key={key}>
                        <Label>{label}</Label>
                        <Input
                          type="text"
                          value={(formData as any)[key]}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          required={label.includes("*")}
                          placeholder={placeholder}
                          className="mt-2 focus:border-[#084526] focus:ring-[#084526]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Notes */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border">
                  <div className="flex items-center space-x-2 mb-6">
                    <MessageSquare className="w-6 h-6 text-[#084526]" />
                    <h2 className="text-2xl font-bold text-[#084526]">
                      Special Instructions
                    </h2>
                  </div>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      handleInputChange("notes", e.target.value)
                    }
                    placeholder="Any special delivery instructions..."
                    rows={4}
                    className="focus:border-[#084526] focus:ring-[#084526]"
                  />
                </div>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-[#084526] mb-6">
                  Order Summary
                </h3>

                {/* Product Details */}
                <div className="space-y-3 mb-5">
                  {cartItems.map((item) => (
                    <>
                      <div
                      key={`${item.id}-${item.size ?? ""}`}
                      className="flex justify-between text-sm text-gray-700 border-b pb-2"
                    >
                      <div className="flex-1 pr-3">
                        <p className="font-medium text-gray-800">
                          {item.product?.name}
                        </p>
                        {item.size && (
                          <p className="text-xs text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">
                          ₹{Number(item.unit_price).toFixed(2)} ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="text-right font-semibold text-[#084526]">
                        ₹
                        {(Number(item.unit_price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex justify-between text-gray-700 text-sm">
                          <div>  <span>Making Charges</span> {item.making_percentage && <span className="text-xs text-primary font-sans">({item.making_percentage}%)</span>}</div>
                          <span className="font-semibold">
                            ₹{item.product.making_charges ?? "0.00"}
                          </span>
                        </div>
                    </>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>
                        Coupon ({appliedCoupon.code}){" "}
                        <span className="text-gray-500 text-xs ml-1">
                          {appliedCoupon.description}
                        </span>
                      </span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between text-base font-bold text-[#084526]">
                    <span>Total Payable</span>
                    <span>₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Note */}
                <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>Free shipping on all orders</span>
                </div>

                {/* ✅ Place Order Button below summary */}
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-[#084526] hover:bg-[#0a5a2e] text-white py-3 text-lg font-semibold rounded-xl shadow-md"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
