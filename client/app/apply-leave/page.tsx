"use client";

import LeaveForm from "../../components/LeaveForm";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ApplyLeavePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
        <Navbar />

        <main className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
          <div className="mb-6">
            <p className="text-sm font-medium text-teal-700">Leave</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-950">Apply for leave</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Submit the dates and reason for your leave request.
            </p>
          </div>

          <LeaveForm />
        </main>
      </div>
    </ProtectedRoute>
  );
}
