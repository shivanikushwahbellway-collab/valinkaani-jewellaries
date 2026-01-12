import { API_BASE_URL } from "@/config";

export type NormalizedLogin = {
  token: string;
  user: {
    id?: number;
    name: string;
    email: string;
    role?: string;
  };
  message?: string;
};

export async function adminLogin(
  username: string,
  password: string
): Promise<NormalizedLogin> {
  const payload = username.includes("@")
    ? { email: username, password }
    : { username, password };

  const res = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Login failed";
    try {
      const data = await res.json();
      message = (data as any)?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const json = await res.json();
  const data = (json as any)?.data || {};
  const user = data.user || {};
  const token = data.token as string;
  return {
    token,
    user: {
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
      role: user.role,
    },
    message: (json as any)?.message,
  };
}

// Admin profile
export type AdminProfileData = {
  id: number;
  user_code: string;
  name: string;
  email: string;
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
  mobile: string | null;
  mobile_otp_expires_at: string | null;
  mobile_verified_at: string | null;
};

export type AdminProfileResponse = {
  status: boolean;
  message: string;
  data: AdminProfileData;
};

export async function adminGetProfile(
  token: string
): Promise<AdminProfileData> {
  const res = await fetch(`${API_BASE_URL}/admin/getProfile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = "Failed to fetch profile";
    try {
      const data = (await res.json()) as Partial<AdminProfileResponse>;
      message = data.message || message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  const json = (await res.json()) as AdminProfileResponse;
  return json.data;
}
