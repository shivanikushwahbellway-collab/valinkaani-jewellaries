import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { registerContactQuery } from "@/lib/api/queryController";
import { toast } from "sonner"; // optional if you use sonner toast
const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    details: ["+91 95451 11124",],
    description: "Mon - Sat: 10:00 AM - 8:00 PM"
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["vailankannijewellers89@gmail.com",],
    description: "We'll respond within 24 hours"
  },
  {
    icon: MapPin,
    title: "Visit Our Store",
    details: ["Shop No. G-10 Ground Floor", "Shankar Parvati Building behind", "Panjim Church", "Penha De Franca Panjim - 403001",],
    description: "Goa, India"
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Monday - Saturday", "10:00 AM - 8:00 PM"],
    description: "Sunday: By Appointment"
  }
];

const ContactSection = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerContactQuery(formData);
      toast.success("Message sent successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to send message. Try again!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We'd love to help you find the perfect piece or answer any questions about our collections
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="border-0 shadow-elegant hover:shadow-luxury transition-all duration-300 animate-scale-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <info.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-serif text-primary mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-foreground font-medium">{detail}</p>
                      ))}
                      <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-luxury animate-fade-in">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif text-primary mb-6">Send us a Message</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <Input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Your first name"
                        className="border-border focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <Input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Your last name"
                        className="border-border focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="border-border focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <Input
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="border-border focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="border-border focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements..."
                      rows={5}
                      className="border-border focus:border-primary resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-gold hover:shadow-gold transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;