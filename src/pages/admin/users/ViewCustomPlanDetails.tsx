import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Hourglass,
  Coins,
  Receipt
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getUserCustomPlans,
  getUserGoldPlanPayments,
  type CustomPlan,
  type GoldPlanPayment,
} from "@/lib/api/adminUserController";

const ViewCustomPlanDetails = () => {
  const { userId, customPlanId } = useParams<{ userId: string; customPlanId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();

  const [plan, setPlan] = useState<CustomPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [payments, setPayments] = useState<GoldPlanPayment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!token || !userId || !customPlanId) return;
      setLoading(true);
      try {
        const response = await getUserCustomPlans(token, Number(userId));
        if (response.status) {
          setUserName(response.data.name);
          const found = (response.data.custom_plan || []).find(
            (p: CustomPlan) => p.id === Number(customPlanId)
          );
          setPlan(found ?? null);
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch plan details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPlanDetails();
  }, [token, userId, customPlanId, toast]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!token || !userId || !customPlanId) return;
      setLoadingPayments(true);
      try {
        const resp = await getUserGoldPlanPayments(
          token,
          Number(userId),
          Number(plan?.id)
        );
        if (resp.status) {
          setPayments(resp.data.payments || []);
        }
      } finally {
        setLoadingPayments(false);
      }
    };
    if (plan) fetchPayments();
  }, [token, userId, customPlanId, plan]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "success":
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "upcoming":
        return <Hourglass className="h-3 w-3" />;
      case "failed":
        return <XCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
      case "upcoming":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading custom plan details...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className=" mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Custom Plan Details</h1>
              <p className="text-slate-500 mt-1">{userName}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Custom Plan Not Found</h3>
                  <p className="text-slate-500 mt-1 text-sm">The requested custom plan details could not be found.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const successfulPayments = payments.filter(p => p.status === "paid" || p.status === "success").length;
  const totalPayments = payments.length;
  const progressPercentage = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Custom Plan #{plan.id}</h1>
            <p className="text-slate-500 mt-1">{userName}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Compact Progress Overview */}
        <Card className="mb-4 border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Coins className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Gold Investment</h3>
                  <p className="text-xs text-slate-500">{successfulPayments}/{totalPayments} payments</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{Math.round(progressPercentage)}%</p>
                <p className="text-xs text-slate-500">Complete</p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Compact Plan Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Invested Amount Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-slate-500">Invested Amount</h3>
                  <p className="text-base font-semibold text-slate-900">₹{Number(plan.invested_amount).toLocaleString("en-IN")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gold Grams Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Coins className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-slate-500">Gold Grams</h3>
                  <p className="text-base font-semibold text-slate-900">{Number(plan.gold_grams).toFixed(4)} g</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gold Rate Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-slate-500">Gold Rate</h3>
                  <p className="text-base font-semibold text-slate-900">₹{Number(plan.gold_rate).toLocaleString("en-IN")}/g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Information and Payments */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Plan Details</CardTitle>
                <CardDescription className="text-xs">ID: #{plan.id} | Created: {new Date(plan.created_at).toLocaleDateString()}</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Total Payments</p>
                <p className="text-lg font-semibold text-slate-900">{payments.length}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingPayments ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-2 px-3 font-medium text-slate-700 text-xs">Payment ID</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-700 text-xs">Order ID</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-700 text-xs">Status</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-700 text-xs">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((pay, index) => (
                      <tr 
                        key={pay.id} 
                        className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${index === 0 ? '' : ''}`}
                      >
                        <td className="py-2 px-3">
                          <div className="flex items-center space-x-1">
                            <Receipt className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-900 text-xs">#{pay.id}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-slate-700 text-xs">{pay.order_id}</span>
                        </td>
                        <td className="py-2 px-3">
                          <Badge 
                            className={`capitalize flex justify-center w-fit items-center space-x-1 text-xs ${getStatusColor(pay.status)}`}
                          >
                            {getStatusIcon(pay.status)}
                            <span>{pay.status}</span>
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="font-medium text-slate-900 text-xs">₹{Number(pay.amount).toLocaleString("en-IN")}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Receipt className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">No Payments Found</h3>
                <p className="text-slate-500 text-xs">There are no payment transactions recorded for this custom plan yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewCustomPlanDetails;