import { API_BASE_URL } from "@/config";
import axios from "axios";

export const getSettings = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/business-settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

// Update General Settings
export const updateGeneralSettings = async (
  token: string,
  generalData: any
) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/business-settings/update`,
    { general: generalData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};

// Update Business Information
export const updateBusinessSettings = async (
  token: string,
  businessData: any
) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/business-settings/update`,
    { business_information: businessData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};

// Update Payment Methods
export const updatePaymentSettings = async (
  token: string,
  paymentData: any
) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/business-settings/update`,
    { payment_methods: paymentData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};

// Update Inventory Management
export const updateInventorySettings = async (
  token: string,
  inventoryData: any
) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/business-settings/update`,
    { inventory_management: inventoryData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};

// Update Security Settings
export const updateSecuritySettings = async (
  token: string,
  securityData: any
) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/business-settings/update`,
    { security_settings: securityData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};

// Update Gold API Settings
export const updateGoldApiSettings = async (
  token: string,
  goldApiData: any
) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/business-settings/update`,
    { gold_api_settings: goldApiData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};
