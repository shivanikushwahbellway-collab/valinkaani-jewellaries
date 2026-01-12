import axios from "axios";
import { API_BASE_URL } from "@/config";

// ======================
// Contact Form POST
// ======================
export interface ContactData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
}

/**
 * Registers a contact query.
 * Works both in development (live backend if dev server not running)
 * and production.
 */
export const registerContactQuery = async (data: ContactData) => {
  try {
    // Match backend spelling: "enquriy"
    const url = `${API_BASE_URL}/enquiry`;

    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // backend returns { status, message, data }
    if (!res.data.status) {
      throw new Error(res.data.message || "Failed to send enquiry");
    }

    return res.data.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to send enquiry"
    );
  }
};

// ======================
// Admin Enquiries GET
// ======================
export interface AdminEnquiry {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface AdminEnquiryResponse {
  status: boolean;
  message: string;
  data: AdminEnquiry[];
}

/**
 * Fetch all admin enquiries
 */
export const fetchAdminEnquiries = async (token: string): Promise<AdminEnquiry[]> => {
  try {
    const res = await axios.get<AdminEnquiryResponse>(`${API_BASE_URL}/admin/enquiry`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.data.status) {
      throw new Error(res.data.message || "Failed to fetch enquiries");
    }

    return res.data.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch enquiries"
    );
  }
};

/**
 * Fetch compare gold requests
 */
export const fetchCompareGoldRequests = async (token: string): Promise<AdminEnquiry[]> => {
  try {
    const res = await axios.get<AdminEnquiryResponse>(`${API_BASE_URL}/admin/compare-gold`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data || [];
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch gold requests");
  }
};

/**
 * Fetch compare price requests
 */
export const fetchComparePriceRequests = async (token: string): Promise<AdminEnquiry[]> => {
  try {
    const res = await axios.get<AdminEnquiryResponse>(`${API_BASE_URL}/admin/compare-price`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data || [];
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch price requests");
  }
};
