import React, { createContext, useContext, useState } from "react";
import { adminLogin, NormalizedLogin } from "@/lib/api/auth";

type AuthContextValue = {
  isAdmin: boolean;
  token: string | null;
  name: string | null;
  email: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

type AuthState = {
  token: string | null;
  name: string | null;
  email: string | null;
};

const STORAGE_KEY = "va_admin_auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as AuthState;
    } catch {
      // ignore broken localStorage values
    }
    return { token: null, name: null, email: null };
  });

  const login = async (username: string, password: string) => {
    const { token: accessToken, user }: NormalizedLogin = await adminLogin(
      username,
      password
    );
    const nextAuth: AuthState = {
      token: accessToken,
      name: user?.name ?? null,
      email: user?.email ?? null,
    };
    setAuth(nextAuth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
  };

  const logout = () => {
    setAuth({ token: null, name: null, email: null });
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthContextValue = {
    isAdmin: Boolean(auth.token),
    token: auth.token,
    name: auth.name,
    email: auth.email,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
