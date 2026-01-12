// import { useEffect, useRef, useState } from "react";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Plus, Search, Edit, Trash2, Upload } from "lucide-react";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//     DialogClose,
// } from "@/components/ui/dialog";
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Textarea } from "@/components/ui/textarea";
// import {
//     getProducts,
//     createProduct,
//     getProductById,
//     updateProduct,
//     deleteProduct,
//     bulkUpdateProductPrices,
//     bulkUpdateProductStatus,
// } from "@/lib/api/productController";
// import {
//     getCategories,
//     createCategory,
//     getCategoryById,
//     updateCategory,
//     deleteCategory as deleteCategoryApi,
// } from "@/lib/api/categoriesController";

// import {
//     getCollections,
//     createCollection,
//     getCollectionById,
//     updateCollection,
//     deleteCollection as deleteCollectionApi,
// } from "@/lib/api/collectionsController";

// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import { API_BASE_URL, getImageUrl } from "@/config";
// const ProductManagement = () => {
//     const { toast } = useToast();
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("all");
//     const [selectedCollection, setSelectedCollection] = useState("all");

//     // Search and filter states for categories and collections
//     const [categorySearchTerm, setCategorySearchTerm] = useState("");
//     const [collectionSearchTerm, setCollectionSearchTerm] = useState("");
//     const [categories, setCategories] = useState([]);
//     const [collections, setCollections] = useState([]);
//     const [products, setProducts] = useState<any[]>([]);
//     const { token } = useAuth();
//     const [name, setName] = useState("");
//     const [categoryId, setCategoryId] = useState("");
//     const [collectionId, setCollectionId] = useState("");
//     const [purity, setPurity] = useState("");
//     const [metalType, setMetalType] = useState("Gold");
//     const [weight, setWeight] = useState("");
//     const [makingPercentage, setMakingPercentage] = useState("");
//     const [price, setPrice] = useState("");
//     const [stock, setStock] = useState("");
//     const [sizes, setSizes] = useState<{ size: string; quantity: number }[]>([]);

//     const [images, setImages] = useState<File[]>([]);
//     const [isDragging, setIsDragging] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement | null>(null);
//     const editFileInputRef = useRef<HTMLInputElement | null>(null);
//     // Edit product state
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [editingProductId, setEditingProductId] = useState<number | null>(null);
//     const [editName, setEditName] = useState("");
//     const [editCategoryId, setEditCategoryId] = useState("");
//     const [editCollectionId, setEditCollectionId] = useState("");
//     const [editPurity, setEditPurity] = useState("");
//     const [editMetalType, setEditMetalType] = useState("Gold");
//     const [editWeight, setEditWeight] = useState("");
//     const [editMakingPercentage, setEditMakingPercentage] = useState("");
//     const [editPrice, setEditPrice] = useState("");
//     const [editStock, setEditStock] = useState("");
//     const [editSizes, setEditSizes] = useState<{ size: string; quantity: number }[]>([]);
//     const [editStatusActive, setEditStatusActive] = useState(false);
//     const [editImageUrl, setEditImageUrl] = useState<string>("");
//     const [editImageUrls, setEditImageUrls] = useState<string[]>([]);
//     const [editImages, setEditImages] = useState<File[]>([]);

//     // Bulk price update state
//     const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
//     const [selectedProductIds, setSelectedProductIds] = useState<
//         (number | string)[]
//     >([]);
//     const [bulkPrices, setBulkPrices] = useState<Record<string, string>>({});
//     const [bulkApplyAll, setBulkApplyAll] = useState<string>("");
//     const [bulkSubmitting, setBulkSubmitting] = useState(false);

//     // Bulk status update state
//     const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false);
//     const [bulkStatuses, setBulkStatuses] = useState<Record<string, string>>({});
//     const [bulkStatusApplyAll, setBulkStatusApplyAll] = useState<string>("");
//     const [bulkStatusSubmitting, setBulkStatusSubmitting] = useState(false);

//     const MAX_CREATE_IMAGES = 5;
//     const MAX_EDIT_IMAGES = 5;

//     // Category CRUD state
//     const [categoryCreateOpen, setCategoryCreateOpen] = useState(false);
//     const [categoryEditOpen, setCategoryEditOpen] = useState(false);
//     const [newCategoryName, setNewCategoryName] = useState("");
//     const [newCategoryDescription, setNewCategoryDescription] = useState("");
//     const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
//     const [categoryEditId, setCategoryEditId] = useState<number | null>(null);
//     const [categoryEditName, setCategoryEditName] = useState("");
//     const [categoryEditDescription, setCategoryEditDescription] = useState("");
//     const [categoryEditImage, setCategoryEditImage] = useState<File | null>(null);
//     const categoryCreateFileRef = useRef<HTMLInputElement | null>(null);
//     const categoryEditFileRef = useRef<HTMLInputElement | null>(null);

//     // Collection CRUD state
//     const [collectionCreateOpen, setCollectionCreateOpen] = useState(false);
//     const [collectionEditOpen, setCollectionEditOpen] = useState(false);
//     const [newCollectionName, setNewCollectionName] = useState("");
//     const [newCollectionDescription, setNewCollectionDescription] = useState("");
//     const [newCollectionImage, setNewCollectionImage] = useState<File | null>(null);
//     const [collectionEditId, setCollectionEditId] = useState<number | null>(null);
//     const [collectionEditName, setCollectionEditName] = useState("");
//     const [collectionEditDescription, setCollectionEditDescription] = useState("");
//     const [collectionEditImage, setCollectionEditImage] = useState<File | null>(null);
//     const collectionCreateFileRef = useRef<HTMLInputElement | null>(null);
//     const collectionEditFileRef = useRef<HTMLInputElement | null>(null);

//     // Edit modal shows only editable fields; no image state for edit
//     const normalizePurity = (value: unknown): string => {
//         if (value === null || value === undefined) return "";
//         const raw = String(value).trim();
//         const lower = raw.toLowerCase();
//         if (["24k", "22k", "18k", "925"].includes(lower)) return lower;
//         if (lower.includes("925")) return "925";
//         const match = lower.match(/(\d{2,3})/);
//         if (match) {
//             const num = match[1];
//             if (num === "24") return "24k";
//             if (num === "22") return "22k";
//             if (num === "18") return "18k";

//         }
//         return "";
//     };

//     useEffect(() => {
//         if (!token) return;
//         getProducts(token)
//             .then((response) => {
//                 const data = (response?.data?.data ?? []) as any[];
//                 setProducts(Array.isArray(data) ? data : []);
//             })
//             .catch(() => setProducts([]));

//         getCategories(token)
//             .then((response) => {
//                 setCategories(response.data.data);
//             })
//         getCollections(token)
//             .then((response) => {
//                 setCollections(response.data.data);
//             })

//             .catch(() => { });
//     }, [token]);

//     const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!token) return;
//         const jsonPayload = {
//             name,
//             category_id: categoryId,
//             collection_id: collectionId,
//             purity,
//             metal_type: metalType,
//             weight: weight ? Number(weight) : undefined,
//             making_charges: makingPercentage ? Number(makingPercentage) : undefined,
//             sizes: sizes.length ? JSON.stringify(sizes.filter(s => s.size)) : undefined,
//         };
//         try {
//             let payload: Record<string, unknown> | FormData = jsonPayload;
//             if (images.length > 0) {
//                 const formData = new FormData();
//                 formData.append("name", name);
//                 formData.append("category_id", categoryId);
//                 formData.append("collection_id", collectionId);
//                 formData.append("metal_type", metalType);
//                 if (purity) formData.append("purity", purity.toUpperCase());
//                 if (weight) formData.append("weight", String(Number(weight)));
//                 if (makingPercentage)
//                     formData.append("making_percentage", String(Number(makingPercentage)));
//                 if (sizes.length)
//                     formData.append("sizes", JSON.stringify(sizes.filter(s => s.size)));
//                 images.forEach((file) => {
//                     formData.append("image[]", file, file.name);
//                 });
//                 payload = formData;
//             }
//             await createProduct(token, payload);
//             toast({
//                 title: "Success",
//                 description: "Product added successfully",
//                 variant: "success",
//             });
//             const refreshed = await getProducts(token);
//             const data = (refreshed?.data?.data ?? []) as any[];
//             setProducts(Array.isArray(data) ? data : []);
//             // reset form
//             setName("");
//             setCategoryId("");
//             setCollectionId("");
//             setPurity("");
//             setWeight("");
//             setMakingPercentage("");
//             setPrice("");
//             setStock("");

//             setImages([]);
//         } catch (error) {
//             // Error handled by toast
//         }
//     };

//     const openEditDialogForProduct = async (product: any) => {
//         try {
//             if (!token) return;
//             const id = product?.id;
//             if (!id) return;
//             const response = await getProductById(token, id);
//             const details = response?.data?.data ?? {};
//             const categoryIdFromProduct =
//                 details?.category_id ?? details?.category?.id ?? "";
//             setEditingProductId(details?.id ?? id);
//             setEditName(details?.name ?? "");
//             setEditCategoryId(
//                 categoryIdFromProduct ? String(categoryIdFromProduct) : ""
//             );
//             const collectionIdFromProduct =
//                 details?.collection_id ?? details?.collection?.id ?? "";
//             setEditCollectionId(
//                 collectionIdFromProduct ? String(collectionIdFromProduct) : ""
//             );
//             const normalizedPurity = normalizePurity(
//                 details?.purity ?? details?.karat ?? ""
//             );
//             setEditPurity(normalizedPurity);
//             setEditMetalType(details?.metal_type || details?.metal || "Gold");
//             setEditWeight(
//                 details?.weight !== undefined && details?.weight !== null
//                     ? String(details.weight)
//                     : ""
//             );
//             setEditMakingPercentage(
//                 details?.making_percentage !== undefined &&
//                     details?.making_percentage !== null
//                     ? String(details.making_percentage)
//                     : ""
//             );
//             setEditPrice(
//                 details?.price !== undefined && details?.price !== null
//                     ? String(details.price)
//                     : ""
//             );
//             setEditStock(
//                 details?.stock !== undefined && details?.stock !== null
//                     ? String(details.stock)
//                     : ""
//             );
//             // sizes
//             try {
//                 const rawSizes = (details as any)?.sizes;
//                 let parsed: { size: string; quantity: number }[] = [];
//                 if (Array.isArray(rawSizes)) parsed = rawSizes as any;
//                 else if (typeof rawSizes === "string" && rawSizes.trim().startsWith("[")) parsed = JSON.parse(rawSizes);
//                 setEditSizes(parsed.filter((s) => s && s.size !== undefined));
//             } catch {
//                 setEditSizes([]);
//             }
//             const statusVal = details?.status;
//             setEditStatusActive(
//                 statusVal === 1 || statusVal === "1" || statusVal === true
//             );
//             const imgField: unknown =
//                 (details && (details.image_url ?? details.image)) ??
//                 (details && details.images) ??
//                 "";
//             let urls: string[] = [];
//             try {
//                 if (Array.isArray(imgField)) {
//                     urls = (imgField as any[])
//                         .map((x) => (typeof x === "string" ? x : x?.url ?? ""))
//                         .filter(Boolean);
//                 } else if (typeof imgField === "string") {
//                     if (imgField.trim().startsWith("[")) {
//                         const parsed = JSON.parse(imgField);
//                         if (Array.isArray(parsed)) {
//                             urls = parsed.filter((x: any) => typeof x === "string");
//                         }
//                     } else if (imgField) {
//                         urls = [imgField];
//                     }
//                 }
//             } catch { }
//             setEditImageUrls(urls);
//             setEditImageUrl(urls[0] ?? "");
//             setEditImages([]);
//             setEditDialogOpen(true);
//         } catch (err) {
//             // fallback to opening with whatever we have
//             const categoryIdFromProduct =
//                 product?.category_id ?? product?.category?.id ?? "";
//             setEditingProductId(product?.id ?? null);
//             setEditName(product?.name ?? "");
//             setEditCategoryId(
//                 categoryIdFromProduct ? String(categoryIdFromProduct) : ""
//             );
//             const collectionIdFromProduct =
//                 product?.collection_id ?? product?.collection?.id ?? "";
//             setEditCollectionId(
//                 collectionIdFromProduct ? String(collectionIdFromProduct) : ""
//             );
//             const normalizedPurity = normalizePurity(
//                 product?.purity ?? product?.karat ?? ""
//             );
//             setEditPurity(normalizedPurity);
//             setEditMetalType(product?.metal_type || product?.metal || "Gold");
//             setEditWeight(
//                 product?.weight !== undefined && product?.weight !== null
//                     ? String(product.weight)
//                     : ""
//             );
//             setEditMakingPercentage(
//                 product?.making_percentage !== undefined &&
//                     product?.making_percentage !== null
//                     ? String(product.making_percentage)
//                     : ""
//             );
//             setEditPrice(
//                 product?.price !== undefined && product?.price !== null
//                     ? String(product.price)
//                     : ""
//             );
//             setEditStock(
//                 product?.stock !== undefined && product?.stock !== null
//                     ? String(product.stock)
//                     : ""
//             );
//             const statusVal = product?.status;
//             setEditStatusActive(
//                 statusVal === 1 || statusVal === "1" || statusVal === true
//             );
//             const imgField: unknown =
//                 product?.image_url ?? product?.image ?? product?.images ?? "";
//             let urls: string[] = [];
//             try {
//                 if (Array.isArray(imgField)) {
//                     urls = (imgField as any[])
//                         .map((x) => (typeof x === "string" ? x : x?.url ?? ""))
//                         .filter(Boolean);
//                 } else if (typeof imgField === "string") {
//                     if (imgField.trim().startsWith("[")) {
//                         const parsed = JSON.parse(imgField);
//                         if (Array.isArray(parsed)) {
//                             urls = parsed.filter((x: any) => typeof x === "string");
//                         }
//                     } else if (imgField) {
//                         urls = [imgField];
//                     }
//                 }
//             } catch { }
//             setEditImageUrls(urls);
//             setEditImageUrl(urls[0] ?? "");
//             setEditImages([]);
//             setEditDialogOpen(true);
//         }
//     };

//     const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!token || !editingProductId) return;
//         const jsonPayload = {
//             name: editName,
//             category_id: editCategoryId ? Number(editCategoryId) : undefined,
//             collection_id: editCollectionId ? Number(editCollectionId) : undefined,
//             purity: editPurity ? editPurity.toUpperCase() : undefined,
//             metal_type: editMetalType,
//             weight: editWeight ? Number(editWeight) : undefined,
//             making_percentage: editMakingPercentage ? Number(editMakingPercentage) : undefined,
//             status: editStatusActive ? 1 : 0,
//             sizes: editSizes.length ? JSON.stringify(editSizes.filter(s => s.size)) : undefined,
//         };
//         try {
//             let payload: Record<string, unknown> | FormData = jsonPayload;
//             if (editImages.length > 0) {
//                 const formData = new FormData();
//                 formData.append("name", editName);
//                 if (editCategoryId)
//                     formData.append("category_id", String(Number(editCategoryId)));
//                 if (editCollectionId)
//                     formData.append("collection_id", String(Number(editCollectionId)));
//                 formData.append("metal_type", editMetalType);
//                 if (editPurity) formData.append("purity", editPurity.toUpperCase());
//                 if (editWeight) formData.append("weight", String(Number(editWeight)));
//                 if (editMakingPercentage)
//                     formData.append(
//                         "making_charges",
//                         String(Number(editMakingPercentage))
//                     );
//                 formData.append("status", editStatusActive ? "1" : "0");
//                 if (editSizes.length)
//                     formData.append("sizes", JSON.stringify(editSizes.filter(s => s.size)));
//                 editImages.forEach((file) => {
//                     formData.append("image[]", file, file.name);
//                 });
//                 payload = formData;
//             }
//             await updateProduct(token, editingProductId, payload);
//             toast({
//                 title: "Success",
//                 description: "Product updated successfully",
//                 variant: "success",
//             });
//             const refreshed = await getProducts(token);
//             const data = (refreshed?.data?.data ?? []) as any[];
//             setProducts(Array.isArray(data) ? data : []);
//             setEditDialogOpen(false);
//         } catch (error) {
//             // Error handled by toast
//         }
//     };

//     const handleDeleteProduct = async (id: number) => {
//         if (!token) return;
//         await deleteProduct(token, id);
//         toast({
//             title: "Success",
//             description: "Product deleted successfully",
//             variant: "success",
//         });
//         const refreshed = await getProducts(token);
//         const data = (refreshed?.data?.data ?? []) as any[];
//         setProducts(Array.isArray(data) ? data : []);
//     };
//     // Category handlers
//     const refreshCategories = async () => {
//         if (!token) return;
//         const response = await getCategories(token);
//         setCategories(response.data.data ?? []);
//     };

