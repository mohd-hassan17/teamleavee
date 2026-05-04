"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, RegisterUserData, loginUser, registerUser } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";
import Card from "./Card";

type AuthMode = "login" | "signup";

const roles: AuthUser["role"][] = ["employee", "manager", "admin"];

export default function AuthForm() {
  const router = useRouter();
  const { saveSession } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AuthUser["role"]>("employee");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const auth =
        mode === "signup"
          ? await registerUser({ name, email, password, role } satisfies RegisterUserData)
          : await loginUser(email, password);

      saveSession(auth);
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="grid grid-cols-2 rounded-md bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`h-10 rounded-md text-sm font-semibold transition ${
            mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`h-10 rounded-md text-sm font-semibold transition ${
            mode === "signup" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"
          }`}
        >
          Signup
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Avery Stone"
              required
            />
          </label>
        ) : null}

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="avery@example.com"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
        </label>

        {mode === "signup" ? (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AuthUser["role"])}
              className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm capitalize outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              {roles.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
        </Button>
      </form>

      {message ? (
        <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">{message}</p>
      ) : null}
    </Card>
  );
}
