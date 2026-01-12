import axios from "axios";
import { API_BASE_URL } from "@/config";

interface CreateOrderData {
  cart_id: number;
  delivery_address: string;
  order_date: string;
  expected_delivery: string;
  payment: string;
  coupon_id?: number;
  notes?: string;
}

export const createOrder = async (data: CreateOrderData, token: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/order`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrders = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (orderId: number, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (orderId: number, token: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/user/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
