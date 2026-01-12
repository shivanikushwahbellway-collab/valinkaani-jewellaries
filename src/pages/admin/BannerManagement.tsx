import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Edit, Trash2, Loader2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/config";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/lib/api/bannerController";
import type { Banner, BannerPayload } from "@/lib/api/bannerController";

const BannerManagement = () => {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<BannerPayload>({
    image: "",
    title: "",
    description: "",
    position: "top",
    status: true,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [bannerToView, setBannerToView] = useState<Banner | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        if (!token) {
          setBanners([]);
          setLoading(false);
          return;
        }
        const data = await getBanners(token);
        if (Array.isArray(data)) {
          setBanners(data as Banner[]);
        } else if (data && Array.isArray(data.banners)) {
          setBanners(data.banners as Banner[]);
        } else if (data && Array.isArray(data.data)) {
          setBanners(data.data as Banner[]);
        } else {
          setBanners([]);
        }
      } catch (error) {
        console.error("Failed to fetch banners", error);
        toast({
          title: "Error",
          description: "Failed to fetch banners",
          variant: "destructive",
        });
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const handleAddBanner = () => {
    setEditingBanner(null);
    setFormData({
      image: "",
      title: "",
      description: "",
      position: "top",
      status: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      image: (banner as any).imageUrl || banner.image || "",
      title: banner.title || "",
      description: banner.description || "",
      position:
        (banner as any).position?.toString?.() ||
        (banner.position as any) ||
        "top",
      status: (banner as any).isActive ?? banner.status ?? true,
    });
    setIsDialogOpen(true);
  };

  const requestDeleteBanner = (banner: Banner) => {
    setBannerToDelete(banner);
    setConfirmOpen(true);
  };

  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;
    try {
      if (!token) return;
      await deleteBanner(token, bannerToDelete.id);
      toast({ title: "Deleted", description: "Banner deleted successfully" });
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete.id));
    } catch (error) {
      console.error("Failed to delete banner", error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    } finally {
      setConfirmOpen(false);
      setBannerToDelete(null);
    }
  };

  const openViewBanner = (banner: Banner) => {
    setBannerToView(banner);
    setViewOpen(true);
  };

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      const nextStatus =
        !(banner as any).isActive && banner.status === undefined
          ? true
          : !(banner.status ?? (banner as any).isActive);
      const payload: BannerPayload = {
        image: (banner as any).imageUrl || banner.image,
        title: banner.title,
        description: banner.description,
        position:
          (banner as any).position?.toString?.() ||
          (banner.position as any) ||
          "top",
        status: nextStatus,
      };
      if (!token) return;
      await updateBanner(token, banner.id, payload);
      toast({
        title: "Updated",
        description: `Banner ${nextStatus ? "activated" : "deactivated"}`,
      });
      setBanners((prev) =>
        prev.map((b) =>
          b.id === banner.id ? ({ ...b, status: nextStatus } as Banner) : b
        )
      );
    } catch (error) {
      console.error("Failed to update banner status", error);
      toast({
        title: "Error",
        description: "Failed to update banner status",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    field: keyof BannerPayload,
    value: string | boolean | File
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));
  };

  const handleImageFileChange = (fileList: FileList | null) => {
    const file = fileList && fileList.length > 0 ? fileList[0] : null;
    setFormData((prev) => ({ ...prev, image: (file as any) || "" }));
  };

  const validateForm = () => {
    // Require image only when creating; while editing image is optional
    if (!editingBanner) {
      const hasImage =
        typeof formData.image === "string"
          ? formData.image.trim().length > 0
          : formData.image instanceof File;
      if (!hasImage) {
        toast({
          title: "Validation",
          description: "Banner image is required",
          variant: "destructive",
        });
        return false;
      }
    }
    if (!formData.title.trim()) {
      toast({
        title: "Validation",
        description: "Title is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Validation",
        description: "Description is required",
        variant: "destructive",
      });
      return false;
    }
    if (!String(formData.position ?? "").trim()) {
      toast({
        title: "Validation",
        description: "Position is required",
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
      if (!token) return;
      if (editingBanner) {
        await updateBanner(token, editingBanner.id, formData);
        toast({ title: "Success", description: "Banner updated successfully" });
      } else {
        await createBanner(token, formData);
        toast({ title: "Success", description: "Banner created successfully" });
      }
      // Refresh list
      try {
        const data = await getBanners(token);
        setBanners(
          Array.isArray(data) ? data : data?.banners || data?.data || []
        );
      } catch {}
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save banner", error);
      toast({
        title: "Error",
        description: editingBanner
          ? "Failed to update banner"
          : "Failed to create banner",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading banners...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Banner Management
          </h1>
          <p className="text-muted-foreground">
            Manage homepage banners and promotional content
          </p>
        </div>
        <Button onClick={handleAddBanner}>
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <Card className="mt-6"> 
        <CardHeader>
          <CardTitle>Active Banners</CardTitle>
          <CardDescription>
            Manage your homepage banners and promotional content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!Array.isArray(banners) || banners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No banners found. Create your first banner.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <img
                        src={getImageUrl((banner as any).imageUrl || (banner as any).image)}
                        alt={banner.title}
                        className="w-16 h-10 object-cover rounded cursor-pointer"
                        onClick={() => openViewBanner(banner)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {banner.title}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {banner.description}
                    </TableCell>
                    <TableCell>
                      {(banner as any).position?.toString?.() ||
                        (banner.position as any)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={(banner as any).isActive ?? banner.status}
                          onCheckedChange={() => toggleBannerStatus(banner)}
                        />
                        <Badge
                          variant={
                            (banner as any).isActive ?? banner.status
                              ? "default"
                              : "secondary"
                          }
                        >
                          {(banner as any).isActive ?? banner.status
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{banner.createdAt || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBanner(banner)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewBanner(banner)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => requestDeleteBanner(banner)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </DialogTitle>
            <DialogDescription>
              {editingBanner
                ? "Update banner details"
                : "Create a new promotional banner"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Banner title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Banner description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="position">Display Position (number)</Label>
              <Input
                id="position"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="1"
                value={String(formData.position ?? "")}
                onChange={(e) => {
                  const raw = e.target.value;
                  // allow empty during typing; otherwise keep only digits
                  const digitsOnly = raw.replace(/\D+/g, "");
                  setFormData((prev) => ({ ...prev, position: digitsOnly } as any));
                }}
              />
            </div>
            <div>
              <Label htmlFor="image">Banner Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileChange(e.target.files)}
              />
              {typeof formData.image === "string" && formData.image && (
                <p className="text-xs text-muted-foreground mt-1">Using existing image URL</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={
                  typeof formData.status === "boolean"
                    ? formData.status
                    : typeof formData.status === "number"
                    ? formData.status === 1
                    : String(formData.status).toLowerCase() === "1" ||
                      String(formData.status).toLowerCase() === "true"
                }
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, status: checked }))
                }
              />
              <Label htmlFor="status">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
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
                {editingBanner ? "Update" : "Create"} Banner
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>View Banner</DialogTitle>
            <DialogDescription>{bannerToView?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {bannerToView && (
              <img
                src={getImageUrl((bannerToView as any).imageUrl || (bannerToView as any).image)}
                alt={bannerToView.title}
                className="w-full h-auto rounded"
              />
            )}
            {bannerToView?.description && (
              <p className="text-sm text-muted-foreground">
                {bannerToView.description}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              banner
              {bannerToDelete ? ` "${bannerToDelete.title}"` : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBanner}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BannerManagement;
