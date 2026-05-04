"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { AuthUser } from "../lib/api";

type ProtectedRouteProps = {
  children: ReactNode;
  roles?: AuthUser["role"][];
};

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isReady, user } = useAuth();
  const isAllowed = !roles || (user ? roles.includes(user.role) : false);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isReady, router]);

  useEffect(() => {
    if (isReady && isAuthenticated && !isAllowed) {
      router.replace("/dashboard");
    }
  }, [isAllowed, isAuthenticated, isReady, router]);

  if (!isReady) {
    return <main className="p-5 text-sm text-slate-600">Loading...</main>;
  }

  if (!isAuthenticated || !isAllowed) {
    return null;
  }

  return children;
}
