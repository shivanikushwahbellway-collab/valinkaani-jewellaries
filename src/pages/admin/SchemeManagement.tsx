import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAllSchemes, updateScheme } from "@/lib/api/schemeController";

// removed alert dialog since delete is not allowed
type Scheme = {
    id?: number;
    name: string;
    timeline: string;
    minAmount: number;
    // maturityAmount?: number;
    isPopular: boolean;
    status: "Active" | "Inactive";
    points: string[]; // editable bullet points/benefits
    attachments?: File[]; // new files to upload on update
};

type SchemeModalProps = {
    initialData: Scheme;
    onSubmit: (data: Scheme) => void;
};
import { useToast } from "@/hooks/use-toast";

const EditSchemeDialog: React.FC<SchemeModalProps> = ({ initialData, onSubmit }) => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<Scheme>(initialData);
    const [files, setFiles] = useState<File[]>([]);

    const updatePoint = (idx: number, value: string) => {
        const next = [...form.points];
        next[idx] = value;
        setForm({ ...form, points: next });
    };

    const addPoint = () => setForm({ ...form, points: [...form.points, ""] });
    const removePoint = (idx: number) => setForm({ ...form, points: form.points.filter((_, i) => i !== idx) });

    const handleSubmit = () => {
        onSubmit({ ...form, attachments: files });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Plan</DialogTitle>
                    <DialogDescription>Update plan fields and points</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <Label>Timeline</Label>
                        <Input value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} />
                    </div>
                    <div>
                        <Label>Min Amount</Label>
                        <Input type="number" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: Number(e.target.value) })} />
                    </div>
                    {/* <div>
                        <Label>Maturity Amount</Label>
                        <Input type="number" value={form.maturityAmount || ""} onChange={(e) => setForm({ ...form, maturityAmount: e.target.value ? Number(e.target.value) : undefined })} placeholder="Optional" />
                    </div> */}
                    <div>
                        <Label>Status</Label>
                        <Select value={form.status} onValueChange={(v: "Active" | "Inactive") => setForm({ ...form, status: v })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Is Popular</Label>
                        <div className="mt-2">
                            <Select value={String(form.isPopular)} onValueChange={(v) => setForm({ ...form, isPopular: v === "true" })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <Label>Points</Label>
                    <div className="space-y-2 mt-2">
                        {form.points.map((p, idx) => (
                            <div key={idx} className="flex gap-2">
                                <Input value={p} onChange={(e) => updatePoint(idx, e.target.value)} />
                                <Button variant="outline" onClick={() => removePoint(idx)}>Remove</Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addPoint}>Add Point</Button>
                    </div>
                </div>
                <div className="mt-6">
                    <Label>Attachments (PDFs)</Label>
                    <Input type="file" multiple accept="application/pdf" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const SchemeManagement: React.FC = () => {
    const { token } = useAuth();
    const { toast } = useToast();
    const [schemes, setSchemes] = useState<Scheme[]>([]);

    const apiToUi = (item: any): Scheme => ({
        id: item.id,
        name: item.name,
        timeline: item.timeline,
        minAmount: item.minAmount,
        // maturityAmount: item.maturityAmount,
        isPopular: Number(item.isPopular) === 1,
        status: Number(item.status) === 1 ? "Active" : "Inactive",
        points: item.points || [],
    });

    const loadSchemes = async () => {
        if (!token) return;
        try {
            const res = await getAllSchemes(token);
            setSchemes(res.data.map(apiToUi));
        } catch (err: any) {
            toast({ title: "Failed to load plans", description: err?.response?.data?.message || "Please try again later" });
        }
    };

    useEffect(() => {
        loadSchemes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className="p-6">
            {/* Heading and add scheme button */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Manage Plans</h1>
                    <p className="text-muted-foreground">
                        Buying gold made simple
                    </p>
                </div>

            </div>

            {/* Products Table */}
            <Card>

                <CardHeader>
                    <CardTitle>Plans</CardTitle>
                    <CardDescription>Manage your subsciption plans</CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Scheme ID</TableHead>
                                <TableHead>Scheme</TableHead>
                                <TableHead>Timeline</TableHead>
                                <TableHead>Min Amount</TableHead>
                                {/* <TableHead>Maturity Amount</TableHead> */}
                                <TableHead>Is Popular</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Edit</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {schemes.map((scheme) => (
                                <TableRow key={scheme.id}>
                                    <TableCell className="font-medium">{scheme.id}</TableCell>
                                    <TableCell>{scheme.name}</TableCell>
                                    <TableCell>{scheme.timeline}</TableCell>
                                    <TableCell>₹{scheme.minAmount}</TableCell>
                                    {/* <TableCell>{scheme.maturityAmount ? `₹${scheme.maturityAmount}` : "—"}</TableCell> */}
                                    <TableCell>
                                        <Badge variant={scheme.isPopular ? "default" : "secondary"}>
                                            {scheme.isPopular ? "Yes" : "No"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={scheme.status === "Active" ? "default" : "destructive"}>
                                            {scheme.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <EditSchemeDialog
                                            initialData={scheme}
                                            onSubmit={async (updated) => {
                                                if (!token || !scheme.id) return;
                                                try {
                                                    await updateScheme(token, scheme.id, {
                                                        name: updated.name,
                                                        timeline: updated.timeline,
                                                        minAmount: updated.minAmount,
                                                        // maturityAmount: updated.maturityAmount,
                                                        status: updated.status === "Active" ? 1 : 0,
                                                        isPopular: updated.isPopular ? 1 : 0,
                                                        points: updated.points,
                                                        attachments: updated.attachments,
                                                    });
                                                    toast({ title: "Plan updated successfully" });
                                                    await loadSchemes();
                                                } catch (err: any) {
                                                    toast({ title: "Update failed", description: err?.response?.data?.message || "Please try again" });
                                                }
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default SchemeManagement;
