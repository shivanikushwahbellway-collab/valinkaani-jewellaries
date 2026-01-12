import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Loader2, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserWithCustomOrders, type CustomOrder } from "@/lib/api/adminUserController";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UserCustomOrders = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchCustomOrders = async () => {
      if (!token || !userId) return;
      try {
        setLoading(true);
        const response = await getUserWithCustomOrders(token, Number(userId));
        if (response.status) {
          setCustomOrders(response.data.custom_orders || []);
          setUserName(response.data.name);
        }
      } catch (err: any) {
        console.error("Error fetching custom orders:", err);
        toast({
          title: "Error",
          description: "Failed to load custom orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomOrders();
  }, [token, userId, toast]);

  const getCustomOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-200/70 text-yellow-800 hover:bg-yellow-200";
      case "approved": return "bg-blue-200/70 text-blue-800 hover:bg-blue-200";
      case "rejected": return "bg-red-200/70 text-red-800 hover:bg-red-200";
      case "in_progress": return "bg-purple-200/70 text-purple-800 hover:bg-purple-200";
      case "completed": return "bg-green-200/70 text-green-800 hover:bg-green-200";
      default: return "bg-gray-200/70 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full justify-between">
          <div className="">
            <h1 className="text-3xl font-bold">Custom Orders</h1>
            <p className="text-muted-foreground">{userName || "Loading..."}</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <Tabs defaultValue="customOrders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" onClick={() => navigate(`/admin/users/${userId}/overview`)}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders" onClick={() => navigate(`/admin/users/${userId}/orders`)}>
            Orders
          </TabsTrigger>
          <TabsTrigger value="customOrders" onClick={() => navigate(`/admin/users/${userId}/custom-orders`)}>
            Custom Orders
          </TabsTrigger>
          <TabsTrigger value="schemes" onClick={() => navigate(`/admin/users/${userId}/schemes`)}>
            Schemes
          </TabsTrigger>
          <TabsTrigger value="customPlans" onClick={() => navigate(`/admin/users/${userId}/custom-plans`)}>
            Custom Plans
          </TabsTrigger>
          <TabsTrigger value="wallet" onClick={() => navigate(`/admin/users/${userId}/wallet`)}>
            Wallet
          </TabsTrigger>
          <TabsTrigger value="vault" onClick={() => navigate(`/admin/users/${userId}/gold-vault`)}>
            Gold vault
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Custom Orders ({customOrders.length})</CardTitle>
          <CardDescription>User-specific custom jewelry orders</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : customOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Metal & Purity</TableHead>
                  <TableHead>Size & Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{order.metal}</span>
                        <span className="text-xs text-muted-foreground">{order.purity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>Size: {order.size}</span>
                        <span className="text-xs text-muted-foreground">Weight: {order.weight}g</span>
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
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/custom-orders/${order.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <Package className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No custom orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCustomOrders;