//     const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!token) return;
//         try {
//             const name = newCategoryName.trim();
//             if (!name) return;
//             const form = new FormData();
//             form.append("name", name);
//             if (newCategoryDescription.trim()) {
//                 form.append("description", newCategoryDescription.trim());
//             }
//             if (newCategoryImage) {
//                 form.append("image", newCategoryImage, newCategoryImage.name);
//             }
//             await createCategory(token, form);
//             toast({
//                 title: "Success",
//                 description: "Category created successfully",
//                 variant: "success",
//             });
//             await refreshCategories();
//             setCategoryCreateOpen(false);
//             setNewCategoryName("");
//             setNewCategoryDescription("");
//             setNewCategoryImage(null);
//         } catch (error) {
//             // eslint-disable-next-line no-console
//             console.error(error);
//             toast({
//                 title: "Error",
//                 description: "Failed to create category",
//                 variant: "destructive",
//             });
//         }
//     };

//     const openEditCategory = async (id: number) => {
//         if (!token) return;
//         setCategoryEditId(id);
//         try {
//             const response = await getCategoryById(token, id);
//             const data = response?.data?.data;
//             setCategoryEditName(data?.name ?? "");
//             setCategoryEditDescription(data?.description ?? "");
//             // Keep existing image visible by not clearing unless user selects a new one
//         } catch (error) {
//             const fallback = (categories as any[]).find((c) => c?.id === id);
//             setCategoryEditName(fallback?.name ?? "");
//             setCategoryEditDescription(fallback?.description ?? "");
//         }
//         setCategoryEditOpen(true);
//     };

//     const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!token || !categoryEditId) return;
//         try {
//             const name = categoryEditName.trim();
//             if (!name) return;
//             const maybeForm = new FormData();
//             maybeForm.append("name", name);
//             if (categoryEditDescription.trim()) {
//                 maybeForm.append("description", categoryEditDescription.trim());
//             }
//             if (categoryEditImage) {
//                 maybeForm.append("image", categoryEditImage, categoryEditImage.name);
//             }
//             await updateCategory(token, categoryEditId, maybeForm);
//             toast({
//                 title: "Success",
//                 description: "Category updated successfully",
//                 variant: "success",
//             });
//             await refreshCategories();
//             setCategoryEditOpen(false);
//             setCategoryEditId(null);
//             setCategoryEditName("");
//             setCategoryEditDescription("");
//             setCategoryEditImage(null);
//         } catch (error) {
//             // eslint-disable-next-line no-console
//             console.error(error);
//             toast({
//                 title: "Error",
//                 description: "Failed to update category",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleDeleteCategory = async (id: number) => {
//         if (!token) return;
//         try {
//             await deleteCategoryApi(token, id);
//             toast({
//                 title: "Success",
//                 description: "Category deleted successfully",
//                 variant: "success",
//             });
//             await refreshCategories();
//         } catch (error) {
//             // eslint-disable-next-line no-console
//             console.error(error);
//             toast({
//                 title: "Error",
//                 description: "Failed to delete category",
//                 variant: "destructive",
//             });
//         }
//     };
//     // Collections handlers
//     const refreshCollections = async () => {
//         if (!token) return;
//         const response = await getCollections(token);
//         setCollections(response.data.data ?? []);
//     };

//     const handleCreateCollection = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!token) return;
//         try {
//             const name = newCollectionName.trim();
//             if (!name) return;
//             const form = new FormData();
//             form.append("name", name);
//             if (newCollectionDescription.trim()) {
//                 form.append("description", newCollectionDescription.trim());
//             }
//             if (newCollectionImage) {
//                 form.append("image", newCollectionImage, newCollectionImage.name);
//             }
//             await createCollection(token, form);
//             toast({
//                 title: "Success",
//                 description: "Collection created successfully",
//                 variant: "success",
//             });
//             await refreshCollections();
//             setCollectionCreateOpen(false);
//             setNewCollectionName("");
//             setNewCollectionDescription("");
//             setNewCollectionImage(null);
//         } catch (error) {
//             // eslint-disable-next-line no-console
//             console.error(error);
//             toast({
//                 title: "Error",
//                 description: "Failed to create collection",
//                 variant: "destructive",
//             });
//         }
//     };

//     const openEditCollection = async (id: number) => {
//         if (!token) return;
//         setCollectionEditId(id);
//         try {
//             const response = await getCollectionById(token, id);
//             const data = response?.data?.data;
//             setCollectionEditName(data?.name ?? "");
//             setCollectionEditDescription(data?.description ?? "");
//             // Keep existing image visible by not clearing unless user selects a new one
//         } catch (error) {
//             const fallback = (collections as any[]).find((c) => c?.id === id);
//             setCollectionEditName(fallback?.name ?? "");
//         }
//         setCollectionEditOpen(true);
//     };

//     const handleUpdateCollection = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!token || !collectionEditId) return;
//         try {
//             const name = collectionEditName.trim();
//             if (!name) return;
//             const maybeForm = new FormData();
//             maybeForm.append("name", name);
//             if (collectionEditDescription.trim()) {
//                 maybeForm.append("description", collectionEditDescription.trim());
//             }
//             if (collectionEditImage) {
//                 maybeForm.append("image", collectionEditImage, collectionEditImage.name);
//             }
//             await updateCollection(token, collectionEditId, maybeForm);
//             toast({
//                 title: "Success",
//                 description: "Collection updated successfully",
//                 variant: "success",
//             });
//             await refreshCollections();
//             setCollectionEditOpen(false);
//             setCollectionEditId(null);
//             setCollectionEditName("");
//             setCollectionEditDescription("");
//             setCollectionEditImage(null);
//         } catch (error) {
//             // eslint-disable-next-line no-console
//             console.error(error);
//             toast({
//                 title: "Error",
//                 description: "Failed to update collection",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleDeleteCollection = async (id: number) => {
//         if (!token) return;
//         try {
//             await deleteCollectionApi(token, id);
//             toast({
//                 title: "Success",
//                 description: "Collection deleted successfully",
//                 variant: "success",
//             });
//             await refreshCollections();
//         } catch (error) {
//             // eslint-disable-next-line no-console
//             console.error(error);
//             toast({
//                 title: "Error",
//                 description: "Failed to delete collection",
//                 variant: "destructive",
//             });
//         }
//     };

//     return (
//         <div className="p-6 ">

//             <div className="flex items-center justify-between mb-6">

//                 <div>
//                     <h1 className="text-3xl font-bold">Product Management</h1>
//                     <p className="text-muted-foreground">Manage your jewelry inventory</p>
//                 </div>

//                 {/* add product modal   */}
//                 <Dialog>

//                     <DialogTrigger asChild>
//                         <Button>
//                             <Plus className="mr-2 h-4 w-4" />
//                             Add Product
//                         </Button>
//                     </DialogTrigger>

//                     <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                         <DialogHeader>
//                             <DialogTitle>Add New Product</DialogTitle>
//                             <DialogDescription>
//                                 Add a new jewelry item to your inventory
//                             </DialogDescription>
//                         </DialogHeader>
//                         <form action="" method="post" onSubmit={handleAddProduct}>
//                             <div className="grid gap-4">

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="productName">Product Name</Label>
//                                         <Input
//                                             id="productName"
//                                             placeholder="Enter product name"
//                                             value={name}
//                                             onChange={(e) => setName(e.target.value)}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="purity">Purity</Label>
//                                         <Select value={purity} onValueChange={setPurity}>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select purity" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="24k">24K</SelectItem>
//                                                 <SelectItem value="22k">22K</SelectItem>
//                                                 <SelectItem value="20k">20K</SelectItem>
//                                                 <SelectItem value="18k">18K</SelectItem>
//                                                 <SelectItem value="14k">14K</SelectItem>
//                                                 <SelectItem value="9k">9K</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="category">Category</Label>
//                                         <Select value={categoryId} onValueChange={setCategoryId}>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select category" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {categories.map((category) => (
//                                                     <SelectItem
//                                                         key={category.id}
//                                                         value={String(category.id)}
//                                                     >
//                                                         {category.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>

//                                     <div className="grid gap-2">
//                                         <Label htmlFor="collection">Collection</Label>
//                                         <Select value={collectionId} onValueChange={setCollectionId}>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select collection" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {collections.map((collection) => (
//                                                     <SelectItem
//                                                         key={collection.id}
//                                                         value={String(collection.id)}
//                                                     >
//                                                         {collection.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>


//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="weight">Weight (grams)</Label>
//                                         <Input
//                                             id="weight"
//                                             type="number"
//                                             placeholder="Enter weight"
//                                             value={weight}
//                                             onChange={(e) => setWeight(e.target.value)}
//                                         />
//                                     </div>

//                                     {/* Right column intentionally left for other fields */}
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="makingPercentage">Making Percentage (%)</Label>
//                                         <Input
//                                             id="makingPercentage"
//                                             type="number"
//                                             placeholder="Enter making percentage"
//                                             value={makingPercentage}
//                                             onChange={(e) => setMakingPercentage(e.target.value)}
//                                         />
//                                     </div>

//                                     <div className="grid gap-2">
//                                         <Label htmlFor="metalType">Metal Type</Label>
//                                         <Select value={metalType} onValueChange={setMetalType}>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select metal" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="Gold">Gold</SelectItem>
//                                                 <SelectItem value="Silver">Silver</SelectItem>
//                                                 <SelectItem value="Platinum">Platinum</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>

//                                     {/* <div className="grid gap-2">
//                     <Label>Price (₹)</Label>
//                     <Input value={price} disabled placeholder="Auto-calculated" />
//                   </div> */}
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     {/* <div className="grid gap-2">
//                     <Label>Stock</Label>
//                     <Input value={stock} disabled placeholder="Auto-managed" />
//                   </div> */}
//                                 </div>

//                                 {/* Sizes Manager */}
//                                 <div className="grid gap-3">
//                                     <Label>Sizes (category wise)</Label>
//                                     <div className="text-xs text-muted-foreground mb-1">
//                                         Enter available sizes and per-size quantity. If a category has no sizes, add one entry like size "OneSize" with total stock.
//                                     </div>
//                                     <div className="space-y-2">
//                                         {sizes.map((row, idx) => (
//                                             <div key={idx} className="grid grid-cols-5 gap-2">
//                                                 <div className="col-span-3">
//                                                     <Input
//                                                         placeholder={'Size e.g. 7 / 2.4 / 18"'}
//                                                         value={row.size}
//                                                         onChange={(e) => {
//                                                             const next = [...sizes];
//                                                             next[idx] = { ...next[idx], size: e.target.value };
//                                                             setSizes(next);
//                                                         }}
//                                                     />
//                                                 </div>
//                                                 {/* <div>
//                           <Input
//                             type="number"
//                             placeholder="Qty"
//                             value={String(row.quantity)}
//                             onChange={(e) => {
//                               const val = Math.max(0, Number(e.target.value || 0));
//                               const next = [...sizes];
//                               next[idx] = { ...next[idx], quantity: val };
//                               setSizes(next);
//                             }}
//                           />
//                         </div> */}
//                                                 <div className="flex items-center">
//                                                     <Button
//                                                         variant="outline"
//                                                         type="button"
//                                                         onClick={() => setSizes(sizes.filter((_, i) => i !== idx))}
//                                                     >
//                                                         Remove
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                     <div>
//                                         <Button
//                                             type="button"
//                                             variant="secondary"
//                                             onClick={() => setSizes([...sizes, { size: "", quantity: 0 }])}
//                                         >
//                                             + Add Size
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 <div className="grid gap-2">
//                                     <Label>Product Images (max 5)</Label>
//                                     <div
//                                         className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
//                                             ? "border-primary"
//                                             : "border-muted-foreground/25"
//                                             }`}
//                                         onDragOver={(e) => {
//                                             e.preventDefault();
//                                             setIsDragging(true);
//                                         }}
//                                         onDragLeave={(e) => {
//                                             e.preventDefault();
//                                             setIsDragging(false);
//                                         }}
//                                         onDrop={(e) => {
//                                             e.preventDefault();
//                                             setIsDragging(false);
//                                             const dropped = Array.from(
//                                                 e.dataTransfer.files || []
//                                             ).filter((f) => f.type.startsWith("image/"));
//                                             if (dropped.length === 0) return;
//                                             setImages((prev) => {
//                                                 const available = MAX_CREATE_IMAGES - prev.length;
//                                                 if (available <= 0) {
//                                                     toast({
//                                                         title: "Limit reached",
//                                                         description: `You can upload up to ${MAX_CREATE_IMAGES} images`,
//                                                         variant: "warning",
//                                                     });
//                                                     return prev;
//                                                 }
//                                                 const accepted = dropped.slice(0, available);
//                                                 if (dropped.length > available) {
//                                                     toast({
//                                                         title: "Some files ignored",
//                                                         description: `Only ${available} more image(s) allowed`,
//                                                         variant: "warning",
//                                                     });
//                                                 }
//                                                 return [...prev, ...accepted];
//                                             });
//                                         }}
//                                         onClick={() => fileInputRef.current?.click()}
//                                     >
//                                         <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
//                                         <p className="mt-2 text-sm text-muted-foreground">
//                                             Click to upload or drag and drop up to 2 images
//                                         </p>
//                                         <input
//                                             ref={fileInputRef}
//                                             id="images"
//                                             type="file"
//                                             accept="image/*"
//                                             multiple
//                                             className="hidden"
//                                             onChange={(e) => {
//                                                 const selected = Array.from(e.target.files ?? [])
//                                                     .filter((f) => f.type.startsWith("image/"));
//                                                 if (selected.length === 0) return;
//                                                 setImages((prev) => {
//                                                     const available = MAX_CREATE_IMAGES - prev.length;
//                                                     if (available <= 0) {
//                                                         toast({
//                                                             title: "Limit reached",
//                                                             description: `You can upload up to ${MAX_CREATE_IMAGES} images`,
//                                                             variant: "warning",
//                                                         });
//                                                         return prev;
//                                                     }
//                                                     const accepted = selected.slice(0, available);
//                                                     if (selected.length > available) {
//                                                         toast({
//                                                             title: "Some files ignored",
//                                                             description: `Only ${available} more image(s) allowed`,
//                                                             variant: "warning",
//                                                         });
//                                                     }
//                                                     return [...prev, ...accepted];
//                                                 });
//                                             }}
//                                         />
//                                     </div>
//                                     {images.length > 0 && (
//                                         <div>
//                                             <p className="text-sm text-muted-foreground mb-2">
//                                                 {images.length} file(s) selected (max {MAX_CREATE_IMAGES})
//                                             </p>
//                                             <div className="grid grid-cols-3 gap-2">
//                                                 {images.map((file, idx) => (
//                                                     <img
//                                                         key={`${file.name}-${idx}`}
//                                                         src={URL.createObjectURL(file)}
//                                                         alt={file.name}
//                                                         className="w-full h-24 object-cover rounded"
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="flex justify-end space-x-2">
//                                     <DialogClose asChild>
//                                         <Button variant="outline" type="button">Cancel</Button>
//                                     </DialogClose>
//                                     <Button type="submit">Add Product</Button>
//                                 </div>
//                             </div>
//                         </form>
//                     </DialogContent>

//                 </Dialog>

//                 {/* edit product modal */}
//                 <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>

//                     <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

//                         <DialogHeader>
//                             <DialogTitle>Edit Product</DialogTitle>
//                             <DialogDescription>Update the product details</DialogDescription>
//                         </DialogHeader>

