import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      {children}
    </section>
  );
}
