import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserList, updateUserStatus, type AdminUser } from "@/lib/api/adminUserController";
import { UserX, UserCheck } from "lucide-react";

const UserManagement = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getUserList(token);
      if (response.status) {
        setUsers(response.data);
      } else {
        setError(response.message || "Failed to load users");
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load users");
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getStatusColor = (status: number) => {
    return status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.mobile && user.mobile.includes(searchTerm)) ||
      (user.user_code && user.user_code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" && user.status === 1) || (statusFilter === "inactive" && user.status === 0);
    return matchesSearch && matchesStatus;
  });

  const activeUsers = users.filter((u) => u.status === 1).length;
  const inactiveUsers = users.filter((u) => u.status === 0).length;
  const totalOrders = users.reduce((sum, u) => sum + (u.orders?.length || 0), 0);

  const handleViewUser = (userId: number) => {
    navigate(`/admin/users/${userId}/overview`);
  };

  const handleUpdateStatus = async (userId: number, currentStatus: number) => {
    if (!token) return;
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const response = await updateUserStatus(token, userId, { status: newStatus });
      if (response.status) {
        toast({
          title: "Success",
          description: response.message || "User status updated successfully",
        });
        // Update the user in the list
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage customer accounts and profiles</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">All Users</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name, email, phone, user code..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* User Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{activeUsers}</div>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{inactiveUsers}</div>
                <p className="text-xs text-muted-foreground">Inactive Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Manage customer accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-2">{error}</p>
                  <Button variant="outline" onClick={fetchUsers}>Retry</Button>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                      <TableHead>User Code</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Joined {new Date(user.created_at).toLocaleDateString()}
                              </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{user.email}</div>
                              <div className="text-muted-foreground">{user.mobile || "N/A"}</div>
                        </div>
                      </TableCell>
                          <TableCell>{user.user_code || "N/A"}</TableCell>
                          <TableCell>{user.orders?.length || 0}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                              {user.status === 1 ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                            {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewUser(user.id)}
                              >
                              <Eye className="h-4 w-4" />
                            </Button>
                              {user.status === 1 ? (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(user.id, user.status)}
                                  title="Block User"
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(user.id, user.status)}
                                  title="Unblock User"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <p className="text-muted-foreground">No users found</p>
                      </TableCell>
                    </TableRow>
                    )}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
