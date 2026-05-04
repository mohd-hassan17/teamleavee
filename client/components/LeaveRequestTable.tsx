"use client";

import { LeaveRequest, ManagerInsight } from "../lib/api";
import Button from "./Button";
import Card from "./Card";

type LeaveRequestTableProps = {
  requests: LeaveRequest[];
  insights?: Record<string, ManagerInsight>;
  isLoading?: boolean;
  busyId?: string;
  insightLoadingId?: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onInsight?: (leave: LeaveRequest) => void;
};

const getEmployeeName = (leave: LeaveRequest) =>
  typeof leave.userId === "string" ? "Employee" : leave.userId.name;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

const statusClass = {
  pending: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-800 ring-1 ring-rose-200",
};

function StatusBadge({ status }: { status: LeaveRequest["status"] }) {
  return (
    <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass[status]}`}>
      {status}
    </span>
  );
}

type ActionProps = Pick<
  LeaveRequestTableProps,
  "busyId" | "insightLoadingId" | "onApprove" | "onReject" | "onInsight"
> & {
  request: LeaveRequest;
};

function Actions({
  request,
  busyId,
  insightLoadingId,
  onApprove,
  onReject,
  onInsight,
}: ActionProps) {
  const isBusy = busyId === request._id;
  const isFinal = request.status !== "pending";

  return (
    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
      <Button type="button" onClick={() => onApprove?.(request._id)} disabled={isBusy || isFinal}>
        Approve
      </Button>
      <Button type="button" variant="secondary" onClick={() => onReject?.(request._id)} disabled={isBusy || isFinal}>
        Reject
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => onInsight?.(request)}
        disabled={insightLoadingId === request._id}
      >
        {insightLoadingId === request._id ? "Thinking..." : "AI insight"}
      </Button>
    </div>
  );
}

function Insight({
  request,
  insights = {},
  insightLoadingId,
}: {
  request: LeaveRequest;
  insights?: Record<string, ManagerInsight>;
  insightLoadingId?: string;
}) {
  if (insightLoadingId === request._id) {
    return (
      <div className="mt-3 rounded-md border border-teal-100 bg-white p-3 text-sm text-slate-600">
        Generating AI insight...
      </div>
    );
  }

  if (!insights[request._id]) {
    return null;
  }

  return (
    <div className="mt-3 rounded-md border border-teal-100 bg-teal-50 p-3 text-sm text-teal-900">
      <p className="font-semibold">Summary</p>
      <p className="mt-1">{insights[request._id].summary}</p>
      <p className="mt-3 font-semibold">Recommendation</p>
      <p className="mt-1">{insights[request._id].recommendation}</p>
    </div>
  );
}

export default function LeaveRequestTable({
  requests,
  insights = {},
  isLoading = false,
  busyId = "",
  insightLoadingId = "",
  onApprove,
  onReject,
  onInsight,
}: LeaveRequestTableProps) {
  if (isLoading) {
    return (
      <Card>
        <p className="text-sm text-slate-600">Loading leave requests...</p>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <p className="text-sm font-medium text-slate-950">No leave requests</p>
        <p className="mt-1 text-sm text-slate-600">New requests will appear here when employees apply.</p>
      </Card>
    );
  }

  return (
    <div>
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Employee Name</th>
              <th className="px-4 py-3">Leave Type</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">End Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Manager Comment</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {requests.map((request) => (
              <tr key={request._id} className="align-top transition hover:bg-slate-50">
                <td className="px-4 py-4 font-medium text-slate-950">{getEmployeeName(request)}</td>
                <td className="px-4 py-4 text-slate-700">{request.type}</td>
                <td className="px-4 py-4 text-slate-700">{formatDate(request.startDate)}</td>
                <td className="px-4 py-4 text-slate-700">{formatDate(request.endDate)}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={request.status} />
                </td>
                <td className="max-w-xs px-4 py-4 text-slate-600">{request.comment || "No comment"}</td>
                <td className="px-4 py-4">
                  <div className="ml-auto w-32">
                    <Actions
                      request={request}
                      busyId={busyId}
                      insightLoadingId={insightLoadingId}
                      onApprove={onApprove}
                      onReject={onReject}
                      onInsight={onInsight}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-3 border-t border-slate-200 p-4">
          {requests.map((request) => (
            <Insight
              key={request._id}
              request={request}
              insights={insights}
              insightLoadingId={insightLoadingId}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {requests.map((request) => (
          <Card key={request._id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Employee Name</p>
                <p className="mt-1 font-semibold text-slate-950">{getEmployeeName(request)}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Leave Type</p>
                <p className="mt-1 text-sm text-slate-800">{request.type}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Start Date</p>
                <p className="mt-1 text-sm text-slate-800">{formatDate(request.startDate)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">End Date</p>
                <p className="mt-1 text-sm text-slate-800">{formatDate(request.endDate)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Manager Comment</p>
                <p className="mt-1 text-sm text-slate-800">{request.comment || "No comment"}</p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <Actions
                request={request}
                busyId={busyId}
                insightLoadingId={insightLoadingId}
                onApprove={onApprove}
                onReject={onReject}
                onInsight={onInsight}
              />
              <Insight request={request} insights={insights} insightLoadingId={insightLoadingId} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
