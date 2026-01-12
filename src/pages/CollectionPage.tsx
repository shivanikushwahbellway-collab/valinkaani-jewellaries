// import Header from "@/components/Header";
// import { Link, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Footer from "@/components/Footer";
// import ContactSection from "@/components/ContactSection";
// import { Heart, ShoppingCart } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { getCollectionProducts, getPublicCategories } from "@/lib/api/publicController";
// import { addToCart } from "@/lib/api/cartController";
// import { addToWishlist } from "@/lib/api/wishlistController";
// import { useUserAuth } from "@/context/UserAuthContext";
// import { useToast } from "@/hooks/use-toast";
// import QuantityDialog from "@/components/QuantityDialog";
// import { API_BASE_URL, getImageUrl } from "@/config";

// const CollectionPage = () => {
//     const { collectionId } = useParams();
//     const navigate = useNavigate();
//     const { token, isAuthenticated } = useUserAuth();
//     const { toast } = useToast();
//     const [collection, setCollection] = useState<any>(null);
//     const [products, setProducts] = useState<any[]>([]);
//     const [categories, setCategories] = useState<any[]>([]);
//     const [selectedCategoryName, setSelectedCategoryName] = useState<string>("All");
//     const [loading, setLoading] = useState(true);
//     const [quantityDialog, setQuantityDialog] = useState<{
//         isOpen: boolean;
//         product: any;
//     }>({ isOpen: false, product: null });
//     const [addingToCart, setAddingToCart] = useState(false);
//     const [addingToWishlist, setAddingToWishlist] = useState<number | null>(null);

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, [collectionId]);

//     useEffect(() => {
//         const fetchCollectionData = async () => {
//             if (!collectionId) return;

//             try {
//                 setLoading(true);
//                 const [collectionResponse, categoriesResponse] = await Promise.all([
//                     getCollectionProducts(collectionId),
//                     getPublicCategories()
//                 ]);

//                 if (collectionResponse.data.success) {
//                     setCollection(collectionResponse.data.data.collection);
//                     setProducts(collectionResponse.data.data.products || []);
//                 }

//                 if (categoriesResponse.data.success) {
//                     setCategories(categoriesResponse.data.data || []);
//                 }
//             } catch (error) {
//                 console.error("Error fetching collection data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCollectionData();
//     }, [collectionId]);

//     // --- UPDATED HELPER: Handle Images & Video ---
//     const getProductMedia = (product: any) => {
//         try {
//             const imageData = JSON.parse(product.image || "[]");

//             // Main Image
//             const mainImage = (Array.isArray(imageData) && imageData.length > 0)
//                 ? getImageUrl(imageData[0])
//                 : "/placeholder.svg";

//             // Fallback Hover Image (Agar video na ho to yahi dikhegi)
//             const secondImage = (Array.isArray(imageData) && imageData.length > 1)
//                 ? getImageUrl(imageData[1])
//                 : mainImage;

//             // Check for Video
//             const videoUrl = product.short_video ? getImageUrl(product.short_video) : null;

//             return {
//                 main: mainImage,
//                 hoverImg: secondImage,
//                 hoverVideo: videoUrl
//             };
//         } catch (error) {
//             return {
//                 main: "/placeholder.svg",
//                 hoverImg: "/placeholder.svg",
//                 hoverVideo: null
//             };
//         }
//     };

//     // --- VIDEO HANDLERS ---
//     const handleMouseEnter = (e: React.MouseEvent<HTMLVideoElement>) => {
//         const video = e.currentTarget;
//         video.play().catch(err => console.log("Video play error:", err));
//     };

//     const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
//         const video = e.currentTarget;
//         video.pause();
//         video.currentTime = 0; // Video wapas shuru se chlegi jab hatoge
//     };

//     const handleAddToCart = (product: any) => {
//         if (!isAuthenticated) {
//             navigate("/signin");
//             return;
//         }
//         setQuantityDialog({ isOpen: true, product });
//     };

//     const handleConfirmAddToCart = async (quantity: number, size?: string | number) => {
//         if (!token || !quantityDialog.product) return;

//         setAddingToCart(true);
//         try {
//             const data = await addToCart(
//                 { product_id: quantityDialog.product.id, quantity, size },
//                 token
//             );
//             if (data.success) {
//                 toast({
//                     title: "Success",
//                     description: "Product added to cart successfully",
//                 });
//                 setQuantityDialog({ isOpen: false, product: null });
//             }
//         } catch (err: any) {
//             toast({
//                 title: "Error",
//                 description: err?.response?.data?.message || "Failed to add product to cart",
//                 variant: "destructive",
//             });
//         } finally {
//             setAddingToCart(false);
//         }
//     };

