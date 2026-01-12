import React, { useState } from "react";
import logo from "@/assets/logo.jpg";
import signinImg from "@/assets/signin.png";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyRegisterOtp } from "@/lib/api/userController";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (showOtp && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [showOtp, timer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await registerUser(formData);
      setShowOtp(true);
      setTimer(60);
      setMessage("");
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const maskMobile = (mobile: string) => {
    if (!mobile) return "";
    if (mobile.length <= 6) return mobile;
    return `${mobile.slice(0, 4)}xxxxxx${mobile.slice(-2)}`;
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyRegisterOtp({ mobile: formData.mobile, otp });
      setShowOtp(false);
      setOtp("");
      setFormData({ name: "", email: "", mobile: "" });
      navigate("/signin");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center font-serif ">
        <div className="bg-white flex w-full overflow-hidden">
          {/* Left Image */}
          <div className="hidden md:block w-1/2 bg-gray-100">
            <img
              src={signinImg}
              alt="Sign Up"
              className="object-cover w-full h-full"
            />
          </div>
          {/* Right Form */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <div className="flex justify-center gap-2 items-center mb-8">
              <img
                src={logo}
                alt="Vailankanni Logo"
                className="h-12 w-12 rounded mb-2"
              />
              <div className="flex flex-col justify-center">
                <span className="text-[#084526] text-xl font-bold">
                  Vailankanni
                </span>
                <span className="text-xs text-[#8e6e00] uppercase tracking-widest">
                  Jewellers
                </span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-[#084526]">Sign Up</h2>
            <div className="text-sm mb-6">
              Already Have An Account?{" "}
              <a href="/signin" className="text-[#eab308] ml-1">
                Sign In
              </a>
            </div>

            {message && (
              <div
                className={`mb-4 p-3 rounded text-sm ${
                  message.includes("successful")
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#084526]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. john@email.com"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#084526]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 985 652 0198"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#084526]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded mt-4 font-semibold hover:bg-[#222] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Get OTP"}
              </button>
            </form>
          </div>
        </div>
        <Dialog open={showOtp} onOpenChange={setShowOtp}>
          <DialogContent className="max-w-xl p-8 font-serif">
            <form onSubmit={handleOtpSubmit} className="flex flex-col items-center">
              <h2 className="text-2xl font-bold my-2 text-center">Enter Your OTP</h2>
              <div className="text-sm text-center my-4">
                OTP sent to your registered mobile no. <br />
                <span className="font-semibold">{maskMobile(formData.mobile)}</span>
              </div>
              <InputOTP maxLength={6} value={otp} onChange={setOtp} className="mb-4 ">
                <InputOTPGroup>
                  {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                </InputOTPGroup>
              </InputOTP>
              <div className="text-xs text-gray-500 my-4">Didn't get the code? Resend in 0:{timer.toString().padStart(2, '0')}</div>
              <button type="submit" className="w-fit px-10 bg-black text-white py-2 font-semibold hover:bg-[#222] transition">Submit</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
