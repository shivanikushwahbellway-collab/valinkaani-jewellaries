import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { verifySchemePaymentCashfree } from "@/lib/api/userSchemesController";
import { useUserAuth } from "@/context/UserAuthContext";
import logo from "@/assets/logo.jpg";

const PAYMENT_METHODS = [
  {
    label: "UPI",
    description: "Google pay, phone pay, paytm",
    icon: "🟡",
  },
  {
    label: "Credit/Debit Card",
    description: "Visa, Mastercard, RuPay",
    icon: "💳",
  },
  {
    label: "NetBanking",
    description: "Visa, Mastercard, RuPay",
    icon: "🏦",
  },
  {
    label: "Wallets",
    description: "Paytm, Amazon Pay, Mobikwik",
    icon: "👛",
  },
];

type NavState = {
  order?: { success: boolean; order_id: string; amount: number; currency: string; receipt: string };
  key?: string;
  userScheme?: any;
};

const Payments = () => {
  const [selected, setSelected] = useState(0);
  const [autoDebit, setAutoDebit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { token, isAuthenticated } = useUserAuth();

  const { order, key, userScheme } = (location.state || {}) as NavState;
  const totalAmountInRupees = useMemo(() => (order?.amount ? order.amount / 100 : 0), [order?.amount]);

  if (!order) {
    // If user lands here without order context, redirect to Schemes
    toast({ title: "No payment context", description: "Please choose a plan to proceed" });
    navigate("/schemes");
    return null;
  }

  // Load Razorpay script once
  useEffect(() => {
    const src = "https://checkout.razorpay.com/v1/checkout.js";
    const existing = document.querySelector(`script[src='${src}']`);
    if (existing) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openRazorpay = () => {
    if (!isAuthenticated || !token) {
      toast({ title: "Please sign in", description: "Login required to pay" });
      navigate("/signin");
      return;
    }
    // @ts-ignore
    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      toast({ title: "Payment SDK not loaded", description: "Please wait and try again" });
      return;
    }
    const firstPayment = Array.isArray(userScheme?.payments)
      ? userScheme.payments.find((p: any) => p.razorpay_order_id === order.order_id) || userScheme.payments[0]
      : undefined;
    const schemePaymentId = Number(firstPayment?.id);

    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      name: "Vailankanni Jewellers",
      image: logo,
      description: userScheme?.scheme?.name || "Scheme first installment",
      order_id: order.order_id,
      handler: async function (response: any) {
        try {
          await verifySchemePaymentCashfree(token!, {
            scheme_payment_id: schemePaymentId,
           
            order_id: response.razorpay_order_id,
          });
          toast({ title: "Payment verified", description: "Your plan is now active" });
          navigate("/profile");
        } catch (err: any) {
          toast({ title: "Verification failed", description: err?.response?.data?.message || "Please contact support" });
        }
      },
      prefill: {},
      notes: { receipt: order.receipt },
      theme: { color: "#166534" },
    } as any;

    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <Header />
      <div className="w-auto bg-[#f3e3b2] rounded-xl mt-8 mx-10 flex items-center px-8 py-4 shadow-md">
        <span className="mr-2">⚠️</span>
        <span className="text-[#7a5a1e] font-medium">
          You're Just Step Away From Locking Your Gold At Today's Rate
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mx-10 my-8">
        {/* Payment Methods */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {PAYMENT_METHODS.map((method, idx) => (
                <div
                  key={method.label}
                  className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                    selected === idx
                      ? "border-green-600 bg-[#f5fbe9]"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => setSelected(idx)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <div className="font-semibold">{method.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {method.description}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selected === idx ? "border-green-600" : "border-gray-300"
                    }`}
                  >
                    {selected === idx ? (
                      <span className="w-3 h-3 bg-green-600 rounded-full inline-block"></span>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Order Summary */}
        <Card className="w-full md:w-96">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="text-green-900 font-semibold text-md mb-2">Payment Summary</div>
            <div className="flex justify-between text-sm">
              <span>Order ID</span>
              <span className="text-green-700">{order.order_id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Receipt</span>
              <span>{order.receipt}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Currency</span>
              <span>{order.currency}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span className="text-orange-700">₹ {totalAmountInRupees}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium">Auto Debit</span>
              <button
                className={`w-10 h-6 rounded-full border-2 flex items-center transition-colors duration-200 ${
                  autoDebit
                    ? "bg-yellow-600 border-yellow-600"
                    : "bg-gray-200 border-gray-300"
                }`}
                onClick={() => setAutoDebit(!autoDebit)}
                type="button"
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                    autoDebit ? "translate-x-4" : ""
                  }`}
                ></span>
              </button>
            </div>
            <Button
              className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-lg text-lg font-semibold w-full mt-4"
              onClick={openRazorpay}
            >
              Proceed To Payment
            </Button>
   
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Payments;
