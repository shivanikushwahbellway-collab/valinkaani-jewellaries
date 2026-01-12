import { API_BASE_URL } from "@/config";
import axios from "axios";

export interface AdminCustomOrder {
  id: number;
  user_id: number;
  category_id: number;
  purity: string;
  metal: string;
  size: string;
  design_image: string;
  weight: string;
  price: number | null;
  description: string;
  note: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer?: {
    id: number;
    user_code: string;
    name: string;
    email: string;
    mobile: string;
    [key: string]: any;
  };
  category?: {
    id: number;
    name: string;
    image: string;
    description: string | null;
    status: number;
    created_at: string;
    updated_at: string;
  };
}

export interface GetAllCustomOrdersParams {
  status?: string[];
  customer_name?: string;
  start_date?: string;
  end_date?: string;
}

export interface GetAllCustomOrdersResponse {
  status: boolean;
  data: AdminCustomOrder[];
}

export interface GetCustomOrderByIdResponse {
  status: boolean;
  data: AdminCustomOrder;
}

export interface UpdateCustomOrderStatusPayload {
  status: string;
  admin_note?: string;
}

export interface UpdateCustomOrderStatusResponse {
  status: boolean;
  message: string;
  data: AdminCustomOrder;
}

// Get all custom orders with filters
export const getAllCustomOrders = async (
  token: string,
  params?: GetAllCustomOrdersParams
): Promise<GetAllCustomOrdersResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.status && Array.isArray(params.status)) {
    params.status.forEach((status) => {
      queryParams.append("status", status);
    });
  }
  
  if (params?.customer_name) {
    queryParams.append("customer_name", params.customer_name);
  }
  
  if (params?.start_date) {
    queryParams.append("start_date", params.start_date);
  }
  
  if (params?.end_date) {
    queryParams.append("end_date", params.end_date);
  }

  const url = `${API_BASE_URL}/admin/AllCustomeorder${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  
  const response = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

// Get custom order by ID
export const getCustomOrderById = async (
  token: string,
  orderId: number
): Promise<GetCustomOrderByIdResponse> => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/getCustomOrder/${orderId}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.data;
};

// Update custom order status
export const updateCustomOrderStatus = async (
  token: string,
  orderId: number,
  payload: UpdateCustomOrderStatusPayload
): Promise<UpdateCustomOrderStatusResponse> => {
  const response = await axios.put(
    `${API_BASE_URL}/admin/updatecustomorder/${orderId}`,
    payload,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.data;
};