//     const handleAddToWishlist = async (product: any) => {
//         if (!isAuthenticated) {
//             navigate("/signin");
//             return;
//         }

//         if (!token) return;

//         setAddingToWishlist(product.id);
//         try {
//             const data = await addToWishlist({ product_id: product.id }, token);
//             if (data.success) {
//                 toast({
//                     title: "Success",
//                     description: "Product added to wishlist successfully",
//                 });
//             }
//         } catch (err: any) {
//             toast({
//                 title: "Error",
//                 description: err?.response?.data?.message || "Failed to add product to wishlist",
//                 variant: "destructive",
//             });
//         } finally {
//             setAddingToWishlist(null);
//         }
//     };

//     const filteredProducts = selectedCategoryName === "All"
//         ? products
//         : products.filter(p => {
//             const cat = categories.find(c => c.name === selectedCategoryName);
//             return p.category_id === cat?.id;
//         });

//     if (loading) {
//         return (
//             <>
//                 <Header />
//                 <main className="relative mx-auto min-h-screen bg-white">
//                     <div className="flex flex-col items-center w-full px-4">
//                         <div className="w-full max-w-8xl mt-8 mb-6">
//                             <div className="text-center">
//                                 <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
//                                     Loading Collection...
//                                 </h1>
//                                 <p className="text-lg text-gray-500">Please wait while we fetch the collection data.</p>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//                 <ContactSection />
//                 <Footer />
//             </>
//         );
//     }

//     if (!collection) {
//         return (
//             <>
//                 <Header />
//                 <main className="relative mx-auto min-h-screen bg-white">
//                     <div className="flex flex-col items-center w-full px-4">
//                         <div className="w-full max-w-8xl mt-8 mb-6">
//                             <div className="text-center">
//                                 <h1 className="text-3xl font-serif font-bold text-red-500 mb-4">
//                                     Collection Not Found
//                                 </h1>
//                                 <p className="text-lg text-gray-500">The collection you're looking for doesn't exist.</p>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//                 <ContactSection />
//                 <Footer />
//             </>
//         );
//     }

//     return (
//         <>
//             <Header />
//             <main className="relative mx-auto min-h-screen bg-white">
//                 <div className="flex flex-col items-center w-full px-4">
//                     {/* Filters & Sorting Section */}
//                     <div className="w-full max-w-8xl mt-8 mb-6">
//                         {/* Breadcrumb */}
//                         <nav className="flex items-center text-sm text-gray-500 mb-2">
//                             <Link to={`/`} className="hover:underline cursor-pointer">Home</Link>
//                             <span className="mx-2">&gt;</span>
//                             <span className="">Collections</span>
//                             <span className="mx-2">&gt;</span>
//                             <span className="text-primary font-semibold">
//                                 {collection.name}
//                             </span>
//                         </nav>
//                         {/* Title & Results */}
//                         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
//                             <div className="flex items-center gap-3 mb-2 md:mb-0">
//                                 <h1 className="text-3xl font-serif font-bold text-gray-900">
//                                     {collection.name}
//                                 </h1>
//                                 <span className="text-lg text-gray-500">({filteredProducts.length} results)</span>
//                             </div>
//                         </div>

//                         {/* Category Filter Chips */}
//                         <div className="mb-8 animate-fade-in">
//                             <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">Categories</h3>
//                             <div className="flex flex-wrap gap-3">
//                                 <button
//                                     onClick={() => setSelectedCategoryName("All")}
//                                     className={`px-6 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 shadow-sm
//                     ${selectedCategoryName === "All"
//                                             ? "bg-[#004d3d] text-white border-[#004d3d] shadow-md"
//                                             : "bg-white text-gray-600 border-gray-200 hover:border-[#004d3d] hover:text-[#004d3d]"}`}
//                                 >
//                                     <span className="font-medium">All ({products.length})</span>
//                                 </button>
//                                 {categories.map((cat) => {
//                                     const count = products.filter(p => p.category_id === cat.id).length;
//                                     if (count === 0) return null;

