import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";
import { createGoldPlan, extractCashfreeSessionId, initiateGoldPlanPayment, previewGoldPlan, verifyGoldPlanPayment } from "@/lib/api/customGoldPlanController";
import { load } from "@cashfreepayments/cashfree-js";
import { getManualRatesToday } from "@/lib/api/ratesController";

const MAX_INVESTMENT_AMOUNT = 100000;

const PlanDetails = () => {
    const { token } = useUserAuth();
    const [investment, setInvestment] = useState(50000);
    const [creating, setCreating] = useState(false);
    const [loadingRate, setLoadingRate] = useState(false);

    const [activeGoldRate, setActiveGoldRate] = useState<number>(0);
    const [isManualActive, setIsManualActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const isInvestmentExceeded = investment > MAX_INVESTMENT_AMOUNT;

    useEffect(() => {
        const fetchGoldRates = async () => {
            setLoadingRate(true);
            setError(null);

            let fetchedRate: number | null = null;

            // Attempt 1: previewGoldPlan
            try {
                const preview = await previewGoldPlan(token || "", investment);
                const rate = preview?.data?.gold_rate ?? (preview as any)?.gold_rate ?? (preview as any)?.rate;
                if (rate && Number(rate) > 0) {
                    fetchedRate = Number(rate);
                }
            } catch (err) {
                console.error("Attempt 1 (previewGoldPlan) failed:", err);
            }

            // Attempt 2: getGoldInvestments (if Attempt 1 failed or returned 0)
            if (!fetchedRate && token) {
                try {
                    const { getGoldInvestments } = await import("@/lib/api/userController");
                    const invRes = await getGoldInvestments(token);
                    const rate = invRes.data?.current_gold_rate ?? (invRes.data as any)?.wallet?.current_gold_rate;
                    if (rate && Number(rate) > 0) {
                        fetchedRate = Number(rate);
                    }
                } catch (err) {
                    console.error("Attempt 2 (getGoldInvestments) failed:", err);
                }
            }

            // Attempt 3: getManualRatesToday (last resort fallback)
            if (!fetchedRate && token) {
                try {
                    const manualData = await getManualRatesToday(token);
                    const goldManual = manualData.Gold?.find((r: any) => r.karat === "24K");
                    if (goldManual) {
                        fetchedRate = Number(goldManual.rate_per_gm);
                    }
                } catch (err) {
                    console.error("Attempt 3 (getManualRatesToday) failed:", err);
                }
            }

            if (fetchedRate) {
                setActiveGoldRate(fetchedRate);

                // Manual Indicator Detection
                if (token) {
                    try {
                        const manualData = await getManualRatesToday(token);
                        const goldManual = manualData.Gold?.find((r: any) => r.karat === "24K");
                        if (goldManual) {
                            const mRate = Number(goldManual.rate_per_gm);
                            if (Math.abs(mRate - (fetchedRate || 0)) < 5) { // Small buffer
                                setIsManualActive(true);
                            } else {
                                setIsManualActive(false);
                            }
                        }
                    } catch {
                        setIsManualActive(false);
                    }
                }
            } else {
                if (!token) {
                    setError("Please sign in to view accurate rates and create a plan.");
                } else {
                    setError("Unable to load latest gold rates. Please refresh or try again.");
                }
            }

            setLoadingRate(false);
        };
        fetchGoldRates();
    }, [token, investment]);

    const goldYouGet = useMemo(() => {
        if (!activeGoldRate) return "0.0000";
        return (investment / activeGoldRate).toFixed(4);
    }, [investment, activeGoldRate]);

    const prettyCurrency = (val: number) =>
        `₹ ${val.toLocaleString("en-IN")}`;

    async function handleCreatePlanAndPay() {
        if (!token) { navigate("/signin"); return; }
        if (isInvestmentExceeded) { setError("Amount exceeds limit"); return; }

        setError(null);
        setCreating(true);
        try {
            const created = await createGoldPlan(token, investment);
            const planId = created?.data?.plan;

            const paymentInit = await initiateGoldPlanPayment(planId, token);
            if (paymentInit?.success === false || paymentInit?.payment?.code) {
                throw new Error(paymentInit?.payment?.message || "Payment failed");
            }

            const initOrderId = (paymentInit as any)?.order_id;
            const sessionId = extractCashfreeSessionId(paymentInit) || extractCashfreeSessionId(paymentInit?.data);
            if (!sessionId) throw new Error("Unable to get session");

            const cashfree = await load({ mode: "sandbox" });
            await cashfree.checkout({
                paymentSessionId: sessionId,
                redirectTarget: "_self",
                returnUrl: `${window.location.origin}/payment-success?order_id=${initOrderId}`,
                onSuccess: async () => {
                    navigate(`/payment-success?order_id=${initOrderId}&verified=true`);
                },
                onFailure: () => {
                    navigate(`/payment-success?order_id=${initOrderId}&verified=false&error=payment_failed`);
                }
            });
        } catch (e: any) {
            setError(e?.message || "Something went wrong");
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="w-full px-4 md:px-10 py-8">
                {/* Banner */}
                <div className="w-full bg-[#D4AF37]/80 rounded-xl p-8 flex justify-between items-center mb-8 shadow-sm">
                    <div>
                        <div className="text-sm font-medium mb-1">Gold Rate</div>
                        <div className="text-3xl font-bold">
                            {loadingRate ? "..." : `₹ ${activeGoldRate ? activeGoldRate.toLocaleString("en-IN") : "0.00"}`}
                        </div>
                        <div className="text-xs opacity-70 mt-1">
                            ({isManualActive ? "Fixed Rate Applied" : "Live Market Rate"})
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-semibold">24k Gold</div>
                        <div className="text-xs opacity-70">~~ 0.00%</div>
                    </div>
                </div>

                {/* Desktop Layout grid */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    {/* Left: Input */}
                    <Card className="flex-[2] border border-gray-100 shadow-none rounded-lg overflow-hidden">
                        <CardContent className="p-8">
                            <h3 className="text-base font-bold mb-6">Calculate Your Gold Investment</h3>
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-500 mb-2">Investment Amount</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-200 rounded p-3 text-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                                    value={investment}
                                    onChange={(e) => setInvestment(Number(e.target.value))}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {[10000, 25000, 50000, 100000].map((val) => (
                                    <Button
                                        key={val}
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-200 text-gray-700 h-10 px-4 rounded"
                                        onClick={() => setInvestment(val)}
                                    >
                                        {prettyCurrency(val)}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Summary Card */}
                    <Card className="flex-1 bg-[#D4AF37]/50 border-none shadow-none rounded-lg overflow-hidden">
                        <CardContent className="p-8 flex flex-col gap-6">
                            <div>
                                <div className="text-xs font-bold text-gray-700/70 mb-1">Current Gold Rate</div>
                                <div className="text-lg font-bold">{loadingRate ? "..." : `₹ ${activeGoldRate}/Gram`}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-700/70 mb-1">Your Investment</div>
                                <div className="text-lg font-bold">{prettyCurrency(investment)}</div>
                            </div>
                            <div className="mt-2">
                                <div className="text-xs font-bold text-gray-700/70 mb-1">Gold You Will Get</div>
                                <div className="text-3xl font-bold text-[#084526]">
                                    {goldYouGet} <span className="text-xl">grams</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Botom CTA */}
                <Card className="w-full border border-gray-100 shadow-none py-12 rounded-xl text-center">
                    <h2 className="text-xl font-bold mb-2">Ready To Start Your Gold Journey?</h2>
                    <p className="text-xs text-gray-500 mb-8">
                        {isManualActive
                            ? "Take advantage of the currently applied rate and begin building your gold portfolio"
                            : "Lock In Today's Live Rate And Begin Building Your Gold Portfolio"
                        }
                    </p>

                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                    <Button
                        className="bg-[#15693C] hover:bg-[#0e4d2b] text-white font-bold h-12 px-12 rounded-lg text-lg min-w-[300px]"
                        onClick={handleCreatePlanAndPay}
                        disabled={creating || !activeGoldRate || isInvestmentExceeded}
                    >
                        {creating ? "Processing..." : "Pay & Lock-In Rate"}
                    </Button>

                    <div className="mt-4 flex flex-col gap-1">
                        <p className="text-[10px] text-gray-400">Rate Valid For Next 30 Minutes. No Hidden Charges</p>
                        <p className="text-[10px] text-gray-400">Maximum investment: ₹{MAX_INVESTMENT_AMOUNT.toLocaleString()}</p>
                    </div>
                </Card>
            </main>

            <Footer />
        </div>
    );
};

export default PlanDetails;
