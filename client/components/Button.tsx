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
      ? "bg-teal-700 text-white hover:bg-teal-800 disabled:bg-slate-400"
      : "border border-slate-300 text-slate-800 hover:bg-slate-100";

  return (
    <button
      className={`h-11 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed ${variantClass} ${className}`}
      {...props}
    />
  );
}
