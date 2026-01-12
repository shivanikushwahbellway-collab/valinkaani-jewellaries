import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, UserX, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserList, updateUserStatus, type AdminUser } from "@/lib/api/adminUserController";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserOverview = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token || !userId) return;
      try {
        setLoading(true);
        const response = await getUserList(token);
        if (response.status) {
          const foundUser = response.data.find((u) => u.id === Number(userId));
          if (foundUser) {
            setUser(foundUser);
          } else {
            toast({
              title: "Error",
              description: "User not found",
              variant: "destructive",
            });
            navigate("/admin/users");
          }
        }
      } catch (err: any) {
        console.error("Error fetching user:", err);
        toast({
          title: "Error",
          description: "Failed to load user",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, userId, navigate, toast]);

  const getStatusColor = (status: number) => {
    return status === 1 ? "bg-green-200/70 text-green-800 hover:bg-green-200" : "bg-red-200 text-red-800 hover:bg-red-200";
  };

  const handleUpdateStatus = async () => {
    if (!token || !user) return;
    const newStatus = user.status === 1 ? 0 : 1;
    try {
      const response = await updateUserStatus(token, user.id, { status: newStatus });
      if (response.status) {
        toast({
          title: "Success",
          description: response.message || "User status updated successfully",
        });
        setUser({ ...user, status: newStatus });
      }
    } catch (err: any) {
      console.error("Error updating user status:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
       
      
          <div>
            <h1 className="text-3xl font-bold">User Overview</h1>
            <p className="text-muted-foreground">{user.name}</p>
          </div>
    
        <div className="flex items-center gap-4">
          {user.status === 1 ? (
            <Button
              variant="destructive"
              onClick={handleUpdateStatus}
            >
              <UserX className="h-4 w-4 mr-2" />
              Block User
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleUpdateStatus}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Unblock User
            </Button>
          )}
              <Button variant="outline" onClick={() => navigate("/admin/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
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

        <TabsContent value="overview" className="space-y-8">
  <div className="grid gap-6 md:grid-cols-2">
    {/* Personal Info */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-emerald-600 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.795.604 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Personal Information
      </h3>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-gray-500 font-medium">Full Name</p>
          <p className="text-gray-800">{user.name}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Email</p>
          <p className="text-gray-800">{user.email}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Mobile</p>
          <p className="text-gray-800">{user.mobile || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">User Code</p>
          <p className="text-gray-800">{user.user_code || "N/A"}</p>
        </div>
      </div>
    </div>

    {/* Account Info */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-indigo-600 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 .552.448 1 1 1s1-.448 1-1-.448-1-1-1-1 .448-1 1zm-6 8v-1a2 2 0 012-2h8a2 2 0 012 2v1m-4-4a4 4 0 10-8 0" />
        </svg>
        Account Information
      </h3>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-gray-500 font-medium">User ID</p>
          <p className="text-gray-800">{user.id}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Role</p>
          <p className="capitalize text-gray-800">{user.role}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Status</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              user.status === 1
                ? "bg-emerald-100 text-emerald-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {user.status === 1 ? "Active" : "Inactive"}
          </span>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Created At</p>
          <p className="text-gray-800">{new Date(user.created_at).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Last Login</p>
          <p className="text-gray-800">
            {user.last_login_at
              ? new Date(user.last_login_at).toLocaleString()
              : "Never"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Mobile Verified</p>
          <p className="text-gray-800">
            {user.mobile_verified_at
              ? new Date(user.mobile_verified_at).toLocaleString()
              : "Not Verified"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">2FA Verified</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              user.two_factor_verified === 1
                ? "bg-sky-100 text-sky-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {user.two_factor_verified === 1 ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  </div>
</TabsContent>

      </Tabs>
    </div>
  );
};

export default UserOverview;