//                         <form action="" method="post" onSubmit={handleUpdateProduct}>
//                             <div className="grid gap-4">
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="editProductName">Product Name</Label>
//                                         <Input
//                                             id="editProductName"
//                                             placeholder="Enter product name"
//                                             value={editName}
//                                             onChange={(e) => setEditName(e.target.value)}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="editPurity">Purity</Label>
//                                         <Select value={editPurity} onValueChange={setEditPurity}>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select purity" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="24k">24K</SelectItem>
//                                                 <SelectItem value="22k">22K</SelectItem>
//                                                 <SelectItem value="20k">20K</SelectItem>
//                                                 <SelectItem value="18k">18K</SelectItem>
//                                                 <SelectItem value="14k">14K</SelectItem>
//                                                 <SelectItem value="9k">9K</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 </div>
//                                 {editImageUrl && (
//                                     <div className="grid gap-2">
//                                         <Label>Current Images</Label>
//                                         <div className="grid grid-cols-2 gap-2">
//                                             {editImageUrls.length > 0 ? (
//                                                 editImageUrls.map((url, idx) => (
//                                                     <img
//                                                         key={`${url}-${idx}`}
//                                                         src={getImageUrl(url)}
//                                                         alt={editName || "Product image"}
//                                                         className="w-full h-36 object-cover rounded-md border"
//                                                     />
//                                                 ))
//                                             ) : (
//                                                 <img
//                                                     src={getImageUrl(editImageUrl)}
//                                                     alt={editName || "Product image"}
//                                                     className="w-full h-36 object-cover rounded-md border"
//                                                 />
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="grid gap-2">
//                                     <Label>Upload New Images (max 2)</Label>
//                                     <div
//                                         className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
//                                             ? "border-primary"
//                                             : "border-muted-foreground/25"
//                                             }`}
//                                         onDragOver={(e) => {
//                                             e.preventDefault();
//                                             setIsDragging(true);
//                                         }}
//                                         onDragLeave={(e) => {
//                                             e.preventDefault();
//                                             setIsDragging(false);
//                                         }}
//                                         onDrop={(e) => {
//                                             e.preventDefault();
//                                             setIsDragging(false);
//                                             const dropped = Array.from(
//                                                 e.dataTransfer.files || []
//                                             ).filter((f) => f.type.startsWith("image/"));
//                                             if (dropped.length === 0) return;
//                                             setEditImages((prev) => {
//                                                 const available = MAX_EDIT_IMAGES - prev.length;
//                                                 if (available <= 0) {
//                                                     toast({
//                                                         title: "Limit reached",
//                                                         description: `You can upload up to ${MAX_EDIT_IMAGES} images`,
//                                                         variant: "warning",
//                                                     });
//                                                     return prev;
//                                                 }
//                                                 const accepted = dropped.slice(0, available);
//                                                 if (dropped.length > available) {
//                                                     toast({
//                                                         title: "Some files ignored",
//                                                         description: `Only ${available} more image(s) allowed`,
//                                                         variant: "warning",
//                                                     });
//                                                 }
//                                                 return [...prev, ...accepted];
//                                             });
//                                         }}
//                                         onClick={() => editFileInputRef.current?.click()}
//                                     >
//                                         <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
//                                         <p className="mt-2 text-sm text-muted-foreground">
//                                             Click to upload or drag and drop up to 2 images
//                                         </p>
//                                         <input
//                                             ref={editFileInputRef}
//                                             type="file"
//                                             accept="image/*"
//                                             multiple
//                                             className="hidden"
//                                             onChange={(e) => {
//                                                 const selected = Array.from(e.target.files ?? [])
//                                                     .filter((f) => f.type.startsWith("image/"));
//                                                 if (selected.length === 0) return;
//                                                 setEditImages((prev) => {
//                                                     const available = MAX_EDIT_IMAGES - prev.length;
//                                                     if (available <= 0) {
//                                                         toast({
//                                                             title: "Limit reached",
//                                                             description: `You can upload up to ${MAX_EDIT_IMAGES} images`,
//                                                             variant: "warning",
//                                                         });
//                                                         return prev;
//                                                     }
//                                                     const accepted = selected.slice(0, available);
//                                                     if (selected.length > available) {
//                                                         toast({
//                                                             title: "Some files ignored",
//                                                             description: `Only ${available} more image(s) allowed`,
//                                                             variant: "warning",
//                                                         });
//                                                     }
//                                                     return [...prev, ...accepted];
//                                                 });
//                                             }}
//                                         />
//                                     </div>
//                                     {editImages.length > 0 && (
//                                         <div>
//                                             <p className="text-sm text-muted-foreground mb-2">
//                                                 {editImages.length} new file(s) selected (max {MAX_EDIT_IMAGES})
//                                             </p>
//                                             <div className="grid grid-cols-3 gap-2">
//                                                 {editImages.map((file, idx) => (
//                                                     <img
//                                                         key={`${file.name}-${idx}`}
//                                                         src={URL.createObjectURL(file)}
//                                                         alt={file.name}
//                                                         className="w-full h-24 object-cover rounded"
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="editCategory">Category</Label>
//                                         <Select
//                                             value={editCategoryId}
//                                             onValueChange={setEditCategoryId}
//                                         >
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select category" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {categories.map((category) => (
//                                                     <SelectItem
//                                                         key={category.id}
//                                                         value={String(category.id)}
//                                                     >
//                                                         {category.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="editCollection">Collection</Label>
//                                         <Select
//                                             value={editCollectionId}
//                                             onValueChange={setEditCollectionId}
//                                         >
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select collection" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {collections.map((collection) => (
//                                                     <SelectItem
//                                                         key={collection.id}
//                                                         value={String(collection.id)}
//                                                     >
//                                                         {collection.name}

//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="editWeight">Weight (grams)</Label>
//                                         <Input
//                                             id="editWeight"
//                                             type="number"
//                                             placeholder="Enter weight"
//                                             value={editWeight}
//                                             onChange={(e) => setEditWeight(e.target.value)}
//                                         />
//                                     </div>

//                                     <div className="grid gap-2">
//                                         <Label htmlFor="editMakingPercentage">
//                                             Making Percentage(%)
//                                         </Label>
//                                         <Input
//                                             id="editMakingPercentage"
//                                             type="number"
//                                             placeholder="Enter making percentage"
//                                             value={editMakingPercentage}
//                                             onChange={(e) => setEditMakingPercentage(e.target.value)}
//                                         />
//                                     </div>
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="editMetalType">Metal Type</Label>
//                                         <Select value={editMetalType} onValueChange={setEditMetalType}>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select metal" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="Gold">Gold</SelectItem>
//                                                 <SelectItem value="Silver">Silver</SelectItem>
//                                                 <SelectItem value="Platinum">Platinum</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                     <div className="grid gap-2">
//                                         <Label htmlFor="editPrice">Price (₹)</Label>
//                                         <Input id="editPrice" value={editPrice} disabled placeholder="Auto-calculated" />
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">

//                                     {/* <div className="grid gap-2">
//                     <Label htmlFor="editStock">Stock</Label>
//                     <Input id="editStock" value={editStock} disabled placeholder="Auto-managed" />
//                   </div> */}
//                                 </div>

//                                 {/* Edit Sizes Manager */}
//                                 <div className="grid gap-3">
//                                     <Label>Edit Sizes</Label>
//                                     <div className="text-xs text-muted-foreground mb-1">
//                                         Modify available sizes and per-size quantity. Use OneSize for items without size.
//                                     </div>
//                                     <div className="space-y-2">
//                                         {editSizes.map((row, idx) => (
//                                             <div key={idx} className="grid grid-cols-5 gap-2">
//                                                 <div className="col-span-3">
//                                                     <Input
//                                                         placeholder="Size"
//                                                         value={row.size}
//                                                         onChange={(e) => {
//                                                             const next = [...editSizes];
//                                                             next[idx] = { ...next[idx], size: e.target.value };
//                                                             setEditSizes(next);
//                                                         }}
//                                                     />
//                                                 </div>
//                                                 {/* <div>
//                           <Input
//                             type="number"
//                             placeholder="Qty"
//                             value={String(row.quantity)}
//                             onChange={(e) => {
//                               const val = Math.max(0, Number(e.target.value || 0));
//                               const next = [...editSizes];
//                               next[idx] = { ...next[idx], quantity: val };
//                               setEditSizes(next);
//                             }}
//                           />
//                         </div> */}
//                                                 <div className="flex items-center">
//                                                     <Button
//                                                         variant="outline"
//                                                         type="button"
//                                                         onClick={() => setEditSizes(editSizes.filter((_, i) => i !== idx))}
//                                                     >
//                                                         Remove
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                     <div>
//                                         <Button
//                                             type="button"
//                                             variant="secondary"
//                                             onClick={() => setEditSizes([...editSizes, { size: "", quantity: 0 }])}
//                                         >
//                                             + Add Size
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 <div className="grid gap-2">
//                                     <Label htmlFor="editStatus">Active</Label>
//                                     <div className="flex items-center gap-2">
//                                         <Checkbox
//                                             id="editStatus"
//                                             checked={editStatusActive}
//                                             onCheckedChange={(checked) =>
//                                                 setEditStatusActive(Boolean(checked))
//                                             }
//                                         />
//                                         <span className="text-sm text-muted-foreground">
//                                             Toggle to set status 1 (active) or 0 (inactive)
//                                         </span>
//                                     </div>
//                                 </div>
//                                 {/* Image editing not included; showing preview above if available */}

//                                 <div className="flex justify-end space-x-2">
//                                     <Button
//                                         type="button"
//                                         variant="outline"
//                                         onClick={() => setEditDialogOpen(false)}
//                                     >
//                                         Cancel
//                                     </Button>
//                                     <Button type="submit">Update Product</Button>
//                                 </div>
//                             </div>
//                         </form>
//                     </DialogContent>

//                 </Dialog>
//             </div>

//             {/* tabs */}
//             <Tabs defaultValue="products" className="space-y-4">
//                 <TabsList>
//                     <TabsTrigger value="products">All Products</TabsTrigger>
//                     <TabsTrigger value="categories">Categories</TabsTrigger>
//                     <TabsTrigger value="collections">Collections</TabsTrigger>
//                     <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="products" className="space-y-4">
//                     {/*  serach and Filters */}
//                     <Card>
//                         <CardContent className="pt-6">

//                             <div className="flex gap-4">

//                                 <div className="flex-1">
//                                     <div className="relative">
//                                         <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                                         <Input
//                                             placeholder="Search products..."
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             className="pl-8"
//                                         />
//                                     </div>
//                                 </div>

//                                 <Select
//                                     value={selectedCategory}
//                                     onValueChange={setSelectedCategory}
//                                 >
//                                     <SelectTrigger className="w-48">
//                                         <SelectValue placeholder="Filter by category" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="all">All Categories</SelectItem>
//                                         {categories.map((category) => (
//                                             <SelectItem
//                                                 key={category.id}
//                                                 value={category.name.toLowerCase()}
//                                             >
//                                                 {category.name}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>

//                             </div>

//                         </CardContent>
//                     </Card>

//                     {/* Products Table */}
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Products ({products.length})</CardTitle>
//                             <CardDescription>Manage your jewelry inventory</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead>
//                                             <Checkbox
//                                                 checked={
//                                                     selectedProductIds.length > 0 &&
//                                                     selectedProductIds.length === products.length
//                                                 }
//                                                 onCheckedChange={(checked) => {
//                                                     if (checked) {
//                                                         setSelectedProductIds(products.map((p) => p.id));
//                                                     } else {
//                                                         setSelectedProductIds([]);
//                                                     }
//                                                 }}
//                                             />
//                                         </TableHead>
//                                         <TableHead>Product ID</TableHead>
//                                         <TableHead>Name</TableHead>
//                                         <TableHead>Category</TableHead>
//                                         <TableHead>Collection</TableHead>
//                                         <TableHead>Weight</TableHead>
//                                         <TableHead>Purity</TableHead>
//                                         <TableHead>Making Charges</TableHead>
//                                         <TableHead>Price</TableHead>
//                                         <TableHead>Stock</TableHead>
//                                         <TableHead>Status</TableHead>
//                                         <TableHead>Actions</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {products.map((product) => {
//                                         const categoryName =
//                                             (product?.category && typeof product.category === "object"
//                                                 ? product.category?.name
//                                                 : product?.category) ||
//                                             product?.category_name ||
//                                             "-";

//                                         const collectionName =
//                                             (product?.collection && typeof product.collection === "object"
//                                                 ? product.collection?.name
//                                                 : product?.collection) ||
//                                             product?.collection_name ||
//                                             "-";



//                                         const makingCharges =
//                                             product?.makingCharges ?? product?.making_charges ?? "-";
//                                         const statusText = (() => {
//                                             const val = product?.status;
//                                             if (typeof val === "string") return val;
//                                             if (typeof val === "number")
//                                                 return val === 1 ? "Active" : "Inactive";
//                                             if (typeof val === "boolean")
//                                                 return val ? "Active" : "Inactive";
//                                             return "Inactive";
//                                         })();
//                                         const statusVariant =
//                                             statusText === "Active" ? "default" : "destructive";
//                                         return (
//                                             <TableRow key={product.id}>
//                                                 <TableCell>
//                                                     <Checkbox
//                                                         checked={selectedProductIds.includes(product.id)}
//                                                         onCheckedChange={(checked) => {
//                                                             setSelectedProductIds((prev) =>
//                                                                 checked
//                                                                     ? Array.from(new Set([...prev, product.id]))
//                                                                     : prev.filter((id) => id !== product.id)
//                                                             );
//                                                         }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell className="font-medium">
//                                                     {product.id}
//                                                 </TableCell>
//                                                 <TableCell>{product.name}</TableCell>
//                                                 <TableCell>{categoryName}</TableCell>
//                                                 <TableCell>{collectionName}</TableCell>
//                                                 <TableCell>{product.weight ?? "-"}</TableCell>
//                                                 <TableCell>
//                                                     {product.purity ?? product.karat ?? "-"}
//                                                 </TableCell>
//                                                 <TableCell>{makingCharges}</TableCell>
//                                                 <TableCell className="font-medium">
//                                                     {product.price ?? "-"}
//                                                 </TableCell>
//                                                 <TableCell>{product.stock ?? "-"}</TableCell>
//                                                 <TableCell>
//                                                     <Badge variant={statusVariant}>{statusText}</Badge>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <div className="flex gap-2">
//                                                         <Button
//                                                             variant="outline"
//                                                             size="sm"
//                                                             onClick={() => openEditDialogForProduct(product)}
//                                                         >
//                                                             <Edit className="h-4 w-4" />
//                                                         </Button>
//                                                         <AlertDialog>
//                                                             <AlertDialogTrigger asChild>
//                                                                 <Button
//                                                                     variant="outline"
//                                                                     size="sm"
//                                                                     className="text-destructive"
//                                                                 >
//                                                                     <Trash2 className="h-4 w-4" />
//                                                                 </Button>
//                                                             </AlertDialogTrigger>
//                                                             <AlertDialogContent>
//                                                                 <AlertDialogHeader>
//                                                                     <AlertDialogTitle>
//                                                                         Delete product?
//                                                                     </AlertDialogTitle>
//                                                                     <AlertDialogDescription>
//                                                                         This action cannot be undone. This will
//                                                                         permanently delete "{product.name}" (ID:{" "}
//                                                                         {product.id}).
//                                                                     </AlertDialogDescription>
//                                                                 </AlertDialogHeader>
//                                                                 <AlertDialogFooter>
//                                                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                                                     <AlertDialogAction
//                                                                         onClick={() =>
//                                                                             handleDeleteProduct(product.id)
//                                                                         }
//                                                                     >
//                                                                         Delete
//                                                                     </AlertDialogAction>
//                                                                 </AlertDialogFooter>
//                                                             </AlertDialogContent>
//                                                         </AlertDialog>
//                                                     </div>
//                                                 </TableCell>
//                                             </TableRow>
//                                         );
//                                     })}
//                                 </TableBody>
//                             </Table>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>

