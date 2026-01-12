import React, { createContext, useContext, useMemo, useState } from "react";

type UserAuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
};

type UserAuthState = {
  token: string | null;
};

const STORAGE_KEY = "va_user_token";

const UserAuthContext = createContext<UserAuthContextValue | undefined>(
  undefined
);

export const UserAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<UserAuthState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return { token: saved ?? null };
    } catch {
      return { token: null };
    }
  });

  const setToken = (token: string | null) => {
    setState({ token });
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const logout = () => setToken(null);

  const value = useMemo<UserAuthContextValue>(
    () => ({ isAuthenticated: Boolean(state.token), token: state.token, setToken, logout }),
    [state.token]
  );

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used within a UserAuthProvider");
  return ctx;
};



