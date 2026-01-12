import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Shield,
  Loader2,
  Eye,
  Image as ImageIcon,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getGoldVault, debitGoldVault } from "@/lib/api/vaultController";

interface GoldTransaction {
  id: number;
  type: "credit" | "debit";
  gold_plan_id?: number;
  gold_grams: number;
  invested_amount: number;
  current_value: number;
  description: string;
  attachments?: string[];
  created_at: string;
}

interface GoldVaultData {
  total_gold_grams: number;
  total_invested_amount: number;
  total_current_value: number;
  current_gold_rate: number;
  transactions: GoldTransaction[];
}

const UserGoldVault = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [vault, setVault] = useState<GoldVaultData | null>(null);

  // debit form
  const [goldGrams, setGoldGrams] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const loadGoldVault = async () => {
    if (!token || !userId) return;
    setLoading(true);
    try {
      const res = await getGoldVault(Number(userId), token);
      if (res?.success && res.data) {
        setVault(res.data);
        setUserName(`User #${userId}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoldVault();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  const onSubmitDebit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) return;
    try {
      setSubmitting(true);
      await debitGoldVault(token, {
        user_id: Number(userId),
        gold_grams: goldGrams,
        description: description || undefined,
        attachments: files ? Array.from(files) : [],
      });
      
      // Show success message
      toast({
        title: "Success",
        description: "Gold debited successfully.",
      });
      
      // Reset form
      setGoldGrams("");
      setDescription("");
      setFiles(null);
      
      // Reload data
      await loadGoldVault();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to debit gold. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gold Vault</h1>
            <p className="text-muted-foreground">{userName || "Loading..."}</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="vault" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" onClick={() => navigate(`/admin/users/${userId}/overview`)}>Overview</TabsTrigger>
          <TabsTrigger value="orders" onClick={() => navigate(`/admin/users/${userId}/orders`)}>Orders</TabsTrigger>
          <TabsTrigger value="customOrders" onClick={() => navigate(`/admin/users/${userId}/custom-orders`)}>Custom Orders</TabsTrigger>
          <TabsTrigger value="schemes" onClick={() => navigate(`/admin/users/${userId}/schemes`)}>Schemes</TabsTrigger>
          <TabsTrigger value="customPlans" onClick={() => navigate(`/admin/users/${userId}/custom-plans`)}>Custom Plans</TabsTrigger>
          <TabsTrigger value="wallet" onClick={() => navigate(`/admin/users/${userId}/wallet`)}>Wallet</TabsTrigger>
          <TabsTrigger value="vault" onClick={() => navigate(`/admin/users/${userId}/gold-vault`)}>Gold Vault</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main layout */}
      <div className="grid gap-4 md:grid-cols-4 mt-4">
        {/* Left: Gold Holdings and Debit Form */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gold Holdings
              </CardTitle>
              <CardDescription>Secure gold balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold">
                    {vault?.total_gold_grams ?? 0} g
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total invested: ₹ {vault?.total_invested_amount ?? 0} 
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current value: ₹{vault?.total_current_value ?? 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    Current rate: ₹{vault?.current_gold_rate ?? 0}/g
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Debit Gold
              </CardTitle>
              <CardDescription>Debit gold with optional attachments</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmitDebit} className="grid grid-cols-1 gap-3 items-end">
                <div>
                  <Label htmlFor="goldGrams">Gold Grams</Label>
                  <Input 
                    id="goldGrams" 
                    type="number" 
                    min="0" 
                    step="0.0001" 
                    value={goldGrams} 
                    onChange={(e) => setGoldGrams(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    rows={2} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Reason or description" 
                  />
                </div>
                <div>
                  <Label htmlFor="files">Attachments</Label>
                  <Input 
                    id="files" 
                    type="file" 
                    multiple 
                    onChange={(e) => setFiles(e.target.files)} 
                  />
                </div>
                <div>
                  <Button 
                    type="submit" 
                    disabled={submitting || !goldGrams} 
                    className="w-full"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Debit Gold
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Transactions */}
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Vault Transactions</CardTitle>
              <CardDescription>Buy, Sell & other movements</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : vault?.transactions?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gold Plan ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Gold (g)</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purchase Rate (g)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vault.transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.gold_plan_id ? `#${t.gold_plan_id}` : "—"}</TableCell>
                        <TableCell>{new Date(t.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              t.type === "credit"
                                ? "bg-green-200/70 text-green-800 hover:bg-green-200"
                                : "bg-red-200/70 text-red-800 hover:bg-red-200"
                            }
                          >
                            {t.type === "credit" ? "Credit" : "Debit"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="max-w-[380px] truncate"
                          title={t.description}
                        >
                          {t.description}
                        </TableCell>
                        <TableCell>{t.gold_grams} g</TableCell>
                        <TableCell
                          className={
                            t.type === "credit"
                              ? "text-green-700 font-medium"
                              : "text-red-700 font-medium"
                          }
                        >
                          {t.type === "credit" ? "+" : "-"}₹
                          {Number(t.invested_amount).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>{t.purchase_rate}</TableCell>
                        <TableCell>
                          {t.type === "credit" && t.gold_plan_id ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/admin/users/${userId}/custom-plans/${t.gold_plan_id}/details`
                                )
                              }
                            >
                              View Plan
                            </Button>
                          ) : t.type === "debit" &&
                            (t.attachments || [])?.length ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPreviewImages(t.attachments || []);
                                setPreviewOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" /> Preview
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-sm text-muted-foreground py-8 text-center">
                  No vault transactions yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Attachments
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {previewImages.map((src, idx) => (
              <div
                key={idx}
                className="aspect-square rounded overflow-hidden border"
              >
                <img
                  src={src}
                  alt={`Attachment ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserGoldVault;