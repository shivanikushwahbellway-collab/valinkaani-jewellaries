import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bridalImage from '@/assets/bridal-banner.jpg';

const BridalCollection = () => {
  const [date, setDate] = useState<Date>();
  const [estimatedPrice, setEstimatedPrice] = useState('₹ 4548');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <Button variant="default">Book Appointment</Button>
            <Button variant="outline">Compare Gold</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Side - Image */}
          <div className="space-y-4">
            <img 
              src={bridalImage} 
              alt="Bridal Collection Jewelry"
              className="w-full h-[600px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Right Side - Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Compare your Jewellery
              </h1>
              <p className="text-muted-foreground italic">
                Find out the estimated worth
              </p>
            </div>

            <div className="space-y-4">
              {/* Jewelry Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Jewellery Type
                </label>
                <Select>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="necklace">Necklace</SelectItem>
                    <SelectItem value="earrings">Earrings</SelectItem>
                    <SelectItem value="bangles">Bangles</SelectItem>
                    <SelectItem value="rings">Rings</SelectItem>
                    <SelectItem value="mangalsutra">Mangalsutra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Material Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Material Type
                </label>
                <Select>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select material..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter Weight (grams)
                </label>
                <Input 
                  type="number" 
                  placeholder="Enter weight in grams"
                  className="bg-card"
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Special Instructions (Optional)
                </label>
                <Textarea 
                  placeholder="e.g. Chain design, traditional look, and jewellery with stones, etc."
                  className="bg-card min-h-[100px]"
                />
              </div>

              {/* Estimated Price */}
              <div className="bg-accent p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Estimated Price</h3>
                <div className="text-2xl font-bold text-primary">
                  {estimatedPrice}
                </div>
                <p className="text-sm text-muted-foreground">
                  Price = (Metal Rate) + Weight + Making Charges
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  * The price is based on current metal rate and may vary
                </p>
              </div>

              {/* Submit Button */}
              <Button className="w-full" size="lg">
                Compare My Jewellery
              </Button>

              {/* Important Note */}
              <div className="bg-muted p-4 rounded-lg border border-border">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-sm">Important Note:</h4>
                    <p className="text-sm text-muted-foreground">
                      This Is An Estimated Price Based On The Details You Provide. For An
                      Accurate Final Quote, Please Contact Us Directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BridalCollection;