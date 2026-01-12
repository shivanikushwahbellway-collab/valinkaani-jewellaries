import axios from "axios";
import { API_BASE_URL } from "@/config";

export const getCoupons = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/coupons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const createCoupon = async (token: string, data: Record<string, unknown>) => {
    const response = await axios.post(`${API_BASE_URL}/admin/coupons`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const getCouponById = async (token: string, id: number | string) => {
    const response = await axios.get(`${API_BASE_URL}/admin/coupons/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const updateCoupon = async (token: string, id: number | string, data: Record<string, unknown>) => {
    const response = await axios.put(`${API_BASE_URL}/admin/coupons/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const deleteCoupon = async (token: string, id: number | string) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/coupons/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};
