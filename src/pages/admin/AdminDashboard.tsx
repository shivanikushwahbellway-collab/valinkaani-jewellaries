import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAnalytics } from "@/lib/api/dashboardController";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingBag, TrendingUp, DollarSign, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;
    
    getAnalytics(token)
      .then((response) => {
        const data = response;
        setStats(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  return (
    <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Orders */}
          <Card className="rounded-2xl shadow bg-blue-50 ">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {stats.total_orders}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Orders placed till date
              </p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="rounded-2xl shadow bg-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-6 w-6 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                ₹{stats.total_revenue}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Gross earnings so far
              </p>
            </CardContent>
          </Card>

          {/* Average Order Value */}
          <Card className="rounded-2xl shadow bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg. Order Value
              </CardTitle>
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                ₹{stats.average_order_value}
              </div>
              <p className="text-xs text-gray-500 mt-1">Per order on average</p>
            </CardContent>
          </Card>

          {/* Active Customers */}
          <Card className="rounded-2xl shadow bg-rose-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Customers
              </CardTitle>
              <Users className="h-6 w-6 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {stats.active_customers}
              </div>
              <p className="text-xs text-gray-500 mt-1">Engaged this month</p>
            </CardContent>
          </Card>
        </div>

      {/* Recent Orders */}
      <Card>
  <CardHeader>
    <CardTitle>Recent Orders</CardTitle>
    <CardDescription>Latest customer orders</CardDescription>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Expected Delivery</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
  {stats.recent_orders?.map((order: any) => (
    <TableRow key={order.id}>
      <TableCell className="font-medium">{order.order_code}</TableCell>
      <TableCell>
        {order.customer?.name} <br />
        <span className="text-xs text-gray-500">{order.customer?.email}</span>
      </TableCell>
      <TableCell>₹{parseFloat(order.final_amount).toLocaleString()}</TableCell>
      <TableCell>
        <Badge
          variant={
            order.status === "completed"
              ? "default"
              : order.status === "shipped"
              ? "secondary"
              : "destructive"
          }
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="capitalize">{order.payment_method}</TableCell>
      <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(order.expected_delivery).toLocaleDateString()}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/admin/orders/${order.id}`)}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
    </Table>
  </CardContent>
</Card>

    </div>
  );
};

export default AdminDashboard;
