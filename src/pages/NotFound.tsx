import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-10 text-center animate-fade-in border border-yellow-200">
          <div className="mb-6">
            <span className="text-[7rem] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-900 drop-shadow-lg select-none font-serif animate-fade-in">
              404
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 mb-4 font-serif animate-fade-in delay-100">
            Lost in the sparkle?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 animate-fade-in delay-200">
            The page you’re looking for doesn’t exist or has been moved.
            <br />
            Let’s get you back to something precious!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-100 text-yellow-900 font-bold px-10 py-4 rounded-full shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-300 animate-fade-in delay-300"
          >
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fade-in.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fade-in.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fade-in.delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
