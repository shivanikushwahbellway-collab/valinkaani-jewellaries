import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getPublicBanners } from "@/lib/api/publicController";
import { getImageUrl } from "@/config";
// No local fallback banners; only render API data

interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  badge: string;
  primaryButton: string;
  position?: number;
}

const HeroSection = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPublicBanners();
     
        // Handle different response structures
        let bannersData = response.data;
        if (response.data && typeof response.data === 'object' && response.data.banners) {
          bannersData = response.data.banners;
        } else if (response.data && typeof response.data === 'object' && response.data.data) {
          bannersData = response.data.data;
        }
       
        
        if (bannersData && Array.isArray(bannersData) && bannersData.length > 0) {
          // Transform API response to match our Banner interface
          const apiBanners: Banner[] = bannersData.map((banner: any, index: number) => {
      
            return {
              id: banner.id || banner.banner_id || index + 1,
              image: banner.image ? getImageUrl(banner.image) : (banner.imageUrl || banner.banner_image || banner.image_url || banner.url),
              title: banner.title || banner.name || banner.heading || "Timeless Elegance",
              subtitle: banner.subtitle || banner.description || banner.content || "Discover our exquisite collection",
              badge: banner.badge || banner.tag || banner.label || "Premium Collection",
              primaryButton: banner.primaryButton || banner.buttonText || banner.button_text || banner.cta || "Explore Now",
              position: (() => {
                const raw = (banner.position ?? (banner.order ?? banner.sort)) as any;
                const num = Number(raw);
                return Number.isFinite(num) && num > 0 ? num : 999999;
              })()
            };
          });
          // Sort by position ascending (1 first, then greater)
          apiBanners.sort((a, b) => (a.position ?? 999999) - (b.position ?? 999999));
          setBanners(apiBanners);
        
        } else {
          setBanners([]);
        }
      } catch (err) {
        setError("Failed to load banners");
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBannerData = banners[currentBanner];

  // Show loading state
  if (loading) {
    return (
      <section
        id="home"
        className="relative -mt-20 min-h-[96vh] flex items-center justify-center overflow-hidden"
      >
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading banners...</span>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative -mt-20 min-h-[96vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Images with Transition */}
      <div className="absolute inset-0 z-0">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r bg-black/20"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevBanner}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          >
            <ChevronLeft className="h-6 w-6 text-white group-hover:translate-x-[-2px] transition-transform" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          >
            <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-[2px] transition-transform" />
          </button>
        </>
      )}

      {/* Banner Indicators - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBanner
                  ? "bg-secondary scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-4 right-4 z-30 bg-red-500/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Content */}
      {/* <div className="absolute bottom-0 left-0  z-10 container mx-auto px-4 text-center md:text-left text-primary-foreground opacity-50">
        <div className="max-w-3xl md:ml-8 lg:ml-16 animate-fade-in">
          {currentBannerData?.title && (
            <h1 className="text-2xl md:text-3xl font-bold leading-tight drop-shadow-lg">
              {currentBannerData.title}
            </h1>
          )}
          {currentBannerData?.subtitle && (
            <p className="mt-4 text-base md:text-sm leading-relaxed text-white/90 drop-shadow-md">
              {currentBannerData.subtitle}
            </p>
          )}
        </div>
      </div> */}

      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-secondary/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-1/3 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-300"></div>
      <div className="absolute top-1/3 left-20 w-16 h-16 bg-secondary/15 rounded-full blur-xl animate-pulse delay-700"></div>
    </section>
  );
};

export default HeroSection;
