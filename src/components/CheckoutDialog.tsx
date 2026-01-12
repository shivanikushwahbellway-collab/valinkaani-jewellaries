import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOrder } from "@/lib/api/orderController";
import { useToast } from "@/hooks/use-toast";


interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cartItems: any[];
  token: string;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  cartItems,
  token,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    order_date: "",
    payment: "COD",
    coupon_code: "",
    notes: "",
    // Address fields
    h_no: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.order_date || !formData.h_no || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Combine address fields
    const delivery_address = `${formData.h_no}, ${formData.street}, ${formData.landmark}, ${formData.city}, ${formData.state}, ${formData.pincode}`;

    // Prepare products array from cart items
    const products = cartItems.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity
    }));

    // Calculate expected delivery (3 days from order date)
    const orderDate = new Date(formData.order_date);
    const expectedDelivery = new Date(orderDate);
    expectedDelivery.setDate(expectedDelivery.getDate() + 3);

    const orderData = {
      products,
      delivery_address,
      order_date: formData.order_date,
      expected_delivery: expectedDelivery.toISOString().split('T')[0],
      payment: formData.payment,
      coupon_id: formData.coupon_code ? parseInt(formData.coupon_code) : undefined,
      notes: formData.notes,
    };

    setLoading(true);
    try {
      const response = await createOrder(orderData, token);
      if (response.success) {
        toast({
          title: "Success",
          description: "Order placed successfully!",
        });
        // Reset form
        setFormData({
          order_date: "",
          payment: "COD",
          coupon_code: "",
          notes: "",
          h_no: "",
          street: "",
          landmark: "",
          city: "",
          state: "",
          pincode: "",
        });
        // Close dialog and trigger success callback
        onClose();
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to place order",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₹{item.total_price}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order_date">Order Date *</Label>
              <Input
                id="order_date"
                type="date"
                value={formData.order_date}
                onChange={(e) => handleInputChange("order_date", e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="payment">Payment Mode *</Label>
              <Select value={formData.payment} onValueChange={(value) => handleInputChange("payment", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="coupon_code">Coupon Code</Label>
              <Input
                id="coupon_code"
                type="text"
                value={formData.coupon_code}
                onChange={(e) => handleInputChange("coupon_code", e.target.value)}
                placeholder="Enter coupon code"
              />
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Delivery Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="h_no">House/Flat No. *</Label>
                <Input
                  id="h_no"
                  type="text"
                  value={formData.h_no}
                  onChange={(e) => handleInputChange("h_no", e.target.value)}
                  required
                  placeholder="e.g., 123"
                />
              </div>

              <div>
                <Label htmlFor="street">Street/Area *</Label>
                <Input
                  id="street"
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  required
                  placeholder="e.g., Main Street"
                />
              </div>

              <div>
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => handleInputChange("landmark", e.target.value)}
                  placeholder="e.g., Near City Mall"
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                  placeholder="e.g., Mumbai"
                />
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  required
                  placeholder="e.g., Maharashtra"
                />
              </div>

              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  required
                  placeholder="e.g., 400001"
                  pattern="[0-9]{6}"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Special Instructions</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any special delivery instructions..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#084526] hover:bg-[#0a5a2e]"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
