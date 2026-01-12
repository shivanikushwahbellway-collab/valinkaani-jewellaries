import Header from "@/components/Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { Heart, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategoryProducts, getPublicCategories } from "@/lib/api/publicController";
import { addToCart } from "@/lib/api/cartController";
import { addToWishlist } from "@/lib/api/wishlistController";
import { useUserAuth } from "@/context/UserAuthContext";
import { useToast } from "@/hooks/use-toast";
import QuantityDialog from "@/components/QuantityDialog";
import { API_BASE_URL, getImageUrl } from "@/config";

const CategoryPage = () => {
    const { categorySlug } = useParams();
    const navigate = useNavigate();
    const { token, isAuthenticated } = useUserAuth();
    const { toast } = useToast();
    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantityDialog, setQuantityDialog] = useState<{
        isOpen: boolean;
        product: any;
    }>({ isOpen: false, product: null });
    const [addingToCart, setAddingToCart] = useState(false);
    const [addingToWishlist, setAddingToWishlist] = useState<number | null>(null);

    // --- NEW: AUTO SLIDESHOW STATE ---
    const [activeMediaIndexMap, setActiveMediaIndexMap] = useState<Record<number, number>>({});

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categorySlug]);

    useEffect(() => {
        const fetchCategoryData = async () => {
            if (!categorySlug) return;

            try {
                setLoading(true);
                const response = await getCategoryProducts(categorySlug);
                if (response.data.success) {
                    setCategory(response.data.data.category);
                    setProducts(response.data.data.products || []);
                }
            } catch (error) {
                // Error fetching category data - silently fail
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [categorySlug]);

    // --- NEW: GLOBAL AUTOMATIC SLIDER ---
    // Ye function har 3 second baad chalta rahega
    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setActiveMediaIndexMap((prev) => {
                const next = { ...prev };

                // Har product ke liye index badal do
                products.forEach((product) => {
                    const mediaList = getMediaList(product);

                    // Agar media nahi hai to skip karo
                    if (mediaList.length === 0) return;

                    let currentIdx = prev[product.id] || 0;

                    // Index badhao aur modulo loop use karo (wapis 0 par jayega)
                    currentIdx = (currentIdx + 1) % mediaList.length;

                    next[product.id] = currentIdx;
                });

                return next;
            });
        }, 3000); // 3000 ms = 3 Seconds

        return () => clearInterval(interval);
    }, [products]); // Products change hone par restart hoga

    // --- NEW HELPER: Get All Media List (Images + Video) ---
    const getMediaList = (product: any): { type: 'image' | 'video', url: string }[] => {
        const list: { type: 'image' | 'video', url: string }[] = [];

        try {
            // 1. Sabhi Images add karo
            const imageData = JSON.parse(product.image || "[]");
            if (Array.isArray(imageData)) {
                imageData.forEach((img: any) => {
                    list.push({ type: 'image', url: getImageUrl(img) });
                });
            }

            // 2. Video add karo (Images ke baad push hoga)
            if (product.short_video) {
                list.push({ type: 'video', url: getImageUrl(product.short_video) });
            }
        } catch (error) {
            console.error("Error parsing media", error);
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

    if (loading) {
        return (
            <>
                <Header />
                <main className="relative mx-auto min-h-screen bg-white">
                    <div className="flex flex-col items-center w-full px-4">
                        <div className="w-full max-w-8xl mt-8 mb-6">
                            <div className="text-center">
                                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                                    Loading Category...
                                </h1>
                                <p className="text-lg text-gray-500">Please wait while we fetch category data.</p>
                            </div>
                        </div>
                    </div>
                </main>
                <ContactSection />
                <Footer />
            </>
        );
    }

    if (!category) {
        return (
            <>
                <Header />
                <main className="relative mx-auto min-h-screen bg-white">
                    <div className="flex flex-col items-center w-full px-4">
                        <div className="w-full max-w-8xl mt-8 mb-6">
                            <div className="text-center">
                                <h1 className="text-3xl font-serif font-bold text-red-500 mb-4">
                                    Category Not Found
                                </h1>
                                <p className="text-lg text-gray-500">The category you're looking for doesn't exist.</p>
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
                            <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Home</span>
                            <span className="mx-2">&gt;</span>
                            <span className="hover:underline cursor-pointer" onClick={() => navigate('/categories')}>Categories</span>
                            <span className="mx-2">&gt;</span>
                            <span className="text-primary font-semibold">
                                {category.name}
                            </span>
                        </nav>
                        {/* Title & Results */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div className="flex items-center gap-3 mb-2 md:mb-0">
                                <h1 className="text-3xl font-serif font-bold text-gray-900">
                                    {category.name}
                                </h1>
                                <span className="text-lg text-gray-500">({products.length} results)</span>
                            </div>
                        </div>

                        {/* Category Description */}
                        {category.description && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {category.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Product Cards Grid */}
                    <div className="w-full max-w-8xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
                        {products.length > 0 ? (
                            products.map((product) => {
                                const mediaList = getMediaList(product);
                                const currentIndex = activeMediaIndexMap[product.id] || 0;
                                const currentMedia = mediaList[currentIndex];

                                return (
                                    <div
                                        key={product.id}
                                        className="relative bg-white border rounded-2xl shadow p-4 flex flex-col items-stretch group hover:shadow-lg transition min-h-[420px]"
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
                                        <div className="relative rounded-xl overflow-hidden border border-gray-100 mb-4 aspect-[3/4] bg-white flex items-center justify-center">

                                            {/* Render Based on Type */}
                                            {currentMedia ? (
                                                currentMedia.type === 'video' ? (
                                                    // VIDEO: AutoPlay, Muted, Loop
                                                    <video
                                                        src={currentMedia.url}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    // IMAGE
                                                    <img
                                                        src={currentMedia.url}
                                                        alt={product.name}
                                                        className="object-cover w-full h-full transition-opacity duration-500"
                                                    />
                                                )
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">No Media</div>
                                            )}
                                        </div>

                                        {/* INDICATORS (Neeche dots) */}
                                        {mediaList.length > 1 && (
                                            <div className="flex justify-center gap-2 mt-2 mb-2">
                                                {mediaList.map((media, idx) => (
                                                    <div key={idx} className="relative">
                                                        {/* Active Indicator */}
                                                        <div className={`w-2 h-2 rounded-full transition-all duration-300
                                                            ${currentIndex === idx ? 'bg-black scale-125' : 'bg-gray-300'}
                                                        `}></div>

                                                        {/* Play Icon Overlay for Video Indicator */}
                                                        {media.type === 'video' && (
                                                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-white pointer-events-none transition-opacity duration-300
                                                                ${currentIndex === idx ? 'opacity-100' : 'opacity-0'}
                                                            `}>
                                                                <Play fill="currentColor" className="w-3 h-3" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

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

export default CategoryPage;