import axios from "axios";
import { API_BASE_URL } from "@/config";

export type AdminUser = {
  id: number;
  user_code: string | null;
  name: string;
  email: string;
  mobile: string | null;
  last_login_at: string | null;
  current_token_expires_at: string | null;
  email_verified_at: string | null;
  two_factor_verified: number;
  created_at: string;
  updated_at: string;
  role: string;
  fcm_token: string | null;
  status: number;
  two_factor_code: string | null;
  two_factor_expires_at: string | null;
  mobile_otp_expires_at: string | null;
  mobile_verified_at: string | null;
  google_id: string | null;
  orders?: Order[];
  custom_orders?: CustomOrder[];
  schemes?: UserScheme[];
  custom_plan?: CustomPlan[];
};

export type Order = {
  id: number;
  order_code: string;
  customer_id: number;
  total_amount: string;
  coupon_id: number | null;
  discount_amount: string;
  final_amount: string;
  status: string;
  delivery_address: string;
  order_date: string;
  expected_delivery: string;
  payment_method: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomOrder = {
  id: number;
  user_id: number;
  category_id: number;
  purity: string;
  metal: string;
  size: string;
  design_image: string;
  weight: string;
  price: string | null;
  description: string;
  note: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type UserScheme = {
  id: number;
  user_id: number;
  scheme_id: number;
  monthly_amount: string;
  start_date: string;
  end_date: string;
  total_paid: string;
  status: string;
  meta: any | null;
  created_at: string;
  updated_at: string;
};

export type SchemePayment = {
  id: number;
  user_scheme_id: number;
  installment_number: number;
  due_date: string;
  amount: string;
  status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  created_at: string;
  updated_at: string;
  laravel_through_key: number;
};

export type CustomPlan = {
  id: number;
  user_id: number;
  invested_amount: string;
  gold_grams: string;
  gold_rate: string;
  created_at: string;
  updated_at: string;
};

export type GoldPlanPayment = {
  id: number;
  user_id: number;
  gold_plan_id: number;
  payment_id: string;
  order_id: string;
  amount: string;
  status: string;
  start_date: string;
  created_at: string;
  updated_at: string;
};

export type GetUserListResponse = {
  status: boolean;
  message: string;
  data: AdminUser[];
};

export type GetUserWithOrdersResponse = {
  status: boolean;
  message: string;
  data: AdminUser;
};

export type GetUserWithCustomOrdersResponse = {
  status: boolean;
  message: string;
  data: AdminUser;
};

export type GetUserWithSchemesResponse = {
  status: boolean;
  messages: string;
  data: AdminUser;
};

export type GetUserSchemesPaymentsResponse = {
  status: boolean;
  message: string;
  data: {
    user: AdminUser;
    scheme_id: string;
    payments: SchemePayment[];
  };
};

export type GetUserCustomPlansResponse = {
  status: boolean;
  message: string;
  data: AdminUser;
};

export type GetUserGoldPlanPaymentsResponse = {
  status: boolean;
  message: string;
  data: {
    user: AdminUser;
    gold_plan_id: string;
    payments: GoldPlanPayment[];
  };
};

// Get all users
export const getUserList = async (token: string): Promise<GetUserListResponse> => {
  const response = await axios.get(`${API_BASE_URL}/admin/user-list`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get user with orders
export const getUserWithOrders = async (
  token: string,
  userId: number
): Promise<GetUserWithOrdersResponse> => {
  const response = await axios.get(`${API_BASE_URL}/admin/user-with-orders/${userId}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get user with custom orders
export const getUserWithCustomOrders = async (
  token: string,
  userId: number
): Promise<GetUserWithCustomOrdersResponse> => {
  const response = await axios.get(`${API_BASE_URL}/admin/user-with-customorders/${userId}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get user with schemes
export const getUserWithSchemes = async (
  token: string,
  userId: number
): Promise<GetUserWithSchemesResponse> => {
  const response = await axios.get(`${API_BASE_URL}/admin/user-with-schemes/${userId}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get user schemes payments
export const getUserSchemesPayments = async (
  token: string,
  userId: number,
  schemeId: number
): Promise<GetUserSchemesPaymentsResponse> => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/user-with-schemes-payments/${userId}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        scheme_id: schemeId,
      },
    }
  );
  return response.data;
};

// Get user custom plans
export const getUserCustomPlans = async (
  token: string,
  userId: number
): Promise<GetUserCustomPlansResponse> => {
  const response = await axios.get(`${API_BASE_URL}/admin/user-custom-plans/${userId}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get user gold plan payments
export const getUserGoldPlanPayments = async (
  token: string,
  userId: number,
  goldPlanId: number
): Promise<GetUserGoldPlanPaymentsResponse> => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/user-with-gold-payemnts/${userId}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        gold_plan_id: goldPlanId,
      },
    }
  );
  return response.data;
};

export type UpdateUserStatusPayload = {
  status: number; // 1 for active, 0 for inactive
};

export type UpdateUserStatusResponse = {
  status: boolean;
  message: string;
  data: {
    user_id: number;
    current_status: number;
  };
};

// Update user status (block/unblock)
export const updateUserStatus = async (
  token: string,
  userId: number,
  payload: UpdateUserStatusPayload
): Promise<UpdateUserStatusResponse> => {
  const response = await axios.put(
    `${API_BASE_URL}/admin/update-user-status/${userId}`,
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

