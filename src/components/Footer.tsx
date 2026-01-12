import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-12 w-12 bg-gradient-gold rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">V</span>
              </div>
              <div>
                <h3 className="text-2xl font-serif">Vailankanni</h3>
                <p className="text-xs uppercase tracking-wider text-primary-foreground/80 font-serif">Jewellers</p>
              </div>
            </div>
            <p className="text-primary-foreground/90 mb-6 leading-relaxed max-w-md">
              For over 35 years, we have been crafting exquisite jewelry that celebrates life's most precious moments. 
              Our commitment to quality and traditional craftsmanship makes us Goa's trusted jeweler.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-primary-foreground/80 hover:text-secondary transition-colors">Home</a></li>
              <li><a href="#collections" className="text-primary-foreground/80 hover:text-secondary transition-colors">Collections</a></li>
              <li><a href="#about" className="text-primary-foreground/80 hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="#reviews" className="text-primary-foreground/80 hover:text-secondary transition-colors">Reviews</a></li>
              <li><a href="#contact" className="text-primary-foreground/80 hover:text-secondary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-primary-foreground/90">Shop No. G-10 Ground Floor</p>
                  <p className="text-primary-foreground/90">Shankar Parvati Building behind Panjim Church</p>
                  <p className="text-primary-foreground/90">Penha De Franca Panjim - 403001</p>
                  <p className="text-primary-foreground/80">Goa, India</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                <div>
                  <p className="text-primary-foreground/90">+91 95451 11124</p>
               
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                <div>
                  <p className="text-primary-foreground/90">vailankannijewellers89@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/80">
            <p>&copy; {currentYear} Vailankanni Jewellers. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/policies#privacy" className="hover:text-secondary transition-colors">Privacy Policy</a>
              <a href="/policies#terms" className="hover:text-secondary transition-colors">Terms of Service</a>
              <a href="/policies#shipping" className="hover:text-secondary transition-colors">Shipping Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

