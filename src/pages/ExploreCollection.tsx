import { useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import goldImage from '@/assets/gold-collection.jpg';

const ExploreCollection = () => {
  const [date, setDate] = useState<Date>();

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
              src={goldImage} 
              alt="Gold Testing Service"
              className="w-full h-[600px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Right Side - Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Test Your Gold for Free
              </h1>
              <p className="text-muted-foreground italic">
                Book an Appointment
              </p>
            </div>

            <div className="space-y-4">
              {/* Name and Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input 
                    placeholder="Enter your name"
                    className="bg-card"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    E-mail Address
                  </label>
                  <Input 
                    type="email"
                    placeholder="Enter your email"
                    className="bg-card"
                  />
                </div>
              </div>

              {/* Jewelry Type and Material */}
              <div className="grid md:grid-cols-2 gap-4">
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
                      <SelectItem value="chains">Chains</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Weight and Date */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter Weight (grams)
                  </label>
                  <Input 
                    type="number"
                    placeholder="Enter weight"
                    className="bg-card"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Schedule Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-card"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd/MM/yyyy") : "11/07/2025"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Special Instructions (Optional)
                </label>
                <Textarea 
                  placeholder="e.g. Custom design, traditional look, old jewellery purity etc"
                  className="bg-card min-h-[80px]"
                />
              </div>

              {/* Submit Button */}
              <Button className="w-full" size="lg">
                Book My Free Appointment
              </Button>

              {/* Important Note */}
              <div className="bg-muted p-4 rounded-lg border border-border">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-sm">Important Note:</h4>
                    <p className="text-sm text-muted-foreground">
                      You're Scheduled To Visit Us On August 3rd, 2025 At 3:30 PM.
                      Thank You For Booking Your Gold Testing Appointment With Us. We're
                      Excited To Welcome You!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Appointment Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Active Appointment</h2>
          </div>
          
          <div className="bg-primary text-primary-foreground p-6 rounded-lg">
            <div className="space-y-2">
              <p><strong>Date:</strong> Sunday, August 3rd, 2025</p>
              <p><strong>Time:</strong> 3:30 PM</p>
              <p><strong>Location:</strong> Jewelproof Gold Evaluation Centre</p>
              <p><strong>Reference ID:</strong> JR-APT-08325-335PM</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExploreCollection;