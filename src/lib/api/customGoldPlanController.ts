import axios from "axios";
import { API_BASE_URL } from "@/config";

export type CreateGoldPlanResponse = {
  success: boolean;
  message: string;
  data: {
    invested_amount: number;
    gold_rate: number;
    gold_grams: number;
    plan: number; // newly created plan id
  };
};

export type PreviewGoldPlanResponse = {
  success: boolean;
  message?: string;
  data: {
    invested_amount: number;
    gold_rate: number;
    gold_grams: number;
  };
};

export async function previewGoldPlan(
  token: string,
  investedAmount: number
): Promise<PreviewGoldPlanResponse> {
  const res = await axios.get(
    `${API_BASE_URL}/user/show-gold-Plan`,
    { invested_amount: investedAmount },
    {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      //   "Content-Type": "application/json",
      //   Accept: "application/json",
      // },
    }
  );
  return res.data as PreviewGoldPlanResponse;
}

export async function createGoldPlan(
  token: string,
  investedAmount: number
): Promise<CreateGoldPlanResponse> {
  const res = await axios.post(
    `${API_BASE_URL}/user/gold-plan`,
    { invested_amount: investedAmount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return res.data as CreateGoldPlanResponse;
}

export type InitiatePaymentResponse = {
  success: boolean;
  message?: string;
  // attempt to be flexible with backend key naming
  data?: any;
  payment_session_id?: string;
  paymentSessionId?: string;
  order_token?: string;
  orderToken?: string;
  order_id?: string;
  payment?: {
    code?: string;
    message?: string;
    type?: string;
  };
  payment_id?: number;
};

export async function initiateGoldPlanPayment(
  planId: number,
  token: string
): Promise<InitiatePaymentResponse> {
  const res = await axios.post(
    `${API_BASE_URL}/user/gold-plan/${planId}/payment`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return res.data as InitiatePaymentResponse;
}

export function extractCashfreeSessionId(data: any): string | null {
  if (!data) return null;
  // known key variations from Cashfree
  const possibleKeys = [
    "payment_session_id",
    "paymentSessionId",
    "order_token",
    "orderToken",
    "cf_payment_session_id",
    // sometimes SDK examples use token inside nested payment/order objects
    "token",
  ];
  for (const key of possibleKeys) {
    if (typeof data[key] === "string" && data[key]) return data[key] as string;
  }
  // sometimes backend nests under data
  if (data.data) return extractCashfreeSessionId(data.data);
  if (data.payment) return extractCashfreeSessionId(data.payment);
  if (data.order) return extractCashfreeSessionId(data.order);
  return null;
}

export type VerifyPaymentResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

export async function verifyGoldPlanPayment(
  token: string,
  orderId: string
): Promise<VerifyPaymentResponse> {
  const res = await axios.post(
    `${API_BASE_URL}/user/gold-plan/payment/verify`,
    { order_id: orderId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return res.data as VerifyPaymentResponse;
}


