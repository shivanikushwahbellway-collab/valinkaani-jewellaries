import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Copy, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/lib/api/couponController";

interface Coupon {
  id: number;
  coupon_code: string;
  description: string;
  discount_type: "fixed" | "percentage";
  value: number;
  min_order_amount: number;
  usage_limit: number;
  used_count?: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CouponFormData {
  coupon_code: string;
  description: string;
  discount_type: "fixed" | "percentage";
  value: number;
  min_order_amount: number;
  usage_limit: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  [key: string]: string | number | boolean;
}

const CouponManagement = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>({
    coupon_code: "",
    description: "",
    discount_type: "percentage",
    value: 0,
    min_order_amount: 0,
    usage_limit: 0,
    valid_from: "",
    valid_until: "",
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch coupons on component mount and when token changes
  useEffect(() => {
    if (token) {
      fetchCoupons();
    } else {
      setCoupons([]);
      setLoading(false);
    }
  }, [token]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await getCoupons(token!);

      // Ensure we always set an array, even if the response structure is unexpected
      if (Array.isArray(response.data)) {
        setCoupons(response.data);
      } else if (response.data && Array.isArray(response.data.coupons)) {
        setCoupons(response.data.coupons);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCoupons(response.data.data);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch coupons",
        variant: "destructive",
      });
      setCoupons([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setFormData({
      coupon_code: "",
      description: "",
      discount_type: "percentage",
      value: 0,
      min_order_amount: 0,
      usage_limit: 0,
      valid_from: "",
      valid_until: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      coupon_code: coupon.coupon_code || "",
      description: coupon.description || "",
      discount_type: coupon.discount_type || "percentage",
      value: coupon.value || 0,
      min_order_amount: coupon.min_order_amount || 0,
      usage_limit: coupon.usage_limit || 0,
      valid_from: coupon.valid_from || "",
      valid_until: coupon.valid_until || "",
      is_active: coupon.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await deleteCoupon(token!, id);
      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      });
      fetchCoupons();
    } catch (error) {
      // Error handled by toast
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  const toggleCouponStatus = async (coupon: Coupon) => {
    try {
      const updatedData = { ...coupon, is_active: !coupon.is_active };
      await updateCoupon(token!, coupon.id, updatedData);
      toast({
        title: "Success",
        description: `Coupon ${
          updatedData.is_active ? "activated" : "deactivated"
        } successfully`,
      });
      fetchCoupons();
    } catch (error) {
      // Error handled by toast
      toast({
        title: "Error",
        description: "Failed to update coupon status",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    field: keyof CouponFormData,
    value: string | number | boolean
  ) => {
    // Ensure we never set null values
    const safeValue =
      value === null ? (field === "is_active" ? false : "") : value;
    setFormData((prev) => ({
      ...prev,
      [field]: safeValue,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.coupon_code.trim()) {
      toast({
        title: "Validation Error",
        description: "Coupon code is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive",
      });
      return false;
    }
    if (formData.value <= 0) {
      toast({
        title: "Validation Error",
        description: "Value must be greater than 0",
        variant: "destructive",
      });
      return false;
    }
    if (formData.min_order_amount < 0) {
      toast({
        title: "Validation Error",
        description: "Minimum order amount cannot be negative",
        variant: "destructive",
      });
      return false;
    }
    if (formData.usage_limit <= 0) {
      toast({
        title: "Validation Error",
        description: "Usage limit must be greater than 0",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.valid_from) {
      toast({
        title: "Validation Error",
        description: "Valid from date is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.valid_until) {
      toast({
        title: "Validation Error",
        description: "Valid until date is required",
        variant: "destructive",
      });
      return false;
    }
    if (new Date(formData.valid_from) >= new Date(formData.valid_until)) {
      toast({
        title: "Validation Error",
        description: "Valid until date must be after valid from date",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      if (editingCoupon) {
        await updateCoupon(token!, editingCoupon.id, formData);
        toast({
          title: "Success",
          description: "Coupon updated successfully",
        });
      } else {
        await createCoupon(token!, formData);
        toast({
          title: "Success",
          description: "Coupon created successfully",
        });
      }

      setIsDialogOpen(false);
      fetchCoupons();
    } catch (error) {
      // Error handled by toast
      toast({
        title: "Error",
        description: editingCoupon
          ? "Failed to update coupon"
          : "Failed to create coupon",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getCouponStatus = (coupon: Coupon) => {
    const now = new Date();
    const validUntil = new Date(coupon.valid_until);

    if (!coupon.is_active)
      return { label: "Inactive", variant: "secondary" as const };
    if (validUntil < now)
      return { label: "Expired", variant: "destructive" as const };
    if (coupon.used_count && coupon.used_count >= coupon.usage_limit)
      return { label: "Exhausted", variant: "outline" as const };
    return { label: "Active", variant: "default" as const };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="container py-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading coupons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Coupon Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage discount coupons for your store
          </p>
        </div>
        <Button onClick={handleAddCoupon}>
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(coupons) ? coupons.length : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(coupons)
                ? coupons.filter(
                    (c) => c.is_active && new Date(c.valid_until) > new Date()
                  ).length
                : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(coupons)
                ? coupons.reduce((sum, c) => sum + (c.used_count || 0), 0)
                : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(coupons)
                ? coupons.filter((c) => new Date(c.valid_until) < new Date())
                    .length
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>
            Manage your discount codes and promotional offers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!Array.isArray(coupons) || coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {!Array.isArray(coupons)
                ? "Loading..."
                : "No coupons found. Create your first coupon to get started."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => {
                  const status = getCouponStatus(coupon);
                  return (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-medium">
                        <div className="flex items-center space-x-2">
                          <span>{coupon.coupon_code}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(coupon.coupon_code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {coupon.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {coupon.discount_type === "percentage" ? "%" : "₹"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {coupon.discount_type === "percentage"
                          ? `${coupon.value}%`
                          : `₹${coupon.value}`}
                      </TableCell>
                      <TableCell>₹{coupon.min_order_amount}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {coupon.used_count || 0}/{coupon.usage_limit}
                          <div className="w-full bg-secondary rounded-full h-1.5 mt-1">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  ((coupon.used_count || 0) /
                                    coupon.usage_limit) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(coupon.valid_until).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={coupon.is_active}
                            onCheckedChange={() => toggleCouponStatus(coupon)}
                          />
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCoupon(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </DialogTitle>
            <DialogDescription>
              {editingCoupon
                ? "Update coupon details"
                : "Create a new discount coupon"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coupon_code">Coupon Code *</Label>
                <Input
                  id="coupon_code"
                  placeholder="WELCOME60"
                  value={formData.coupon_code || ""}
                  onChange={(e) =>
                    handleInputChange("coupon_code", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="discount_type">Discount Type *</Label>
                <Select
                  value={formData.discount_type || "percentage"}
                  onValueChange={(value) =>
                    handleInputChange(
                      "discount_type",
                      value as "fixed" | "percentage"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Flat 50 discount for new users"
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder={
                    formData.discount_type === "percentage" ? "10" : "500"
                  }
                  value={formData.value || 0}
                  onChange={(e) =>
                    handleInputChange("value", parseFloat(e.target.value) || 0)
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.discount_type === "percentage"
                    ? "Enter percentage (e.g., 10 for 10%)"
                    : "Enter amount in ₹"}
                </p>
              </div>
              <div>
                <Label htmlFor="min_order_amount">Min Order Amount *</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  placeholder="200"
                  value={formData.min_order_amount || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "min_order_amount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usage_limit">Usage Limit *</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  placeholder="100"
                  value={formData.usage_limit || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "usage_limit",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    handleInputChange("is_active", checked)
                  }
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valid_from">Valid From *</Label>
                <Input
                  id="valid_from"
                  type="date"
                  value={formData.valid_from || ""}
                  onChange={(e) =>
                    handleInputChange("valid_from", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="valid_until">Valid Until *</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until || ""}
                  onChange={(e) =>
                    handleInputChange("valid_until", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingCoupon ? "Update" : "Create"} Coupon
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponManagement;
