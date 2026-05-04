"use client";

import { FormEvent, useState } from "react";
import Button from "./Button";
import Card from "./Card";

export default function LeaveForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Leave request saved locally.");
  };

  return (
    <Card className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Start date</span>
          <input
            type="date"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">End date</span>
          <input
            type="date"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            required
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Reason</span>
          <textarea
            className="mt-2 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="Add a short reason"
            required
          />
        </label>

        <div className="sm:col-span-2">
          <Button type="submit" className="w-full sm:w-auto">
            Submit request
          </Button>
        </div>
      </form>

      {message ? (
        <p className="mt-4 rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-800">{message}</p>
      ) : null}
    </Card>
  );
}
