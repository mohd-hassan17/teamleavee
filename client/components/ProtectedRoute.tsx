"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady) {
    return <main className="p-5 text-sm text-slate-600">Loading...</main>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
