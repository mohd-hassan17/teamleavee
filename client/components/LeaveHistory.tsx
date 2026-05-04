"use client";

import { LeaveRequest } from "../lib/api";
import Card from "./Card";

type LeaveHistoryProps = {
  leaves: LeaveRequest[];
  isLoading?: boolean;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

export default function LeaveHistory({ leaves, isLoading = false }: LeaveHistoryProps) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-950">Leave history</h2>
        <span className="text-sm text-slate-500">{leaves.length} requests</span>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading ? <p className="text-sm text-slate-600">Loading leave history...</p> : null}
        {!isLoading && leaves.length === 0 ? (
          <p className="text-sm text-slate-600">No leave requests yet.</p>
        ) : null}
        {leaves.map((leave) => (
          <div key={leave._id} className="rounded-md border border-slate-200 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-medium text-slate-950">{leave.type}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
                </p>
              </div>
              <span className="w-fit rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-700">
                {leave.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{leave.reason}</p>
            {leave.comment ? <p className="mt-2 text-sm text-slate-500">Manager: {leave.comment}</p> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
