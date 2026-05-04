"use client";

import Card from "../../components/Card";
import DashboardCard from "../../components/DashboardCard";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { token, user } = useAuth();

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

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardCard title="Leave Balance" value="18" detail="Days remaining this year" />
            <DashboardCard title="Pending Requests" value="2" detail="Waiting for manager review" />
            <DashboardCard title="Approved Leaves" value="5" detail="Requests approved this year" />
          </div>

          <Card className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              JWT Token
            </p>
            <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-700">{token}</p>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
