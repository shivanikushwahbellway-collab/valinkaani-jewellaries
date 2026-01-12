import axios from "axios";
import { API_BASE_URL } from "@/config";

export interface GoldTransaction {
  id: number;
  type: string;
  gold_plan_id: number;
  gold_grams: number;
  invested_amount: number;
  current_value: number;
  description: string;
  attachments: any[];
  created_at: string;
}

export interface GoldVaultData {
  total_gold_grams: number;
  total_invested_amount: number;
  current_gold_rate: number;
  total_current_value: number;
  transactions: GoldTransaction[];
}

export interface GoldVaultResponse {
  success: boolean;
  message: string;
  data: GoldVaultData;
}

export interface DebitGoldVaultRequest {
  user_id: number;
  gold_grams: string;
  description?: string;
  attachments?: File[];
}

export const getGoldVault = async (
  adminId: number,
  token: string
): Promise<GoldVaultResponse> => {
  try {
    const res = await axios.get<GoldVaultResponse>(
      `${API_BASE_URL}/admin/gold-wallet/${adminId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching gold vault:", err);
    throw err;
  }
};

export const debitGoldVault = async (
  token: string,
  data: DebitGoldVaultRequest
): Promise<GoldVaultResponse> => {
  try {
    const formData = new FormData();
    formData.append("user_id", data.user_id.toString());
    formData.append("gold_grams", data.gold_grams);
    
    if (data.description) {
      formData.append("description", data.description);
    }
    
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachments[]`, file);
      });
    }
    
    const res = await axios.post<GoldVaultResponse>(
      `${API_BASE_URL}/admin/gold-wallet/debit`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error debiting gold vault:", err);
    throw err;
  }
};