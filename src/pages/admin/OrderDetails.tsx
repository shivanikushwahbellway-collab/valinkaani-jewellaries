import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  MessageSquare,
  Package,
  Truck,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getOrderById, updateOrderStatus } from "@/lib/api/ordersController";
import { getImageUrl } from "@/config";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "completed",
    "cancelled",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100/70 text-yellow-800 hover:bg-yellow-200";
      case "processing":
        return "bg-blue-100/70 text-blue-800 hover:bg-blue-200";
      case "shipped":
        return "bg-purple-100/70 text-purple-800 hover:bg-purple-200";
      case "completed":
        return "bg-green-100/70 text-green-800 hover:bg-green-200";
      case "cancelled":
        return "bg-red-100/70 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100/70 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return "Pending";
    const s = status.replace(/_/g, " ");
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString("en-IN");
    } catch {
      return dateString;
    }
  };

  const formatDateOnly = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-IN");
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value?: string | number | null) => {
    const numericValue = Number(value ?? 0);
    return `₹${numericValue.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const parseProductImages = (image?: string | null) => {
    if (!image) return [];
    try {
      const parsed = JSON.parse(image);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "string") return [parsed];
    } catch {
      return [image];
    }
    return [];
  };

  const getPrimaryProductImage = (image?: string | null) => {
    const images = parseProductImages(image);
    return images.length > 0 ? images[0] : null;
  };

  const fetchOrderDetails = async () => {
    if (!orderId || !token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getOrderById(token, orderId);
      const orderData = response?.data?.data;

      if (orderData) {
        setOrder(orderData);
        setSelectedStatus(orderData.status || "pending");
      } else {
        setError("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to fetch order details. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch order details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!orderId || !token || !selectedStatus) return;

    try {
      setStatusUpdateLoading(true);
      await updateOrderStatus(token, orderId, selectedStatus);

      // Update the order in local state
      setOrder((prev: any) => ({ ...prev, status: selectedStatus }));

      toast({
        title: "Success",
        description: "Order status updated successfully.",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (orderId && token) {
      fetchOrderDetails();
    }
  }, [orderId, token]);

  if (loading) {
    return (
      <div className=" p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-medium">Error loading order</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => navigate("/admin/orders")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className=" p-6">
        <div className="text-center py-12">
          <p className="text-lg font-medium">Order not found</p>
          <Button
            onClick={() => navigate("/admin/orders")}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">
              Order #{order.order_code} - {formatStatus(order.status)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Order ID:
                    </span>
                    <span className="font-medium">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Order Code:
                    </span>
                    <span className="font-medium font-mono">
                      {order.order_code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Customer ID:
                    </span>
                    <span className="font-medium">{order.customer_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Order Date:
                    </span>
                    <span className="font-medium">
                      {formatDate(order.order_date)}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    <Badge className={getStatusColor(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment Method:
                    </span>
                    <span className="font-medium capitalize">
                      {order.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Expected Delivery:
                    </span>
                    <span className="font-medium">
                      {order.expected_delivery
                        ? formatDate(order.expected_delivery)
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Created:
                    </span>
                    <span className="font-medium">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          {order.customer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {order.customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Full Name
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {order.customer.user_code}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {order.customer.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Email Address
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {order.customer.mobile}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Mobile Number
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Role:
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {order.customer.role}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Badge
                        variant={
                          order.customer.status === 1 ? "default" : "secondary"
                        }
                      >
                        {order.customer.status === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Login:
                      </span>
                      <span className="text-sm">
                        {formatDate(order.customer.last_login_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Razorpay Order ID:
                    </span>
                    <span className="font-medium font-mono text-xs">
                      {order.razorpay_order_id || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment ID:
                    </span>
                    <span className="font-medium font-mono text-xs">
                      {order.razorpay_payment_id || "—"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Signature:
                    </span>
                    <span className="font-medium font-mono text-xs">
                      {order.razorpay_signature || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Coupon ID:
                    </span>
                    <span className="font-medium">
                      {order.coupon_id || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          {Array.isArray(order.items) && order.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
                <CardDescription>Products included in this order</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Product</th>
                      <th className="px-4 py-3 text-center font-semibold">Quantity</th>
                      <th className="px-4 py-3 text-right font-semibold">Unit Price</th>
                      <th className="px-4 py-3 text-right font-semibold">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.items.map((item: any) => {
                      const product = item.product || {};
                      const primaryImage = getPrimaryProductImage(product.image);
                      return (
                        <tr key={item.id} className="bg-white">
                          <td className="px-4 py-4 align-top">
                            <div className="flex items-start gap-3">
                              {primaryImage && (
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-muted">
                                  <img
                                    src={getImageUrl(primaryImage)}
                                    alt={product.name || `Product ${product.id}`}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                              <div className="space-y-1">
                                <div className="text-sm font-semibold text-foreground">
                                  {product.name || `Product #${product.id}`}
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                  {product.metal_type && (
                                    <span className="rounded-full bg-muted px-2 py-1">
                                      {product.metal_type}
                                    </span>
                                  )}
                                  {product.purity && (
                                    <span className="rounded-full bg-muted px-2 py-1">
                                      {product.purity}
                                    </span>
                                  )}
                                  {product.weight && (
                                    <span className="rounded-full bg-muted px-2 py-1">
                                      {Number(product.weight).toFixed(2)} g
                                    </span>
                                  )}
                                </div>
                              <div className="text-xs text-muted-foreground">
                                Product ID: #{product.id}
                                {product.collection_id ? ` • Collection ${product.collection_id}` : ""}
                                {product.category_id ? ` • Category ${product.category_id}` : ""}
                              </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-medium">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-right text-muted-foreground">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="px-4 py-4 text-right font-semibold text-foreground">
                            {formatCurrency(item.total_price)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">{order.delivery_address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Current Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Current Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">{order.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-semibold">₹{order.total_amount}</span>
                </div>
                {order.discount_amount && Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-semibold">
                      -₹{order.discount_amount}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Final Amount:</span>
                    <span className="font-bold text-primary">
                      ₹{order.final_amount}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.coupon && (
            <Card>
              <CardHeader>
                <CardTitle>Coupon Applied</CardTitle>
                <CardDescription>Discount details for this order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coupon Code</span>
                  <Badge variant="secondary" className="font-mono uppercase">
                    {order.coupon.coupon_code}
                  </Badge>
                </div>
                {order.coupon.description && (
                  <div className="rounded-lg border border-muted bg-muted/20 p-3 text-xs text-muted-foreground">
                    {order.coupon.description}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">
                      Discount Type
                    </div>
                    <div className="font-medium capitalize">
                      {order.coupon.discount_type}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">
                      Discount Value
                    </div>
                    <div className="font-medium">
                      {order.coupon.discount_type === "percentage"
                        ? `${Number(order.coupon.value).toFixed(0)}%`
                        : formatCurrency(order.coupon.value)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">
                      Min. Order Amount
                    </div>
                    <div className="font-medium">
                      {formatCurrency(order.coupon.min_order_amount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">
                      Usage Limit
                    </div>
                    <div className="font-medium">
                      {order.coupon.usage_limit || "No limit"}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>
                    Valid From:{" "}
                    <span className="font-medium text-foreground">
                      {formatDateOnly(order.coupon.valid_from)}
                    </span>
                  </div>
                  <div>
                    Valid Until:{" "}
                    <span className="font-medium text-foreground">
                      {formatDateOnly(order.coupon.valid_until)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Update Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={
                  statusUpdateLoading || selectedStatus === order.status
                }
                className="w-full"
              >
                {statusUpdateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Truck className="mr-2 h-4 w-4" />
                Track Package
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send SMS
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
