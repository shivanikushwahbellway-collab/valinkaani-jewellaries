import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CollectionsSection from "@/components/CollectionsSection";
import AboutSection from "@/components/AboutSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      {/* Custom Order Button Section */}
      {/* <div className="bg-gradient-to-b from-white to-amber-50 py-8">
        <div className="container mx-auto px-4 flex justify-center">
          <Button
            onClick={() => navigate("/custom-order")}
            className="bg-gradient-to-r from-[#084526] to-[#0a5a2e] hover:from-[#0a5a2e] hover:to-[#084526] text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Create Custom Order
          </Button>
        </div>
      </div> */}
      <CollectionsSection />
      <div id="about">
        <AboutSection />
      </div>
      <div id="reviews">
        <ReviewsSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
