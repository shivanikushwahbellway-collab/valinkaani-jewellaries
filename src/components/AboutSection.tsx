import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Master Craftsmanship",
    description: "Over 35 years of expertise in creating exquisite jewelry with traditional techniques"
  },
  {
    icon: Shield,
    title: "Certified Quality", 
    description: "All our jewelry comes with proper certification and quality guarantee"
  },
  {
    icon: Users,
    title: "Customer Trust",
    description: "Thousands of satisfied customers who trust us for their precious moments"
  },
  {
    icon: Clock,
    title: "Timeless Designs",
    description: "Classic and contemporary designs that never go out of style"
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">
              Crafting Dreams Into Reality
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              For over three decades, Vailankanni Jewellers has been synonymous with excellence in jewelry craftsmanship. 
              We combine traditional artistry with contemporary design to create pieces that celebrate life's most precious moments.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our master craftsmen use time-honored techniques passed down through generations, ensuring each piece 
              meets the highest standards of quality and beauty. From traditional Indian designs to modern contemporary 
              styles, we create jewelry that tells your unique story.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">35+</div>
                <div className="text-muted-foreground">Years of Excellence</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">10,000+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-elegant hover:shadow-luxury transition-all duration-300 animate-scale-in group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-serif text-primary mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;