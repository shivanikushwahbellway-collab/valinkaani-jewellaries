import axios from "axios";
import { API_BASE_URL } from "@/config";

export type WalletTransaction = {
  id: number;
  wallet_id?: number;
  type: "credit" | "debit";
  amount: string;
  description: string;
  created_at: string;
  updated_at?: string;
  user_scheme_id?: number | null;
  scheme_name?: string | null;
  maturity_amount?: number | null;
  attachments?: string[] | null;
};

export type WalletResponse = {
  success: boolean;
  message?: string;
  data?: {
    balance: string;
    transactions: WalletTransaction[];
  };
};

export const getAdminUserWallet = async (
  token: string,
  userId: number
): Promise<WalletResponse> => {
  const res = await axios.get(`${API_BASE_URL}/admin/wallet/${userId}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getUserWallet = async (
  token: string,
  userId: number
): Promise<WalletResponse> => {
  const res = await axios.get(`${API_BASE_URL}/user/wallet/${userId}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const adminDebitWallet = async (
  token: string,
  payload: { user_id: number; amount: number | string; description?: string; attachments?: File[] }
): Promise<WalletResponse> => {
  const form = new FormData();
  form.append("user_id", String(payload.user_id));
  form.append("amount", String(payload.amount));
  if (payload.description) form.append("description", payload.description);
  (payload.attachments || []).forEach((file) => form.append("attachments[]", file));
  const res = await axios.post(`${API_BASE_URL}/admin/wallet/debit`, form, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


