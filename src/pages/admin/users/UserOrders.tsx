import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserWithOrders, type Order } from "@/lib/api/adminUserController";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserOrders = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token || !userId) return;
      try {
        setLoading(true);
        const response = await getUserWithOrders(token, Number(userId));
        if (response.status) {
          setOrders(response.data.orders || []);
          setUserName(response.data.name);
        }
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token, userId, toast]);

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-200/70 text-yellow-800 hover:bg-yellow-200";
      case "processing": return "bg-blue-200/70 text-blue-800 hover:bg-blue-200";
      case "shipped": return "bg-purple-200/70 text-purple-800 hover:bg-purple-200";
      case "delivered": return "bg-green-200/70 text-green-800 hover:bg-green-200";
      case "cancelled": return "bg-red-200/70 text-red-800 hover:bg-red-200";
      default: return "bg-gray-200/70 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Orders</h1>
          <p className="text-muted-foreground">{userName || "Loading..."}</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" onClick={() => navigate(`/admin/users/${userId}/overview`)}>Overview</TabsTrigger>
          <TabsTrigger value="orders" onClick={() => navigate(`/admin/users/${userId}/orders`)}>Orders</TabsTrigger>
          <TabsTrigger value="customOrders" onClick={() => navigate(`/admin/users/${userId}/custom-orders`)}>Custom Orders</TabsTrigger>
          <TabsTrigger value="schemes" onClick={() => navigate(`/admin/users/${userId}/schemes`)}>Schemes</TabsTrigger>
          <TabsTrigger value="customPlans" onClick={() => navigate(`/admin/users/${userId}/custom-plans`)}>Custom Plans</TabsTrigger>
          <TabsTrigger value="wallet" onClick={() => navigate(`/admin/users/${userId}/wallet`)}>Wallet</TabsTrigger>
          <TabsTrigger value="vault" onClick={() => navigate(`/admin/users/${userId}/gold-vault`)}>Gold Vault</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : orders.length > 0 ? (
        <div className="mt-6 border rounded-lg overflow-x-auto shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Order Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Final</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_code}</TableCell>
                  <TableCell>
                    <Badge className={`capitalize ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{Number(order.total_amount).toLocaleString("en-IN")}</TableCell>
                  <TableCell>₹{Number(order.final_amount).toLocaleString("en-IN")}</TableCell>
                  <TableCell>{order.payment_method}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(order.expected_delivery).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {order.delivery_address}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 mt-4 text-muted-foreground">
          No orders found
        </div>
      )}
    </div>
  );
};

export default UserOrders;
