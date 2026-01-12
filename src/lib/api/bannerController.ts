import axios from "axios";
import { API_BASE_URL } from "@/config";

// Types for banner API
export interface BannerPayload {
  image: string | File;
  title: string;
  description: string;
  position: string | number;
  status: boolean | string | number;
}

export interface Banner extends BannerPayload {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export const getBanners = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/banners`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBanner = async (token: string, banner: BannerPayload) => {
  try {
    const formData = new FormData();
    if (banner.image instanceof File) {
      formData.append("image", banner.image);
    } else if (banner.image) {
      // If a URL/string is provided, still send as text field
      formData.append("image", banner.image as string);
    }
    formData.append("title", banner.title ?? "");
    formData.append("description", banner.description ?? "");
    formData.append("position", String(banner.position ?? "top"));
    // Backend expects 1/0 or true/false as string; normalize to 1/0
    const statusValue = ((): string => {
      const s = banner.status;
      if (typeof s === "boolean") return s ? "1" : "0";
      if (typeof s === "number") return s ? "1" : "0";
      if (typeof s === "string") return s === "1" || s.toLowerCase() === "true" ? "1" : "0";
      return "1";
    })();
    formData.append("status", statusValue);

    const response = await axios.post(`${API_BASE_URL}/admin/banners`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBanner = async (
  token: string,
  id: string | number,
  banner: BannerPayload
) => {
  try {
    const formData = new FormData();
    if (banner.image instanceof File) {
      formData.append("image", banner.image);
    }
    formData.append("title", banner.title ?? "");
    formData.append("description", banner.description ?? "");
    formData.append("position", String(banner.position ?? "0"));
    const statusValue = ((): string => {
      const s = banner.status;
      if (typeof s === "boolean") return s ? "1" : "0";
      if (typeof s === "number") return s ? "1" : "0";
      if (typeof s === "string") return s === "1" || s.toLowerCase() === "true" ? "1" : "0";
      return "1";
    })();
    formData.append("status", statusValue);

    const response = await axios.post(
      `${API_BASE_URL}/admin/banners/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBanner = async (token: string, id: string | number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admin/banners/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBannerById = async (token: string, id: string | number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/banners/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching banner by id:", error);
    throw error;
  }
};
