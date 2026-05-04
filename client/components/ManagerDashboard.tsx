"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveLeave,
  getManagerInsight,
  getPendingLeaves,
  LeaveRequest,
  ManagerInsight,
  rejectLeave,
} from "../lib/api";
import Button from "./Button";
import Card from "./Card";
import DashboardCard from "./DashboardCard";
import LeaveRequestTable from "./LeaveRequestTable";

export default function ManagerDashboard() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [insights, setInsights] = useState<Record<string, ManagerInsight>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [insightLoadingId, setInsightLoadingId] = useState("");

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setMessage("");

    try {
      setRequests(await getPendingLeaves());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load pending requests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRequests();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadRequests]);

  const decide = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    setMessage("");

    try {
      if (action === "approve") {
        await approveLeave(id);
      } else {
        await rejectLeave(id);
      }

      await loadRequests();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update request");
    } finally {
      setBusyId("");
    }
  };

  const loadInsight = async (leave: LeaveRequest) => {
    setInsightLoadingId(leave._id);
    setMessage("");

    try {
      const insight = await getManagerInsight(leave, {
        pendingCount: requests.length,
        requests,
      });
      setInsights((current) => ({ ...current, [leave._id]: insight }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load AI insight");
    } finally {
      setInsightLoadingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard title="Pending Requests" value={String(requests.length)} detail="Awaiting action" />
        <DashboardCard title="Team Coverage" value="AI" detail="Use insight per request" />
        <DashboardCard title="Queue Status" value={isLoading ? "..." : "Ready"} detail="Current manager view" />
      </div>

      {message ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{message}</p> : null}

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Leave requests</h2>
            <p className="mt-1 text-sm text-slate-600">Review employee requests and manager comments.</p>
          </div>
          <Button type="button" variant="secondary" onClick={() => void loadRequests()} className="w-full sm:w-auto">
            Refresh
          </Button>
        </div>
      </Card>

      <LeaveRequestTable
        requests={requests}
        insights={insights}
        isLoading={isLoading}
        busyId={busyId}
        insightLoadingId={insightLoadingId}
        onApprove={(id) => void decide(id, "approve")}
        onReject={(id) => void decide(id, "reject")}
        onInsight={(request) => void loadInsight(request)}
      />
    </div>
  );
}
