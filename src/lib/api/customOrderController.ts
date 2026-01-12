import { API_BASE_URL } from "@/config";
import axios from "axios";

export interface CustomOrderPayload {
  category_id: string | number;
  purity: string;
  metal: string;
  size: string;
  weight: string;
  description: string;
  note?: string;
  design_images?: File[];
}

export interface CustomOrder {
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
  customer?: any;
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

export interface CreateCustomOrderResponse {
  status: boolean;
  message: string;
  data: CustomOrder;
}

export interface GetCustomOrdersResponse {
  status: boolean;
  data: CustomOrder[];
}

// Create custom order
export const createCustomOrder = async (
  token: string,
  payload: CustomOrderPayload
): Promise<CreateCustomOrderResponse> => {
  const formData = new FormData();
  
  formData.append("category_id", String(payload.category_id));
  formData.append("purity", payload.purity);
  formData.append("metal", payload.metal);
  formData.append("size", payload.size);
  formData.append("weight", payload.weight);
  formData.append("description", payload.description);
  
  if (payload.note) {
    formData.append("note", payload.note);
  }
  
  // Append design images
  if (payload.design_images && payload.design_images.length > 0) {
    payload.design_images.forEach((file) => {
      formData.append("design_images[]", file);
    });
  }

  const response = await axios.post(
    `${API_BASE_URL}/user/store/custom-order`,
    formData,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.data;
};

// Get user's custom orders
export const getMyCustomOrders = async (
  token: string
): Promise<GetCustomOrdersResponse> => {
  const response = await axios.get(
    `${API_BASE_URL}/user/mycustom-order`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.data;
};

