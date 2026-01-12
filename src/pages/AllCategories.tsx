import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { useEffect, useState } from "react";
import { getPublicCategories } from "@/lib/api/publicController";
import { getImageUrl } from "@/config";
import { Link } from "react-router-dom";
import { LayoutGrid, List, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import earrings from "@/assets/earrings.jpg";
import bangles from "@/assets/bangles.jpg";
import pendants from "@/assets/pendants.jpg";
import mangalsutra from "@/assets/mangalsutra.jpg";
import bracelets from "@/assets/bracelets.jpg";
import fingerrings from "@/assets/fingerrings.jpg";
import chain from "@/assets/chain.jpg";
import gemstoneCollection from "@/assets/gemstone-collection.jpg";

const AllCategories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCategories = async () => {
            try {
                const response = await getPublicCategories();
                if (response.data.success) {
                    setCategories(response.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const getCategoryImage = (category: any) => {
        if (category.image) {
            return getImageUrl(category.image);
        }
        const name = category.name.toLowerCase();
        if (name.includes('earring')) return earrings;
        if (name.includes('bangle')) return bangles;
        if (name.includes('pendant')) return pendants;
        if (name.includes('mangalsutra')) return mangalsutra;
        if (name.includes('bracelet')) return bracelets;
        if (name.includes('ring')) return fingerrings;
        if (name.includes('chain')) return chain;
        if (name.includes('gemstone')) return gemstoneCollection;
        return earrings;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <p className="text-xl text-muted-foreground font-serif">Loading categories...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
            <Header />

            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-12 animate-fade-in">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <LayoutGrid className="text-primary w-8 h-8" />
                        <h1 className="text-4xl md:text-6xl text-primary font-serif">All Categories</h1>
                    </div>

                    <div className="flex flex-col items-center gap-6 mt-8">
                        <div className="flex bg-gray-100 p-1 rounded-full shadow-inner">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-primary'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                <span className="font-medium">Grid</span>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-primary'}`}
                            >
                                <List className="w-4 h-4" />
                                <span className="font-medium">List</span>
                            </button>
                        </div>

                        <Badge variant="secondary" className="bg-[#e6f3f0] text-[#2d6a4f] hover:bg-[#d8ece6] transition-colors gap-2 px-4 py-1.5 rounded-full border-0">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-semibold">{categories.length} Categories Available</span>
                        </Badge>
                    </div>
                </div>

                <div className={`mt-12 ${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-10' : 'max-w-4xl mx-auto space-y-4'}`}>
                    {categories.map((category, index) => (
                        viewMode === 'grid' ? (
                            <Link
                                to={`/category/${category.id}`}
                                key={category.id}
                                className="group text-center animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden hover:shadow-luxury transition-all duration-500 transform group-hover:-translate-y-2 border border-gray-100 bg-white">
                                    <img
                                        src={getCategoryImage(category)}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <h4 className="mt-4 font-serif text-xl text-primary group-hover:text-primary-glow transition-colors duration-300">{category.name}</h4>
                            </Link>
                        ) : (
                            <Link
                                to={`/category/${category.id}`}
                                key={category.id}
                                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                        <img
                                            src={getCategoryImage(category)}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <h4 className="font-serif text-2xl text-primary group-hover:text-primary-glow transition-colors duration-300">{category.name}</h4>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </Link>
                        )
                    ))}
                </div>
            </main>

            <ContactSection />
            <Footer />
        </div>
    );
};

export default AllCategories;
