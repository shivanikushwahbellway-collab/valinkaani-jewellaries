import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  applyCoupon,
  getCouponsList,
  removeAppliedCoupon
} from "@/lib/api/cartController";
import { useUserAuth } from "@/context/UserAuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Sparkles,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "@/config";

const Cart = () => {
  const navigate = useNavigate();
  const { token } = useUserAuth();
  const { toast } = useToast();

  const [cartItems, setCartItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState<number | null>(null);
  const [cartSummary, setCartSummary] = React.useState<{
    total_amount: number;
    final_amount: number;
    cart_id?: number;
  }>({ total_amount: 0, final_amount: 0 });

  const [formData, setFormData] = React.useState({ coupon_code: "" });
  const [appliedCoupon, setAppliedCoupon] = React.useState<any>(null);
  const [couponDiscount, setCouponDiscount] = React.useState(0);
  const [showCoupon, setShowCoupon] = React.useState(false);
  const [coupons, setCoupons] = React.useState<any[]>([]);
  const [couponsLoading, setCouponsLoading] = React.useState(false);

  // ✅ Fetch Cart with coupon persistence
  const fetchCartItems = async () => {
    if (!token) {
      navigate("/signin");
      return;
    }

    setLoading(true);
    try {
      const data = await getCartItems(token);

      if (data.success) {
        const d = data.data;
        setCartItems(d.items || []);
        setCartSummary({
          total_amount: d.total_amount ?? 0,
          final_amount: d.final_amount ?? 0,
          cart_id: d.cart_id,
        });

        // ✅ Detect and store applied coupon (if present)
        const coupon =
          d.coupon || d.applied_coupon || (d.coupon_code && { coupon_code: d.coupon_code });

        if (coupon) {
          const discount =
            d.discount_amount ||
            coupon.discount_amount ||
            (d.total_amount && d.final_amount ? d.total_amount - d.final_amount : 0);

          // Save full coupon details (for card display)
          setAppliedCoupon({
            code: coupon.coupon_code,
            description: coupon.description || "Discount applied successfully",
            discount_type: coupon.discount_type || "flat",
            value: coupon.value || 0,
            discount_amount: discount,
          });

          setCouponDiscount(discount);
          setFormData((prev) => ({ ...prev, coupon_code: coupon.coupon_code }));
        } else {
          setAppliedCoupon(null);
          setCouponDiscount(0);
        }
      } else {
        setCartItems([]);
        setCartSummary({ total_amount: 0, final_amount: 0 });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
      setCartItems([]);
      setCartSummary({ total_amount: 0, final_amount: 0 });
    } finally {
      setLoading(false);
    }
  };


  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const data = await getCouponsList();
      if (data.status) setCoupons(data.data || []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive",
      });
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleQuantityUpdate = async (cartItemId: number, newQuantity: number) => {
    if (!token) return;
    setUpdating(cartItemId);
    try {
      const data = await updateCartQuantity(
        { item_id: cartItemId, quantity: newQuantity },
        token
      );
      if (data.success) {
        fetchCartItems();
        toast({
          title: "Updated",
          description: "Quantity updated successfully",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveFromCart = async (cartItemId: number) => {
    if (!token) return;
    try {
      const data = await removeFromCart({ item_id: cartItemId }, token);
      if (data.success) {
        fetchCartItems();
        toast({ title: "Removed", description: "Item removed from cart" });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const handleApplyCoupon = async (couponCode: string) => {
    if (!token || !cartSummary.cart_id) return;
    try {
      const data = await applyCoupon(cartSummary.cart_id, couponCode, token);
      if (data.status) {
        setAppliedCoupon({
          code: couponCode,
          value: data.data.discount_amount ?? 0,
        });
        setCouponDiscount(data.data.discount_amount ?? 0);
        await fetchCartItems();
        toast({ title: "Success", description: "Coupon applied successfully!" });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to apply coupon",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to apply coupon",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCoupon = async () => {
    if (!token || !cartSummary.cart_id) return;
    try {
      const data = await removeAppliedCoupon(cartSummary.cart_id, token);
      if (data.status) {
        toast({
          title: "Success",
          description: data.message || "Coupon removed successfully",
        });
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setFormData((prev) => ({ ...prev, coupon_code: "" }));
        await fetchCartItems();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to remove coupon",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove coupon",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (f: string, v: string) =>
    setFormData((p) => ({ ...p, [f]: v }));

  const handleCouponToggle = () => {
    setShowCoupon((p) => !p);
    if (!showCoupon) fetchCoupons();
  };

  const getProductImages = (product: any) => {
    try {
      const img = JSON.parse(product.image || "[]");
      if (Array.isArray(img) && img.length > 0) return getImageUrl(img[0]);
    } catch { }
    return "/placeholder.svg";
  };

  React.useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading)
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-[#084526] rounded-full"></div>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <div className="min-h-screen font-serif  ">
        <div className="mx-auto px-4 py-10">
          {/* Header */}
          <div className="mb-10">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-[#084526] hover:text-[#0a5a2e] flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#084526] rounded-2xl shadow-md">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#084526] tracking-tight">
                  Your Shopping Cart
                </h1>
                <p className="text-gray-600 text-sm">
                  Your selected jewellery pieces
                </p>
              </div>
            </div>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Items + Coupons */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 p-5"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Product Image */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
                      <img
                        src={getProductImages(item.product)}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-xl border border-gray-100"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.product.name}
                        </h3>
                        <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                          <p className="flex items-center gap-1 text-amber-700">
                            <Sparkles className="w-4 h-4" /> {item.product.purity}
                          </p>
                          <p>Metal: {item.product.metal_type}</p>
                          <p>Weight: {item.product.weight}g</p>
                          <p>Size: {item.size || "—"}</p>
                        </div>
                      </div>

                      {/* Price + Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xl font-bold text-[#084526]">
                          ₹{item.unit_price}
                        </p>

                        <div className="mt-2 flex items-center bg-gray-100 border border-gray-200 rounded-full shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-[#084526]/40 transition">
                          <button
                            onClick={() =>
                              handleQuantityUpdate(item.id, Math.max(1, item.quantity - 1))
                            }
                            disabled={updating === item.id || item.quantity <= 1}
                            className="px-3 py-2 text-lg text-[#084526] hover:bg-[#084526]/10 transition disabled:opacity-50"
                          >
                            −
                          </button>

                          <input
                            inputMode="numeric"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= 1)
                                handleQuantityUpdate(item.id, val);
                            }}
                            className="w-12 text-center bg-transparent text-sm font-medium focus:outline-none"
                          />

                          <button
                            onClick={() =>
                              handleQuantityUpdate(item.id, item.quantity + 1)
                            }
                            disabled={updating === item.id}
                            className="px-3 py-2 text-lg text-[#084526] hover:bg-[#084526]/10 transition disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon Section */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-[#084526] mb-4 flex justify-between items-center">
                    Apply Coupon
                    <span
                      onClick={handleCouponToggle}
                      className="text-sm text-[#084526] cursor-pointer hover:underline"
                    >
                      {showCoupon ? "Hide" : "View All"}
                    </span>
                  </h2>

                  {appliedCoupon ? (
                    <div className="relative mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl shadow-sm transition-all">
                      {/* Remove Coupon Button */}
                      <button
                        onClick={handleRemoveCoupon}
                        className="absolute -top-2 -right-2 text-red-100 hover:text-red-200 transition bg-red-500 rounded-full p-1"
                        title="Remove Coupon"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Coupon Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-semibold text-[#084526]">
                            {appliedCoupon?.code}
                          </h4>

                          {/* Description & Type */}
                          <p className="text-xs text-gray-600 italic mt-0.5">
                            {appliedCoupon?.description || "Special discount applied on your order."}
                          </p>
                          {/* {appliedCoupon?.discount_type && (
                            <p className="text-xs text-gray-500 capitalize">
                              Type:{" "}
                              {appliedCoupon.discount_type === "percentage"
                                ? "Percentage Discount"
                                : appliedCoupon.discount_type === "flat"
                                  ? "Flat Discount"
                                  : appliedCoupon.discount_type}
                            </p>
                          )} */}

                          <p className="text-sm text-gray-700 mt-1">
                            Coupon Applied Successfully!
                          </p>
                        </div>

                        {/* Discount Amount */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#084526]">−₹{couponDiscount}</p>
                          <p className="text-sm text-green-700 font-medium">
                            You saved ₹{couponDiscount}
                          </p>
                        </div>
                      </div>
                    </div>

                  ) : (
                    <div className="relative mb-4">
                      <Input
                        type="text"
                        value={formData.coupon_code}
                        onChange={(e) =>
                          handleInputChange("coupon_code", e.target.value)
                        }
                        placeholder="Enter coupon code"
                        className="pl-3 pr-24 rounded-full focus:border-[#084526] focus:ring-[#084526]/30"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(formData.coupon_code)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#084526] hover:bg-[#0a5a2e] text-white px-4 py-1 rounded-full text-sm font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {showCoupon && (
                    <div className="bg-gray-50 rounded-xl border border-gray-200 mt-4 p-3">
                      {couponsLoading ? (
                        <div className="flex justify-center py-6">
                          <div className="animate-spin h-6 w-6 border-b-2 border-[#084526] rounded-full"></div>
                        </div>
                      ) : coupons.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {coupons.map((coupon) => {
                            const eligible =
                              (cartSummary.total_amount ?? 0) >=
                              parseFloat(coupon.min_order_amount);
                            return (
                              <div
                                key={coupon.id}
                                className={`p-3 rounded-lg border shadow-sm flex flex-col justify-between transition ${eligible
                                  ? "border-green-500 bg-white hover:shadow-md"
                                  : "border-gray-200 bg-gray-100 text-gray-500"
                                  }`}
                              >
                                <div>
                                  <div className="flex justify-between text-sm font-medium">
                                    <span className="text-[#084526] font-semibold">
                                      {coupon.coupon_code}
                                    </span>
                                    <span
                                      className={`text-xs ${eligible
                                        ? "text-green-600"
                                        : "text-gray-400"
                                        }`}
                                    >
                                      {eligible ? "Eligible" : "Not Eligible"}
                                    </span>
                                  </div>

                                  <div className="flex justify-between text-xs mt-1 text-gray-600">
                                    <span>
                                      {coupon.discount_type === "percentage"
                                        ? `${coupon.value}% OFF`
                                        : `₹${coupon.value} OFF`}
                                    </span>
                                    <span>Min. ₹{coupon.min_order_amount}</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    eligible &&
                                    handleApplyCoupon(coupon.coupon_code)
                                  }
                                  disabled={!eligible}
                                  className={`mt-3 py-1.5 text-sm font-medium rounded-full transition ${eligible
                                    ? "bg-[#084526] text-white hover:bg-[#0a5a2e]"
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    }`}
                                >
                                  Apply
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 text-sm py-4">
                          No coupons available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Detailed Order Summary */}
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
                          key={`${item.id}-${item.size ?? ""}-${item.color ?? ""}`}
                          className="flex justify-between text-sm text-gray-700 border-b pb-2"
                        >
                          <div className="flex-1 pr-3 w-full ">
                            <p className="font-medium text-gray-800">
                              {item.product?.name}
                            </p>

                            {/* Show variant details if available */}
                            {(item.size || item.color) && (
                              <p className="text-xs text-gray-500">
                                {item.size && <>Size: {item.size}</>}
                                {item.size && item.color && " • "}
                                {item.color && <>Color: {item.color}</>}
                              </p>
                            )}

                            {/* Price × Qty */}
                            <p className="text-xs text-gray-500 mt-0.5">
                              ₹{Number(item.unit_price).toFixed(2)} × {item.quantity}
                            </p>

                            {/* <p className="text-xs text-gray-500 mt-0.5">
                            ₹{Number(item.unit_price).toFixed(2)} 
                          </p> */}
                          </div>

                          <div className="text-right font-semibold text-[#084526]">
                            ₹{(Number(item.unit_price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        {/* <div className="flex justify-between text-gray-700 text-sm">
                          <div>  <span>Making percentage</span> {item.making_percentage && <span className="text-xs text-primary font-sans">({item.making_percentage}%)</span>}</div>
                          <span className="font-semibold">
                            ₹{item.product.making_percentage ?? "0.00"}
                          </span>
                        </div> */}
  <div className="flex justify-between text-gray-700 text-sm">
  <div>
    <span>Making percentage</span>
    {item.product.making_percentage != null && (
      <span className="text-xs text-primary font-sans ml-1">
        ({item.product.making_percentage}%)
      </span>
    )}
  </div>
  <span className="font-semibold">
    ₹{item.product.making_charges ?? "0.00"}
    
  </span>
</div>
                       



                      </>

                    ))}
                  </div>

                  {/* Totals Section */}
                  <div className="space-y-3 mb-6 text-gray-700 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ₹{cartSummary.total_amount ?? "0.00"}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span>Making Charges</span>
                      <span className="font-semibold">
                        ₹{cartSummary.total_amount ?? "0.00"}
                      </span>
                    </div> */}

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

                    <div className="border-t pt-3 flex justify-between text-base font-bold text-[#084526]">
                      <span>Total Payable</span>
                      <span>₹{cartSummary.final_amount ?? "0.00"}</span>
                    </div>
                  </div>

                  {/* Free Shipping Note */}
                  <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>Free shipping on all orders</span>
                  </div>
                  {/* Action Buttons */}
                  <Button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-[#084526] hover:bg-[#0a5a2e] text-white py-3 text-lg font-semibold rounded-xl shadow-md"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="w-full mt-3 border-[#084526] text-[#084526] hover:bg-[#084526] hover:text-white"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>



            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingCart className="mx-auto w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">Your cart is empty.</p>
              <Button
                onClick={() => navigate("/products")}
                className="bg-[#084526] hover:bg-[#0a5a2e] text-white rounded-full px-6 py-3 font-semibold"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
