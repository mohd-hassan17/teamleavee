"use client";

import ManagerDashboard from "../../components/ManagerDashboard";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ManagerPage() {
  return (
    <ProtectedRoute roles={["manager", "admin"]}>
      <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
        <Navbar />

        <main className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
          <div className="mb-6">
            <p className="text-sm font-medium text-teal-700">Manager</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-950">Review leave requests</h1>
          </div>

          <ManagerDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
}
