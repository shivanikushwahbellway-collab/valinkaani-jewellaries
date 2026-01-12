import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle, Hourglass } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserWithSchemes, getUserSchemesPayments, type UserScheme, type SchemePayment } from "@/lib/api/adminUserController";

const ViewSchemeDetails = () => {
  const { userId, userSchemeId } = useParams<{ userId: string; userSchemeId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const [scheme, setScheme] = useState<UserScheme | null>(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [schemePayments, setSchemePayments] = useState<SchemePayment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    const fetchSchemeDetails = async () => {
      if (!token || !userId || !userSchemeId) return;
      setLoading(true);
      try {
        const response = await getUserWithSchemes(token, Number(userId));
        if (response.status) {
          setUserName(response.data.name);
          const found = (response.data.user_schemes || []).find((s: UserScheme) => s.id === Number(userSchemeId));
          setScheme(found ?? null);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch scheme details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSchemeDetails();
  }, [token, userId, userSchemeId, toast]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!token || !userId || !userSchemeId) return;
      setLoadingPayments(true);
      try {
        const resp = await getUserSchemesPayments(token, Number(userId), Number(scheme?.scheme_id));
        if (resp.status) {
          setSchemePayments(resp.data.payments || []);
        }
      } finally {
        setLoadingPayments(false);
      }
    };
    if (scheme) fetchPayments();
  }, [token, userId, userSchemeId, scheme]);

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
          <p className="text-muted-foreground text-sm">Loading scheme details...</p>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className=" mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Scheme Details</h1>
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
                  <h3 className="text-lg font-semibold text-slate-900">Scheme Not Found</h3>
                  <p className="text-slate-500 mt-1 text-sm">The requested scheme details could not be found.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const paidInstallments = schemePayments.filter(p => p.status === "paid" || p.status === "success").length;
  const totalInstallments = schemePayments.length;
  const progressPercentage = totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Scheme Details #{scheme.id}</h1>
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
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Scheme Progress</h3>
                  <p className="text-xs text-slate-500">{paidInstallments}/{totalInstallments} installments</p>
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

        {/* Compact Scheme Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Status Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-slate-500">Status</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 capitalize">{scheme.status}</p>
                    <Badge className={`text-xs ${scheme.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                      {scheme.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheme Name Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-slate-500">Scheme Name</h3>
                  <p className="text-sm font-semibold text-slate-900 truncate">{scheme.scheme?.scheme || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Amount Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-slate-500">Monthly Amount</h3>
                  <p className="text-sm font-semibold text-slate-900">₹{Number(scheme.monthly_amount).toLocaleString("en-IN")}</p>
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
                <CardTitle className="text-lg font-semibold text-slate-900">Scheme Details</CardTitle>
                <CardDescription className="text-xs">
                  Total Paid: ₹{Number(scheme.total_paid).toLocaleString("en-IN")} | 
                  {/* Maturity: ₹{scheme.scheme?.maturity_amount?.toLocaleString("en-IN")} */}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Total Installments</p>
                <p className="text-lg font-semibold text-slate-900">{schemePayments.length}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingPayments ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : schemePayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-2 px-3 font-medium text-slate-700 text-xs">Installment</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-700 text-xs">Due Date</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-700 text-xs">Status</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-700 text-xs">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemePayments.map((p, index) => (
                      <tr 
                        key={p.id} 
                        className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${index === 0 ? '' : ''}`}
                      >
                        <td className="py-2 px-3">
                          <span className="text-slate-900 font-medium text-xs">#{p.installment_number}</span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-700 text-xs">{new Date(p.due_date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <Badge 
                            className={`capitalize flex justify-center w-fit items-center space-x-1 text-xs ${getStatusColor(p.status)}`}
                          >
                            {getStatusIcon(p.status)}
                            <span>{p.status}</span>
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="font-medium text-slate-900 text-xs">₹{Number(p.amount).toLocaleString("en-IN")}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">No Payments Found</h3>
                <p className="text-slate-500 text-xs">There are no installment payments recorded for this scheme yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewSchemeDetails;