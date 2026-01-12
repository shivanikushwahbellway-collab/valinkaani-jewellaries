import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchAdminEnquiries,
//   fetchCompareGoldRequests,
//   fetchComparePriceRequests,
  AdminEnquiry,
} from "@/lib/api/queryController";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface QueryTableProps {
  data: AdminEnquiry[];
  type: string;
}

const QueryTable = ({ data, type }: QueryTableProps) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>{type === "contact" ? "Contact Queries" : type === "gold" ? "Compare Gold Requests" : "Compare Price Requests"}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[600px]">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-primary/10 sticky top-0">
              <tr>
                <th className="p-3 text-left border-b">ID</th>
                <th className="p-3 text-left border-b">Name</th>
                <th className="p-3 text-left border-b">Email</th>
                <th className="p-3 text-left border-b">Mobile</th>
                <th className="p-3 text-left border-b">Subject</th>
                <th className="p-3 text-left border-b">Message</th>
                <th className="p-3 text-left border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((e) => (
                <tr key={e.id} className="hover:bg-primary/5 transition-colors">
                  <td className="p-3 border-b">{e.id}</td>
                  <td className="p-3 border-b">{e.first_name} {e.last_name}</td>
                  <td className="p-3 border-b">{e.email}</td>
                  <td className="p-3 border-b">{e.mobile}</td>

                  {/* Subject tooltip */}
                  <td className="p-3 border-b max-w-[150px] truncate">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer">{e.subject}</span>
                        </TooltipTrigger>
                        <TooltipContent>{e.subject}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>

                  {/* Message modal */}
                  <td className="p-3 border-b max-w-[200px] truncate">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" size="sm" className="p-0">
                          {e.message.length > 20 ? e.message.slice(0, 20) + "..." : e.message}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Full Message</DialogTitle>
                        </DialogHeader>
                        <div className="whitespace-pre-wrap">{e.message}</div>
                      </DialogContent>
                    </Dialog>
                  </td>

                  <td className="p-3 border-b">{new Date(e.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const AdminQueries = () => {
  const { token } = useAuth();
  const [contactQueries, setContactQueries] = useState<AdminEnquiry[]>([]);
  const [goldRequests, setGoldRequests] = useState<AdminEnquiry[]>([]);
  const [priceRequests, setPriceRequests] = useState<AdminEnquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetchAdminEnquiries(token),
    //   fetchCompareGoldRequests(token),
    //   fetchComparePriceRequests(token),
    ])
      .then(([contacts, ]) => {
        setContactQueries(contacts);
        // setGoldRequests(golds);
        // setPriceRequests(prices);
      })
      .catch((err: any) => setError(err.message || "Failed to fetch requests"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="p-5 space-y-6">
      <div className="">
        {/* <MessageCircle className="w-6 h-6 text-primary" /> */}
        <h1 className="text-3xl  font-bold ">Customer Requests</h1>
        <p className="text-muted-foreground">
            See all queries & requests here..
          </p>
      </div>

      {loading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-destructive">{error}</p>}

      {!loading && !error && (
        <Tabs defaultValue="contact" className="space-y-4">
          <TabsList>
            <TabsTrigger value="contact">Contact Queries</TabsTrigger>
            <TabsTrigger value="gold">Compare Gold Requests</TabsTrigger>
            <TabsTrigger value="price">Compare Price Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="contact">
            <QueryTable data={contactQueries} type="contact" />
          </TabsContent>
          <TabsContent value="gold">
            <QueryTable data={goldRequests} type="gold" />
          </TabsContent>
          <TabsContent value="price">
            <QueryTable data={priceRequests} type="price" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminQueries;
