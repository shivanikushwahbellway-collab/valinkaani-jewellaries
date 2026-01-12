import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Package, User, Mail, Phone, Calendar, FileImage, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/config";
import { getCustomOrderById, updateCustomOrderStatus, type AdminCustomOrder } from "@/lib/api/adminCustomOrderController";

const CustomOrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();

  const [order, setOrder] = useState<AdminCustomOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  const statusOptions = useMemo(
    () => [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
      { value: "in_progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
    []
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100/70 text-yellow-800 hover:bg-yellow-200";
      case "approved":
        return "bg-blue-100/70 text-blue-800 hover:bg-blue-200";
      case "rejected":
        return "bg-red-100/70 text-red-800 hover:bg-red-200";
      case "in_progress":
        return "bg-purple-100/70 text-purple-800 hover:bg-purple-200";
      case "completed":
        return "bg-green-100/70 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100/70 text-gray-800 hover:bg-gray-200";
    }
  };

  const images = useMemo(() => {
    if (!order?.design_image) return [];
    try {
      const parsed = JSON.parse(order.design_image);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [order.design_image];
    }
  }, [order]);

  const fetchDetails = async () => {
    if (!token || !orderId) return;
    setLoading(true);
    try {
      const res = await getCustomOrderById(token, Number(orderId));
      if (res.status) {
        setOrder(res.data);
        setNewStatus(res.data.status);
      } else {
        toast({ title: "Error", description: "Custom order not found", variant: "destructive" });
        navigate(-1);
      }
    } catch (err: any) {
      console.error("Custom order fetch error:", err);
      toast({ title: "Error", description: "Failed to load custom order", variant: "destructive" });
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!token || !order || !newStatus) return;
    try {
      setUpdating(true);
      const res = await updateCustomOrderStatus(token, order.id, { status: newStatus });
      if (res.status) {
        setOrder(res.data);
        toast({ title: "Updated", description: "Status updated successfully" });
      } else {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
      }
    } catch (err: any) {
      console.error("Update status error:", err);
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to update status", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Custom Order Details</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Custom Order Details</h1>
            <p className="text-muted-foreground">Order not found</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">No data</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Custom Order #{order.id}</h1>
          <p className="text-muted-foreground">View and manage custom jewelry order</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Information
                </CardTitle>
                <CardDescription>Specifications and current status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("_", " ")}
                  </Badge>
                  {order.price ? (
                    <span className="text-sm font-semibold">₹{Number(order.price).toLocaleString("en-IN")}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not quoted</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <div className="font-medium">{order.category?.name || "—"}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Metal</Label>
                    <div className="font-medium">{order.metal}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Purity</Label>
                    <div className="font-medium">{order.purity}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Size</Label>
                    <div className="font-medium">{order.size}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Weight</Label>
                    <div className="font-medium">{order.weight}g</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Created</Label>
                    <div className="font-medium">{new Date(order.created_at).toLocaleString()}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Updated</Label>
                    <div className="font-medium">{new Date(order.updated_at).toLocaleString()}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <div className="mt-1 text-sm">{order.description}</div>
                </div>
                {order.note ? (
                  <div>
                    <Label className="text-xs text-muted-foreground">Special Instructions</Label>
                    <div className="mt-1 text-sm bg-amber-50 rounded p-3">{order.note}</div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer
                </CardTitle>
                <CardDescription>Contact and profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <div className="font-medium">{order.customer?.name || "—"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.customer?.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.customer?.mobile || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">User Code: {order.customer?.user_code || "—"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Change the custom order lifecycle status</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleUpdateStatus} disabled={updating || newStatus === order.status}>
                {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                Update
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Uploaded Design Images
              </CardTitle>
              <CardDescription>Customer-provided references</CardDescription>
            </CardHeader>
            <CardContent>
              {images.length ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border">
                      <img src={getImageUrl(img)} alt={`Design ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-12">No images uploaded</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
              <CardDescription>Key dates and updates</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Created at: {new Date(order.created_at).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Updated at: {new Date(order.updated_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomOrderDetails;


