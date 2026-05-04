"use client";

import { FormEvent, useState } from "react";
import { applyLeave, LeaveFormData, parseLeaveText } from "../lib/api";
import Button from "./Button";
import Card from "./Card";

type SpeechRecognitionConstructor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
};

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

type LeaveFormProps = {
  onSubmitted?: () => void;
};

const emptyForm: LeaveFormData = {
  type: "",
  startDate: "",
  endDate: "",
  reason: "",
};

export default function LeaveForm({ onSubmitted }: LeaveFormProps) {
  const [form, setForm] = useState<LeaveFormData>(emptyForm);
  const [aiText, setAiText] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const updateField = (field: keyof LeaveFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const fillFromText = async (text: string) => {
    if (!text.trim()) {
      setMessage("Enter or speak a leave request first.");
      return;
    }

    setIsAiLoading(true);
    setMessage("");

    try {
      const parsed = await parseLeaveText(text);
      setForm({
        type: parsed.type || "",
        startDate: parsed.startDate || "",
        endDate: parsed.endDate || "",
        reason: parsed.reason || "",
      });
      setMessage("Form filled from AI.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "AI parsing failed");
    } finally {
      setIsAiLoading(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    setIsListening(true);
    setMessage("");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAiText(transcript);
      void fillFromText(transcript);
    };

    recognition.onerror = () => {
      setMessage("Voice input failed. Try typing the request instead.");
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await applyLeave(form);
      setForm(emptyForm);
      setAiText("");
      setMessage("Leave request submitted.");
      onSubmitted?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Leave request failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-slate-950">Apply for leave</h2>
        <p className="mt-1 text-sm text-slate-600">Fill the form manually, or let AI draft it from a short request.</p>
      </div>

      <div className="mb-6 rounded-lg border border-teal-100 bg-teal-50/70 p-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">AI assistant</span>
          <textarea
            value={aiText}
            onChange={(event) => setAiText(event.target.value)}
            className="mt-2 min-h-24 w-full rounded-md border border-teal-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="I need sick leave from 2026-05-12 to 2026-05-14 for fever"
          />
        </label>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => void fillFromText(aiText)}
            disabled={isAiLoading}
            className="w-full border-teal-200"
          >
            {isAiLoading ? "Generating..." : "Use AI"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={startVoiceInput}
            disabled={isListening || isAiLoading}
            className="w-full border-teal-200"
          >
            {isListening ? "Listening..." : "Use voice"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Leave type</span>
          <input
            value={form.type}
            onChange={(event) => updateField("type", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="Sick, casual, earned"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Start date</span>
          <input
            type="date"
            value={form.startDate}
            onChange={(event) => updateField("startDate", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">End date</span>
          <input
            type="date"
            value={form.endDate}
            onChange={(event) => updateField("endDate", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            required
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Reason</span>
          <textarea
            value={form.reason}
            onChange={(event) => updateField("reason", event.target.value)}
            className="mt-2 min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="Add a short reason"
            required
          />
        </label>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Weekends are excluded from leave day calculation.</p>
          <Button type="submit" className="w-full sm:w-auto sm:min-w-40" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit request"}
          </Button>
        </div>
      </form>

      {message ? (
        <p
          className={`mt-4 rounded-md px-3 py-2 text-sm ${
            message.toLowerCase().includes("failed") || message.toLowerCase().includes("required")
              ? "bg-rose-50 text-rose-700"
              : "bg-teal-50 text-teal-800"
          }`}
        >
          {message}
        </p>
      ) : null}
    </Card>
  );
}
