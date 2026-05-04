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
    <Card className="w-full">
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-end">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">AI request</span>
          <textarea
            value={aiText}
            onChange={(event) => setAiText(event.target.value)}
            className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="I need sick leave from 2026-05-12 to 2026-05-14 for fever"
          />
        </label>
        <Button type="button" variant="secondary" onClick={() => void fillFromText(aiText)} disabled={isAiLoading}>
          {isAiLoading ? "Reading..." : "Use AI"}
        </Button>
        <Button type="button" variant="secondary" onClick={startVoiceInput} disabled={isListening || isAiLoading}>
          {isListening ? "Listening..." : "Voice"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Leave type</span>
          <input
            value={form.type}
            onChange={(event) => updateField("type", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
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
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">End date</span>
          <input
            type="date"
            value={form.endDate}
            onChange={(event) => updateField("endDate", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            required
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Reason</span>
          <textarea
            value={form.reason}
            onChange={(event) => updateField("reason", event.target.value)}
            className="mt-2 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="Add a short reason"
            required
          />
        </label>

        <div className="sm:col-span-2">
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit request"}
          </Button>
        </div>
      </form>

      {message ? (
        <p className="mt-4 rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-800">{message}</p>
      ) : null}
    </Card>
  );
}
