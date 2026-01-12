import { API_BASE_URL } from "@/config";
import axios from "axios";

export const getOrders = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/order/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const getOrderById = async (token: string, id: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/order/view?order_id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const updateOrderStatus = async (token: string, id: string, status: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/order/status-change`,
    {
      order_id: id,
      status: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
