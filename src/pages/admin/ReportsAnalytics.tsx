import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCustomerReport, getSalesReport, getSchemeReport, getGoldPlanReport } from "@/lib/api/reportController";
import { useAuth } from "@/context/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
export default function ReportsAnalytics() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [filters, setFilters] = useState({ name: "", email: "", mobile: "", user_code: "" });
  const [salesLoading, setSalesLoading] = useState(false);
  const [sales, setSales] = useState<any>(null);
  const [salesFilters, setSalesFilters] = useState({
    start_date: "",
    end_date: "",
  });
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [schemeData, setSchemeData] = useState<any>(null);
  const [schemeFilters, setSchemeFilters] = useState({
    start_date: "",
    end_date: "",
    search: "",
    status: [] as string[],
  });

  const [goldLoading, setGoldLoading] = useState(false);
  const [goldData, setGoldData] = useState<any>(null);
  const [goldFilters, setGoldFilters] = useState({
    start_date: "",
    end_date: "",
    name: "",
  });
  // Debounced gold search
  const debouncedGoldSearch = useCallback(
    debounce((text: string) => {
      fetchGoldPlanReport({ ...goldFilters, name: text });
    }, 500),
    [goldFilters, token]
  );

  const handleGoldChange = (e: any) => {
    setGoldFilters({ ...goldFilters, [e.target.name]: e.target.value });
  };


  const fetchGoldPlanReport = async (newFilters?: typeof goldFilters) => {
    if (!token) return;

    const applied = newFilters || goldFilters;

    setGoldLoading(true);
    try {
      const res = await getGoldPlanReport(token, applied);
      setGoldData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setGoldLoading(false);
    }
  };



  const handleSchemeFilterChange = (e: any) => {
    const updated = { ...schemeFilters, [e.target.name]: e.target.value };
    setSchemeFilters(updated);
  };


  const handleSchemeStatusToggle = (value: string) => {
    const exists = schemeFilters.status.includes(value);
    const updated = exists
      ? schemeFilters.status.filter((s) => s !== value)
      : [...schemeFilters.status, value];


    setSchemeFilters({ ...schemeFilters, status: updated });
  };


  const fetchSchemeReport = async (filters?: typeof schemeFilters) => {
    if (!token) return;
    setSchemeLoading(true);
    try {
      const res = await getSchemeReport(token, filters || schemeFilters);
      setSchemeData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSchemeLoading(false);
    }
  };
  const fetchData = async (updatedFilters?: typeof filters) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getCustomerReport(token, updatedFilters || filters);
      setCustomers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch to avoid too many API calls
  const debouncedFetch = useCallback(debounce(fetchData, 500), [token, filters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    debouncedFetch(newFilters);
  };


  const fetchSalesReport = async (newFilters?: typeof salesFilters) => {
    if (!token) return;

    const applied = newFilters || salesFilters;

    try {
      const res = await getSalesReport(token, applied);
      setSales(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleSalesChange = (e: any) => {
    setSalesFilters({
      ...salesFilters,
      [e.target.name]: e.target.value,
    });
  };



  useEffect(() => {
    fetchData();
    fetchSalesReport();
    fetchSchemeReport();
    fetchGoldPlanReport();
  }, [token]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="customer" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customer">Customer Report</TabsTrigger>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="schemes">Schemes Report</TabsTrigger>
          <TabsTrigger value="goldplans">Gold Plans Report</TabsTrigger>
        </TabsList>

        {/* Customer Report */}
        <TabsContent value="customer">
          {/* Inline Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input placeholder="Name" name="name" value={filters.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input placeholder="Email" name="email" value={filters.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile</label>
              <Input placeholder="Mobile" name="mobile" value={filters.mobile} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">User Code</label>
              <Input placeholder="User Code" name="user_code" value={filters.user_code} onChange={handleChange} />
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : !customers.length ? (
            <div className="p-6 text-center">No report found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>User Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Completed Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Schemes</TableHead>
                    <TableHead>Gold Invested</TableHead>
                    <TableHead>Total Gold</TableHead>
                    <TableHead>Custom Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.user_id} className="hover:bg-gray-50">
                      <TableCell>{c.user_code || "-"}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.mobile || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={c.status === "Active" ? "default" : "destructive"}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{c.order_summary.total_orders}</TableCell>
                      <TableCell>{c.order_summary.completed_orders}</TableCell>
                      <TableCell>₹{c.order_summary.total_spent}</TableCell>
                      <TableCell>₹{c.wallet.balance}</TableCell>
                      <TableCell>{c.schemes.total_schemes} / ₹{c.schemes.total_paid}</TableCell>
                      <TableCell>₹{c.gold_plans.total_invested}</TableCell>
                      <TableCell>{c.gold_plans.total_gold_grams} g</TableCell>
                      <TableCell>{c.custom_orders.total_custom_orders}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sales">
          {/* Filters (same layout as customer report) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                name="start_date"
                value={salesFilters.start_date}
                onChange={handleSalesChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                name="end_date"
                value={salesFilters.end_date}
                onChange={handleSalesChange}
              />
            </div>

            <div className="flex items-end justify-end gap-2">
              <Button
                className="h-9 "
                onClick={() => fetchSalesReport()}
              >
                Apply
              </Button>
              {/* RESET BUTTON — SAME STYLE AS CUSTOMER UI */}

              <Button
                variant="outline"
                className="h-9 "
                onClick={() => {
                  const reset = { start_date: "", end_date: "" };
                  setSalesFilters(reset);
                  fetchSalesReport(reset);
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : !sales ? (
            <div className="p-6 text-center">No report found</div>
          ) : (
            <>
              {/* Orders Table (same style as customer report) */}
              <div className="overflow-x-auto mb-8">
                <h2 className="font-semibold text-lg mb-3">Completed Orders</h2>

                <Table className="min-w-[1000px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Code</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {!sales.orders_summary.orders.length ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No completed orders
                        </TableCell>
                      </TableRow>
                    ) : (
                      sales.orders_summary.orders.map((o: any) => (
                        <TableRow key={o.order_code} className="hover:bg-gray-50">
                          <TableCell>{o.order_code}</TableCell>
                          <TableCell>{o.customer_name}</TableCell>
                          <TableCell>₹{o.final_amount}</TableCell>
                          <TableCell>{o.payment_method}</TableCell>
                          <TableCell>{o.order_date}</TableCell>
                          <TableCell>{o.expected_delivery}</TableCell>
                          <TableCell>
                            <Badge variant="default">{o.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Custom Orders Table (same styling) */}
              <div className="overflow-x-auto">
                <h2 className="font-semibold text-lg mb-3">Completed Custom Orders</h2>

                <Table className="min-w-[1000px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Metal</TableHead>
                      <TableHead>Purity</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {!sales.custom_orders_summary.custom_orders.length ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No custom orders
                        </TableCell>
                      </TableRow>
                    ) : (
                      sales.custom_orders_summary.custom_orders.map((c: any) => (
                        <TableRow key={c.id} className="hover:bg-gray-50">
                          <TableCell>{c.id}</TableCell>
                          <TableCell>{c.user_name}</TableCell>
                          <TableCell>{c.metal}</TableCell>
                          <TableCell>{c.purity}</TableCell>
                          <TableCell>{c.weight} g</TableCell>
                          <TableCell>{c.description}</TableCell>
                          <TableCell>
                            <Badge variant="default">{c.status}</Badge>
                          </TableCell>
                          <TableCell>{c.created_at}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </TabsContent>



        <TabsContent value="schemes">

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                name="start_date"
                value={schemeFilters.start_date}
                onChange={(e) => handleSchemeFilterChange(e)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                name="end_date"
                value={schemeFilters.end_date}
                onChange={(e) => handleSchemeFilterChange(e)}
              />
            </div>
            <div className="flex gap-2 items-end  ">
              {["active", "disbursed"].map((st) => {
                const active = schemeFilters.status.includes(st);
                return (
                  <div
                    key={st}
                    onClick={() => handleSchemeStatusToggle(st)}
                    className={`px-3 py-1 rounded-full cursor-pointer text-sm border flex items-center gap-1
          ${active ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300"}`}
                  >
                    {st}
                    {active && <span className="text-xs">×</span>}
                  </div>
                );
              })}
            </div>
            <div className="flex items-end justify-end gap-2">
              <Button
                className="h-9"
                onClick={() => fetchSchemeReport()}
              >
                Apply
              </Button>

              <Button
                variant="outline"
                className="h-9"
                onClick={() => {
                  const reset = { start_date: "", end_date: "", search: "", status: [] };
                  setSchemeFilters(reset);
                  fetchSchemeReport(reset);
                }}
              >
                Reset
              </Button>
            </div>

          </div>

          {/* Loading */}
          {schemeLoading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : !schemeData ? (
            <div className="p-6 text-center">No scheme report found</div>
          ) : (
            <>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg border bg-white">
                  <h3 className="text-sm text-muted-foreground">Total Schemes</h3>
                  <p className="text-2xl font-bold">{schemeData.summary.total_schemes}</p>
                </div>

                <div className="p-4 rounded-lg border bg-white">
                  <h3 className="text-sm text-muted-foreground">Active Schemes</h3>
                  <p className="text-2xl font-bold">{schemeData.summary.active_schemes}</p>
                </div>

                <div className="p-4 rounded-lg border bg-white">
                  <h3 className="text-sm text-muted-foreground">Disbursed</h3>
                  <p className="text-2xl font-bold">{schemeData.summary.disbursed_schemes}</p>
                </div>

                <div className="p-4 rounded-lg border bg-white">
                  <h3 className="text-sm text-muted-foreground">Amount Collected</h3>
                  <p className="text-2xl font-bold">₹{schemeData.summary.total_amount_collected}</p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Scheme</TableHead>
                      <TableHead>Monthly</TableHead>
                      <TableHead>Total Paid</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {schemeData.list.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          No schemes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      schemeData.list.map((s: any) => (
                        <TableRow key={s.id} className="hover:bg-gray-50">
                          <TableCell>{s.id}</TableCell>
                          <TableCell>{s.user_name}</TableCell>
                          <TableCell>{s.scheme_name}</TableCell>
                          <TableCell>₹{s.monthly_amount}</TableCell>
                          <TableCell>₹{s.total_paid}</TableCell>
                          <TableCell>{s.start_date}</TableCell>
                          <TableCell>{s.end_date}</TableCell>
                          <TableCell>
                            <Badge>{s.status}</Badge>
                          </TableCell>
                          <TableCell>{s.created_at}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>

                </Table>
              </div>
            </>
          )}

        </TabsContent>

        <TabsContent value="goldplans">

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                name="start_date"
                value={goldFilters.start_date}
                onChange={(e) => handleGoldChange(e)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                name="end_date"
                value={goldFilters.end_date}
                onChange={(e) => handleGoldChange(e)}
              />
            </div>
            {/* Search by name (with debounce) */}
            <div>
              <label className="block text-sm font-medium mb-1">Search by Name</label>
              <Input
                placeholder="Enter name..."
                name="name"
                value={goldFilters.name}
                onChange={(e) => {
                  handleGoldChange(e);
                  debouncedGoldSearch(e.target.value);
                }}
              />
            </div>
            <div className="flex items-end justify-end gap-2">
              <Button className="h-9" onClick={() => fetchGoldPlanReport()}>
                Apply
              </Button>

              <Button
                variant="outline"
                className="h-9"
                onClick={() => {
                  const reset = { start_date: "", end_date: "", name: "" };
                  setGoldFilters(reset);
                  fetchGoldPlanReport(reset);
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          {goldLoading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : !goldData ? (
            <div className="p-6 text-center">No gold plan data found</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-sm text-muted-foreground">Total Gold Plans</p>
                  <p className="text-2xl font-bold">
                    {goldData?.total_gold_plans ?? 0}
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-sm text-muted-foreground">Total Investment</p>
                  <p className="text-2xl font-bold">
                    ₹{goldData?.total_investment ?? 0}
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-sm text-muted-foreground">Total Gold Grams</p>
                  <p className="text-2xl font-bold">
                    {goldData?.total_gold_grams ?? 0}
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-sm text-muted-foreground">Average Gold Rate</p>
                  <p className="text-2xl font-bold">
                    ₹{goldData?.average_gold_rate ?? 0}
                  </p>
                </div>
              </div>


              {/* Table */}
              <div className="overflow-x-auto">
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Invested</TableHead>
                      <TableHead>Gold Grams</TableHead>
                      <TableHead>Gold Rate</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {goldData.plans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No gold plans found
                        </TableCell>
                      </TableRow>
                    ) : (
                      goldData.plans.map((p: any) => (
                        <TableRow key={p.id} className="hover:bg-gray-50">
                          <TableCell>{p.id}</TableCell>
                          <TableCell>{p.user_name}</TableCell>
                          <TableCell>₹{p.invested_amount}</TableCell>
                          <TableCell>{p.gold_grams} g</TableCell>
                          <TableCell>₹{p.gold_rate}</TableCell>
                          <TableCell>{p.created_at}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>

                </Table>
              </div>
            </>
          )}

        </TabsContent>

      </Tabs>
    </div>
  );
}
