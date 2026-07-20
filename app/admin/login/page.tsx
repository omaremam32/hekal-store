import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Lock } from "lucide-react";

const ADMIN_COOKIE = "hekal-admin";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: {
    error?: string;
  };
}) {
  const isLoggedIn = cookies().get(ADMIN_COOKIE)?.value === "1";

  if (isLoggedIn) {
    redirect("/admin/orders");
  }

  const error = searchParams?.error;

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center px-5 py-20">
      <div className="w-full rounded-[2rem] border border-ink/10 bg-bone p-8 shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-bone">
          <Lock size={28} />
        </div>

        <p className="text-center font-tag text-xs uppercase tracking-[0.28em] text-thread">
          Hekal Admin
        </p>

        <h1 className="mt-3 text-center font-display text-5xl tracking-wide text-ink">
          Login
        </h1>

        <p className="mt-3 text-center text-sm leading-6 text-charcoal/60">
          Enter the admin password to view customer orders.
        </p>

        {error === "1" && (
          <p className="mt-5 rounded-2xl border border-thread/20 bg-thread/10 px-4 py-3 text-sm text-thread">
            Wrong password. Try again.
          </p>
        )}

        {error === "missing" && (
          <p className="mt-5 rounded-2xl border border-thread/20 bg-thread/10 px-4 py-3 text-sm text-thread">
            ADMIN_PASSWORD is missing from your .env.local file.
          </p>
        )}

        <form action="/api/admin/login" method="post" className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-charcoal">
              Admin password
            </span>

            <input
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border border-ink/15 bg-white/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-ink px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-bone transition hover:bg-thread"
          >
            Enter admin
          </button>
        </form>
      </div>
    </main>
  );
}