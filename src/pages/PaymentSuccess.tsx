import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";
import { verifyGoldPlanPayment } from "@/lib/api/customGoldPlanController";
import { verifySchemePaymentCashfree } from "@/lib/api/userSchemesController";

const PaymentSuccess = () => {
  const { token } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle");
  const [message, setMessage] = useState<string>("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [schemePaymentId, setSchemePaymentId] = useState<string | null>(null);
  const [type, setType] = useState<"scheme" | "customGoldPlan" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oidFromUrl = params.get("order_id");
    const schemePid = params.get("scheme_payment_id");
    const typeParam = params.get("type");
    const paymentIdFromUrl =
      params.get("payment_id") ||
      params.get("cf_payment_id") ||
      params.get("txnReference") ||
      params.get("referenceId") ||
      params.get("paymentId");
    const verified = params.get("verified");
    const error = params.get("error");
    
    let oid = oidFromUrl;
    if (!oid) {
      try {
        const cached = localStorage.getItem("va_last_cashfree_order_id");
        if (cached) oid = cached;
      } catch {}
    }
    setOrderId(oid ?? null);
    setSchemePaymentId(schemePid ?? (() => { try { return localStorage.getItem("va_last_scheme_payment_id"); } catch { return null; } })() );
    setType(typeParam === "scheme" ? "scheme" : "customGoldPlan");
    
    if (!oid) {
      setStatus("failed");
      setMessage("Missing order_id");
      return;
    }
    
    if (!token) {
      navigate("/signin");
      return;
    }
    
    // Check if payment was already verified in the callback
    if (verified === "true") {
      setStatus("success");
      setMessage("Payment verified successfully");
      return;
    }
    
    if (verified === "false" || error) {
      setStatus("failed");
      setMessage(error === "payment_failed" ? "Payment failed" : "Payment verification failed");
      return;
    }
    
    // If not pre-verified, attempt verification based on type
    setStatus("verifying");
    const run = async () => {
      if (typeParam === "scheme") {
        const res = await verifySchemePaymentCashfree(token, {
          scheme_payment_id: Number(schemePid),
          order_id: oid,
          razorpay_payment_id: String(paymentIdFromUrl || ""),
        });
        return res;
      } else {
        return await verifyGoldPlanPayment(token, oid);
      }
    };
    run()
      .then((res: any) => {
        if (res?.success) {
          setStatus("success");
          setMessage(res?.message || "Payment verified successfully");
        } else {
          setStatus("failed");
          setMessage(res?.message || "Payment verification failed");
        }
      })
      .catch((e: any) => {
        setStatus("failed");
        setMessage(e?.message || "Verification error");
      });
  }, [location.search, navigate, token]);

  // Simple retry polling if verification initially fails
  const tried = useRef(0);
  useEffect(() => {
    if (status !== "failed" || !orderId || !token) return;
    if (tried.current >= 3) return; // max 3 retries
    tried.current += 1;
    const t = setTimeout(() => {
      setStatus("verifying");
      const rerun = async () => {
        if (type === "scheme") {
          return await verifySchemePaymentCashfree(token, {
            scheme_payment_id: Number(schemePaymentId),
            order_id: orderId,
          });
        }
        return await verifyGoldPlanPayment(token, orderId);
      };
      rerun()
        .then((res: any) => {
          if (res?.success) {
            setStatus("success");
            setMessage(res?.message || "Payment verified successfully");
          } else {
            setStatus("failed");
            setMessage(res?.message || "Payment verification failed");
          }
        })
        .catch((e: any) => {
          setStatus("failed");
          setMessage(e?.message || "Verification error");
        });
    }, 2000 * tried.current);
    return () => clearTimeout(t);
  }, [status, orderId, token]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <Header />
      <div className="w-full max-w-2xl mx-auto mt-10 mb-16 px-4">
        <Card>
          <CardContent className="p-8 flex flex-col gap-4 items-center text-center">
            <div className="text-2xl font-semibold">Payment Status</div>
            <div className="text-sm text-muted-foreground">
              {status === "verifying" && "Verifying your payment..."}
              {status === "success" && (
                <div className="text-green-600 font-semibold">
                  ✅ {message}
                </div>
              )}
              {status === "failed" && (
                <div className="text-red-600 font-semibold">
                  ❌ {message}
                </div>
              )}
            </div>
            {orderId && (
              <div className="text-xs text-muted-foreground">order_id: {orderId}</div>
            )}
            <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;


