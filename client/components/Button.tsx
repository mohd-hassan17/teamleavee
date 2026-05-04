import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-teal-700 text-white shadow-sm hover:bg-teal-800 disabled:bg-slate-400"
      : "border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50";

  return (
    <button
      className={`min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${variantClass} ${className}`}
      {...props}
    />
  );
}
