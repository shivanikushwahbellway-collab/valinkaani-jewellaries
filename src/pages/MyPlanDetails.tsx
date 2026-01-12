import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/context/UserAuthContext";
import {
  getMyPlans,
  createNextInstallmentOrder,
  verifySchemePaymentCashfree,
} from "@/lib/api/userSchemesController";
import {
  Calendar,
  IndianRupee,
  Clock,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Wallet,
} from "lucide-react";
import ProfileLayout from "@/components/ProfileLayout";
import { useToast } from "@/hooks/use-toast";
import { load } from "@cashfreepayments/cashfree-js";
import { extractCashfreeSessionId } from "@/lib/api/customGoldPlanController";

const MyPlanDetails = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { token } = useUserAuth();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [plan, setPlan] = React.useState<any>(null);
  const [payingId, setPayingId] = React.useState<number | null>(null);

  const loadPlan = React.useCallback(async () => {
    if (!token || !planId) return;
    setLoading(true);
    try {
      const resp = await getMyPlans(token);
      if (resp.success) {
        const found = (resp.data || []).find(
          (p: any) => String(p.id) === String(planId)
        );
        setPlan(found || null);
      }
    } finally {
      setLoading(false);
    }
  }, [token, planId]);

  React.useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const handleSectionChange = (
    section: "profile" | "plans" | "wallet" | "vault" | "customOrders" | "orders" | "wishlist"
  ) => {
    navigate("/profile", { state: { activeSection: section } });
  };

  const openCashfreeForPayment = async (currentPlan: any, payment: any) => {
    if (!token) return;
    try {
      setPayingId(payment.id);
      const create = await createNextInstallmentOrder(token, Number(payment.id));
      if (!create?.success) throw new Error("Failed to create order");
      const activeOrder =
        (create as any)?.cashfree_order ||
        (create as any)?.razorpay_order ||
        {};
      const sessionId =
        extractCashfreeSessionId(activeOrder) ||
        extractCashfreeSessionId((create as any)?.data) ||
        extractCashfreeSessionId(create) ||
        (activeOrder as any)?.payment_session_id ||
        (create as any)?.payment_session_id;
      if (!sessionId) {
        toast({
          title: "Payment error",
          description: "Missing Cashfree session. Please try again.",
        });
        return;
      }

      const cashfree = await load({ mode: "sandbox" as any });
      await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_self",
        returnUrl: `${window.location.origin}/payment-success?type=scheme&order_id=${encodeURIComponent(
          String((activeOrder as any)?.order_id || "")
        )}&scheme_payment_id=${encodeURIComponent(String(payment.id))}`,
        onSuccess: async (data: any) => {
          try {
            const cfPaymentId =
              data?.txnReference ||
              data?.payment?.paymentId ||
              data?.paymentId ||
              data?.cf_payment_id ||
              "";
            await verifySchemePaymentCashfree(token, {
              scheme_payment_id: Number(payment.id),
              order_id: String((activeOrder as any)?.order_id || ""),
              razorpay_payment_id: String(cfPaymentId || ""),
            });
            toast({
              title: "Payment verified",
              description: "Installment paid successfully",
            });
            await loadPlan();
          } catch (err: any) {
            toast({
              title: "Verification failed",
              description:
                err?.response?.data?.message || "Please contact support",
            });
          }
        },
        onFailure: (err: any) => {
          toast({
            title: "Payment failed",
            description: err?.message || "Please try again",
          });
        },
      });
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message || err?.response?.data?.error;
      toast({
        title: "Payment init failed",
        description: serverMsg || err?.message || "Try again later",
      });
    } finally {
      setPayingId(null);
    }
  };

  return (
    <ProfileLayout activeSection="plans" setActiveSection={handleSectionChange}>
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <Loader2 className="w-6 h-6 animate-spin text-[#084526]" />
        </div>
      ) : !plan ? (
        <div className="p-6 text-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-muted-foreground text-lg">
            Scheme details not found.
          </div>
        </div>
      ) : (
        <div className="p-6 border mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#084526]">
                Scheme #{plan.id}
              </h1>
              <p className="text-sm text-muted-foreground">
                {plan.scheme?.scheme || "—"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* <div className="bg-[#084526]/10 text-[#084526] px-3 py-2 rounded-full text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Wallet Balance: ₹
                {Number(plan.wallet_amount || 0).toLocaleString("en-IN")}
              </div> */}
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="text-[#084526] border-[#084526]/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </div>
          </div>

          {/* General Info */}
          <div className="bg-white rounded-2xl shadow-md border p-6">
            <h2 className="text-lg font-semibold text-[#084526] mb-4">
              General Info
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              {[
                ["Status", plan.status],
                ["Timeline", plan.scheme?.timeline?.replace("months", " Months")],
                ["Monthly", `₹${Number(plan.monthly_amount).toLocaleString("en-IN")}`],
                ["Total Paid", `₹${Number(plan.total_paid).toLocaleString("en-IN")}`],
                ["Started", new Date(plan.start_date).toLocaleDateString()],
                ["Ends", new Date(plan.end_date).toLocaleDateString()],
                // ["Maturity Amount", `₹${plan.scheme?.maturity_amount?.toLocaleString("en-IN")}`],
              ].map(([label, value], i) => (
                <div key={i}>
                  <div className="font-medium text-gray-600">{label}</div>
                  <div className="font-semibold text-gray-900">{value}</div>
                </div>
              ))}
            </div>

            {plan.scheme?.points?.length ? (
              <div className="mt-6">
                <div className="font-semibold mb-2 text-sm text-[#084526]">
                  Key Benefits
                </div>
                <ul className="list-disc pl-5 text-xs space-y-1 text-gray-700">
                  {plan.scheme.points.map((point: string, idx: number) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {plan.scheme?.attachments?.length ? (
              <div className="mt-6">
                <div className="font-semibold mb-2 text-sm text-[#084526]">
                  Attachments
                </div>
                {plan.scheme.attachments.map((url: string, idx: number) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#084526] underline text-xs mb-1 hover:text-[#063c20]"
                  >
                    <FileText className="w-4 h-4" />
                    Download Brochure #{idx + 1}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Installment Payments */}
          <div className="bg-white rounded-2xl shadow-md border p-6">
            <h2 className="text-lg font-semibold text-[#084526] mb-4">
              Installment Payments
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-separate border-spacing-y-2">
                <thead className="bg-[#084526]/10 text-[#084526]">
                  <tr>
                    {[
                      "Installment",
                      "Due Date",
                      "Status",
                      "Amount",
                      "Order ID",
                      "Payment ID",
                      "Action",
                    ].map((h) => (
                      <th key={h} className="py-3 px-3 text-left font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plan.payments?.length ? (
                    plan.payments.map((p: any, idx: number) => (
                      <tr
                        key={p.id}
                        className="bg-gray-50 hover:bg-gray-100 transition rounded-lg"
                      >
                        <td className="py-3 px-3 font-medium text-gray-700">
                          #{p.installment_number}
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {new Date(p.due_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                              p.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {p.status === "paid" ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" /> {p.status}
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-gray-700">
                          ₹{Number(p.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-gray-500">
                          {p.razorpay_order_id ?? "—"}
                        </td>
                        <td className="py-3 px-3 text-gray-500">
                          {p.razorpay_payment_id ?? "—"}
                        </td>
                        <td className="py-3 px-3">
                          {p.status === "paid" ? (
                            <span className="text-xs text-gray-400">—</span>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-[#084526] hover:bg-[#063c20]"
                              onClick={() => openCashfreeForPayment(plan, p)}
                              disabled={payingId === p.id}
                            >
                              {payingId === p.id && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Pay Now
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center text-xs text-muted-foreground py-6"
                      >
                        No installments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </ProfileLayout>
  );
};

export default MyPlanDetails;
