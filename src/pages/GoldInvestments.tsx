import React from "react";
import { useUserAuth } from "@/context/UserAuthContext";
import {
  getGoldInvestments,
  type GoldPlanSummary,
  type GoldWalletSummary,
  getUserProfile,
} from "@/lib/api/userController";
import { getImageUrl } from "@/config";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Image as ImageIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileLayout from "@/components/ProfileLayout";

const GoldInvestments: React.FC = () => {
  const { token, isAuthenticated } = useUserAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [wallet, setWallet] = React.useState<GoldWalletSummary | null>(null);
  const [plans, setPlans] = React.useState<GoldPlanSummary[]>([]);
  const [totals, setTotals] = React.useState({
    totalGold: 0,
    totalInvested: 0,
    totalCurrentValue: 0,
    currentRate: 0,
  });
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [profile, setProfile] = React.useState<any>(null);

  const formatCurrency = React.useCallback((value: number | string | null | undefined) => {
    const numericValue = Number(value ?? 0);
    return `₹ ${numericValue.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }, []);

  const formatGrams = React.useCallback((value: number | string | null | undefined) => {
    const numericValue = Number(value ?? 0);
    return `${numericValue.toFixed(4)} g`;
  }, []);

  const formatDateTime = React.useCallback((value: string | null | undefined) => {
    if (!value) return "—";
    const normalized = value.includes("T") ? value : value.replace(" ", "T");
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return value;
    const datePart = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart} · ${timePart}`;
  }, []);

  const toTitleCase = React.useCallback((value: string | null | undefined) => {
    if (!value) return "";
    return value
      .toLowerCase()
      .split(/[\s_]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  const getTransactionStyles = React.useCallback((type: string | null | undefined) => {
    const normalized = (type || "").toLowerCase();
    if (normalized === "credit") {
      return {
        badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        amount: "text-emerald-700",
      };
    }

    if (normalized === "debit") {
      return {
        badge: "bg-rose-50 text-rose-700 border border-rose-200",
        amount: "text-rose-700",
      };
    }

    return {
      badge: "bg-slate-50 text-slate-700 border border-slate-200",
      amount: "text-slate-600",
    };
  }, []);

  const hasWallet = Boolean(wallet);
  const hasPlans = plans.length > 0;

  React.useEffect(() => {
    (async () => {
      if (!isAuthenticated || !token) {
        navigate("/signin");
        return;
      }
      try {
        const profileResp = await getUserProfile(token);
        setProfile(profileResp);
      } catch {
        // ignore profile load failures for layout
      }
    })();
  }, [isAuthenticated, token, navigate]);

  React.useEffect(() => {
    (async () => {
      if (!isAuthenticated || !token) {
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await getGoldInvestments(token);
        if (res.success) {
          const walletData = res.data?.wallet ?? null;
          const plansData = Array.isArray(res.data?.plans) ? (res.data?.plans as GoldPlanSummary[]) : [];

          setWallet(walletData);
          setPlans(plansData);

          const totalGold = Number(walletData?.total_gold_grams ?? res.data?.total_gold_grams ?? 0);
          const totalInvested = Number(walletData?.total_invested_amount ?? res.data?.total_invested ?? 0);
          const currentRate = Number(walletData?.current_gold_rate ?? res.data?.current_gold_rate ?? 0);
          const totalCurrentValue = Number(
            walletData?.total_current_value ??
            (totalGold && currentRate ? totalGold * currentRate : 0)
          );

          setTotals({
            totalGold,
            totalInvested,
            totalCurrentValue,
            currentRate,
          });
        } else {
          setWallet(null);
          setPlans([]);
          setTotals({
            totalGold: 0,
            totalInvested: 0,
            totalCurrentValue: 0,
            currentRate: 0,
          });
          setError(res.message || "Failed to load investments");
        }
      } catch (e: any) {
        setWallet(null);
        setPlans([]);
        setTotals({
          totalGold: 0,
          totalInvested: 0,
          totalCurrentValue: 0,
          currentRate: 0,
        });
        setError(e?.response?.data?.message || e?.message || "Failed to load investments");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, token]);

  const handleSectionChange = (
    section: "profile" | "plans" | "wallet" | "vault" | "customOrders" | "orders" | "wishlist"
  ) => {
    if (section === "vault") return;
    if (section === "wallet") {
      navigate("/wallet");
      return;
    }
    if (section === "orders") {
      navigate("/orders");
      return;
    }
    if (section === "wishlist") {
      navigate("/wishlist");
      return;
    }
    navigate("/profile", { state: { activeSection: section } });
  };

  return (
    <ProfileLayout
      activeSection="vault"
      profile={profile}
      setActiveSection={handleSectionChange}
    >
      <div className="space-y-6 border p-6 rounded-2xl bg-gray-50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#084526] flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xl">
                🪙
              </span>
              Gold Vault
            </h1>
            <p className="text-sm text-muted-foreground">
              One-time gold purchases, redemptions, and linked plan activity
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-10 w-10 animate-spin text-[#084526]" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : !hasWallet && !hasPlans ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No gold wallet activity found.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="relative bg-gradient-to-br from-yellow-50 to-amber-100 p-5 rounded-2xl shadow-md border border-amber-200">
                <div className="text-xs uppercase text-gray-500 tracking-wide">
                  Total Gold
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-800">
                  {formatGrams(totals.totalGold)}
                </div>
                <div className="absolute top-2 right-3 text-yellow-400">🏆</div>
              </div>

              <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-2xl shadow-md border border-emerald-200">
                <div className="text-xs uppercase text-gray-500 tracking-wide">
                  Total Invested
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-800">
                  {formatCurrency(totals.totalInvested)}
                </div>
                <div className="absolute top-2 right-3 text-emerald-500">💰</div>
              </div>

              <div className="relative bg-gradient-to-br from-sky-50 to-blue-100 p-5 rounded-2xl shadow-md border border-blue-200">
                <div className="text-xs uppercase text-gray-500 tracking-wide">
                  Current Rate
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-800">
                  {formatCurrency(totals.currentRate)}/g
                </div>
                <div className="absolute top-2 right-3 text-sky-500">📈</div>
              </div>

              <div className="relative bg-gradient-to-br from-amber-50 to-yellow-100 p-5 rounded-2xl shadow-md border border-yellow-200">
                <div className="text-xs uppercase text-gray-500 tracking-wide">
                  Current Value
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-800">
                  {formatCurrency(totals.totalCurrentValue)}
                </div>
                <div className="absolute top-2 right-3 text-yellow-500">🏅</div>
              </div>
            </div>

            {hasWallet && (
              <div className="bg-white rounded-2xl shadow-sm border">
                <div className="p-5 border-b flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
                    <p className="text-sm text-gray-500">Recent gold wallet activities</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {wallet?.transactions?.length || 0} records
                  </div>
                </div>

                <div className="p-4">
                  {wallet?.transactions && wallet.transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                              Scheme ID
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                              Type
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                              Description
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                              Gold (g)
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                              Value
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {wallet.transactions.map((txn) => {
                            const typeClass = getTransactionStyles(txn.type);
                            const isCredit = (txn.type || "").toLowerCase() === "credit";
                            const planId = txn.gold_plan_id;
                            const attachments = txn.attachments || [];

                            return (
                              <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                  {isCredit && planId ? (
                                    
                                      planId
                                   
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>

                                <td className="px-4 py-3 text-gray-700">
                                  {formatDateTime(txn.created_at)}
                                </td>

                                <td className="px-4 py-3">
                                  <div className="flex justify-center">
                                    <span
                                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${typeClass.badge}`}
                                    >
                                      <span
                                        className={`inline-block w-2 h-2 rounded-full ${isCredit ? "bg-emerald-500" : "bg-rose-500"
                                          }`}
                                      />
                                      {toTitleCase(txn.type)}
                                    </span>
                                  </div>
                                </td>

                                <td
                                  className="px-4 py-3 max-w-[320px] truncate text-gray-700"
                                  title={txn.description || ""}
                                >
                                  {txn.description || "—"}
                                </td>

                                <td className="px-4 py-3 text-right font-medium text-gray-900">
                                  {formatGrams(txn.gold_grams)}
                                </td>

                                <td
                                  className={`px-4 py-3 font-semibold text-right ${typeClass.amount}`}
                                >
                                  {`${isCredit ? "+" : "-"}${formatCurrency(
                                    txn.current_value
                                  )}`}
                                </td>

                                <td className="px-4 py-3 text-center">
                                  {attachments.length ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setPreviewImages(
                                          attachments.map((att) => getImageUrl(att))
                                        );
                                        setPreviewOpen(true);
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" /> Preview
                                    </Button>
                                  ) : (
                                    <span className="text-xs text-gray-400">—</span>
                                  )}
                                </td>

                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-500">
                      No transactions yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasPlans && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Linked Gold Plans</h2>
                  <span className="text-sm text-gray-500">
                    {plans.length} plan{plans.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.plan_id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            Plan #{plan.plan_id}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created on {formatDateTime(plan.created_at)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                              Gold
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatGrams(plan.gold_grams)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                              Invested
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatCurrency(plan.invested_amount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                              Gold Rate
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatCurrency(plan.gold_rate)}/g
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                              Payments
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {plan.payments?.length || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t bg-slate-50">
                        {plan.payments && plan.payments.length > 0 ? (
                          <div className="divide-y">
                            {plan.payments.map((payment) => {
                              const paymentStatus = (payment.status || "").toLowerCase();
                              const paymentBadgeClass =
                                paymentStatus === "success"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : paymentStatus === "failed"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-amber-100 text-amber-800";
                              return (
                                <div
                                  key={payment.payment_id}
                                  className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between"
                                >
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                      Payment ID
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900">
                                      #{payment.payment_id}
                                    </p>
                                  </div>
                                  <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        Order
                                      </p>
                                      <p className="text-sm font-medium text-slate-900">
                                        {payment.order_id || "—"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        Amount
                                      </p>
                                      <p className="text-sm font-semibold text-slate-900">
                                        {formatCurrency(payment.amount)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        Status
                                      </p>
                                      <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${paymentBadgeClass}`}
                                      >
                                        {toTitleCase(payment.status)}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        Date
                                      </p>
                                      <p className="text-sm font-medium text-slate-900">
                                        {formatDateTime(payment.start_date)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 text-sm text-muted-foreground">
                            No payments recorded yet for this plan.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Attachments
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-2">
            {previewImages.map((src, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden border">
                <img src={src} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </ProfileLayout>
  );
};

export default GoldInvestments;


