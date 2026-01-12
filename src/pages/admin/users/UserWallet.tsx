import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wallet, Loader2, Image as ImageIcon, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAdminUserWallet, type WalletTransaction, adminDebitWallet } from "@/lib/api/walletController";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const UserWallet = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("0");
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // debit form
  const [amount, setAmount] = useState("");
  const [description, setdescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const loadWallet = async () => {
    if (!token || !userId) return;
    setLoading(true);
    try {
      setUserName(`User #${userId}`);
      const res = await getAdminUserWallet(token, Number(userId));
      if ((res as any).success && res.data) {
        setBalance(res.data.balance);
        setTransactions(res.data.transactions || []);
      } else if ((res as any).status && (res as any).data) {
        setBalance((res as any).data.balance);
        setTransactions((res as any).data.transactions || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  const onSubmitDebit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) return;
    try {
      setSubmitting(true);
      await adminDebitWallet(token, {
        user_id: Number(userId),
        amount: amount,
        description: description || undefined,
        attachments: files ? Array.from(files) : [],
      });
      setAmount("");
      setdescription("");
      setFiles(null);
      await loadWallet();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">{userName || "Loading..."}</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <Tabs defaultValue="wallet" className="space-y-4">
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

      <div className="grid gap-4 md:grid-cols-4 mt-4">
        {/* Left column: Balance and Debit */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Balance
              </CardTitle>
              <CardDescription>Available wallet amount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold">₹{Number(balance || 0).toLocaleString("en-IN")}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debit Wallet</CardTitle>
              <CardDescription>Debit amount with optional attachments</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmitDebit} className="grid grid-cols-1 gap-3 items-end">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={2} value={description} onChange={(e) => setdescription(e.target.value)} placeholder="Reason or description" />
                </div>
                <div>
                  <Label htmlFor="files">Attachments</Label>
                  <Input id="files" type="file" multiple onChange={(e) => setFiles(e.target.files)} />
                </div>
                <div>
                  <Button type="submit" disabled={submitting || !amount} className="w-full">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Debit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Transactions */}
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Credits, debits and adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : transactions.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Scheme ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.user_scheme_id ? `#${t.user_scheme_id}` : "—"}</TableCell>
                        <TableCell>{new Date(t.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={t.type === "credit" ? "bg-green-200/70 text-green-800 hover:bg-green-200" : "bg-red-200/70 text-red-800 hover:bg-red-200"}>
                            {t.type === "credit" ? "Credit" : "Debit"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[380px] truncate" title={t.description}>{t.description}</TableCell>
                        <TableCell className={t.type === "credit" ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                          {t.type === "credit" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          {t.type === "credit" && t.user_scheme_id ? (
                            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/users/${userId}/schemes/${t.user_scheme_id}/details`)}>View Scheme Details</Button>
                          ) : t.type === "debit" && (t.attachments || [])?.length ? (
                            <Button variant="outline" size="sm" onClick={() => { setPreviewImages(t.attachments || []); setPreviewOpen(true); }}>
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
                <div className="text-sm text-muted-foreground py-8 text-center">No transactions yet.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Attachments</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {previewImages.map((src, idx) => (
              <div key={idx} className="aspect-square rounded overflow-hidden border">
                <img src={src} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserWallet;


