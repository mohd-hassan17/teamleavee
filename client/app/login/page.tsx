import AuthForm from "../../components/AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-5 py-8 text-slate-950 sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Employee Portal
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
            Sign in to manage leave requests.
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            Use your account or create one with an employee, manager, or admin role.
          </p>
        </section>

        <AuthForm />
      </div>
    </main>
  );
}