//                 <TabsContent value="categories" className="space-y-4">
//                     {/* Search and Filters */}
//                     <Card>
//                         <CardContent className="pt-6">
//                             <div className="flex gap-4">
//                                 <div className="flex-1">
//                                     <div className="relative">
//                                         <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                                         <Input
//                                             placeholder="Search categories..."
//                                             value={categorySearchTerm}
//                                             onChange={(e) => setCategorySearchTerm(e.target.value)}
//                                             className="pl-8"
//                                         />
//                                     </div>
//                                 </div>
//                                 <Dialog
//                                     open={categoryCreateOpen}
//                                     onOpenChange={setCategoryCreateOpen}
//                                 >
//                                     <DialogTrigger asChild>
//                                         <Button>
//                                             <Plus className="mr-2 h-4 w-4" /> Add Category
//                                         </Button>
//                                     </DialogTrigger>
//                                     <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                                         <DialogHeader>
//                                             <DialogTitle>Create Category</DialogTitle>
//                                             <DialogDescription>Add a new category</DialogDescription>
//                                         </DialogHeader>
//                                         <form onSubmit={handleCreateCategory}>
//                                             <div className="grid gap-4">
//                                                 <div className="grid gap-2">
//                                                     <Label htmlFor="newCategoryName">Name</Label>
//                                                     <Input
//                                                         id="newCategoryName"
//                                                         placeholder="e.g. Gold"
//                                                         value={newCategoryName}
//                                                         onChange={(e) => setNewCategoryName(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="grid gap-2">
//                                                     <Label htmlFor="newCategoryDescription">Description</Label>
//                                                     <Textarea
//                                                         id="newCategoryDescription"
//                                                         placeholder="Short description"
//                                                         value={newCategoryDescription}
//                                                         onChange={(e) => setNewCategoryDescription(e.target.value)}
//                                                     />
//                                                 </div>
//                                                 <div className="grid gap-2">
//                                                     <Label>Category Image</Label>
//                                                     <div
//                                                         className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
//                                                             ? "border-primary"
//                                                             : "border-muted-foreground/25"
//                                                             }`}
//                                                         onDragOver={(e) => {
//                                                             e.preventDefault();
//                                                             setIsDragging(true);
//                                                         }}
//                                                         onDragLeave={(e) => {
//                                                             e.preventDefault();
//                                                             setIsDragging(false);
//                                                         }}
//                                                         onDrop={(e) => {
//                                                             e.preventDefault();
//                                                             setIsDragging(false);
//                                                             const dropped = Array.from(e.dataTransfer.files || [])
//                                                                 .filter((f) => f.type.startsWith("image/"));
//                                                             if (dropped[0]) setNewCategoryImage(dropped[0]);
//                                                         }}
//                                                         onClick={() => categoryCreateFileRef.current?.click()}
//                                                     >
//                                                         <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
//                                                         <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop image</p>
//                                                         <input
//                                                             ref={categoryCreateFileRef}
//                                                             type="file"
//                                                             accept="image/*"
//                                                             className="hidden"
//                                                             onChange={(e) => {
//                                                                 const f = (e.target.files && e.target.files[0]) || null;
//                                                                 if (f) setNewCategoryImage(f);
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     {newCategoryImage && (
//                                                         <img
//                                                             src={URL.createObjectURL(newCategoryImage)}
//                                                             alt="preview"
//                                                             className="w-full h-28 object-cover rounded border"
//                                                         />
//                                                     )}
//                                                 </div>
//                                                 <div className="flex justify-end gap-2">
//                                                     <Button
//                                                         type="button"
//                                                         variant="outline"
//                                                         onClick={() => setCategoryCreateOpen(false)}
//                                                     >
//                                                         Cancel
//                                                     </Button>
//                                                     <Button type="submit">Create</Button>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </DialogContent>
//                                 </Dialog>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Categories Table */}
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Categories ({(categories as any[]).length})</CardTitle>
//                             <CardDescription>Manage product categories</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <Dialog
//                                 open={categoryEditOpen}
//                                 onOpenChange={setCategoryEditOpen}
//                             >
//                                 <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                                     <DialogHeader>
//                                         <DialogTitle>Edit Category</DialogTitle>
//                                         <DialogDescription>
//                                             Update the category details
//                                         </DialogDescription>
//                                     </DialogHeader>
//                                     <form onSubmit={handleUpdateCategory}>
//                                         <div className="grid gap-4">
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="editCategoryName">Name</Label>
//                                                 <Input
//                                                     id="editCategoryName"
//                                                     placeholder="Category name"
//                                                     value={categoryEditName}
//                                                     onChange={(e) => setCategoryEditName(e.target.value)}
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="editCategoryDescription">Description</Label>
//                                                 <Textarea
//                                                     id="editCategoryDescription"
//                                                     placeholder="Short description"
//                                                     value={categoryEditDescription}
//                                                     onChange={(e) => setCategoryEditDescription(e.target.value)}
//                                                 />
//                                             </div>
//                                             <div className="grid gap-2">
//                                                 <Label>Category Image</Label>
//                                                 <div
//                                                     className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
//                                                         ? "border-primary"
//                                                         : "border-muted-foreground/25"
//                                                         }`}
//                                                     onDragOver={(e) => {
//                                                         e.preventDefault();
//                                                         setIsDragging(true);
//                                                     }}
//                                                     onDragLeave={(e) => {
//                                                         e.preventDefault();
//                                                         setIsDragging(false);
//                                                     }}
//                                                     onDrop={(e) => {
//                                                         e.preventDefault();
//                                                         setIsDragging(false);
//                                                         const dropped = Array.from(e.dataTransfer.files || [])
//                                                             .filter((f) => f.type.startsWith("image/"));
//                                                         if (dropped[0]) setCategoryEditImage(dropped[0]);
//                                                     }}
//                                                     onClick={() => categoryEditFileRef.current?.click()}
//                                                 >
//                                                     <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
//                                                     <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop image</p>
//                                                     <input
//                                                         ref={categoryEditFileRef}
//                                                         type="file"
//                                                         accept="image/*"
//                                                         className="hidden"
//                                                         onChange={(e) => {
//                                                             const f = (e.target.files && e.target.files[0]) || null;
//                                                             if (f) setCategoryEditImage(f);
//                                                         }}
//                                                     />
//                                                 </div>
//                                                 {categoryEditImage && (
//                                                     <img
//                                                         src={URL.createObjectURL(categoryEditImage)}
//                                                         alt="preview"
//                                                         className="w-full h-28 object-cover rounded border"
//                                                     />
//                                                 )}
//                                             </div>
//                                             <div className="flex justify-end gap-2">
//                                                 <Button
//                                                     type="button"
//                                                     variant="outline"
//                                                     onClick={() => setCategoryEditOpen(false)}
//                                                 >
//                                                     Cancel
//                                                 </Button>
//                                                 <Button type="submit">Update</Button>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </DialogContent>
//                             </Dialog>

//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead>ID</TableHead>
//                                         <TableHead>Image</TableHead>
//                                         <TableHead>Name</TableHead>
//                                         <TableHead>Description</TableHead>
//                                         <TableHead>Status</TableHead>
//                                         <TableHead>Created At</TableHead>
//                                         <TableHead>Actions</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {(categories as any[])
//                                         .filter((category) =>
//                                             category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
//                                         )
//                                         .map((category) => {
//                                             const statusText = category?.status === 1 || category?.status === "1" ? "Active" : "Inactive";
//                                             const statusVariant = statusText === "Active" ? "default" : "destructive";
//                                             const img = category?.image
//                                                 ? getImageUrl(category.image)
//                                                 : undefined;

//                                             return (
//                                                 <TableRow key={category.id}>
//                                                     <TableCell className="font-medium">{category.id}</TableCell>
//                                                     <TableCell>
//                                                         <div className="w-16 h-16 rounded border bg-muted/30 flex items-center justify-center overflow-hidden">
//                                                             {img ? (
//                                                                 <img src={img} alt={category.name} className="w-full h-full object-cover" />
//                                                             ) : (
//                                                                 <span className="text-xs text-muted-foreground">No image</span>
//                                                             )}
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell className="font-medium">{category.name}</TableCell>
//                                                     <TableCell className="max-w-xs truncate">
//                                                         {category.description || "-"}
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Badge variant={statusVariant}>{statusText}</Badge>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         {new Date(category.created_at).toLocaleDateString()}
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <div className="flex gap-2">
//                                                             <Button
//                                                                 variant="outline"
//                                                                 size="sm"
//                                                                 onClick={() => openEditCategory(category.id)}
//                                                             >
//                                                                 <Edit className="h-4 w-4" />
//                                                             </Button>
//                                                             <AlertDialog>
//                                                                 <AlertDialogTrigger asChild>
//                                                                     <Button
//                                                                         variant="outline"
//                                                                         size="sm"
//                                                                         className="text-destructive"
//                                                                     >
//                                                                         <Trash2 className="h-4 w-4" />
//                                                                     </Button>
//                                                                 </AlertDialogTrigger>
//                                                                 <AlertDialogContent>
//                                                                     <AlertDialogHeader>
//                                                                         <AlertDialogTitle>
//                                                                             Delete category?
//                                                                         </AlertDialogTitle>
//                                                                         <AlertDialogDescription>
//                                                                             This action cannot be undone. This will
//                                                                             permanently delete "{category.name}" (ID:{" "}
//                                                                             {category.id}).
//                                                                         </AlertDialogDescription>
//                                                                     </AlertDialogHeader>
//                                                                     <AlertDialogFooter>
//                                                                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                                                         <AlertDialogAction
//                                                                             onClick={() =>
//                                                                                 handleDeleteCategory(category.id)
//                                                                             }
//                                                                         >
//                                                                             Delete
//                                                                         </AlertDialogAction>
//                                                                     </AlertDialogFooter>
//                                                                 </AlertDialogContent>
//                                                             </AlertDialog>
//                                                         </div>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             );
//                                         })}
//                                 </TableBody>
//                             </Table>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>


//                 <TabsContent value="collections" className="space-y-4">
//                     {/* Search and Filters */}
//                     <Card>
//                         <CardContent className="pt-6">
//                             <div className="flex gap-4">
//                                 <div className="flex-1">
//                                     <div className="relative">
//                                         <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                                         <Input
//                                             placeholder="Search collections..."
//                                             value={collectionSearchTerm}
//                                             onChange={(e) => setCollectionSearchTerm(e.target.value)}
//                                             className="pl-8"
//                                         />
//                                     </div>
//                                 </div>
//                                 <Dialog
//                                     open={collectionCreateOpen}
//                                     onOpenChange={setCollectionCreateOpen}
//                                 >
//                                     <DialogTrigger asChild>
//                                         <Button>
//                                             <Plus className="mr-2 h-4 w-4" /> Add Collection
//                                         </Button>
//                                     </DialogTrigger>
//                                     <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                                         <DialogHeader>
//                                             <DialogTitle>Create Collection</DialogTitle>
//                                             <DialogDescription>Add a new Collection</DialogDescription>
//                                         </DialogHeader>
//                                         <form onSubmit={handleCreateCollection}>
//                                             <div className="grid gap-4">
//                                                 <div className="grid gap-2">
//                                                     <Label htmlFor="newCollectionName">Name</Label>
//                                                     <Input
//                                                         id="newCollectionName"
//                                                         placeholder="e.g. Diamond Collection"
//                                                         value={newCollectionName}
//                                                         onChange={(e) => setNewCollectionName(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="grid gap-2">
//                                                     <Label htmlFor="newCollectionDescription">Description</Label>
//                                                     <Textarea
//                                                         id="newCollectionDescription"
//                                                         placeholder="Short description"
//                                                         value={newCollectionDescription}
//                                                         onChange={(e) => setNewCollectionDescription(e.target.value)}
//                                                     />
//                                                 </div>
//                                                 <div className="grid gap-2">
//                                                     <Label>Collection Image</Label>
//                                                     <div
//                                                         className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
//                                                             ? "border-primary"
//                                                             : "border-muted-foreground/25"
//                                                             }`}
//                                                         onDragOver={(e) => {
//                                                             e.preventDefault();
//                                                             setIsDragging(true);
//                                                         }}
//                                                         onDragLeave={(e) => {
//                                                             e.preventDefault();
//                                                             setIsDragging(false);
//                                                         }}
//                                                         onDrop={(e) => {
//                                                             e.preventDefault();
//                                                             setIsDragging(false);
//                                                             const dropped = Array.from(e.dataTransfer.files || [])
//                                                                 .filter((f) => f.type.startsWith("image/"));
//                                                             if (dropped[0]) setNewCollectionImage(dropped[0]);
//                                                         }}
//                                                         onClick={() => collectionCreateFileRef.current?.click()}
//                                                     >
//                                                         <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
//                                                         <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop image</p>
//                                                         <input
//                                                             ref={collectionCreateFileRef}
//                                                             type="file"
//                                                             accept="image/*"
//                                                             className="hidden"
//                                                             onChange={(e) => {
//                                                                 const f = (e.target.files && e.target.files[0]) || null;
//                                                                 if (f) setNewCollectionImage(f);
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     {newCollectionImage && (
//                                                         <img
//                                                             src={URL.createObjectURL(newCollectionImage)}
//                                                             alt="preview"
//                                                             className="w-full h-28 object-cover rounded border"
//                                                         />
//                                                     )}
//                                                 </div>
//                                                 <div className="flex justify-end gap-2">
//                                                     <Button
//                                                         type="button"
//                                                         variant="outline"
//                                                         onClick={() => setCollectionCreateOpen(false)}
//                                                     >
//                                                         Cancel
//                                                     </Button>
//                                                     <Button type="submit">Create</Button>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </DialogContent>
//                                 </Dialog>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Collections Table */}
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Collections ({(collections as any[]).length})</CardTitle>
//                             <CardDescription>Manage product collections</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <Dialog
//                                 open={collectionEditOpen}
//                                 onOpenChange={setCollectionEditOpen}
//                             >
//                                 <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                                     <DialogHeader>
//                                         <DialogTitle>Edit Collection</DialogTitle>
//                                         <DialogDescription>
//                                             Update the collection details
//                                         </DialogDescription>
//                                     </DialogHeader>
//                                     <form onSubmit={handleUpdateCollection}>
//                                         <div className="grid gap-4">
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="editCollectionName">Name</Label>
//                                                 <Input
//                                                     id="editCollectionName"
//                                                     placeholder="Collection name"
//                                                     value={collectionEditName}
//                                                     onChange={(e) => setCollectionEditName(e.target.value)}
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="editCollectionDescription">Description</Label>
//                                                 <Textarea
//                                                     id="editCollectionDescription"
//                                                     placeholder="Short description"
//                                                     value={collectionEditDescription}
//                                                     onChange={(e) => setCollectionEditDescription(e.target.value)}
//                                                 />
//                                             </div>
//                                             <div className="grid gap-2">
//                                                 <Label>Collection Image</Label>
//                                                 <div
//                                                     className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
//                                                         ? "border-primary"
//                                                         : "border-muted-foreground/25"
//                                                         }`}
//                                                     onDragOver={(e) => {
//                                                         e.preventDefault();
//                                                         setIsDragging(true);
//                                                     }}
//                                                     onDragLeave={(e) => {
//                                                         e.preventDefault();
//                                                         setIsDragging(false);
//                                                     }}
//                                                     onDrop={(e) => {
//                                                         e.preventDefault();
//                                                         setIsDragging(false);
//                                                         const dropped = Array.from(e.dataTransfer.files || [])
//                                                             .filter((f) => f.type.startsWith("image/"));
//                                                         if (dropped[0]) setCollectionEditImage(dropped[0]);
//                                                     }}
//                                                     onClick={() => collectionEditFileRef.current?.click()}
//                                                 >
//                                                     <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
//                                                     <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop image</p>
//                                                     <input
//                                                         ref={collectionEditFileRef}
//                                                         type="file"
//                                                         accept="image/*"
//                                                         className="hidden"
//                                                         onChange={(e) => {
//                                                             const f = (e.target.files && e.target.files[0]) || null;
//                                                             if (f) setCollectionEditImage(f);
//                                                         }}
//                                                     />
//                                                 </div>
//                                                 {collectionEditImage && (
//                                                     <img
//                                                         src={URL.createObjectURL(collectionEditImage)}
//                                                         alt="preview"
//                                                         className="w-full h-28 object-cover rounded border"
//                                                     />
//                                                 )}
//                                             </div>
//                                             <div className="flex justify-end gap-2">
//                                                 <Button
//                                                     type="button"
//                                                     variant="outline"
//                                                     onClick={() => setCollectionEditOpen(false)}
//                                                 >
//                                                     Cancel
//                                                 </Button>
//                                                 <Button type="submit">Update</Button>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </DialogContent>
//                             </Dialog>

//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead>ID</TableHead>
//                                         <TableHead>Image</TableHead>
//                                         <TableHead>Name</TableHead>
//                                         <TableHead>Description</TableHead>
//                                         <TableHead>Status</TableHead>
//                                         <TableHead>Created At</TableHead>
//                                         <TableHead>Actions</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {(collections as any[])
//                                         .filter((collection) =>
//                                             collection.name.toLowerCase().includes(collectionSearchTerm.toLowerCase())
//                                         )
//                                         .map((collection) => {
//                                             const statusText = collection?.status === 1 || collection?.status === "1" ? "Active" : "Inactive";
//                                             const statusVariant = statusText === "Active" ? "default" : "destructive";
//                                             const img = collection?.image
//                                                 ? getImageUrl(collection.image)
//                                                 : undefined;

//                                             return (
//                                                 <TableRow key={collection.id}>
//                                                     <TableCell className="font-medium">{collection.id}</TableCell>
//                                                     <TableCell>
//                                                         <div className="w-16 h-16 rounded border bg-muted/30 flex items-center justify-center overflow-hidden">
//                                                             {img ? (
//                                                                 <img src={img} alt={collection.name} className="w-full h-full object-cover" />
//                                                             ) : (
//                                                                 <span className="text-xs text-muted-foreground">No image</span>
//                                                             )}
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell className="font-medium">{collection.name}</TableCell>
//                                                     <TableCell className="max-w-xs truncate">
//                                                         {collection.description || "-"}
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Badge variant={statusVariant}>{statusText}</Badge>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         {new Date(collection.created_at).toLocaleDateString()}
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <div className="flex gap-2">
//                                                             <Button
//                                                                 variant="outline"
//                                                                 size="sm"
//                                                                 onClick={() => openEditCollection(collection.id)}
//                                                             >
//                                                                 <Edit className="h-4 w-4" />
//                                                             </Button>
//                                                             <AlertDialog>
//                                                                 <AlertDialogTrigger asChild>
//                                                                     <Button
//                                                                         variant="outline"
//                                                                         size="sm"
//                                                                         className="text-destructive"
//                                                                     >
//                                                                         <Trash2 className="h-4 w-4" />
//                                                                     </Button>
//                                                                 </AlertDialogTrigger>
//                                                                 <AlertDialogContent>
//                                                                     <AlertDialogHeader>
//                                                                         <AlertDialogTitle>
//                                                                             Delete collection?
//                                                                         </AlertDialogTitle>
//                                                                         <AlertDialogDescription>
//                                                                             This action cannot be undone. This will
//                                                                             permanently delete "{collection.name}" (ID:{" "}
//                                                                             {collection.id}).
//                                                                         </AlertDialogDescription>
//                                                                     </AlertDialogHeader>
//                                                                     <AlertDialogFooter>
//                                                                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                                                         <AlertDialogAction
//                                                                             onClick={() =>
//                                                                                 handleDeleteCollection(collection.id)
//                                                                             }
//                                                                         >
//                                                                             Delete
//                                                                         </AlertDialogAction>
//                                                                     </AlertDialogFooter>
//                                                                 </AlertDialogContent>
//                                                             </AlertDialog>
//                                                         </div>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             );
//                                         })}
//                                 </TableBody>
//                             </Table>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>


//                 <TabsContent value="bulk" className="space-y-4">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Bulk Operations</CardTitle>
//                             <CardDescription>
//                                 Perform bulk actions on products
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                             <div className="grid gap-4 md:grid-cols-2">
//                                 {/* <Button variant="outline">
//                   <Upload className="mr-2 h-4 w-4" />
//                   Import Products (CSV)
//                 </Button>
//                 <Button variant="outline">Export Products (CSV)</Button> */}
//                                 <Button
//                                     variant="outline"
//                                     onClick={() => {
//                                         // Initialize price map for selected rows
//                                         const map: Record<string, string> = {};
//                                         selectedProductIds.forEach((id) => {
//                                             const p = products.find((pp) => pp.id === id);
//                                             if (p) map[String(id)] = p.price ? String(p.price) : "";
//                                         });
//                                         setBulkPrices(map);
//                                         setBulkApplyAll("");
//                                         setBulkDialogOpen(true);
//                                     }}
//                                 >
//                                     Bulk Price Update
//                                 </Button>
//                                 <Button
//                                     variant="outline"
//                                     onClick={() => {
//                                         const map: Record<string, string> = {};
//                                         selectedProductIds.forEach((id) => {
//                                             const p = products.find((pp) => pp.id === id);
//                                             if (p) {
//                                                 const val = p.status;
//                                                 const isActive =
//                                                     val === 1 ||
//                                                     val === "1" ||
//                                                     val === true ||
//                                                     val === "active";
//                                                 map[String(id)] = isActive ? "1" : "0";
//                                             }
//                                         });
//                                         setBulkStatuses(map);
//                                         setBulkStatusApplyAll("");
//                                         setBulkStatusDialogOpen(true);
//                                     }}
//                                 >
//                                     Bulk Status Update
//                                 </Button>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
//                         <DialogContent className="max-w-2xl">
//                             <DialogHeader>
//                                 <DialogTitle>Bulk Price Update</DialogTitle>
//                                 <DialogDescription>
//                                     Update prices for selected products. Provide new price per row
//                                     or apply one value to all.
//                                 </DialogDescription>
//                             </DialogHeader>
//                             <div className="space-y-4">
//                                 <div className="flex items-end gap-3">
//                                     <div className="flex-1">
//                                         <Label htmlFor="applyAll">Apply one price to all</Label>
//                                         <Input
//                                             id="applyAll"
//                                             type="number"
//                                             placeholder="e.g. 1500"
//                                             value={bulkApplyAll}
//                                             onChange={(e) => setBulkApplyAll(e.target.value)}
//                                         />
//                                     </div>
//                                     <Button
//                                         type="button"
//                                         onClick={() => {
//                                             const next: Record<string, string> = { ...bulkPrices };
//                                             selectedProductIds.forEach((id) => {
//                                                 next[String(id)] = bulkApplyAll;
//                                             });
//                                             setBulkPrices(next);
//                                         }}
//                                     >
//                                         Apply to all
//                                     </Button>
//                                 </div>

//                                 {selectedProductIds.length === 0 ? (
//                                     <div className="text-sm text-muted-foreground">
//                                         No products selected. Go to the Products tab and select rows
//                                         with the checkbox.
//                                     </div>
//                                 ) : (
//                                     <div className="max-h-[50vh] overflow-y-auto border rounded">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead className="w-[120px]">
//                                                         Product ID
//                                                     </TableHead>
//                                                     <TableHead>Name</TableHead>
//                                                     <TableHead className="w-[160px]">
//                                                         New Price (₹)
//                                                     </TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {selectedProductIds.map((id) => {
//                                                     const p = products.find((pp) => pp.id === id);
//                                                     if (!p) return null;
//                                                     return (
//                                                         <TableRow key={String(id)}>
//                                                             <TableCell className="font-mono">{id}</TableCell>
//                                                             <TableCell className="truncate max-w-xs">
//                                                                 {p.name}
//                                                             </TableCell>
//                                                             <TableCell>
//                                                                 <Input
//                                                                     type="number"
//                                                                     placeholder="e.g. 1500"
//                                                                     value={bulkPrices[String(id)] ?? ""}
//                                                                     onChange={(e) =>
//                                                                         setBulkPrices((prev) => ({
//                                                                             ...prev,
//                                                                             [String(id)]: e.target.value,
//                                                                         }))
//                                                                     }
//                                                                 />
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     );
//                                                 })}
//                                             </TableBody>
//                                         </Table>
//                                     </div>
//                                 )}

//                                 <div className="flex justify-end gap-2">
//                                     <Button
//                                         variant="outline"
//                                         onClick={() => setBulkDialogOpen(false)}
//                                         disabled={bulkSubmitting}
//                                     >
//                                         Cancel
//                                     </Button>
//                                     <Button
//                                         onClick={async () => {
//                                             if (selectedProductIds.length === 0) {
//                                                 toast({
//                                                     title: "Warning",
//                                                     description: "Select at least one product",
//                                                     variant: "warning",
//                                                 });
//                                                 return;
//                                             }
//                                             const items = selectedProductIds
//                                                 .map((id) => ({
//                                                     id,
//                                                     price: Number(bulkPrices[String(id)]),
//                                                 }))
//                                                 .filter((x) => !Number.isNaN(x.price) && x.price > 0);
//                                             if (items.length === 0) {
//                                                 toast({
//                                                     title: "Warning",
//                                                     description: "Provide valid prices",
//                                                     variant: "warning",
//                                                 });
//                                                 return;
//                                             }
//                                             try {
//                                                 setBulkSubmitting(true);
//                                                 try {
//                                                     await bulkUpdateProductPrices(token as string, {
//                                                         products: items as any,
//                                                     });
//                                                 } catch (err) {
//                                                     for (const it of items) {
//                                                         await updateProduct(token as string, it.id, {
//                                                             price: it.price,
//                                                         });
//                                                     }
//                                                 }
//                                                 toast({
//                                                     title: "Success",
//                                                     description: "Prices updated successfully",
//                                                     variant: "success",
//                                                 });
//                                                 setBulkDialogOpen(false);
//                                                 const res = await getProducts(token as string);
//                                                 setProducts(res.data?.data ?? res.data ?? []);
//                                             } catch (e) {
//                                                 toast({
//                                                     title: "Error",
//                                                     description: "Failed to update prices",
//                                                     variant: "destructive",
//                                                 });
//                                             } finally {
//                                                 setBulkSubmitting(false);
//                                             }
//                                         }}
//                                         disabled={bulkSubmitting}
//                                     >
//                                         {bulkSubmitting ? "Updating..." : "Update Prices"}
//                                     </Button>
//                                 </div>
//                             </div>
//                         </DialogContent>
//                     </Dialog>

//                     <Dialog
//                         open={bulkStatusDialogOpen}
//                         onOpenChange={setBulkStatusDialogOpen}
//                     >
//                         <DialogContent className="max-w-2xl">
//                             <DialogHeader>
//                                 <DialogTitle>Bulk Status Update</DialogTitle>
//                                 <DialogDescription>
//                                     Activate or deactivate selected products. Choose per row or
//                                     apply one value to all.
//                                 </DialogDescription>
//                             </DialogHeader>
//                             <div className="space-y-4">
//                                 <div className="flex items-end gap-3">
//                                     <div className="flex-1">
//                                         <Label htmlFor="applyAllStatus">
//                                             Apply one status to all
//                                         </Label>
//                                         <Select
//                                             value={bulkStatusApplyAll}
//                                             onValueChange={setBulkStatusApplyAll}
//                                         >
//                                             <SelectTrigger id="applyAllStatus">
//                                                 <SelectValue placeholder="Select status" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="1">Active</SelectItem>
//                                                 <SelectItem value="0">Inactive</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                     <Button
//                                         type="button"
//                                         onClick={() => {
//                                             const next: Record<string, string> = { ...bulkStatuses };
//                                             selectedProductIds.forEach((id) => {
//                                                 if (bulkStatusApplyAll !== "") {
//                                                     next[String(id)] = bulkStatusApplyAll;
//                                                 }
//                                             });
//                                             setBulkStatuses(next);
//                                         }}
//                                     >
//                                         Apply to all
//                                     </Button>
//                                 </div>

//                                 {selectedProductIds.length === 0 ? (
//                                     <div className="text-sm text-muted-foreground">
//                                         No products selected. Go to the Products tab and select rows
//                                         with the checkbox.
//                                     </div>
//                                 ) : (
//                                     <div className="max-h-[50vh] overflow-y-auto border rounded">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead className="w-[120px]">
//                                                         Product ID
//                                                     </TableHead>
//                                                     <TableHead>Name</TableHead>
//                                                     <TableHead className="w-[200px]">Status</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {selectedProductIds.map((id) => {
//                                                     const p = products.find((pp) => pp.id === id);
//                                                     if (!p) return null;
//                                                     return (
//                                                         <TableRow key={String(id)}>
//                                                             <TableCell className="font-mono">{id}</TableCell>
//                                                             <TableCell className="truncate max-w-xs">
//                                                                 {p.name}
//                                                             </TableCell>
//                                                             <TableCell>
//                                                                 <Select
//                                                                     value={bulkStatuses[String(id)] ?? ""}
//                                                                     onValueChange={(val) =>
//                                                                         setBulkStatuses((prev) => ({
//                                                                             ...prev,
//                                                                             [String(id)]: val,
//                                                                         }))
//                                                                     }
//                                                                 >
//                                                                     <SelectTrigger>
//                                                                         <SelectValue placeholder="Select status" />
//                                                                     </SelectTrigger>
//                                                                     <SelectContent>
//                                                                         <SelectItem value="1">Active</SelectItem>
//                                                                         <SelectItem value="0">Inactive</SelectItem>
//                                                                     </SelectContent>
//                                                                 </Select>
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     );
//                                                 })}
//                                             </TableBody>
//                                         </Table>
//                                     </div>
//                                 )}

//                                 <div className="flex justify-end gap-2">
//                                     <Button
//                                         variant="outline"
//                                         onClick={() => setBulkStatusDialogOpen(false)}
//                                         disabled={bulkStatusSubmitting}
//                                     >
//                                         Cancel
//                                     </Button>
//                                     <Button
//                                         onClick={async () => {
//                                             if (selectedProductIds.length === 0) {
//                                                 toast({
//                                                     title: "Warning",
//                                                     description: "Select at least one product",
//                                                     variant: "warning",
//                                                 });
//                                                 return;
//                                             }
//                                             const items = selectedProductIds
//                                                 .map((id) => ({
//                                                     id,
//                                                     status: Number(bulkStatuses[String(id)]),
//                                                 }))
//                                                 .filter((x) => x.status === 0 || x.status === 1);
//                                             if (items.length === 0) {
//                                                 toast({
//                                                     title: "Warning",
//                                                     description: "Provide valid statuses",
//                                                     variant: "warning",
//                                                 });
//                                                 return;
//                                             }
//                                             try {
//                                                 setBulkStatusSubmitting(true);
//                                                 try {
//                                                     const uniqueStatuses = Array.from(
//                                                         new Set(items.map((i) => i.status))
//                                                     );
//                                                     if (uniqueStatuses.length === 1) {
//                                                         await bulkUpdateProductStatus(token as string, {
//                                                             ids: items.map((i) => i.id) as any,
//                                                             status: uniqueStatuses[0],
//                                                         });
//                                                     } else {
//                                                         await bulkUpdateProductStatus(token as string, {
//                                                             products: items as any,
//                                                         });
//                                                     }
//                                                 } catch (err) {
//                                                     for (const it of items) {
//                                                         await updateProduct(token as string, it.id, {
//                                                             status: it.status,
//                                                         });
//                                                     }
//                                                 }
//                                                 toast({
//                                                     title: "Success",
//                                                     description: "Statuses updated successfully",
//                                                     variant: "success",
//                                                 });
//                                                 setBulkStatusDialogOpen(false);
//                                                 const res = await getProducts(token as string);
//                                                 setProducts(res.data?.data ?? res.data ?? []);
//                                             } catch (e) {
//                                                 toast({
//                                                     title: "Error",
//                                                     description: "Failed to update statuses",
//                                                     variant: "destructive",
//                                                 });
//                                             } finally {
//                                                 setBulkStatusSubmitting(false);
//                                             }
//                                         }}
//                                         disabled={bulkStatusSubmitting}
//                                     >
//                                         {bulkStatusSubmitting ? "Updating..." : "Update Statuses"}
//                                     </Button>
//                                 </div>
//                             </div>
//                         </DialogContent>
//                     </Dialog>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// };

// export default ProductManagement;







import { useEffect, useRef, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Edit, Trash2, Upload } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    bulkUpdateProductPrices,
    bulkUpdateProductStatus,
} from "@/lib/api/productController";
import {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory as deleteCategoryApi,
} from "@/lib/api/categoriesController";

import {
    getCollections,
    createCollection,
    getCollectionById,
    updateCollection,
    deleteCollection as deleteCollectionApi,
} from "@/lib/api/collectionsController";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, getImageUrl } from "@/config";

