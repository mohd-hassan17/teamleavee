"use client";

import EmployeeDashboard from "../../components/EmployeeDashboard";
import ManagerDashboard from "../../components/ManagerDashboard";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
        <Navbar />

        <main className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">Dashboard</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-950">
                Welcome, {user?.name}
              </h1>
            </div>
            <p className="text-sm capitalize text-slate-600">Role: {user?.role}</p>
          </div>

          <div className="mt-6 space-y-8">
            {user?.role === "manager" ? <ManagerDashboard /> : null}
            {user?.role === "employee" || user?.role === "admin" ? <EmployeeDashboard /> : null}
            {user?.role === "admin" ? <ManagerDashboard /> : null}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
