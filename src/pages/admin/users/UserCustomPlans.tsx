import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Coins } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserCustomPlans, getUserGoldPlanPayments, type CustomPlan, type GoldPlanPayment } from "@/lib/api/adminUserController";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const UserCustomPlans = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const [customPlans, setCustomPlans] = useState<CustomPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [goldPlanPayments, setGoldPlanPayments] = useState<Record<number, GoldPlanPayment[]>>({});
  const [loadingPayments, setLoadingPayments] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchCustomPlans = async () => {
      if (!token || !userId) return;
      try {
        setLoading(true);
        const response = await getUserCustomPlans(token, Number(userId));
        if (response.status) {
          setCustomPlans(response.data.custom_plan || []);
          setUserName(response.data.name);
        }
      } catch (err: any) {
        console.error("Error fetching custom plans:", err);
        toast({
          title: "Error",
          description: "Failed to load custom plans",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomPlans();
  }, [token, userId, toast]);

  const loadPayments = async (goldPlanId: number) => {
    if (!token || !userId) return;
    try {
      setLoadingPayments((prev) => ({ ...prev, [goldPlanId]: true }));
      const response = await getUserGoldPlanPayments(token, Number(userId), goldPlanId);
      if (response.status) {
        setGoldPlanPayments((prev) => ({ ...prev, [goldPlanId]: response.data.payments || [] }));
      }
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to load gold plan payments", variant: "destructive" });
    } finally {
      setLoadingPayments((prev) => ({ ...prev, [goldPlanId]: false }));
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "bg-green-100 text-green-800";
      case "success": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full justify-between ">
          <div>
            <h1 className="text-3xl font-bold">Custom Plans</h1>
            <p className="text-muted-foreground">{userName || "Loading..."}</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <Tabs defaultValue="customPlans" className="space-y-4">
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

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : customPlans.length > 0 ? (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Custom Plans ({customPlans.length})</CardTitle>
            <CardDescription>User’s gold custom plans</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan ID</TableHead>
                  <TableHead>Invested</TableHead>
                  <TableHead>Gold (g)</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customPlans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>#{p.id}</TableCell>
                    <TableCell>₹{Number(p.invested_amount).toLocaleString("en-IN")}</TableCell>
                    <TableCell>{Number(p.gold_grams).toFixed(4)} g</TableCell>
                    <TableCell>₹{Number(p.gold_rate).toLocaleString("en-IN")}/g</TableCell>
                    <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/users/${userId}/custom-plans/${p.id}/details`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 mt-4">
          <Coins className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No custom plans found</p>
        </div>
      )}
    </div>
  );
};

export default UserCustomPlans;