const ProductManagement = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedCollection, setSelectedCollection] = useState("all");

    // Search and filter states for categories and collections
    const [categorySearchTerm, setCategorySearchTerm] = useState("");
    const [collectionSearchTerm, setCollectionSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [products, setProducts] = useState<any[]>([]);
    const { token } = useAuth();
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [collectionId, setCollectionId] = useState("");
    const [purity, setPurity] = useState("");
    const [metalType, setMetalType] = useState("Gold");
    const [weight, setWeight] = useState("");
    const [makingPercentage, setMakingPercentage] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [sizes, setSizes] = useState<{ size: string; quantity: number }[]>([]);

    const [images, setImages] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const editFileInputRef = useRef<HTMLInputElement | null>(null);

    // EDIT PRODUCT STATE
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editCategoryId, setEditCategoryId] = useState("");
    const [editCollectionId, setEditCollectionId] = useState("");
    const [editPurity, setEditPurity] = useState("");
    const [editMetalType, setEditMetalType] = useState("Gold");
    const [editWeight, setEditWeight] = useState("");
    const [editMakingPercentage, setEditMakingPercentage] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editStock, setEditStock] = useState("");
    const [editSizes, setEditSizes] = useState<{ size: string; quantity: number }[]>([]);
    const [editStatusActive, setEditStatusActive] = useState(false);
    const [editImageUrl, setEditImageUrl] = useState<string>("");
    const [editImageUrls, setEditImageUrls] = useState<string[]>([]);
    const [editImages, setEditImages] = useState<File[]>([]);

    // --- NEW: VIDEO STATES ---
    const [video, setVideo] = useState<File | null>(null);
    const [editVideo, setEditVideo] = useState<File | null>(null);
    const [existingVideoUrl, setExistingVideoUrl] = useState<string>("");

    // Bulk price update state
    const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
    const [selectedProductIds, setSelectedProductIds] = useState<
        (number | string)[]
    >([]);
    const [bulkPrices, setBulkPrices] = useState<Record<string, string>>({});
    const [bulkApplyAll, setBulkApplyAll] = useState<string>("");
    const [bulkSubmitting, setBulkSubmitting] = useState(false);

    // Bulk status update state
    const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false);
    const [bulkStatuses, setBulkStatuses] = useState<Record<string, string>>({});
    const [bulkStatusApplyAll, setBulkStatusApplyAll] = useState<string>("");
    const [bulkStatusSubmitting, setBulkStatusSubmitting] = useState(false);

    const MAX_CREATE_IMAGES = 5;
    const MAX_EDIT_IMAGES = 5;

    // Category CRUD state
    const [categoryCreateOpen, setCategoryCreateOpen] = useState(false);
    const [categoryEditOpen, setCategoryEditOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
    const [categoryEditId, setCategoryEditId] = useState<number | null>(null);
    const [categoryEditName, setCategoryEditName] = useState("");
    const [categoryEditDescription, setCategoryEditDescription] = useState("");
    const [categoryEditImage, setCategoryEditImage] = useState<File | null>(null);
    const categoryCreateFileRef = useRef<HTMLInputElement | null>(null);
    const categoryEditFileRef = useRef<HTMLInputElement | null>(null);

    // Collection CRUD state
    const [collectionCreateOpen, setCollectionCreateOpen] = useState(false);
    const [collectionEditOpen, setCollectionEditOpen] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [newCollectionDescription, setNewCollectionDescription] = useState("");
    const [newCollectionImage, setNewCollectionImage] = useState<File | null>(null);
    const [collectionEditId, setCollectionEditId] = useState<number | null>(null);
    const [collectionEditName, setCollectionEditName] = useState("");
    const [collectionEditDescription, setCollectionEditDescription] = useState("");
    const [collectionEditImage, setCollectionEditImage] = useState<File | null>(null);
    const collectionCreateFileRef = useRef<HTMLInputElement | null>(null);
    const collectionEditFileRef = useRef<HTMLInputElement | null>(null);

    // Edit modal shows only editable fields; no image state for edit
    const normalizePurity = (value: unknown): string => {
        if (value === null || value === undefined) return "";
        const raw = String(value).trim();
        const lower = raw.toLowerCase();
        if (["24k", "22k", "18k", "925"].includes(lower)) return lower;
        if (lower.includes("925")) return "925";
        const match = lower.match(/(\d{2,3})/);
        if (match) {
            const num = match[1];
            if (num === "24") return "24k";
            if (num === "22") return "22k";
            if (num === "18") return "18k";

        }
        return "";
    };

    useEffect(() => {
        if (!token) return;
        getProducts(token)
            .then((response) => {
                const data = (response?.data?.data ?? []) as any[];
                setProducts(Array.isArray(data) ? data : []);
            })
            .catch(() => setProducts([]));

        getCategories(token)
            .then((response) => {
                setCategories(response.data.data);
            })
        getCollections(token)
            .then((response) => {
                setCollections(response.data.data);
            })

            .catch(() => { });
    }, [token]);

    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;
        const jsonPayload = {
            name,
            category_id: categoryId,
            collection_id: collectionId,
            purity,
            metal_type: metalType,
            weight: weight ? Number(weight) : undefined,
            making_charges: makingPercentage ? Number(makingPercentage) : undefined,
            sizes: sizes.length ? JSON.stringify(sizes.filter(s => s.size)) : undefined,
        };
        try {
            let payload: Record<string, unknown> | FormData = jsonPayload;
            // --- CHANGE: Check for video as well ---
            if (images.length > 0 || video) {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("category_id", categoryId);
                formData.append("collection_id", collectionId);
                formData.append("metal_type", metalType);
                if (purity) formData.append("purity", purity.toUpperCase());
                if (weight) formData.append("weight", String(Number(weight)));
                if (makingPercentage)
                    formData.append("making_percentage", String(Number(makingPercentage)));
                if (sizes.length)
                    formData.append("sizes", JSON.stringify(sizes.filter(s => s.size)));
                images.forEach((file) => {
                    formData.append("image[]", file, file.name);
                });
                // --- CHANGE: Append Video ---
                if (video) {
                    formData.append("video", video);
                }
                payload = formData;
            }
            await createProduct(token, payload);
            toast({
                title: "Success",
                description: "Product added successfully",
                variant: "success",
            });
            const refreshed = await getProducts(token);
            const data = (refreshed?.data?.data ?? []) as any[];
            setProducts(Array.isArray(data) ? data : []);
            // reset form
            setName("");
            setCategoryId("");
            setCollectionId("");
            setPurity("");
            setWeight("");
            setMakingPercentage("");
            setPrice("");
            setStock("");
            setImages([]);
            setVideo(null); // Reset Video
        } catch (error) {
            // Error handled by toast
        }
    };

    const openEditDialogForProduct = async (product: any) => {
        try {
            if (!token) return;
            const id = product?.id;
            if (!id) return;
            const response = await getProductById(token, id);
            const details = response?.data?.data ?? {};
            const categoryIdFromProduct =
                details?.category_id ?? details?.category?.id ?? "";
            setEditingProductId(details?.id ?? id);
            setEditName(details?.name ?? "");
            setEditCategoryId(
                categoryIdFromProduct ? String(categoryIdFromProduct) : ""
            );
            const collectionIdFromProduct =
                details?.collection_id ?? details?.collection?.id ?? "";
            setEditCollectionId(
                collectionIdFromProduct ? String(collectionIdFromProduct) : ""
            );
            const normalizedPurity = normalizePurity(
                details?.purity ?? details?.karat ?? ""
            );
            setEditPurity(normalizedPurity);
            setEditMetalType(details?.metal_type || details?.metal || "Gold");
            setEditWeight(
                details?.weight !== undefined && details?.weight !== null
                    ? String(details.weight)
                    : ""
            );
            setEditMakingPercentage(
                details?.making_percentage !== undefined &&
                    details?.making_percentage !== null
                    ? String(details.making_percentage)
                    : ""
            );
            setEditPrice(
                details?.price !== undefined && details?.price !== null
                    ? String(details.price)
                    : ""
            );
            setEditStock(
                details?.stock !== undefined && details?.stock !== null
                    ? String(details.stock)
                    : ""
            );
            // sizes
            try {
                const rawSizes = (details as any)?.sizes;
                let parsed: { size: string; quantity: number }[] = [];
                if (Array.isArray(rawSizes)) parsed = rawSizes as any;
                else if (typeof rawSizes === "string" && rawSizes.trim().startsWith("[")) parsed = JSON.parse(rawSizes);
                setEditSizes(parsed.filter((s) => s && s.size !== undefined));
            } catch {
                setEditSizes([]);
            }
            const statusVal = details?.status;
            setEditStatusActive(
                statusVal === 1 || statusVal === "1" || statusVal === true
            );
            const imgField: unknown =
                (details && (details.image_url ?? details.image)) ??
                (details && details.images) ??
                "";
            let urls: string[] = [];
            try {
                if (Array.isArray(imgField)) {
                    urls = (imgField as any[])
                        .map((x) => (typeof x === "string" ? x : x?.url ?? ""))
                        .filter(Boolean);
                } else if (typeof imgField === "string") {
                    if (imgField.trim().startsWith("[")) {
                        const parsed = JSON.parse(imgField);
                        if (Array.isArray(parsed)) {
                            urls = parsed.filter((x: any) => typeof x === "string");
                        }
                    } else if (imgField) {
                        urls = [imgField];
                    }
                }
            } catch { }
            setEditImageUrls(urls);
            setEditImageUrl(urls[0] ?? "");
            setEditImages([]);

            // --- CHANGE: Load Existing Video ---
            setExistingVideoUrl(details?.short_video ?? "");
            setEditVideo(null);

            setEditDialogOpen(true);
        } catch (err) {
            // fallback to opening with whatever we have
            const categoryIdFromProduct =
                product?.category_id ?? product?.category?.id ?? "";
            setEditingProductId(product?.id ?? null);
            setEditName(product?.name ?? "");
            setEditCategoryId(
                categoryIdFromProduct ? String(categoryIdFromProduct) : ""
            );
            const collectionIdFromProduct =
                product?.collection_id ?? product?.collection?.id ?? "";
            setEditCollectionId(
                collectionIdFromProduct ? String(collectionIdFromProduct) : ""
            );
            const normalizedPurity = normalizePurity(
                product?.purity ?? product?.karat ?? ""
            );
            setEditPurity(normalizedPurity);
            setEditMetalType(product?.metal_type || product?.metal || "Gold");
            setEditWeight(
                product?.weight !== undefined && product?.weight !== null
                    ? String(product.weight)
                    : ""
            );
            setEditMakingPercentage(
                product?.making_percentage !== undefined &&
                    product?.making_percentage !== null
                    ? String(product.making_percentage)
                    : ""
            );
            setEditPrice(
                product?.price !== undefined && product?.price !== null
                    ? String(product.price)
                    : ""
            );
            setEditStock(
                product?.stock !== undefined && product?.stock !== null
                    ? String(product.stock)
                    : ""
            );
            const statusVal = product?.status;
            setEditStatusActive(
                statusVal === 1 || statusVal === "1" || statusVal === true
            );
            const imgField: unknown =
                product?.image_url ?? product?.image ?? product?.images ?? "";
            let urls: string[] = [];
            try {
                if (Array.isArray(imgField)) {
                    urls = (imgField as any[])
                        .map((x) => (typeof x === "string" ? x : x?.url ?? ""))
                        .filter(Boolean);
                } else if (typeof imgField === "string") {
                    if (imgField.trim().startsWith("[")) {
                        const parsed = JSON.parse(imgField);
                        if (Array.isArray(parsed)) {
                            urls = parsed.filter((x: any) => typeof x === "string");
                        }
                    } else if (imgField) {
                        urls = [imgField];
                    }
                }
            } catch { }
            setEditImageUrls(urls);
            setEditImageUrl(urls[0] ?? "");
            setEditImages([]);

            // --- CHANGE: Load Existing Video (Fallback) ---
            setExistingVideoUrl(product?.short_video ?? "");
            setEditVideo(null);

            setEditDialogOpen(true);
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !editingProductId) return;
        const jsonPayload = {
            name: editName,
            category_id: editCategoryId ? Number(editCategoryId) : undefined,
            collection_id: editCollectionId ? Number(editCollectionId) : undefined,
            purity: editPurity ? editPurity.toUpperCase() : undefined,
            metal_type: editMetalType,
            weight: editWeight ? Number(editWeight) : undefined,
            making_percentage: editMakingPercentage ? Number(editMakingPercentage) : undefined,
            status: editStatusActive ? 1 : 0,
            sizes: editSizes.length ? JSON.stringify(editSizes.filter(s => s.size)) : undefined,
        };
        try {
            let payload: Record<string, unknown> | FormData = jsonPayload;
            // --- CHANGE: Check for video as well ---
            if (editImages.length > 0 || editVideo) {
                const formData = new FormData();
                formData.append("name", editName);
                if (editCategoryId)
                    formData.append("category_id", String(Number(editCategoryId)));
                if (editCollectionId)
                    formData.append("collection_id", String(Number(editCollectionId)));
                formData.append("metal_type", editMetalType);
                if (editPurity) formData.append("purity", editPurity.toUpperCase());
                if (editWeight) formData.append("weight", String(Number(editWeight)));
                if (editMakingPercentage)
                    formData.append(
                        "making_charges",
                        String(Number(editMakingPercentage))
                    );
                formData.append("status", editStatusActive ? "1" : "0");
                if (editSizes.length)
                    formData.append("sizes", JSON.stringify(editSizes.filter(s => s.size)));
                editImages.forEach((file) => {
                    formData.append("image[]", file, file.name);
                });
                // --- CHANGE: Append Edit Video ---
                if (editVideo) {
                    formData.append("video", editVideo);
                }
                payload = formData;
            }
            await updateProduct(token, editingProductId, payload);
            toast({
                title: "Success",
                description: "Product updated successfully",
                variant: "success",
            });
            const refreshed = await getProducts(token);
            const data = (refreshed?.data?.data ?? []) as any[];
            setProducts(Array.isArray(data) ? data : []);
            setEditDialogOpen(false);

            // --- CHANGE: Reset Edit Video States ---
            setEditVideo(null);
            setExistingVideoUrl("");
        } catch (error) {
            // Error handled by toast
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!token) return;
        await deleteProduct(token, id);
        toast({
            title: "Success",
            description: "Product deleted successfully",
            variant: "success",
        });
        const refreshed = await getProducts(token);
        const data = (refreshed?.data?.data ?? []) as any[];
        setProducts(Array.isArray(data) ? data : []);
    };
    // Category handlers
    const refreshCategories = async () => {
        if (!token) return;
        const response = await getCategories(token);
        setCategories(response.data.data ?? []);
    };

    const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;
        try {
            const name = newCategoryName.trim();
            if (!name) return;
            const form = new FormData();
            form.append("name", name);
            if (newCategoryDescription.trim()) {
                form.append("description", newCategoryDescription.trim());
            }
            if (newCategoryImage) {
                form.append("image", newCategoryImage, newCategoryImage.name);
            }
            await createCategory(token, form);
            toast({
                title: "Success",
                description: "Category created successfully",
                variant: "success",
            });
            await refreshCategories();
            setCategoryCreateOpen(false);
            setNewCategoryName("");
            setNewCategoryDescription("");
            setNewCategoryImage(null);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to create category",
                variant: "destructive",
            });
        }
    };

    const openEditCategory = async (id: number) => {
        if (!token) return;
        setCategoryEditId(id);
        try {
            const response = await getCategoryById(token, id);
            const data = response?.data?.data;
            setCategoryEditName(data?.name ?? "");
            setCategoryEditDescription(data?.description ?? "");
            // Keep existing image visible by not clearing unless user selects a new one
        } catch (error) {
            const fallback = (categories as any[]).find((c) => c?.id === id);
            setCategoryEditName(fallback?.name ?? "");
            setCategoryEditDescription(fallback?.description ?? "");
        }
        setCategoryEditOpen(true);
    };

    const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !categoryEditId) return;
        try {
            const name = categoryEditName.trim();
            if (!name) return;
            const maybeForm = new FormData();
            maybeForm.append("name", name);
            if (categoryEditDescription.trim()) {
                maybeForm.append("description", categoryEditDescription.trim());
            }
            if (categoryEditImage) {
                maybeForm.append("image", categoryEditImage, categoryEditImage.name);
            }
            await updateCategory(token, categoryEditId, maybeForm);
            toast({
                title: "Success",
                description: "Category updated successfully",
                variant: "success",
            });
            await refreshCategories();
            setCategoryEditOpen(false);
            setCategoryEditId(null);
            setCategoryEditName("");
            setCategoryEditDescription("");
            setCategoryEditImage(null);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update category",
                variant: "destructive",
            });
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!token) return;
        try {
            await deleteCategoryApi(token, id);
            toast({
                title: "Success",
                description: "Category deleted successfully",
                variant: "success",
            });
            await refreshCategories();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to delete category",
                variant: "destructive",
            });
        }
    };
    // Collections handlers
    const refreshCollections = async () => {
        if (!token) return;
        const response = await getCollections(token);
        setCollections(response.data.data ?? []);
    };

    const handleCreateCollection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;
        try {
            const name = newCollectionName.trim();
            if (!name) return;
            const form = new FormData();
            form.append("name", name);
            if (newCollectionDescription.trim()) {
                form.append("description", newCollectionDescription.trim());
            }
            if (newCollectionImage) {
                form.append("image", newCollectionImage, newCollectionImage.name);
            }
            await createCollection(token, form);
            toast({
                title: "Success",
                description: "Collection created successfully",
                variant: "success",
            });
            await refreshCollections();
            setCollectionCreateOpen(false);
            setNewCollectionName("");
            setNewCollectionDescription("");
            setNewCollectionImage(null);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to create collection",
                variant: "destructive",
            });
        }
    };

    const openEditCollection = async (id: number) => {
        if (!token) return;
        setCollectionEditId(id);
        try {
            const response = await getCollectionById(token, id);
            const data = response?.data?.data;
            setCollectionEditName(data?.name ?? "");
            setCollectionEditDescription(data?.description ?? "");
            // Keep existing image visible by not clearing unless user selects a new one
        } catch (error) {
            const fallback = (collections as any[]).find((c) => c?.id === id);
            setCollectionEditName(fallback?.name ?? "");
        }
        setCollectionEditOpen(true);
    };

    const handleUpdateCollection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !collectionEditId) return;
        try {
            const name = collectionEditName.trim();
            if (!name) return;
            const maybeForm = new FormData();
            maybeForm.append("name", name);
            if (collectionEditDescription.trim()) {
                maybeForm.append("description", collectionEditDescription.trim());
            }
            if (collectionEditImage) {
                maybeForm.append("image", collectionEditImage, collectionEditImage.name);
            }
            await updateCollection(token, collectionEditId, maybeForm);
            toast({
                title: "Success",
                description: "Collection updated successfully",
                variant: "success",
            });
            await refreshCollections();
            setCollectionEditOpen(false);
            setCollectionEditId(null);
            setCollectionEditName("");
            setCollectionEditDescription("");
            setCollectionEditImage(null);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update collection",
                variant: "destructive",
            });
        }
    };

    const handleDeleteCollection = async (id: number) => {
        if (!token) return;
        try {
            await deleteCollectionApi(token, id);
            toast({
                title: "Success",
                description: "Collection deleted successfully",
                variant: "success",
            });
            await refreshCollections();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to delete collection",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="p-6 ">

            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-3xl font-bold">Product Management</h1>
                    <p className="text-muted-foreground">Manage your jewelry inventory</p>
                </div>

                {/* add product modal   */}
                <Dialog>

                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Add a new jewelry item to your inventory
                            </DialogDescription>
                        </DialogHeader>
                        <form action="" method="post" onSubmit={handleAddProduct}>
                            <div className="grid gap-4">

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="productName">Product Name</Label>
                                        <Input
                                            id="productName"
                                            placeholder="Enter product name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="purity">Purity</Label>
                                        <Select value={purity} onValueChange={setPurity}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select purity" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="24k">24K</SelectItem>
                                                <SelectItem value="22k">22K</SelectItem>
                                                <SelectItem value="20k">20K</SelectItem>
                                                <SelectItem value="18k">18K</SelectItem>
                                                <SelectItem value="14k">14K</SelectItem>
                                                <SelectItem value="9k">9K</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={categoryId} onValueChange={setCategoryId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={String(category.id)}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="collection">Collection</Label>
                                        <Select value={collectionId} onValueChange={setCollectionId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select collection" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {collections.map((collection) => (
                                                    <SelectItem
                                                        key={collection.id}
                                                        value={String(collection.id)}
                                                    >
                                                        {collection.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>


                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="weight">Weight (grams)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            placeholder="Enter weight"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                        />
                                    </div>

                                    {/* Right column intentionally left for other fields */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="makingPercentage">Making Percentage (%)</Label>
                                        <Input
                                            id="makingPercentage"
                                            type="number"
                                            placeholder="Enter making percentage"
                                            value={makingPercentage}
                                            onChange={(e) => setMakingPercentage(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="metalType">Metal Type</Label>
                                        <Select value={metalType} onValueChange={setMetalType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select metal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Gold">Gold</SelectItem>
                                                <SelectItem value="Silver">Silver</SelectItem>
                                                <SelectItem value="Platinum">Platinum</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* <div className="grid gap-2">
                    <Label>Price (₹)</Label>
                    <Input value={price} disabled placeholder="Auto-calculated" />
                  </div> */}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* <div className="grid gap-2">
                    <Label>Stock</Label>
                    <Input value={stock} disabled placeholder="Auto-managed" />
                  </div> */}
                                </div>

                                {/* Sizes Manager */}
                                <div className="grid gap-3">
                                    <Label>Sizes (category wise)</Label>
                                    <div className="text-xs text-muted-foreground mb-1">
                                        Enter available sizes and per-size quantity. If a category has no sizes, add one entry like size "OneSize" with total stock.
                                    </div>
                                    <div className="space-y-2">
                                        {sizes.map((row, idx) => (
                                            <div key={idx} className="grid grid-cols-5 gap-2">
                                                <div className="col-span-3">
                                                    <Input
                                                        placeholder={'Size e.g. 7 / 2.4 / 18"'}
                                                        value={row.size}
                                                        onChange={(e) => {
                                                            const next = [...sizes];
                                                            next[idx] = { ...next[idx], size: e.target.value };
                                                            setSizes(next);
                                                        }}
                                                    />
                                                </div>
                                                {/* <div>
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={String(row.quantity)}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value || 0));
                              const next = [...sizes];
                              next[idx] = { ...next[idx], quantity: val };
                              setSizes(next);
                            }}
                          />
                        </div> */}
                                                <div className="flex items-center">
                                                    <Button
                                                        variant="outline"
                                                        type="button"
                                                        onClick={() => setSizes(sizes.filter((_, i) => i !== idx))}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setSizes([...sizes, { size: "", quantity: 0 }])}
                                        >
                                            + Add Size
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Product Images (max 5)</Label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                                            ? "border-primary"
                                            : "border-muted-foreground/25"
                                            }`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDragging(true);
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            const dropped = Array.from(
                                                e.dataTransfer.files || []
                                            ).filter((f) => f.type.startsWith("image/"));
                                            if (dropped.length === 0) return;
                                            setImages((prev) => {
                                                const available = MAX_CREATE_IMAGES - prev.length;
                                                if (available <= 0) {
                                                    toast({
                                                        title: "Limit reached",
                                                        description: `You can upload up to ${MAX_CREATE_IMAGES} images`,
                                                        variant: "warning",
                                                    });
                                                    return prev;
                                                }
                                                const accepted = dropped.slice(0, available);
                                                if (dropped.length > available) {
                                                    toast({
                                                        title: "Some files ignored",
                                                        description: `Only ${available} more image(s) allowed`,
                                                        variant: "warning",
                                                    });
                                                }
                                                return [...prev, ...accepted];
                                            });
                                        }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Click to upload or drag and drop up to 2 images
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            id="images"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => {
                                                const selected = Array.from(e.target.files ?? [])
                                                    .filter((f) => f.type.startsWith("image/"));
                                                if (selected.length === 0) return;
                                                setImages((prev) => {
                                                    const available = MAX_CREATE_IMAGES - prev.length;
                                                    if (available <= 0) {
                                                        toast({
                                                            title: "Limit reached",
                                                            description: `You can upload up to ${MAX_CREATE_IMAGES} images`,
                                                            variant: "warning",
                                                        });
                                                        return prev;
                                                    }
                                                    const accepted = selected.slice(0, available);
                                                    if (selected.length > available) {
                                                        toast({
                                                            title: "Some files ignored",
                                                            description: `Only ${available} more image(s) allowed`,
                                                            variant: "warning",
                                                        });
                                                    }
                                                    return [...prev, ...accepted];
                                                });
                                            }}
                                        />
                                    </div>
                                    {images.length > 0 && (
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {images.length} file(s) selected (max {MAX_CREATE_IMAGES})
                                            </p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {images.map((file, idx) => (
                                                    <img
                                                        key={`${file.name}-${idx}`}
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="w-full h-24 object-cover rounded"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* --- NEW: Video Section (Add) --- */}
                                <div className="grid gap-2 mt-4">
                                    <Label>Short Video (Optional)</Label>
                                    <div className="border-2 border-dashed rounded-lg p-4 text-center bg-muted/10">
                                        <input
                                            type="file"
                                            accept="video/mp4,video/webm"
                                            className="hidden"
                                            id="video-upload-input"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setVideo(file);
                                            }}
                                        />
                                        <label htmlFor="video-upload-input" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                            <span className="text-sm text-muted-foreground">
                                                {video ? video.name : "Click to upload video (mp4/webm)"}
                                            </span>
                                        </label>
                                    </div>
                                    {/* Video Preview */}
                                    {video && (
                                        <div className="mt-2 rounded border overflow-hidden">
                                            <video key={URL.createObjectURL(video)} controls className="w-full h-48 bg-black">
                                                <source src={URL.createObjectURL(video)} type={video.type} />
                                            </video>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Add Product</Button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>

                </Dialog>

                {/* edit product modal */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>

                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

                        <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>Update the product details</DialogDescription>
                        </DialogHeader>

                        <form action="" method="post" onSubmit={handleUpdateProduct}>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="editProductName">Product Name</Label>
                                        <Input
                                            id="editProductName"
                                            placeholder="Enter product name"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="editPurity">Purity</Label>
                                        <Select value={editPurity} onValueChange={setEditPurity}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select purity" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="24k">24K</SelectItem>
                                                <SelectItem value="22k">22K</SelectItem>
                                                <SelectItem value="20k">20K</SelectItem>
                                                <SelectItem value="18k">18K</SelectItem>
                                                <SelectItem value="14k">14K</SelectItem>
                                                <SelectItem value="9k">9K</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {editImageUrl && (
                                    <div className="grid gap-2">
                                        <Label>Current Images</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {editImageUrls.length > 0 ? (
                                                editImageUrls.map((url, idx) => (
                                                    <img
                                                        key={`${url}-${idx}`}
                                                        src={getImageUrl(url)}
                                                        alt={editName || "Product image"}
                                                        className="w-full h-36 object-cover rounded-md border"
                                                    />
                                                ))
                                            ) : (
                                                <img
                                                    src={getImageUrl(editImageUrl)}
                                                    alt={editName || "Product image"}
                                                    className="w-full h-36 object-cover rounded-md border"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label>Upload New Images (max 2)</Label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                                            ? "border-primary"
                                            : "border-muted-foreground/25"
                                            }`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDragging(true);
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            const dropped = Array.from(
                                                e.dataTransfer.files || []
                                            ).filter((f) => f.type.startsWith("image/"));
                                            if (dropped.length === 0) return;
                                            setEditImages((prev) => {
                                                const available = MAX_EDIT_IMAGES - prev.length;
                                                if (available <= 0) {
                                                    toast({
                                                        title: "Limit reached",
                                                        description: `You can upload up to ${MAX_EDIT_IMAGES} images`,
                                                        variant: "warning",
                                                    });
                                                    return prev;
                                                }
                                                const accepted = dropped.slice(0, available);
                                                if (dropped.length > available) {
                                                    toast({
                                                        title: "Some files ignored",
                                                        description: `Only ${available} more image(s) allowed`,
                                                        variant: "warning",
                                                    });
                                                }
                                                return [...prev, ...accepted];
                                            });
                                        }}
                                        onClick={() => editFileInputRef.current?.click()}
                                    >
                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Click to upload or drag and drop up to 2 images
                                        </p>
                                        <input
                                            ref={editFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => {
                                                const selected = Array.from(e.target.files ?? [])
                                                    .filter((f) => f.type.startsWith("image/"));
                                                if (selected.length === 0) return;
                                                setEditImages((prev) => {
                                                    const available = MAX_EDIT_IMAGES - prev.length;
                                                    if (available <= 0) {
                                                        toast({
                                                            title: "Limit reached",
                                                            description: `You can upload up to ${MAX_EDIT_IMAGES} images`,
                                                            variant: "warning",
                                                        });
                                                        return prev;
                                                    }
                                                    const accepted = selected.slice(0, available);
                                                    if (selected.length > available) {
                                                        toast({
                                                            title: "Some files ignored",
                                                            description: `Only ${available} more image(s) allowed`,
                                                            variant: "warning",
                                                        });
                                                    }
                                                    return [...prev, ...accepted];
                                                });
                                            }}
                                        />
                                    </div>
                                    {editImages.length > 0 && (
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {editImages.length} new file(s) selected (max {MAX_EDIT_IMAGES})
                                            </p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {editImages.map((file, idx) => (
                                                    <img
                                                        key={`${file.name}-${idx}`}
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="w-full h-24 object-cover rounded"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* --- NEW: Video Section (Edit) --- */}
                                <div className="grid gap-2 mt-4">
                                    <Label>Short Video</Label>

                                    {/* Show Existing Video */}
                                    {existingVideoUrl && (
                                        <div className="mb-2">
                                            <p className="text-xs text-muted-foreground mb-1">Current Video:</p>
                                            <div className="rounded border overflow-hidden">
                                                <video controls className="w-full h-40 bg-black">
                                                    <source src={getImageUrl(existingVideoUrl)} />
                                                </video>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload New Video */}
                                    <div className="border-2 border-dashed rounded-lg p-4 text-center bg-muted/10">
                                        <input
                                            type="file"
                                            accept="video/mp4,video/webm"
                                            className="hidden"
                                            id="edit-video-input"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setEditVideo(file);
                                            }}
                                        />
                                        <label htmlFor="edit-video-input" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                            <span className="text-sm text-muted-foreground">
                                                {editVideo ? editVideo.name : "Click to replace video"}
                                            </span>
                                        </label>
                                    </div>

                                    {/* New Video Preview */}
                                    {editVideo && (
                                        <div className="mt-2 rounded border overflow-hidden">
                                            <video key={URL.createObjectURL(editVideo)} controls className="w-full h-48 bg-black">
                                                <source src={URL.createObjectURL(editVideo)} type={editVideo.type} />
                                            </video>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="editCategory">Category</Label>
                                        <Select
                                            value={editCategoryId}
                                            onValueChange={setEditCategoryId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={String(category.id)}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="editCollection">Collection</Label>
                                        <Select
                                            value={editCollectionId}
                                            onValueChange={setEditCollectionId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select collection" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {collections.map((collection) => (
                                                    <SelectItem
                                                        key={collection.id}
                                                        value={String(collection.id)}
                                                    >
                                                        {collection.name}

                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="editWeight">Weight (grams)</Label>
                                        <Input
                                            id="editWeight"
                                            type="number"
                                            placeholder="Enter weight"
                                            value={editWeight}
                                            onChange={(e) => setEditWeight(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="editMakingPercentage">
                                            Making Percentage(%)
                                        </Label>
                                        <Input
                                            id="editMakingPercentage"
                                            type="number"
                                            placeholder="Enter making percentage"
                                            value={editMakingPercentage}
                                            onChange={(e) => setEditMakingPercentage(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="editMetalType">Metal Type</Label>
                                        <Select value={editMetalType} onValueChange={setEditMetalType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select metal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Gold">Gold</SelectItem>
                                                <SelectItem value="Silver">Silver</SelectItem>
                                                <SelectItem value="Platinum">Platinum</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="editPrice">Price (₹)</Label>
                                        <Input id="editPrice" value={editPrice} disabled placeholder="Auto-calculated" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">

                                    {/* <div className="grid gap-2">
                    <Label htmlFor="editStock">Stock</Label>
                    <Input id="editStock" value={editStock} disabled placeholder="Auto-managed" />
                  </div> */}
                                </div>

                                {/* Edit Sizes Manager */}
                                <div className="grid gap-3">
                                    <Label>Edit Sizes</Label>
                                    <div className="text-xs text-muted-foreground mb-1">
                                        Modify available sizes and per-size quantity. Use OneSize for items without size.
                                    </div>
                                    <div className="space-y-2">
                                        {editSizes.map((row, idx) => (
                                            <div key={idx} className="grid grid-cols-5 gap-2">
                                                <div className="col-span-3">
                                                    <Input
                                                        placeholder="Size"
                                                        value={row.size}
                                                        onChange={(e) => {
                                                            const next = [...editSizes];
                                                            next[idx] = { ...next[idx], size: e.target.value };
                                                            setEditSizes(next);
                                                        }}
                                                    />
                                                </div>
                                                {/* <div>
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={String(row.quantity)}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value || 0));
                              const next = [...editSizes];
                              next[idx] = { ...next[idx], quantity: val };
                              setEditSizes(next);
                            }}
                          />
                        </div> */}
                                                <div className="flex items-center">
                                                    <Button
                                                        variant="outline"
                                                        type="button"
                                                        onClick={() => setEditSizes(editSizes.filter((_, i) => i !== idx))}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setEditSizes([...editSizes, { size: "", quantity: 0 }])}
                                        >
                                            + Add Size
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="editStatus">Active</Label>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="editStatus"
                                            checked={editStatusActive}
                                            onCheckedChange={(checked) =>
                                                setEditStatusActive(Boolean(checked))
                                            }
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            Toggle to set status 1 (active) or 0 (inactive)
                                        </span>
                                    </div>
                                </div>
                                {/* Image editing not included; showing preview above if available */}

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Update Product</Button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>

                </Dialog>
            </div>

            {/* tabs */}
            <Tabs defaultValue="products" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="products">All Products</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="collections">Collections</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-4">
                    {/*  serach and Filters */}
                    <Card>
                        <CardContent className="pt-6">

                            <div className="flex gap-4">

                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>

                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.name.toLowerCase()}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            </div>

                        </CardContent>
                    </Card>

                    {/* Products Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Products ({products.length})</CardTitle>
                            <CardDescription>Manage your jewelry inventory</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Checkbox
                                                checked={
                                                    selectedProductIds.length > 0 &&
                                                    selectedProductIds.length === products.length
                                                }
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedProductIds(products.map((p) => p.id));
                                                    } else {
                                                        setSelectedProductIds([]);
                                                    }
                                                }}
                                            />
                                        </TableHead>
                                        <TableHead>Product ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Collection</TableHead>
                                        <TableHead>Weight</TableHead>
                                        <TableHead>Purity</TableHead>
                                        <TableHead>Making Charges</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => {
                                        const categoryName =
                                            (product?.category && typeof product.category === "object"
                                                ? product.category?.name
                                                : product?.category) ||
                                            product?.category_name ||
                                            "-";

                                        const collectionName =
                                            (product?.collection && typeof product.collection === "object"
                                                ? product.collection?.name
                                                : product?.collection) ||
                                            product?.collection_name ||
                                            "-";



                                        const makingCharges =
                                            product?.makingCharges ?? product?.making_charges ?? "-";
                                        const statusText = (() => {
                                            const val = product?.status;
                                            if (typeof val === "string") return val;
                                            if (typeof val === "number")
                                                return val === 1 ? "Active" : "Inactive";
                                            if (typeof val === "boolean")
                                                return val ? "Active" : "Inactive";
                                            return "Inactive";
                                        })();
                                        const statusVariant =
                                            statusText === "Active" ? "default" : "destructive";
                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedProductIds.includes(product.id)}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedProductIds((prev) =>
                                                                checked
                                                                    ? Array.from(new Set([...prev, product.id]))
                                                                    : prev.filter((id) => id !== product.id)
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {product.id}
                                                </TableCell>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>{categoryName}</TableCell>
                                                <TableCell>{collectionName}</TableCell>
                                                <TableCell>{product.weight ?? "-"}</TableCell>
                                                <TableCell>
                                                    {product.purity ?? product.karat ?? "-"}
                                                </TableCell>
                                                <TableCell>{makingCharges}</TableCell>
                                                <TableCell className="font-medium">
                                                    {product.price ?? "-"}
                                                </TableCell>
                                                <TableCell>{product.stock ?? "-"}</TableCell>
                                                <TableCell>
                                                    <Badge variant={statusVariant}>{statusText}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditDialogForProduct(product)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        Delete product?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will
                                                                        permanently delete "{product.name}" (ID:{" "}
                                                                        {product.id}).
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            handleDeleteProduct(product.id)
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                    {/* Search and Filters */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search categories..."
                                            value={categorySearchTerm}
                                            onChange={(e) => setCategorySearchTerm(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>
                                <Dialog
                                    open={categoryCreateOpen}
                                    onOpenChange={setCategoryCreateOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" /> Add Category
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Create Category</DialogTitle>
                                            <DialogDescription>Add a new category</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleCreateCategory}>
                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="newCategoryName">Name</Label>
                                                    <Input
                                                        id="newCategoryName"
                                                        placeholder="e.g. Gold"
                                                        value={newCategoryName}
                                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="newCategoryDescription">Description</Label>
                                                    <Textarea
                                                        id="newCategoryDescription"
                                                        placeholder="Short description"
                                                        value={newCategoryDescription}
                                                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Category Image</Label>
                                                    <div
                                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                                                            ? "border-primary"
                                                            : "border-muted-foreground/25"
                                                            }`}
                                                        onDragOver={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(true);
                                                        }}
                                                        onDragLeave={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(false);
                                                        }}
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(false);
                                                            const dropped = Array.from(e.dataTransfer.files || [])
                                                                .filter((f) => f.type.startsWith("image/"));
                                                            if (dropped[0]) setNewCategoryImage(dropped[0]);
                                                        }}
                                                        onClick={() => categoryCreateFileRef.current?.click()}
                                                    >
                                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                                        <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop image</p>
                                                        <input
                                                            ref={categoryCreateFileRef}
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const f = (e.target.files && e.target.files[0]) || null;
                                                                if (f) setNewCategoryImage(f);
                                                            }}
                                                        />
                                                    </div>
                                                    {newCategoryImage && (
                                                        <img
                                                            src={URL.createObjectURL(newCategoryImage)}
                                                            alt="preview"
                                                            className="w-full h-28 object-cover rounded border"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setCategoryCreateOpen(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit">Create</Button>
                                                </div>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Categories ({(categories as any[]).length})</CardTitle>
                            <CardDescription>Manage product categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Dialog
                                open={categoryEditOpen}
                                onOpenChange={setCategoryEditOpen}
                            >
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit Category</DialogTitle>
                                        <DialogDescription>
                                            Update the category details
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdateCategory}>
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="editCategoryName">Name</Label>
                                                <Input
                                                    id="editCategoryName"
                                                    placeholder="Category name"
                                                    value={categoryEditName}
                                                    onChange={(e) => setCategoryEditName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="editCategoryDescription">Description</Label>
                                                <Textarea
                                                    id="editCategoryDescription"
                                                    placeholder="Short description"
                                                    value={categoryEditDescription}
                                                    onChange={(e) => setCategoryEditDescription(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Category Image</Label>
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                                                        ? "border-primary"
                                                        : "border-muted-foreground/25"
                                                        }`}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(true);
                                                    }}
                                                    onDragLeave={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(false);
                                                    }}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(false);
                                                        const dropped = Array.from(e.dataTransfer.files || [])
                                                            .filter((f) => f.type.startsWith("image/"));
                                                        if (dropped[0]) setCategoryEditImage(dropped[0]);
                                                    }}
                                                    onClick={() => categoryEditFileRef.current?.click()}
                                                >
                                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                                    <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop image</p>
                                                    <input
                                                        ref={categoryEditFileRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const f = (e.target.files && e.target.files[0]) || null;
                                                            if (f) setCategoryEditImage(f);
                                                        }}
                                                    />
                                                </div>
                                                {categoryEditImage && (
                                                    <img
                                                        src={URL.createObjectURL(categoryEditImage)}
                                                        alt="preview"
                                                        className="w-full h-28 object-cover rounded border"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setCategoryEditOpen(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit">Update</Button>
                                            </div>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(categories as any[])
                                        .filter((category) =>
                                            category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
                                        )
                                        .map((category) => {
                                            const statusText = category?.status === 1 || category?.status === "1" ? "Active" : "Inactive";
                                            const statusVariant = statusText === "Active" ? "default" : "destructive";
                                            const img = category?.image
                                                ? getImageUrl(category.image)
                                                : undefined;

                                            return (
                                                <TableRow key={category.id}>
                                                    <TableCell className="font-medium">{category.id}</TableCell>
                                                    <TableCell>
                                                        <div className="w-16 h-16 rounded border bg-muted/30 flex items-center justify-center overflow-hidden">
                                                            {img ? (
                                                                <img src={img} alt={category.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">No image</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{category.name}</TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {category.description || "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={statusVariant}>{statusText}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(category.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openEditCategory(category.id)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            Delete category?
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will
                                                                            permanently delete "{category.name}" (ID:{" "}
                                                                            {category.id}).
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                handleDeleteCategory(category.id)
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="collections" className="space-y-4">
                    {/* Search and Filters */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search collections..."
                                            value={collectionSearchTerm}
                                            onChange={(e) => setCollectionSearchTerm(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>
                                <Dialog
                                    open={collectionCreateOpen}
                                    onOpenChange={setCollectionCreateOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" /> Add Collection
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Create Collection</DialogTitle>
                                            <DialogDescription>Add a new Collection</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleCreateCollection}>
                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="newCollectionName">Name</Label>
                                                    <Input
                                                        id="newCollectionName"
                                                        placeholder="e.g. Diamond Collection"
                                                        value={newCollectionName}
                                                        onChange={(e) => setNewCollectionName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="newCollectionDescription">Description</Label>
                                                    <Textarea
                                                        id="newCollectionDescription"
                                                        placeholder="Short description"
                                                        value={newCollectionDescription}
                                                        onChange={(e) => setNewCollectionDescription(e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Collection Image</Label>
                                                    <div
                                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                                                            ? "border-primary"
                                                            : "border-muted-foreground/25"
                                                            }`}
                                                        onDragOver={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(true);
                                                        }}
                                                        onDragLeave={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(false);
                                                        }}
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            setIsDragging(false);
                                                            const dropped = Array.from(e.dataTransfer.files || [])
                                                                .filter((f) => f.type.startsWith("image/"));
                                                            if (dropped[0]) setNewCollectionImage(dropped[0]);
                                                        }}
                                                        onClick={() => collectionCreateFileRef.current?.click()}
                                                    >
                                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                                        <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop image</p>
                                                        <input
                                                            ref={collectionCreateFileRef}
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const f = (e.target.files && e.target.files[0]) || null;
                                                                if (f) setNewCollectionImage(f);
                                                            }}
                                                        />
                                                    </div>
                                                    {newCollectionImage && (
                                                        <img
                                                            src={URL.createObjectURL(newCollectionImage)}
                                                            alt="preview"
                                                            className="w-full h-28 object-cover rounded border"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setCollectionCreateOpen(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit">Create</Button>
                                                </div>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Collections Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Collections ({(collections as any[]).length})</CardTitle>
                            <CardDescription>Manage product collections</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Dialog
                                open={collectionEditOpen}
                                onOpenChange={setCollectionEditOpen}
                            >
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit Collection</DialogTitle>
                                        <DialogDescription>
                                            Update the collection details
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdateCollection}>
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="editCollectionName">Name</Label>
                                                <Input
                                                    id="editCollectionName"
                                                    placeholder="Collection name"
                                                    value={collectionEditName}
                                                    onChange={(e) => setCollectionEditName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="editCollectionDescription">Description</Label>
                                                <Textarea
                                                    id="editCollectionDescription"
                                                    placeholder="Short description"
                                                    value={collectionEditDescription}
                                                    onChange={(e) => setCollectionEditDescription(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Collection Image</Label>
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                                                        ? "border-primary"
                                                        : "border-muted-foreground/25"
                                                        }`}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(true);
                                                    }}
                                                    onDragLeave={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(false);
                                                    }}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(false);
                                                        const dropped = Array.from(e.dataTransfer.files || [])
                                                            .filter((f) => f.type.startsWith("image/"));
                                                        if (dropped[0]) setCollectionEditImage(dropped[0]);
                                                    }}
                                                    onClick={() => collectionEditFileRef.current?.click()}
                                                >
                                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                                    <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop image</p>
                                                    <input
                                                        ref={collectionEditFileRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const f = (e.target.files && e.target.files[0]) || null;
                                                            if (f) setCollectionEditImage(f);
                                                        }}
                                                    />
                                                </div>
                                                {collectionEditImage && (
                                                    <img
                                                        src={URL.createObjectURL(collectionEditImage)}
                                                        alt="preview"
                                                        className="w-full h-28 object-cover rounded border"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setCollectionEditOpen(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit">Update</Button>
                                            </div>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(collections as any[])
                                        .filter((collection) =>
                                            collection.name.toLowerCase().includes(collectionSearchTerm.toLowerCase())
                                        )
                                        .map((collection) => {
                                            const statusText = collection?.status === 1 || collection?.status === "1" ? "Active" : "Inactive";
                                            const statusVariant = statusText === "Active" ? "default" : "destructive";
                                            const img = collection?.image
                                                ? getImageUrl(collection.image)
                                                : undefined;

                                            return (
                                                <TableRow key={collection.id}>
                                                    <TableCell className="font-medium">{collection.id}</TableCell>
                                                    <TableCell>
                                                        <div className="w-16 h-16 rounded border bg-muted/30 flex items-center justify-center overflow-hidden">
                                                            {img ? (
                                                                <img src={img} alt={collection.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">No image</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{collection.name}</TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {collection.description || "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={statusVariant}>{statusText}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(collection.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openEditCollection(collection.id)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            Delete collection?
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will
                                                                            permanently delete "{collection.name}" (ID:{" "}
                                                                            {collection.id}).
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                handleDeleteCollection(collection.id)
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="bulk" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bulk Operations</CardTitle>
                            <CardDescription>
                                Perform bulk actions on products
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Products (CSV)
                </Button>
                <Button variant="outline">Export Products (CSV)</Button> */}
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        // Initialize price map for selected rows
                                        const map: Record<string, string> = {};
                                        selectedProductIds.forEach((id) => {
                                            const p = products.find((pp) => pp.id === id);
                                            if (p) map[String(id)] = p.price ? String(p.price) : "";
                                        });
                                        setBulkPrices(map);
                                        setBulkApplyAll("");
                                        setBulkDialogOpen(true);
                                    }}
                                >
                                    Bulk Price Update
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const map: Record<string, string> = {};
                                        selectedProductIds.forEach((id) => {
                                            const p = products.find((pp) => pp.id === id);
                                            if (p) {
                                                const val = p.status;
                                                const isActive =
                                                    val === 1 ||
                                                    val === "1" ||
                                                    val === true ||
                                                    val === "active";
                                                map[String(id)] = isActive ? "1" : "0";
                                            }
                                        });
                                        setBulkStatuses(map);
                                        setBulkStatusApplyAll("");
                                        setBulkStatusDialogOpen(true);
                                    }}
                                >
                                    Bulk Status Update
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Bulk Price Update</DialogTitle>
                                <DialogDescription>
                                    Update prices for selected products. Provide new price per row
                                    or apply one value to all.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <Label htmlFor="applyAll">Apply one price to all</Label>
                                        <Input
                                            id="applyAll"
                                            type="number"
                                            placeholder="e.g. 1500"
                                            value={bulkApplyAll}
                                            onChange={(e) => setBulkApplyAll(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const next: Record<string, string> = { ...bulkPrices };
                                            selectedProductIds.forEach((id) => {
                                                next[String(id)] = bulkApplyAll;
                                            });
                                            setBulkPrices(next);
                                        }}
                                    >
                                        Apply to all
                                    </Button>
                                </div>

                                {selectedProductIds.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">
                                        No products selected. Go to the Products tab and select rows
                                        with the checkbox.
                                    </div>
                                ) : (
                                    <div className="max-h-[50vh] overflow-y-auto border rounded">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[120px]">
                                                        Product ID
                                                    </TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead className="w-[160px]">
                                                        New Price (₹)
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedProductIds.map((id) => {
                                                    const p = products.find((pp) => pp.id === id);
                                                    if (!p) return null;
                                                    return (
                                                        <TableRow key={String(id)}>
                                                            <TableCell className="font-mono">{id}</TableCell>
                                                            <TableCell className="truncate max-w-xs">
                                                                {p.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="e.g. 1500"
                                                                    value={bulkPrices[String(id)] ?? ""}
                                                                    onChange={(e) =>
                                                                        setBulkPrices((prev) => ({
                                                                            ...prev,
                                                                            [String(id)]: e.target.value,
                                                                        }))
                                                                    }
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBulkDialogOpen(false)}
                                        disabled={bulkSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={async () => {
                                            if (selectedProductIds.length === 0) {
                                                toast({
                                                    title: "Warning",
                                                    description: "Select at least one product",
                                                    variant: "warning",
                                                });
                                                return;
                                            }
                                            const items = selectedProductIds
                                                .map((id) => ({
                                                    id,
                                                    price: Number(bulkPrices[String(id)]),
                                                }))
                                                .filter((x) => !Number.isNaN(x.price) && x.price > 0);
                                            if (items.length === 0) {
                                                toast({
                                                    title: "Warning",
                                                    description: "Provide valid prices",
                                                    variant: "warning",
                                                });
                                                return;
                                            }
                                            try {
                                                setBulkSubmitting(true);
                                                try {
                                                    await bulkUpdateProductPrices(token as string, {
                                                        products: items as any,
                                                    });
                                                } catch (err) {
                                                    for (const it of items) {
                                                        await updateProduct(token as string, it.id, {
                                                            price: it.price,
                                                        });
                                                    }
                                                }
                                                toast({
                                                    title: "Success",
                                                    description: "Prices updated successfully",
                                                    variant: "success",
                                                });
                                                setBulkDialogOpen(false);
                                                const res = await getProducts(token as string);
                                                setProducts(res.data?.data ?? res.data ?? []);
                                            } catch (e) {
                                                toast({
                                                    title: "Error",
                                                    description: "Failed to update prices",
                                                    variant: "destructive",
                                                });
                                            } finally {
                                                setBulkSubmitting(false);
                                            }
                                        }}
                                        disabled={bulkSubmitting}
                                    >
                                        {bulkSubmitting ? "Updating..." : "Update Prices"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={bulkStatusDialogOpen}
                        onOpenChange={setBulkStatusDialogOpen}
                    >
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Bulk Status Update</DialogTitle>
                                <DialogDescription>
                                    Activate or deactivate selected products. Choose per row or
                                    apply one value to all.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <Label htmlFor="applyAllStatus">
                                            Apply one status to all
                                        </Label>
                                        <Select
                                            value={bulkStatusApplyAll}
                                            onValueChange={setBulkStatusApplyAll}
                                        >
                                            <SelectTrigger id="applyAllStatus">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Active</SelectItem>
                                                <SelectItem value="0">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const next: Record<string, string> = { ...bulkStatuses };
                                            selectedProductIds.forEach((id) => {
                                                if (bulkStatusApplyAll !== "") {
                                                    next[String(id)] = bulkStatusApplyAll;
                                                }
                                            });
                                            setBulkStatuses(next);
                                        }}
                                    >
                                        Apply to all
                                    </Button>
                                </div>

                                {selectedProductIds.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">
                                        No products selected. Go to the Products tab and select rows
                                        with the checkbox.
                                    </div>
                                ) : (
                                    <div className="max-h-[50vh] overflow-y-auto border rounded">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[120px]">
                                                        Product ID
                                                    </TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead className="w-[200px]">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedProductIds.map((id) => {
                                                    const p = products.find((pp) => pp.id === id);
                                                    if (!p) return null;
                                                    return (
                                                        <TableRow key={String(id)}>
                                                            <TableCell className="font-mono">{id}</TableCell>
                                                            <TableCell className="truncate max-w-xs">
                                                                {p.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={bulkStatuses[String(id)] ?? ""}
                                                                    onValueChange={(val) =>
                                                                        setBulkStatuses((prev) => ({
                                                                            ...prev,
                                                                            [String(id)]: val,
                                                                        }))
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="1">Active</SelectItem>
                                                                        <SelectItem value="0">Inactive</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBulkStatusDialogOpen(false)}
                                        disabled={bulkStatusSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={async () => {
                                            if (selectedProductIds.length === 0) {
                                                toast({
                                                    title: "Warning",
                                                    description: "Select at least one product",
                                                    variant: "warning",
                                                });
                                                return;
                                            }
                                            const items = selectedProductIds
                                                .map((id) => ({
                                                    id,
                                                    status: Number(bulkStatuses[String(id)]),
                                                }))
                                                .filter((x) => x.status === 0 || x.status === 1);
                                            if (items.length === 0) {
                                                toast({
                                                    title: "Warning",
                                                    description: "Provide valid statuses",
                                                    variant: "warning",
                                                });
                                                return;
                                            }
                                            try {
                                                setBulkStatusSubmitting(true);
                                                try {
                                                    const uniqueStatuses = Array.from(
                                                        new Set(items.map((i) => i.status))
                                                    );
                                                    if (uniqueStatuses.length === 1) {
                                                        await bulkUpdateProductStatus(token as string, {
                                                            ids: items.map((i) => i.id) as any,
                                                            status: uniqueStatuses[0],
                                                        });
                                                    } else {
                                                        await bulkUpdateProductStatus(token as string, {
                                                            products: items as any,
                                                        });
                                                    }
                                                } catch (err) {
                                                    for (const it of items) {
                                                        await updateProduct(token as string, it.id, {
                                                            status: it.status,
                                                        });
                                                    }
                                                }
                                                toast({
                                                    title: "Success",
                                                    description: "Statuses updated successfully",
                                                    variant: "success",
                                                });
                                                setBulkStatusDialogOpen(false);
                                                const res = await getProducts(token as string);
                                                setProducts(res.data?.data ?? res.data ?? []);
                                            } catch (e) {
                                                toast({
                                                    title: "Error",
                                                    description: "Failed to update statuses",
                                                    variant: "destructive",
                                                });
                                            } finally {
                                                setBulkStatusSubmitting(false);
                                            }
                                        }}
                                        disabled={bulkStatusSubmitting}
                                    >
                                        {bulkStatusSubmitting ? "Updating..." : "Update Statuses"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProductManagement;