import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlistItems, removeFromWishlist } from "@/lib/api/wishlistController";
import { addToCart } from "@/lib/api/cartController";
import { useUserAuth } from "@/context/UserAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Heart, ArrowLeft, ShoppingCart, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuantityDialog from "@/components/QuantityDialog";
import { getImageUrl } from "@/config";
import ProfileLayout from "@/components/ProfileLayout";
import { getUserProfile } from "@/lib/api/userController";
import { Loader2 } from "lucide-react";

const Wishlist = () => {
  const navigate = useNavigate();
  const { token } = useUserAuth();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getUserProfile(token);
      setProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }, [token]);

  const fetchWishlistItems = useCallback(async () => {
    if (!token) {
      navigate("/signin");
      return;
    }

    setLoading(true);
    try {
      const response = await getWishlistItems(token);
      console.log("Wishlist API Response:", response);

      // Handle different API response structures
      let items: any[] = [];

      if (response.success) {
        // Try different possible data structures
        if (response.data?.items && Array.isArray(response.data.items)) {
          items = response.data.items;
        } else if (response.data?.wishlist && Array.isArray(response.data.wishlist)) {
          items = response.data.wishlist;
        } else if (Array.isArray(response.data)) {
          items = response.data;
        } else if (response.items && Array.isArray(response.items)) {
          items = response.items;
        } else if (response.wishlist && Array.isArray(response.wishlist)) {
          items = response.wishlist;
        }
      } else if (Array.isArray(response)) {
        items = response;
      }

      console.log("Parsed Wishlist Items:", items);
      setWishlistItems(items);
    } catch (err: any) {
      console.error("Wishlist fetch error:", err);
      toast({
        title: "Error",
        description: "Failed to load wishlist items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token, navigate, toast]);

  const handleRemoveFromWishlist = async (wishlistId: number, productId?: number) => {
    if (!token) return;

    setRemoving(wishlistId);
    try {
      const data = await removeFromWishlist(
        {
          wishlist_id: wishlistId,
          product_id: productId,
          id: wishlistId
        },
        token
      );

      // Handle different success response formats
      if (data.success || data.status === 'success' || data.message?.includes('removed')) {
        toast({
          title: "Success",
          description: data.message || "Item removed from wishlist",
        });
        fetchWishlistItems();
      } else {
        // Even if success flag is missing, refresh the list
        fetchWishlistItems();
      }
    } catch (err: any) {
      console.error("Remove from wishlist error:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to remove item from wishlist",
        variant: "destructive",
      });
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = (product: any) => {
    setSelectedProduct(product);
    setShowQuantityDialog(true);
  };

  const handleQuantityConfirm = async (quantity: number) => {
    if (!token || !selectedProduct) return;

    setAddingToCart(selectedProduct.id);
    try {
      const data = await addToCart({ product_id: selectedProduct.id, quantity }, token);
      if (data.success) {
        toast({
          title: "Success",
          description: "Item added to cart successfully",
        });
        setShowQuantityDialog(false);
        setSelectedProduct(null);
      }
    } catch (err: any) {
      console.error("Add to cart error:", err);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchWishlistItems();
  }, [fetchProfile, fetchWishlistItems]);

  const handleSectionChange = (
    section: "profile" | "plans" | "wallet" | "vault" | "customOrders" | "orders" | "wishlist"
  ) => {
    if (section === "wishlist") return;
    if (section === "orders") {
      navigate("/orders");
      return;
    }
    if (section === "wallet") {
      navigate("/wallet");
      return;
    }
    navigate("/profile", { state: { activeSection: section } });
  };

  const getProductImages = (product: any) => {
    if (!product) return "/placeholder.svg";
    try {
      const imageData = JSON.parse(product.image || "[]");
      if (Array.isArray(imageData) && imageData.length > 0) {
        return getImageUrl(imageData[0]);
      }
    } catch (error) {
      console.error("Error parsing product images:", error);
    }
    return "/placeholder.svg";
  };

  // Helper function to get product data from wishlist item (handles different API structures)
  const getProduct = (item: any) => {
    // If item has a product property, use it
    if (item.product) {
      return item.product;
    }
    // Otherwise, the item itself is the product
    return item;
  };

  // Helper to get wishlist ID for removal
  const getWishlistId = (item: any) => {
    return item.wishlist_id || item.id;
  };

  // Helper to get product ID
  const getProductId = (item: any) => {
    const product = getProduct(item);
    return product.id || item.product_id;
  };

  if (loading) {
    return (
      <ProfileLayout
        activeSection="wishlist"
        setActiveSection={handleSectionChange}
        profile={profile}
      >
        <div className="flex justify-center items-center h-80">
          <Loader2 className="w-6 h-6 animate-spin text-[#084526]" />
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout
      activeSection="wishlist"
      setActiveSection={handleSectionChange}
      profile={profile}
    >
      <div className="space-y-6 border p-6 rounded-2xl bg-gray-50 shadow-sm">
        <div className="flex items-center justify-between space-x-3 border-b pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#084526] rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#084526]">My Wishlist</h1>
              <p className="text-gray-600">Your favorite jewelry pieces</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className={`w-10 h-10 p-0 ${viewMode === "grid" ? "bg-[#084526] hover:bg-[#0a5a2e]" : "text-[#084526] border-[#084526]"}`}
              onClick={() => setViewMode("grid")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              className={`w-10 h-10 p-0 ${viewMode === "list" ? "bg-[#084526] hover:bg-[#0a5a2e]" : "text-[#084526] border-[#084526]"}`}
              onClick={() => setViewMode("list")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3" y2="6"></line>
                <line x1="3" y1="12" x2="3" y2="12"></line>
                <line x1="3" y1="18" x2="3" y2="18"></line>
              </svg>
            </Button>
          </div>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="space-y-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => {
                  const product = getProduct(item);
                  const wishlistId = getWishlistId(item);
                  const productId = getProductId(item);

                  return (
                    <div
                      key={wishlistId}
                      className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100 group hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="relative mb-4">
                        <img
                          src={getProductImages(product)}
                          alt={product.name || "Product"}
                          className="w-full h-48 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(wishlistId, productId)}
                            disabled={removing === wishlistId}
                            className="w-8 h-8 p-0 bg-white/90 hover:bg-red-50 text-red-600 hover:text-red-800 border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {product.purity && (
                          <div className="absolute top-3 left-3">
                            <div className="bg-[#084526] text-white px-2 py-1 rounded-full text-xs font-bold">
                              {product.purity}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-[#084526] transition-colors">
                          {product.name || "Unnamed Product"}
                        </h3>

                        <div className="space-y-1">
                          {product.purity && (
                            <p className="text-sm text-amber-600 font-medium flex items-center">
                              <Sparkles className="w-4 h-4 mr-1" />
                              Purity: {product.purity}
                            </p>
                          )}
                          {product.weight && (
                            <p className="text-sm text-gray-600">Weight: {product.weight} g</p>
                          )}
                          <p className="text-xl font-bold text-[#084526]">
                            ₹{Number(product.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3">

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => {
                  const product = getProduct(item);
                  const wishlistId = getWishlistId(item);
                  const productId = getProductId(item);

                  return (
                    <div
                      key={wishlistId}
                      className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100 flex items-center space-x-6 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={getProductImages(product)}
                          alt={product.name || "Product"}
                          className="w-full h-full object-cover rounded-xl shadow-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                              {product.name || "Unnamed Product"}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              {product.purity && (
                                <>
                                  <div className="bg-[#084526] text-white px-2 py-1 rounded-full text-xs font-bold">
                                    {product.purity}
                                  </div>
                                  <p className="text-sm text-amber-600 font-medium flex items-center">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Purity: {product.purity}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveFromWishlist(wishlistId, productId)}
                              disabled={removing === wishlistId}
                              className="w-8 h-8 p-0 bg-white/90 hover:bg-red-50 text-red-600 hover:text-red-800 border-red-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 mb-4">
                          {product.weight && (
                            <p className="text-sm text-gray-600">Weight: {product.weight} g</p>
                          )}
                          <p className="text-xl font-bold text-[#084526]">
                            ₹{Number(product.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Wishlist is empty</h3>
              <p className="text-gray-600 mb-8">Start adding your favourite jewelry items</p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/")}
                  className="w-full bg-[#084526] hover:bg-[#0a5a2e] text-white px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  Explore Collections
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/cart")}
                  className="w-full text-[#084526] border-[#084526] hover:bg-[#084526] hover:text-white"
                >
                  View Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <QuantityDialog
        isOpen={showQuantityDialog}
        onClose={() => setShowQuantityDialog(false)}
        onConfirm={handleQuantityConfirm}
        productName={selectedProduct?.name || ""}
        purity={selectedProduct?.purity}
        weight={selectedProduct?.weight}
      />
    </ProfileLayout>
  );
};

export default Wishlist;
