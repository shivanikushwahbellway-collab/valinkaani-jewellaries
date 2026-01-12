import { API_BASE_URL } from "@/config";
import axios from "axios";

export const getProducts = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const createProduct = async (
  token: string,
  data: Record<string, unknown> | FormData
) => {
  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  let payload: FormData;
  if (isFormData) {
    payload = data as FormData;
  } else {
    payload = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const stringValue =
          key === "purity" ? String(value).toUpperCase() : String(value);
        payload.append(key, stringValue);
      }
    });
  }
  const response = await axios.post(`${API_BASE_URL}/admin/products`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getProductById = async (token: string, id: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateProduct = async (
  token: string,
  id: number | string,
  data: Record<string, unknown> | FormData
) => {
  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  if (isFormData) {
    const payload = data as FormData;
    // Laravel-friendly method override for file uploads
    if (!payload.has("_method")) payload.append("_method", "PUT");
    const response = await axios.post(
      `${API_BASE_URL}/admin/products/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  }
  const jsonPayload: Record<string, unknown> = {
    ...(data as Record<string, unknown>),
    _method: "PUT",
  };
  const response = await axios.post(
    `${API_BASE_URL}/admin/products/${id}`,
    jsonPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const deleteProduct = async (token: string, id: number | string) => {
  const response = await axios.delete(`${API_BASE_URL}/admin/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const bulkUpdateProductPrices = async (
  token: string,
  payload: { products: { id: number | string; price: number }[] }
) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/products/bulk-price-update`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const bulkUpdateProductStatus = async (
  token: string,
  payload:
    | { products: { id: number | string; status: number | boolean }[] }
    | { ids: (number | string)[]; status: number | boolean }
) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/products/bulk-status-update`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
