"use client";

import { useEffect, useState } from "react";
import { AuthResponse, AuthUser } from "../lib/api";

type AuthSession = {
  token: string;
  user: AuthUser | null;
};

const emptySession: AuthSession = {
  token: "",
  user: null,
};

export const useAuth = () => {
  const [session, setSession] = useState<AuthSession>(emptySession);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const token = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (token && savedUser) {
        setSession({ token, user: JSON.parse(savedUser) });
      }

      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const saveSession = (auth: AuthResponse) => {
    localStorage.setItem("auth_token", auth.token);
    localStorage.setItem("auth_user", JSON.stringify(auth.user));
    setSession({ token: auth.token, user: auth.user });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setSession(emptySession);
  };

  return {
    ...session,
    isAuthenticated: Boolean(session.token && session.user),
    isReady,
    saveSession,
    logout,
  };
};
