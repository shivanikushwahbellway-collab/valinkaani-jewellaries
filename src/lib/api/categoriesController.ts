import { API_BASE_URL } from "@/config";
import axios from "axios";
export const getCategories = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const createCategory = async (
  token: string,
  payload: { name: string; description?: string } | FormData
) => {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  let body: FormData | Record<string, unknown> = payload as any;
  if (!isFormData) {
    const form = new FormData();
    const obj = payload as { name: string; description?: string };
    form.append("name", obj.name);
    if (obj.description) form.append("description", obj.description);
    body = form;
  }
  const response = await axios.post(`${API_BASE_URL}/admin/categories`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getCategoryById = async (token: string, id: number) => {
  const response = await axios.get(`${API_BASE_URL}/admin/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateCategory = async (
  token: string,
  id: number,
  payload: { name?: string; description?: string } | FormData
) => {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  let form: FormData;
  if (isFormData) {
    form = payload as FormData;
  } else {
    form = new FormData();
    const obj = payload as { name?: string; description?: string; status?: string | number };
    if (obj.name !== undefined) form.append("name", String(obj.name));
    if (obj.description !== undefined) form.append("description", String(obj.description));
    if ((obj as any).status !== undefined) form.append("status", String((obj as any).status));
  }
  const response = await axios.post(
    `${API_BASE_URL}/admin/categories/${id}/update`,
    form,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const deleteCategory = async (token: string, id: number) => {
  const response = await axios.delete(
    `${API_BASE_URL}/admin/categories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
