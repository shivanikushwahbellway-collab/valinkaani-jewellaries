import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Panjim, Goa",
    rating: 5,
    review: "Absolutely stunning jewelry! The craftsmanship is exceptional and the designs are timeless. I bought my wedding set from Vailankanni and received countless compliments.",
    image: "PS",
    product: "Bridal Gold Set"
  },
  {
    id: 2,
    name: "Rahul Mendes",
    location: "Margao, Goa",
    rating: 5,
    review: "The diamond rings here are of premium quality. The staff is knowledgeable and helped me choose the perfect engagement ring. Highly recommended!",
    image: "RM",
    product: "Diamond Engagement Ring"
  },
  {
    id: 3,
    name: "Anita Fernandes",
    location: "Vasco, Goa",
    rating: 5,
    review: "I've been a customer for over 10 years. The traditional Jadau collection is magnificent and the after-sales service is excellent. Trustworthy jewelers!",
    image: "AF",
    product: "Jadau Necklace Set"
  },
  {
    id: 4,
    name: "Suresh Kamat",
    location: "Mapusa, Goa",
    rating: 4,
    review: "Great experience buying gold jewelry for my daughter's wedding. The variety is impressive and prices are reasonable. Will definitely come back!",
    image: "SK",
    product: "Gold Jewelry Set"
  },
  {
    id: 5,
    name: "Maria D'Souza",
    location: "Calangute, Goa",
    rating: 5,
    review: "The antique collection is absolutely beautiful! Each piece tells a story. The quality and finish are outstanding. Love shopping here!",
    image: "MD",
    product: "Antique Gold Bangles"
  },
  {
    id: 6,
    name: "Rajesh Desai",
    location: "Panaji, Goa",
    rating: 5,
    review: "Excellent customer service and beautiful jewelry. They helped design a custom piece for my wife's anniversary. She loved it! Thank you Vailankanni team.",
    image: "RD",
    product: "Custom Diamond Pendant"
  }
];

const ReviewsSection = () => {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="reviews" className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it - hear from our satisfied customers across Goa
          </p>
        </div>

        {/* Featured Review Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 bg-white/10 backdrop-blur-sm shadow-luxury animate-scale-in">
            <CardContent className="p-8 md:p-12 text-center">
              <Quote className="h-12 w-12 text-secondary mx-auto mb-6" />
              
              <div className="relative overflow-hidden h-48">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className={`absolute inset-0 transition-all duration-700 transform ${
                      index === currentReview 
                        ? 'translate-x-0 opacity-100' 
                        : index < currentReview 
                          ? '-translate-x-full opacity-0' 
                          : 'translate-x-full opacity-0'
                    }`}
                  >
                    <p className="text-lg md:text-xl leading-relaxed mb-6 text-primary-foreground/95">
                      "{review.review}"
                    </p>
                    
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">
                        {review.image}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-primary-foreground">{review.name}</div>
                        <div className="text-sm text-primary-foreground/80">{review.location}</div>
                        <div className="text-xs text-secondary font-medium">{review.product}</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-secondary fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentReview 
                    ? 'bg-secondary scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review, index) => (
            <Card 
              key={review.id} 
              className="border-0 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-scale-in group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-secondary fill-current" />
                  ))}
                </div>
                
                {/* Review Text */}
                <p className="text-primary-foreground/90 mb-4 text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                  "{review.review}"
                </p>
                
                {/* Customer Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-sm">
                    {review.image}
                  </div>
                  <div>
                    <div className="font-semibold text-primary-foreground text-sm">{review.name}</div>
                    <div className="text-xs text-primary-foreground/70">{review.location}</div>
                    <div className="text-xs text-secondary font-medium">{review.product}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div className="animate-scale-in" style={{ animationDelay: '100ms' }}>
            <div className="text-4xl font-bold text-secondary mb-2">4.9</div>
            <div className="text-sm text-primary-foreground/80">Average Rating</div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
            <div className="text-4xl font-bold text-secondary mb-2">2,500+</div>
            <div className="text-sm text-primary-foreground/80">Reviews</div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '300ms' }}>
            <div className="text-4xl font-bold text-secondary mb-2">98%</div>
            <div className="text-sm text-primary-foreground/80">Satisfaction Rate</div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '400ms' }}>
            <div className="text-4xl font-bold text-secondary mb-2">15K+</div>
            <div className="text-sm text-primary-foreground/80">Happy Customers</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;