//                                     return (
//                                         <button
//                                             key={cat.id}
//                                             onClick={() => setSelectedCategoryName(cat.name)}
//                                             className={`px-6 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 shadow-sm
//                         ${selectedCategoryName === cat.name
//                                                     ? "bg-[#004d3d] text-white border-[#004d3d] shadow-md"
//                                                     : "bg-white text-gray-600 border-gray-200 hover:border-[#004d3d] hover:text-[#004d3d]"}`}
//                                         >
//                                             <span className="font-medium">{cat.name} ({count})</span>
//                                         </button>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Product Cards Grid */}
//                     <div className="w-full max-w-8xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
//                         {filteredProducts.length > 0 ? (
//                             filteredProducts.map((product) => {
//                                 const media = getProductMedia(product);
//                                 return (
//                                     <div
//                                         key={product.id}
//                                         className="relative bg-white border rounded-2xl shadow p-4 flex flex-col items-stretch group hover:shadow-lg transition min-h-[420px]"
//                                     >
//                                         {/* Wishlist Icon */}
//                                         <button
//                                             className="absolute top-6 right-6 text-gray-400 hover:text-red-500 z-10 bg-white rounded-full p-2 shadow border border-gray-200"
//                                             onClick={() => handleAddToWishlist(product)}
//                                             disabled={addingToWishlist === product.id}
//                                         >
//                                             <Heart className={`w-6 h-6 ${addingToWishlist === product.id ? 'animate-pulse' : ''}`} />
//                                         </button>

//                                         {/* Product Image & Video Container */}
//                                         <div className="relative rounded-xl overflow-hidden border border-gray-100 mb-4 aspect-[3/4] bg-white flex items-center justify-center group cursor-pointer">

//                                             {/* Main Image (Always visible) */}
//                                             <img
//                                                 src={media.main}
//                                                 alt={product.name}
//                                                 className="object-cover w-full h-full transition-opacity duration-300"
//                                             />

//                                             {/* Hover Overlay: Video OR Second Image */}
//                                             {/* Hum yahan 'opacity' use kar rahe hain taaki turant show ho */}
//                                             {media.hoverVideo ? (
//                                                 // Video Agar hai to
//                                                 <video
//                                                     src={media.hoverVideo}
//                                                     muted
//                                                     loop
//                                                     playsInline
//                                                     className="object-cover w-full h-full absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black"
//                                                     onMouseEnter={handleMouseEnter}
//                                                     onMouseLeave={handleMouseLeave}
//                                                 />
//                                             ) : (
//                                                 // Video nahi hai to Dusri Image dikhegi
//                                                 <img
//                                                     src={media.hoverImg}
//                                                     alt={product.name + " hover"}
//                                                     className="object-cover w-full h-full absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                                                 />
//                                             )}

//                                         </div>

//                                         {/* Product Name */}
//                                         <div className="text-lg font-serif font-medium text-gray-900 mb-2 px-2 text-center line-clamp-1">
//                                             {product.name}
//                                         </div>

//                                         {/* Pricing */}
//                                         <div className="flex items-center gap-3 mb-2 px-2 justify-center">
//                                             <span className="text-2xl font-semibold text-gray-900">
//                                                 ₹ {product.price ? Number(product.price).toLocaleString() : 'N/A'}
//                                             </span>
//                                         </div>

//                                         {/* Sizes */}
//                                         <div className="px-2 mb-3 flex flex-wrap justify-center gap-2">
//                                             {(() => {
//                                                 try {
//                                                     const sizes = product?.sizes;
//                                                     const list =
//                                                         typeof sizes === "string"
//                                                             ? JSON.parse(sizes)
//                                                             : Array.isArray(sizes)
//                                                                 ? sizes
//                                                                 : [];
//                                                     const names = list.slice(0, 4).map((s: any) => String(s.size));

//                                                     return names.length ? (
//                                                         names.map((size, i) => (
//                                                             <span
//                                                                 key={i}
//                                                                 className="w-8 h-8 flex items-center justify-center text-xs font-medium border border-gray-200 rounded-full text-gray-600 bg-white hover:bg-gray-50 transition shadow-sm"
//                                                             >
//                                                                 {size}
//                                                             </span>
//                                                         ))
//                                                     ) : (
//                                                         <span className="text-xs text-gray-400">Standard Size</span>
//                                                     );
//                                                 } catch {
//                                                     return <span className="text-xs text-gray-400">Standard Size</span>;
//                                                 }
//                                             })()}
//                                         </div>

