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

const getEmployeeName = (leave: LeaveRequest) =>
  typeof leave.userId === "string" ? "Employee" : leave.userId.name;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

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
          <h2 className="text-lg font-semibold text-slate-950">Pending leave requests</h2>
          <Button type="button" variant="secondary" onClick={() => void loadRequests()} className="w-full sm:w-auto">
            Refresh
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          {isLoading ? <p className="text-sm text-slate-600">Loading requests...</p> : null}
          {!isLoading && requests.length === 0 ? (
            <p className="text-sm text-slate-600">No pending leave requests.</p>
          ) : null}
          {requests.map((request) => (
            <div key={request._id} className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-medium text-slate-950">
                    {getEmployeeName(request)} - {request.type}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatDate(request.startDate)} to {formatDate(request.endDate)}
                    {request.workingDays ? `, ${request.workingDays} working days` : ""}
                  </p>
                  <p className="mt-3 text-sm text-slate-700">{request.reason}</p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 lg:w-36 lg:grid-cols-1">
                  <Button
                    type="button"
                    onClick={() => void decide(request._id, "approve")}
                    disabled={busyId === request._id}
                  >
                    Approve
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void decide(request._id, "reject")}
                    disabled={busyId === request._id}
                  >
                    Reject
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void loadInsight(request)}
                    disabled={insightLoadingId === request._id}
                  >
                    {insightLoadingId === request._id ? "Thinking..." : "AI insight"}
                  </Button>
                </div>
              </div>

              {insightLoadingId === request._id ? (
                <div className="mt-4 rounded-md border border-teal-100 bg-white p-3 text-sm text-slate-600">
                  Generating AI insight...
                </div>
              ) : null}

              {insights[request._id] ? (
                <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3 text-sm text-teal-900">
                  <p className="font-semibold">Summary</p>
                  <p className="mt-1">{insights[request._id].summary}</p>
                  <p className="mt-3 font-semibold">Recommendation</p>
                  <p className="mt-1">{insights[request._id].recommendation}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
