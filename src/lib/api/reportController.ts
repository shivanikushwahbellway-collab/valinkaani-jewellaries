import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "@/config";

// --------------------------------------
// 📌 FULL TYPE STRUCTURE (Inside Controller)
// --------------------------------------

export interface RecentOrder {
  order_code: string;
  final_amount: string;
  status: string;
  order_date: string;
  payment_method: string;
}

export interface OrderSummary {
  total_orders: number;
  completed_orders: number;
  total_spent: number;
  recent_orders: RecentOrder[];
}

export interface Wallet {
  balance: number | string;
}

export interface SchemeDetails {
  scheme_id: number;
  monthly_amount: string;
  total_paid: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface Schemes {
  total_schemes: number;
  total_paid: number;
  details: SchemeDetails[];
}

export interface GoldPlanDetail {
  invested_amount: string;
  gold_grams: string;
  gold_rate: string;
  created_at: string;
}

export interface GoldPlans {
  total_invested: number;
  total_gold_grams: number;
  details: GoldPlanDetail[];
}

export interface GoldWallet {
  total_gold_grams: number | string;
  total_invested_amount: number | string;
  current_gold_rate: number | string;
}

export interface CustomOrder {
  category_id: number;
  metal: string;
  purity: string;
  weight: string;
  status: string;
  description: string;
  note: string;
  created_at: string;
}

export interface CustomOrders {
  total_custom_orders: number;
  details: CustomOrder[];
}

export interface CustomerReport {
  user_id: number;
  user_code: string | null;
  name: string;
  email: string;
  mobile: string | null;
  status: string;
  last_login_at: string | null;
  created_at: string;

  order_summary: OrderSummary;
  wallet: Wallet;
  schemes: Schemes;
  gold_plans: GoldPlans;
  gold_wallet: GoldWallet;
  custom_orders: CustomOrders;
}

export interface CustomerReportResponse {
  success: boolean;
  message: string;
  data: CustomerReport[];
}

// --------------------------------------
// 📌 API FUNCTION (Direct Base URL)
// --------------------------------------

export const getCustomerReport = async (
    token: string,
    filters?: { name?: string; email?: string; mobile?: string; user_code?: string }
  ): Promise<AxiosResponse<CustomerReportResponse>> => {
    const query = filters
      ? Object.entries(filters)
          .filter(([_, value]) => value && value.trim() !== "")
          .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
          .join("&")
      : "";
  
    const url = `${API_BASE_URL}/admin/reports/customer${query ? `?${query}` : ""}`;
  
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  

  // ===============================
// 📌 TYPES
// ===============================

// ---- Orders ----
export interface SalesOrder {
  order_code: string;
  customer_name: string;
  final_amount: string;
  payment_method: string;
  order_date: string;
  expected_delivery: string;
  status: string;
}

export interface OrdersSummary {
  total_completed_orders: number;
  total_revenue: number;
  orders: SalesOrder[];
}

// ---- Custom Orders ----
export interface SalesCustomOrder {
  id: number;
  user_name: string;
  metal: string;
  purity: string;
  weight: string;
  description: string;
  note: string;
  status: string;
  created_at: string;
}

export interface CustomOrdersSummary {
  total_completed_custom_orders: number;
  total_weight: number;
  custom_orders: SalesCustomOrder[];
}

// ---- Main Sales Report ----
export interface SalesReport {
  orders_summary: OrdersSummary;
  custom_orders_summary: CustomOrdersSummary;
}

export interface SalesReportResponse {
  success: boolean;
  message: string;
  data: SalesReport;
}

// ===============================
// 📌 API FUNCTION
// ===============================

export const getSalesReport = async (
  token: string,
  filters?: { start_date?: string; end_date?: string }
): Promise<AxiosResponse<SalesReportResponse>> => {
  
  const query = filters
    ? Object.entries(filters)
        .filter(([_, v]) => v && v.trim() !== "")
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&")
    : "";

  const url = `${API_BASE_URL}/admin/reports/sales${query ? `?${query}` : ""}`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ====================================================================
// 📌 SCHEME REPORT TYPES (NEW)
// ====================================================================

export interface SchemeSummary {
  total_schemes: number;
  active_schemes: number;
  disbursed_schemes: number;
  total_amount_collected: number;
}

export interface SchemeItem {
  id: number;
  user_name: string;
  scheme_name: string;
  monthly_amount: string;
  start_date: string;
  end_date: string;
  total_paid: string;
  status: "active" | "disbursed";
  created_at: string;
}

export interface SchemeReportData {
  summary: SchemeSummary;
  list: SchemeItem[];
}

export interface SchemeReportResponse {
  success: boolean;
  message: string;
  data: SchemeReportData;
}

// ====================================================================
// 📌 SCHEME REPORT API (NEW)
// ====================================================================

export const getSchemeReport = async (
  token: string,
  filters?: {
    start_date?: string;
    end_date?: string;
    status?: string[]; // supports multiple
    search?: string;
  }
): Promise<AxiosResponse<SchemeReportResponse>> => {
  const params = new URLSearchParams();

  if (filters?.start_date) params.append("start_date", filters.start_date);
  if (filters?.end_date) params.append("end_date", filters.end_date);
  if (filters?.search) params.append("search", filters.search);

  filters?.status?.forEach((s) => params.append("status", s));

  const url = `${API_BASE_URL}/admin/reports/schemes?${params.toString()}`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ====================================================================
// 📌 GOLD PLAN REPORT TYPES
// ====================================================================

export interface GoldPlanItem {
  id: number;
  user_name: string;
  invested_amount: string;
  gold_grams: string;
  gold_rate: string;
  created_at: string;
}

export interface GoldPlanSummary {
  total_gold_plans: number;
  total_investment: number;
  total_gold_grams: number;
  average_gold_rate: number;
}

export interface GoldPlanReportData {
  summary: GoldPlanSummary;
  plans: GoldPlanItem[];
}

export interface GoldPlanReportResponse {
  success: boolean;
  message: string;
  data: GoldPlanReportData;
}


export const getGoldPlanReport = async (
  token: string,
  filters?: {
    start_date?: string;
    end_date?: string;
    name?: string; // search by username
  }
): Promise<AxiosResponse<GoldPlanReportResponse>> => {
  const params = new URLSearchParams();

  if (filters?.start_date) params.append("start_date", filters.start_date);
  if (filters?.end_date) params.append("end_date", filters.end_date);
  if (filters?.name) params.append("name", filters.name);

  const url = `${API_BASE_URL}/admin/reports/goldschems?${params.toString()}`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
