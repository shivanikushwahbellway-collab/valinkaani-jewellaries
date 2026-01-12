import React, { useEffect, useRef, useState } from "react";
import goldbar from "@/assets/goldbar.png";
import appointmentImg from "@/assets/bookappointment.png";
import compareImg from "@/assets/compare.png";
import { CalendarDays } from "lucide-react";
import  Header  from "@/components/Header";
import Footer from "@/components/Footer";

const GoldServices = () => {
  const appointmentRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<'appointment' | 'compare'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#compare') return 'compare';
      return 'appointment';
    }
    return 'appointment';
  });
  const [date, setDate] = useState('');

  useEffect(() => {
    if (window.location.hash === "#appointment" && appointmentRef.current) {
      appointmentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (window.location.hash === "#compare" && compareRef.current) {
      compareRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    window.location.hash = `#${activeSection}`;
  }, [activeSection]);

  return (
    <>
      <Header/>
    <div className="min-h-screen bg-white  px-4 flex flex-col items-center">
      {/* Top Menu */}
      <div className="w-full flex justify-center mb-8 font-serif">
        <button
          className={`px-20 py-2 border transition-all duration-200  ${activeSection === 'appointment' ? 'bg-[#084526] text-[#fce56b] border-[#084526]' : 'bg-white hover:bg-green-100 border-gray-300 text-green-900'}`}
          onClick={() => setActiveSection('appointment')}
        >
          Book Appointment
        </button>
        <button
          className={`px-20 py-2 border transition-all duration-200  ${activeSection === 'compare' ? 'bg-[#084526] text-[#fce56b] border-[#084526]' : 'bg-white hover:bg-green-100 border-gray-300 text-green-900'}`}
          onClick={() => setActiveSection('compare')}
        >
          Compare Gold
        </button>
      </div>

      {/* Section Content */}
      <div className="w-full h-[80vh] flex flex-col md:flex-row  ">
        {activeSection === 'appointment' && (
          <div ref={appointmentRef} id="appointment" className="flex-1 flex flex-col md:flex-row bg-[#feeddb] rounded-xl shadow-lg p-0 overflow-hidden">
            <div className="hidden md:block md:w-1/2 bg-white">
              <img src={appointmentImg} alt="Jewellery" className="object-cover w-full h-full" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center p-6 md:p-10 relative">
              <h2 className="text-2xl font-bold text-center mb-1 mt-8 md:mt-0 text-green-900 font-serif">Test Your Gold for Free <br /><span className="text-lg font-normal italic">---------------Book an Appointment</span></h2>
              <form className="w-full rounded-lg   flex flex-col gap-4 mt-4 font-serif">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Your Name</label>
                    <input className="border rounded p-2 w-full bg-transparent" placeholder="Enter your name" />
                  </div>
                  <div>
                    <label className="block text-sm  mb-1">E-mail Address</label>
                    <input className="border rounded p-2 w-full bg-transparent" placeholder="Enter your email" />
                  </div>
                  <div>
                    <label className="block text-sm  mb-1">Select Jewellery Type</label>
                    <select className="border rounded p-2 w-full bg-transparent" defaultValue=""><option value="">Select</option></select>
                  </div>
                  <div>
                    <label className="block text-sm  mb-1">Select Material Type</label>
                    <select className="border rounded p-2 w-full bg-transparent" defaultValue=""><option value="">Select</option></select>
                  </div>
                  <div>
                    <label className="block text-sm  mb-1">Enter Weight (grams)</label>
                    <input className="border rounded p-2 w-full bg-transparent" placeholder="e.g. 10" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm  mb-1">Schedule Date</label>
                    <input 
                      className="border rounded p-2 w-full pr-10 bg-transparent" 
                      type="date" 
                      value={date} 
                      onChange={e => setDate(e.target.value)}
                    />
                    <CalendarDays className="absolute right-3 top-9 text-gray-400 w-5 h-5 pointer-events-none bg-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm  mb-1">Special Instructions (Optional)</label>
                  <textarea className="border rounded p-2 w-full min-h-[48px] text-sm bg-transparent" placeholder="e.g. Custom design, karat/brand details, or other notes..." />
                </div>
                <button
                  type="submit"
                  className="relative overflow-hidden group bg-gradient-luxury hover:shadow-luxury transition-all duration-300 px-8 py-2 text-white text-lg  rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 transform hover:scale-105"
                >
                  {/* Animated overlay */}
                  <span
                    className="pointer-events-none absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out"
                    aria-hidden="true"
                  ></span>
                  {/* Button text */}
                  <span className="relative z-10">Book My Free Appointment</span>
                </button>
                {/* Active Appointment Box */}
                {/* <div className="w-full mt-4 rounded-lg shadow border border-green-800 bg-gradient-to-br from-green-800 to-green-600 text-white p-4 text-sm">
                  <div className="flex items-center mb-1">
                    <span className="mr-2">&#9679;</span>
                    <span className="font-semibold">Active Appointment</span>
                  </div>
                  <div className="mt-2">
                    <div>Date: <b>Sunday, August 3rd, 2025</b></div>
                    <div>Time: <b>3:30 PM</b></div>
                    <div>Location: <b>Jewelroof Gold Evaluation Centre</b></div>
                    <div>Reference ID: <b>JR-APT-08325-335PM</b></div>
                  </div>
                </div> */}
                <div className="w-full  mt-4 bg-yellow-100 border border-yellow-400 rounded p-3 text-xs md:text-sm">
                  <b>Important Note:</b><br />
                  Your Schedule To Visit Is On August 3rd, 2025 At 3:30 PM.<br />
                  Thank You For Booking Your Gold Testing Appointment With Us. We're Excited To Welcome You!
                </div>
              </form>
              
             
            </div>
            
          </div>
        
        )}
        {activeSection === 'compare' && (
          <div ref={compareRef} id="compare" className="flex-1 flex flex-col md:flex-row bg-[#feeddb] rounded-xl shadow-lg p-0 overflow-hidden">
            <div className="hidden md:block md:w-1/2 bg-white">
              <img src={compareImg} alt="Jewellery" className="object-cover w-full h-full" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center p-6 md:p-10 relative">
              <h2 className="text-2xl font-bold text-center mb-1 mt-8 md:mt-0 text-green-900 font-serif">Compare your Jewellery <br /><span className="text-lg font-normal italic">---------------Find out the estimated worth</span></h2>
              <form className="w-full rounded-lg flex flex-col gap-4 mt-4 font-serif">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Select Jewellery Type</label>
                    <select className="border rounded p-2 w-full bg-transparent" defaultValue=""><option value="">Select</option></select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Select Material Type</label>
                    <select className="border rounded p-2 w-full bg-transparent" defaultValue=""><option value="">Select</option></select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Enter Weight (grams)</label>
                    <input className="border rounded p-2 w-full bg-transparent" placeholder="Enter Weight (grams)" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Special Instructions (Optional)</label>
                    <textarea className="border rounded p-2 w-full min-h-[48px] text-sm bg-transparent" placeholder="e.g. Custom design, karat/brand details, or other notes..." />
                  </div>
                </div>
                {/* Estimated Price Box */}
                <div className="bg-yellow-100 border border-yellow-400 rounded p-4 text-center mt-4 text-xs md:text-sm">
                  <div className="text-lg font-bold text-[#8e6e00]">₹ 4548</div>
                  <div className="text-xs">Price = (Metal Rate) x Weight + Making Charges<br/>(This is an estimated amount, actual price may vary.)</div>
                </div>
                <button
                  type="submit"
                  className="relative overflow-hidden group bg-gradient-luxury hover:shadow-luxury transition-all duration-300 px-8 py-2 text-white text-lg  rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 transform hover:scale-105"
                >
                  {/* Animated overlay */}
                  <span
                    className="pointer-events-none absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out"
                    aria-hidden="true"
                  ></span>
                  {/* Button text */}
                  <span className="relative z-10">Compare My Jewellery</span>
                </button>
              </form>
              <div className="w-full  mt-4 bg-yellow-100 border border-yellow-400 rounded p-3 text-xs md:text-sm">
                <b>Important Note:</b><br />
                This is an estimate price based on the details you provide. For the accurate final quote, please contact us directly.
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
    <Footer/>
    </>
  );
};

export default GoldServices; 