//                                         {/* Action Area */}
//                                         <div className="mt-auto px-2">
//                                             {/* Add to Cart Button */}
//                                             <button
//                                                 className="w-full font-semibold py-3 rounded-lg shadow-sm transition-all duration-300 text-base mt-1 bg-[#004d3d] text-white hover:bg-[#003d30] hover:shadow-md"
//                                                 onClick={() => handleAddToCart(product)}
//                                             >
//                                                 Add to Cart
//                                             </button>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         ) : (
//                             <div className="col-span-full text-center py-16">
//                                 <h3 className="text-2xl font-serif text-gray-500 mb-4">
//                                     No products found in this category
//                                 </h3>
//                                 <p className="text-lg text-gray-400">
//                                     Try selecting a different category or view all products.
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </main>
//             <ContactSection />
//             <Footer />

//             {/* Quantity Dialog */}
//             <QuantityDialog
//                 isOpen={quantityDialog.isOpen}
//                 onClose={() => setQuantityDialog({ isOpen: false, product: null })}
//                 onConfirm={handleConfirmAddToCart}
//                 productName={quantityDialog.product?.name || ""}
//                 loading={addingToCart}
//                 purity={quantityDialog.product?.purity}
//                 weight={quantityDialog.product?.weight}
//                 sizes={(() => {
//                     try {
//                         const sizes = quantityDialog.product?.sizes;
//                         if (!sizes) return [];
//                         if (typeof sizes === 'string') return JSON.parse(sizes);
//                         if (Array.isArray(sizes)) return sizes;
//                         return [];
//                     } catch {
//                         return [];
//                     }
//                 })()}
//             />
//         </>
//     );
// };

// export default CollectionPage;



import Header from "@/components/Header";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCollectionProducts, getPublicCategories } from "@/lib/api/publicController";
import { addToCart } from "@/lib/api/cartController";
import { addToWishlist } from "@/lib/api/wishlistController";
import { useUserAuth } from "@/context/UserAuthContext";
import { useToast } from "@/hooks/use-toast";
import QuantityDialog from "@/components/QuantityDialog";
import { API_BASE_URL, getImageUrl } from "@/config";
import ImageZoom from "@/components/ImageZoom";

const CollectionPage = () => {
    const { collectionId } = useParams();
    const navigate = useNavigate();
    const { token, isAuthenticated } = useUserAuth();
    const { toast } = useToast();
    const [collection, setCollection] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>("All");
    const [loading, setLoading] = useState(true);
    const [quantityDialog, setQuantityDialog] = useState<{
        isOpen: boolean;
        product: any;
    }>({ isOpen: false, product: null });
    const [addingToCart, setAddingToCart] = useState(false);
    const [addingToWishlist, setAddingToWishlist] = useState<number | null>(null);

    // --- AUTOMATIC SLIDESHOW STATE ---
    // Hum har product ka index track karenge (0, 1, 2...)
    const [activeMediaIndexMap, setActiveMediaIndexMap] = useState<Record<number, number>>({});

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [collectionId]);

    useEffect(() => {
        const fetchCollectionData = async () => {
            if (!collectionId) return;

            try {
                setLoading(true);
                const [collectionResponse, categoriesResponse] = await Promise.all([
                    getCollectionProducts(collectionId),
                    getPublicCategories()
                ]);

                if (collectionResponse.data.success) {
                    setCollection(collectionResponse.data.data.collection);
                    setProducts(collectionResponse.data.data.products || []);
                }

                if (categoriesResponse.data.success) {
                    setCategories(categoriesResponse.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching collection data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollectionData();
    }, [collectionId]);


    // --- HELPER: Get Combined Media List (Images + Video) ---
    const getMediaList = (product: any): { type: 'image' | 'video', url: string }[] => {
        const list: { type: 'image' | 'video', url: string }[] = [];

        // 1. Sabhi Images add karo
        try {
            const imageData = JSON.parse(product.image || "[]");
            if (Array.isArray(imageData)) {
                imageData.forEach((img: any) => {
                    list.push({ type: 'image', url: getImageUrl(img) });
                });
            }
        } catch (e) {
            console.error("Error parsing images", e);
        }

        // 2. Video add karo (Images ke baad push hoga)
        if (product.short_video) {
            list.push({ type: 'video', url: getImageUrl(product.short_video) });
        }

        return list;
    };

    const handleAddToCart = (product: any) => {
        if (!isAuthenticated) {
            navigate("/signin");
            return;
        }
        setQuantityDialog({ isOpen: true, product });
    };

    const handleConfirmAddToCart = async (quantity: number, size?: string | number) => {
        if (!token || !quantityDialog.product) return;

        setAddingToCart(true);
        try {
            const data = await addToCart(
                { product_id: quantityDialog.product.id, quantity, size },
                token
            );
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Product added to cart successfully",
                });
                setQuantityDialog({ isOpen: false, product: null });
            }
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.response?.data?.message || "Failed to add product to cart",
                variant: "destructive",
            });
        } finally {
            setAddingToCart(false);
        }
    };

    const handleAddToWishlist = async (product: any) => {
        if (!isAuthenticated) {
            navigate("/signin");
            return;
        }

        if (!token) return;

        setAddingToWishlist(product.id);
        try {
            const data = await addToWishlist({ product_id: product.id }, token);
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Product added to wishlist successfully",
                });
            }
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.response?.data?.message || "Failed to add product to wishlist",
                variant: "destructive",
            });
        } finally {
            setAddingToWishlist(null);
        }
    };

    const filteredProducts = selectedCategoryName === "All"
        ? products
        : products.filter(p => {
            const cat = categories.find(c => c.name === selectedCategoryName);
            return p.category_id === cat?.id;
        });

    if (loading) {
        return (
            <>
                <Header />
                <main className="relative mx-auto min-h-screen bg-white">
                    <div className="flex flex-col items-center w-full px-4">
                        <div className="w-full max-w-8xl mt-8 mb-6">
                            <div className="text-center">
                                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                                    Loading Collection...
                                </h1>
                                <p className="text-lg text-gray-500">Please wait while we fetch collection data.</p>
                            </div>
                        </div>
                    </div>
                </main>
                <ContactSection />
                <Footer />
            </>
        );
    }

    if (!collection) {
        return (
            <>
                <Header />
                <main className="relative mx-auto min-h-screen bg-white">
                    <div className="flex flex-col items-center w-full px-4">
                        <div className="w-full max-w-8xl mt-8 mb-6">
                            <div className="text-center">
                                <h1 className="text-3xl font-serif font-bold text-red-500 mb-4">
                                    Collection Not Found
                                </h1>
                                <p className="text-lg text-gray-500">The collection you're looking for doesn't exist.</p>
                            </div>
                        </div>
                    </div>
                </main>
                <ContactSection />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="relative mx-auto min-h-screen bg-white">
                <div className="flex flex-col items-center w-full px-4">
                    {/* Filters & Sorting Section */}
                    <div className="w-full max-w-8xl mt-8 mb-6">
                        {/* Breadcrumb */}
                        <nav className="flex items-center text-sm text-gray-500 mb-2">
                            <Link to={`/`} className="hover:underline cursor-pointer">Home</Link>
                            <span className="mx-2">&gt;</span>
                            <span className="">Collections</span>
                            <span className="mx-2">&gt;</span>
                            <span className="text-primary font-semibold">
                                {collection.name}
                            </span>
                        </nav>
                        {/* Title & Results */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div className="flex items-center gap-3 mb-2 md:mb-0">
                                <h1 className="text-3xl font-serif font-bold text-gray-900">
                                    {collection.name}
                                </h1>
                                <span className="text-lg text-gray-500">({filteredProducts.length} results)</span>
                            </div>
                        </div>

                        {/* Category Filter Chips */}
                        <div className="mb-8 animate-fade-in">
                            <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">Categories</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setSelectedCategoryName("All")}
                                    className={`px-6 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 shadow-sm
                    ${selectedCategoryName === "All"
                                            ? "bg-[#004d3d] text-white border-[#004d3d] shadow-md"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-[#004d3d] hover:text-[#004d3d]"}`}
                                >
                                    <span className="font-medium">All ({products.length})</span>
                                </button>
                                {categories.map((cat) => {
                                    const count = products.filter(p => p.category_id === cat.id).length;
                                    if (count === 0) return null;

                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategoryName(cat.name)}
                                            className={`px-6 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 shadow-sm
                        ${selectedCategoryName === cat.name
                                                    ? "bg-[#004d3d] text-white border-[#004d3d] shadow-md"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-[#004d3d] hover:text-[#004d3d]"}`}
                                        >
                                            <span className="font-medium">{cat.name} ({count})</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="w-full max-w-8xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => {
                                const mediaList = getMediaList(product);

                                // Agar koi media nahi hai to error nahi aaye
                                if (mediaList.length === 0) return null;

                                const currentIndex = activeMediaIndexMap[product.id] || 0;
                                const currentMedia = mediaList[currentIndex];

                                return (
                                    <div
                                        key={product.id}
                                        className="relative bg-white border rounded-2xl shadow p-4 flex flex-col items-stretch group hover:shadow-lg transition"
                                    >
                                        {/* Wishlist Icon */}
                                        <button
                                            className="absolute top-6 right-6 text-gray-400 hover:text-red-500 z-10 bg-white rounded-full p-2 shadow border border-gray-200"
                                            onClick={() => handleAddToWishlist(product)}
                                            disabled={addingToWishlist === product.id}
                                        >
                                            <Heart className={`w-6 h-6 ${addingToWishlist === product.id ? 'animate-pulse' : ''}`} />
                                        </button>

                                        {/* Product Media Area */}
                                        <div className="relative mb-4 aspect-[3/4] bg-white flex items-center justify-center">

                                            {/* Render Based on Type */}
                                            {currentMedia.type === 'video' ? (
                                                // VIDEO: AutoPlay, Muted, Loop
                                                <div className="w-full h-full overflow-hidden rounded-xl border border-gray-100">
                                                    <video
                                                        src={currentMedia.url}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                // IMAGE with Side Zoom
                                                <ImageZoom
                                                    src={currentMedia.url}
                                                    alt={product.name}
                                                    className="w-full h-full"
                                                />
                                            )}
                                        </div>

                                        {/* Product Name */}
                                        <div className="text-lg font-serif font-medium text-gray-900 mb-2 px-2 text-center line-clamp-1">
                                            {product.name}
                                        </div>

                                        {/* Pricing */}
                                        <div className="flex items-center gap-3 mb-2 px-2 justify-center">
                                            <span className="text-2xl font-semibold text-gray-900">
                                                ₹ {product.price ? Number(product.price).toLocaleString() : 'N/A'}
                                            </span>
                                        </div>

                                        {/* Sizes */}
                                        <div className="px-2 mb-3 flex flex-wrap justify-center gap-2">
                                            {(() => {
                                                try {
                                                    const sizes = product?.sizes;
                                                    const list =
                                                        typeof sizes === "string"
                                                            ? JSON.parse(sizes)
                                                            : Array.isArray(sizes)
                                                                ? sizes
                                                                : [];
                                                    const names = list.slice(0, 4).map((s: any) => String(s.size));

                                                    return names.length ? (
                                                        names.map((size, i) => (
                                                            <span
                                                                key={i}
                                                                className="w-8 h-8 flex items-center justify-center text-xs font-medium border border-gray-200 rounded-full text-gray-600 bg-white hover:bg-gray-50 transition shadow-sm"
                                                            >
                                                                {size}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Standard Size</span>
                                                    );
                                                } catch {
                                                    return <span className="text-xs text-gray-400">Standard Size</span>;
                                                }
                                            })()}
                                        </div>

                                        {/* Action Area */}
                                        <div className="mt-auto px-2">
                                            {/* Add to Cart Button */}
                                            <button
                                                className="w-full font-semibold py-3 rounded-lg shadow-sm transition-all duration-300 text-base mt-1 bg-[#004d3d] text-white hover:bg-[#003d30] hover:shadow-md"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <h3 className="text-2xl font-serif text-gray-500 mb-4">
                                    No products found in this category
                                </h3>
                                <p className="text-lg text-gray-400">
                                    Try selecting a different category or view all products.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <ContactSection />
            <Footer />

            {/* Quantity Dialog */}
            <QuantityDialog
                isOpen={quantityDialog.isOpen}
                onClose={() => setQuantityDialog({ isOpen: false, product: null })}
                onConfirm={handleConfirmAddToCart}
                productName={quantityDialog.product?.name || ""}
                loading={addingToCart}
                purity={quantityDialog.product?.purity}
                weight={quantityDialog.product?.weight}
                sizes={(() => {
                    try {
                        const sizes = quantityDialog.product?.sizes;
                        if (!sizes) return [];
                        if (typeof sizes === 'string') return JSON.parse(sizes);
                        if (Array.isArray(sizes)) return sizes;
                        return [];
                    } catch {
                        return [];
                    }
                })()}
            />
        </>
    );
};

export default CollectionPage;