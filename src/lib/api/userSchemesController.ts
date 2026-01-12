import axios from "axios";
import { API_BASE_URL } from "@/config";

export type UserScheme = {
  id: number;
  name: string; // maps from `scheme`
  timeline: string;
  minAmount: number; // maps from `min_amount`
  maturityAmount?: number; // maps from `maturity_amount`
  status: number; // 0/1
  isPopular: number; // 0/1
  points: string[];
  attachments: string[]; // relative paths
};

function parsePoints(points: unknown): string[] {
  if (Array.isArray(points)) return points.filter((p) => typeof p === "string") as string[];
  if (typeof points === "string") {
    try {
      const parsed = JSON.parse(points);
      return Array.isArray(parsed) ? parsed.filter((p) => typeof p === "string") : [points];
    } catch {
      return [points];
    }
  }
  return [];
}

function normalize(item: any): UserScheme {
  return {
    id: Number(item?.id),
    name: String(item?.scheme ?? item?.name ?? ""),
    timeline: String(item?.timeline ?? ""),
    minAmount: Number(item?.min_amount ?? item?.minAmount ?? 0),
    maturityAmount: item?.maturity_amount || item?.maturityAmount ? Number(item?.maturity_amount ?? item?.maturityAmount) : undefined,
    status: Number(item?.status ?? 0),
    isPopular: Number(item?.is_popular ?? item?.isPopular ?? 0),
    points: parsePoints(item?.points),
    attachments: Array.isArray(item?.attachments) ? (item.attachments as string[]) : [],
  };
}

export async function getUserSchemes(): Promise<{ success: boolean; message: string; data: UserScheme[] }>
{
  const res = await axios.get(`${API_BASE_URL}/admin/scheme`);
  const success = Boolean(res.data?.sucess ?? res.data?.success);
  const message = String(res.data?.massage ?? res.data?.message ?? "");
  const list = Array.isArray(res.data?.data) ? res.data.data.map(normalize) : [];
  return { success, message, data: list };
}

export type EnrollResponse = {
  success: boolean;
  message: string;
  data: {
    user_scheme: any;
    razorpay_order: { success: boolean; order_id: string; amount: number; currency: string; receipt: string };
    razorpay_key: string;
  };
};

export async function enrollInScheme(
  token: string,
  payload: { scheme_id: number; monthly_amount: number }
): Promise<EnrollResponse> {
  const res = await axios.post(`${API_BASE_URL}/schemes/enroll`, payload, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" },
  });
  return res.data as EnrollResponse;
}


// Cashfree-style verify (backend expects order_id and keeps Razorpay-like names)
export async function verifySchemePaymentCashfree(
  token: string,
  payload: { scheme_payment_id: number; order_id: string; razorpay_payment_id?: string }
): Promise<{ success: boolean; message: string }> {
  const res = await axios.post(`${API_BASE_URL}/schemes/payment/verify`, payload, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" },
  });
  return res.data as { success: boolean; message: string };
}



// Create order for next installment payment
export async function createNextInstallmentOrder(
  token: string,
  paymentId: number
): Promise<{ success: boolean; razorpay_order: { success: boolean; order_id: string; amount: number; currency: string; receipt: string }; razorpay_key: string }>
{
  const res = await axios.post(`${API_BASE_URL}/schemes/payment/create/${paymentId}`, undefined, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  return res.data as any;
}


// Fetch logged-in user's plans (tries common endpoints if one fails)
export async function getMyPlans(token: string): Promise<{ success: boolean; data: any[] }>
{
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const res = await axios.get(`${API_BASE_URL}/user/myschemes`, { headers });
    return res.data as { success: boolean; data: any[] };
  } catch {
    const res = await axios.get(`${API_BASE_URL}/schemes`, { headers });
    return res.data as { success: boolean; data: any[] };
  }
}
