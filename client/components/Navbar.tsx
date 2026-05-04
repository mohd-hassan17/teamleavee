"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/apply-leave", label: "Apply Leave" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link href="/dashboard" className="text-lg font-semibold text-slate-950">
          Employee Portal
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {isAuthenticated
            ? navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    pathname === item.href
                      ? "bg-teal-50 text-teal-800"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))
            : null}

          {isAuthenticated ? (
            <Button type="button" variant="secondary" onClick={handleLogout} className="w-full sm:w-auto">
              Logout
            </Button>
          ) : (
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
