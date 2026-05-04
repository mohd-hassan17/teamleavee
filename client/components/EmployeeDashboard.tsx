"use client";

import { useCallback, useEffect, useState } from "react";
import { getMyLeaves, LeaveRequest } from "../lib/api";
import DashboardCard from "./DashboardCard";
import LeaveForm from "./LeaveForm";
import LeaveHistory from "./LeaveHistory";

export default function EmployeeDashboard() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadLeaves = useCallback(async () => {
    setIsLoading(true);
    setMessage("");

    try {
      setLeaves(await getMyLeaves());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load leave history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLeaves();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadLeaves]);

  const approvedDays = leaves
    .filter((leave) => leave.status === "approved")
    .reduce((total, leave) => total + (leave.workingDays || 0), 0);
  const pendingCount = leaves.filter((leave) => leave.status === "pending").length;
  const balance = Math.max(0, 24 - approvedDays);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Leave Balance" value={String(balance)} detail="Working days remaining" />
        <DashboardCard title="Pending Requests" value={String(pendingCount)} detail="Waiting for review" />
        <DashboardCard title="Approved Days" value={String(approvedDays)} detail="Used this year" />
      </div>

      {message ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{message}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <LeaveForm onSubmitted={loadLeaves} />
        <LeaveHistory leaves={leaves} isLoading={isLoading} />
      </div>
    </div>
  );
}
