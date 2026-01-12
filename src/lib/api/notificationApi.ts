import axios from "axios";
import { API_BASE_URL } from "@/config";

export const saveDeviceToken = async (fcmToken: string, userToken: string) => {
  return axios.post(
    `${API_BASE_URL}/device-token`,
    { token: fcmToken, platform: "web" },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
};

// Fetch all notifications
export const getNotifications = async (userToken: string) => {
  return axios.get(`${API_BASE_URL}/admin/custom-notifications`, {
    headers: { 
      Accept: "application/json",
      Authorization: `Bearer ${userToken}` 
    },
  });
};

// Create/send a new notification
export const sendNotification = async (data: FormData, userToken: string) => {
  return axios.post(`${API_BASE_URL}/admin/custom-notifications`, data, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete a notification
export const deleteNotification = async (notificationId: number, userToken: string) => {
  return axios.delete(`${API_BASE_URL}/admin/custom-notifications/${notificationId}`, {
    headers: { 
      Accept: "application/json",
      Authorization: `Bearer ${userToken}` 
    },
  });
};