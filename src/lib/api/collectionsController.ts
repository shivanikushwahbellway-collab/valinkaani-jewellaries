import { API_BASE_URL } from "@/config";
import axios from "axios";
export const getCollections = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/collections`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const createCollection = async (
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
  const response = await axios.post(`${API_BASE_URL}/admin/collections`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getCollectionById = async (token: string, id: number) => {
  const response = await axios.get(`${API_BASE_URL}/admin/collections/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateCollection = async (
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
    `${API_BASE_URL}/admin/collections/${id}/update`,
    form,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const deleteCollection = async (token: string, id: number) => {
  const response = await axios.delete(
    `${API_BASE_URL}/admin/collections/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
