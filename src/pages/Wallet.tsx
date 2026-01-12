import { useEffect, useState } from "react";
import { useUserAuth } from "@/context/UserAuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile } from "@/lib/api/userController";
import { getUserWallet, type WalletTransaction } from "@/lib/api/walletController";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wallet as WalletIcon, Eye, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileLayout from "@/components/ProfileLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Wallet = () => {
  const { token, isAuthenticated } = useUserAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string>("0");
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated || !token) {
        navigate("/signin");
        return;
      }
      setLoading(true);
      try {
        const profileResp = await getUserProfile(token);
        setProfile(profileResp);
        const id = profileResp?.data?.id ?? profileResp?.data?.user?.id ?? null;
        if (!id) throw new Error("Unable to resolve user id");
        const wallet = await getUserWallet(token, Number(id));
        if (wallet.success && wallet.data) {
          setBalance(wallet.data.balance);
          setTransactions(wallet.data.transactions || []);
        } else {
          toast({
            title: "Wallet",
            description: wallet.message || "Unable to fetch wallet",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error("Wallet fetch error:", err);
        toast({
          title: "Error",
          description: err?.message || "Failed to load wallet",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [isAuthenticated, token, toast, navigate]);

  const handleSectionChange = (
    section: "profile" | "plans" | "wallet" | "vault" | "customOrders" | "orders" | "wishlist"
  ) => {
    if (section === "wallet") return;
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
      activeSection="wallet"
      profile={profile}
      setActiveSection={handleSectionChange}
    >
      <div className="space-y-6 border p-6 rounded-2xl bg-gray-50 shadow-sm">
        {/* Header + Balance */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#084526] flex items-center gap-3">
              <WalletIcon className="h-6 w-6 text-[#084526]" /> Wallet
            </h2>
            <p className="text-sm text-gray-600">All credits & debits related to your account</p>
          </div>

          {/* Balance card */}
          <div className="self-start md:self-center">
            <div className="relative w-[200px]">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-[#08603a] to-[#0f7f4a] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium flex items-center gap-2">
                      <WalletIcon className="h-4 w-4 opacity-90" />
                      Available Balance
                    </div>
                    <div className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/90">LIVE</div>
                  </div>
                  <div className="mt-3 text-lg font-extrabold tracking-tight">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-white text-lg">Loading</span>
                      </div>
                    ) : (
                      <>₹{Number(balance || 0).toLocaleString("en-IN")}</>
                    )}
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
              <p className="text-sm text-gray-500">Recent wallet activities</p>
            </div>
            <div className="text-sm text-gray-500">{transactions.length} records</div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-[#084526]" />
              </div>
            ) : transactions.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Scheme ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          {t.user_scheme_id ? (
                            <button
                              onClick={() => navigate(`/my-plans/${t.user_scheme_id}/details`)}
                              className="text-[#084526] font-semibold hover:underline"
                            >
                              #{t.user_scheme_id}
                            </button>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-gray-700">{new Date(t.created_at).toLocaleString()}</td>

                        {/* Credit/Debit pill centered */}
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            {t.type === "credit" ? (
                              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                                Credit
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
                                Debit
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 max-w-[420px] truncate text-gray-700" title={t.description}>
                          {t.description || "—"}
                        </td>

                        <td className={`px-4 py-3 font-semibold text-right ${t.type === "credit" ? "text-emerald-700" : "text-rose-700"}`}>
                          {t.type === "credit" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {t.user_scheme_id ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/my-plans/${t.user_scheme_id}/details`)}
                              className="text-[#084526] border-[#084526] hover:bg-[#084526] hover:text-white transition-colors"
                            >
                              View Scheme
                            </Button>
                          ) : t.attachments?.length ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setPreviewImages(t.attachments || []);
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
                    ))}
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

        {/* Preview Dialog */}
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
      </div>
    </ProfileLayout>
  );
};

export default Wallet;
