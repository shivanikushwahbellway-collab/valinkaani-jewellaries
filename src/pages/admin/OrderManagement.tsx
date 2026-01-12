import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Eye,
  Download,
  Package,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getOrders } from "@/lib/api/ordersController";
import {
  getAllCustomOrders,
  getCustomOrderById,
  updateCustomOrderStatus,
  type AdminCustomOrder,
} from "@/lib/api/adminCustomOrderController";
import { getImageUrl } from "@/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
  });

  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const navigate = useNavigate();

  // Custom Orders State
  const [customOrders, setCustomOrders] = useState<AdminCustomOrder[]>([]);
  const [customOrdersLoading, setCustomOrdersLoading] = useState(false);
  const [customOrdersError, setCustomOrdersError] = useState<string | null>(null);
  const [customOrderFilters, setCustomOrderFilters] = useState({
    status: "" as string, // Single status selection instead of array
    customer_name: "",
    start_date: "",
    end_date: "",
  });
  const [selectedCustomOrder, setSelectedCustomOrder] = useState<AdminCustomOrder | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const copyToClipboard = useCallback((value?: string) => {
    if (!value) return;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          setCopiedValue(value);
          setTimeout(() => setCopiedValue(null), 1500);
        })
        .catch(() => {
          // Silently ignore copy failures
        });
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrders(token);
      const apiOrders = response?.data?.data ?? [];
      const counts = response?.data?.status_counts ?? null;

      const formatDate = (iso?: string) => {
        if (!iso) return "";
        try {
          const d = new Date(iso);
          return d.toLocaleString();
        } catch {
          return String(iso);
        }
      };

      const formatStatus = (status?: string) => {
        if (!status) return "Pending";
        const s = status.replace(/_/g, " ");
        return s.charAt(0).toUpperCase() + s.slice(1);
      };

      const normalized = apiOrders.map((o: any) => ({
        id: o.id,
        orderCode: o.order_code,
        customerId: o.customer_id,
        customer: o.customer ?? null,
        totalAmount: o.total_amount,
        finalAmount: o.final_amount,
        discountAmount: o.discount_amount,
        status: formatStatus(o.status),
        rawStatus: o.status ?? "pending",
        deliveryAddress: o.delivery_address ?? "",
        orderDate: formatDate(o.order_date),
        expectedDelivery: o.expected_delivery
          ? formatDate(o.expected_delivery)
          : "—",
        paymentMethod: o.payment_method ?? "",
        razorpayOrderId: o.razorpay_order_id ?? "—",
        razorpayPaymentId: o.razorpay_payment_id ?? "—",
        razorpaySignature: o.razorpay_signature ?? "—",
        notes: o.notes ?? "",
      }));

      setOrders(normalized);
      if (counts) {
        setStatusCounts({
          pending: counts.pending ?? 0,
          processing: counts.processing ?? 0,
          shipped: counts.shipped ?? 0,
          completed: counts.completed ?? 0,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
      setOrders([]);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token, fetchOrders]);

  const statusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Completed",
    "Cancelled",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fetch Custom Orders
  const fetchCustomOrders = useCallback(async () => {
    if (!token) return;
    
    try {
      setCustomOrdersLoading(true);
      setCustomOrdersError(null);
      
      const params: any = {};
      if (customOrderFilters.status) {
        params.status = [customOrderFilters.status]; // Convert to array for API
      }
      if (customOrderFilters.customer_name) {
        params.customer_name = customOrderFilters.customer_name;
      }
      if (customOrderFilters.start_date) {
        params.start_date = customOrderFilters.start_date;
      }
      if (customOrderFilters.end_date) {
        params.end_date = customOrderFilters.end_date;
      }
      
      const response = await getAllCustomOrders(token, params);
      if (response.status) {
        setCustomOrders(response.data || []);
      } else {
        setCustomOrdersError("Failed to load custom orders");
      }
    } catch (err: any) {
      console.error("Error fetching custom orders:", err);
      setCustomOrdersError(
        err?.response?.data?.message || err?.message || "Failed to load custom orders"
      );
    } finally {
      setCustomOrdersLoading(false);
    }
  }, [token, customOrderFilters]);

  // Get Custom Order Status Color
  const getCustomOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "in_progress":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Update Custom Order Status
  const handleUpdateStatus = async () => {
    if (!token || !selectedCustomOrder || !newStatus) return;
    
    try {
      setUpdatingStatus(true);
      const response = await updateCustomOrderStatus(
        token,
        selectedCustomOrder.id,
        {
          status: newStatus,
          admin_note: adminNote || undefined,
        }
      );
      
      if (response.status) {
        toast({
          title: "Success",
          description: "Custom order status updated successfully",
        });
        setStatusUpdateDialogOpen(false);
        setAdminNote("");
        fetchCustomOrders();
      } else {
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Track active tab
  const [activeTab, setActiveTab] = useState("orders");

  // Fetch custom orders when custom tab is active
  useEffect(() => {
    if (token && activeTab === "custom") {
      fetchCustomOrders();
    }
  }, [token, activeTab, fetchCustomOrders]);

  return (
    <div className=" p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">
            Manage customer orders and deliveries
          </p>
        </div>
      </div>

      <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="custom">Custom Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders by ID, customer name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status.toLowerCase()}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{statusCounts.pending}</div>
                <p className="text-xs text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {statusCounts.processing}
                </div>
                <p className="text-xs text-muted-foreground">Processing</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{statusCounts.shipped}</div>
                <p className="text-xs text-muted-foreground">Shipped</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {statusCounts.completed}
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Orders ({orders.length})</CardTitle>
              <CardDescription>Manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Order Code</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Final Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Loading orders...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-red-500 mb-2">
                          <p className="text-sm font-medium">
                            Error loading orders
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {error}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchOrders()}
                          className="mt-2"
                        >
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.orderCode}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="capitalize font-semibold">
                              {order.customer?.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <span>{order.customer?.email}</span>
                              {order.customer?.email ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Copy email"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    copyToClipboard(order.customer?.email)
                                  }
                                >
                                  {copiedValue === order.customer?.email ? (
                                    <Check className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{order.customer?.mobile}</span>
                              {order.customer?.mobile ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Copy mobile"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    copyToClipboard(order.customer?.mobile)
                                  }
                                >
                                  {copiedValue === order.customer?.mobile ? (
                                    <Check className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{order.finalAmount}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>{order.expectedDelivery}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/orders/${order.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No orders found
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          {/* Custom Orders Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by customer name..."
                      value={customOrderFilters.customer_name}
                      onChange={(e) =>
                        setCustomOrderFilters({
                          ...customOrderFilters,
                          customer_name: e.target.value,
                        })
                      }
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={customOrderFilters.start_date}
                    onChange={(e) =>
                      setCustomOrderFilters({
                        ...customOrderFilters,
                        start_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={customOrderFilters.end_date}
                    onChange={(e) =>
                      setCustomOrderFilters({
                        ...customOrderFilters,
                        end_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={fetchCustomOrders}
                    disabled={customOrdersLoading}
                  >
                    {customOrdersLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Filter"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCustomOrderFilters({
                        status: "",
                        customer_name: "",
                        start_date: "",
                        end_date: "",
                      });
                      // Don't auto-fetch on reset, let user click Filter button
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">Filter by Status</Label>
                <Select
                  value={customOrderFilters.status || "all"}
                  onValueChange={(value) => {
                    setCustomOrderFilters({
                      ...customOrderFilters,
                      status: value === "all" ? "" : value,
                    });
                  }}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Custom Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Orders ({customOrders.length})</CardTitle>
              <CardDescription>
                Manage custom jewelry orders and design uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Metal & Purity</TableHead>
                    <TableHead>Size & Weight</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customOrdersLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Loading custom orders...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : customOrdersError ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="text-red-500 mb-2">
                          <p className="text-sm font-medium">
                            Error loading custom orders
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {customOrdersError}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchCustomOrders}
                          className="mt-2"
                        >
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : customOrders.length > 0 ? (
                    customOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {order.customer?.name || "N/A"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {order.customer?.email || ""}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {order.customer?.mobile || ""}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.category?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{order.metal}</span>
                            <span className="text-xs text-muted-foreground">
                              {order.purity}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>Size: {order.size}</span>
                            <span className="text-xs text-muted-foreground">
                              Weight: {order.weight}g
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCustomOrderStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.price ? (
                            <span className="font-medium">₹{Number(order.price).toLocaleString("en-IN")}</span>
                          ) : (
                            <span className="text-muted-foreground">Not quoted</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/custom-orders/${order.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCustomOrder(order);
                                setNewStatus(order.status);
                                setAdminNote(order.admin_note || "");
                                setStatusUpdateDialogOpen(true);
                              }}
                            >
                              Update
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No custom orders found
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Custom Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Custom Order Details #{selectedCustomOrder?.id}</DialogTitle>
            <DialogDescription>
              View complete custom order information
            </DialogDescription>
          </DialogHeader>
          {selectedCustomOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Customer Information</Label>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Name:</span> {selectedCustomOrder.customer?.name || "N/A"}</p>
                    <p><span className="font-medium">Email:</span> {selectedCustomOrder.customer?.email || "N/A"}</p>
                    <p><span className="font-medium">Mobile:</span> {selectedCustomOrder.customer?.mobile || "N/A"}</p>
                    <p><span className="font-medium">User Code:</span> {selectedCustomOrder.customer?.user_code || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Order Information</Label>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Category:</span> {selectedCustomOrder.category?.name || "N/A"}</p>
                    <p><span className="font-medium">Metal:</span> {selectedCustomOrder.metal}</p>
                    <p><span className="font-medium">Purity:</span> {selectedCustomOrder.purity}</p>
                    <p><span className="font-medium">Size:</span> {selectedCustomOrder.size}</p>
                    <p><span className="font-medium">Weight:</span> {selectedCustomOrder.weight}g</p>
                    <p><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getCustomOrderStatusColor(selectedCustomOrder.status)}`}>
                        {selectedCustomOrder.status}
                      </Badge>
                    </p>
                    {selectedCustomOrder.price && (
                      <p><span className="font-medium">Price:</span> ₹{Number(selectedCustomOrder.price).toLocaleString("en-IN")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-semibold">Description</Label>
                <p className="mt-2 p-3 bg-gray-50 rounded-md">{selectedCustomOrder.description}</p>
              </div>

              {/* Special Instructions */}
              {selectedCustomOrder.note && (
                <div>
                  <Label className="text-sm font-semibold">Special Instructions</Label>
                  <p className="mt-2 p-3 bg-amber-50 rounded-md">{selectedCustomOrder.note}</p>
                </div>
              )}

              {/* Admin Note */}
              {selectedCustomOrder.admin_note && (
                <div>
                  <Label className="text-sm font-semibold">Admin Note</Label>
                  <p className="mt-2 p-3 bg-blue-50 rounded-md">{selectedCustomOrder.admin_note}</p>
                </div>
              )}

              {/* Design Images */}
              {selectedCustomOrder.design_image && (
                <div>
                  <Label className="text-sm font-semibold">Design Images</Label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(() => {
                      let images: string[] = [];
                      try {
                        const parsed = JSON.parse(selectedCustomOrder.design_image);
                        images = Array.isArray(parsed) ? parsed : [parsed];
                      } catch {
                        images = [selectedCustomOrder.design_image];
                      }
                      return images.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={getImageUrl(img)}
                            alt={`Design ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-semibold">Created At</Label>
                  <p className="mt-1">{new Date(selectedCustomOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Updated At</Label>
                  <p className="mt-1">{new Date(selectedCustomOrder.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusUpdateDialogOpen} onOpenChange={setStatusUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Custom Order Status</DialogTitle>
            <DialogDescription>
              Update the status and add admin notes for order #{selectedCustomOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="admin_note">Admin Note (Optional)</Label>
              <Textarea
                id="admin_note"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add any notes or comments..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusUpdateDialogOpen(false)}
              disabled={updatingStatus}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updatingStatus || !newStatus}
            >
              {updatingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
