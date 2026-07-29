export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  CheckCircle2,
  Database,
  HardDrive,
  Server,
  XCircle,
} from "lucide-react";
import { supabaseServer } from "@/lib/supabaseServer";

const ADMIN_COOKIE = "hekal-admin";

type BackendTableCheck = {
  name: string;
  ok: boolean;
  count: number;
  error: string | null;
};

type BackendStorageCheck = {
  name: string;
  ok: boolean;
  fileCountVisible: number;
  error: string | null;
};

async function checkTable(tableName: string): Promise<BackendTableCheck> {
  const { count, error } = await supabaseServer
    .from(tableName)
    .select("id", {
      count: "exact",
      head: true,
    });

  return {
    name: tableName,
    ok: !error,
    count: count ?? 0,
    error: error?.message ?? null,
  };
}

async function checkStorageBucket(
  bucketName: string
): Promise<BackendStorageCheck> {
  const { data, error } = await supabaseServer.storage
    .from(bucketName)
    .list("", {
      limit: 1,
    });

  return {
    name: bucketName,
    ok: !error,
    fileCountVisible: data?.length ?? 0,
    error: error?.message ?? null,
  };
}

async function getBackendStatus() {
  const [
    products,
    productVariants,
    orders,
    orderItems,
    productImagesBucket,
  ] = await Promise.all([
    checkTable("products"),
    checkTable("product_variants"),
    checkTable("orders"),
    checkTable("order_items"),
    checkStorageBucket("product-images"),
  ]);

  const tables = [products, productVariants, orders, orderItems];
  const storage = [productImagesBucket];

  return {
    supabaseUrlExists: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    serviceRoleExists: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    tables,
    storage,
    allOk:
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
      tables.every((table) => table.ok) &&
      storage.every((bucket) => bucket.ok),
  };
}

export default async function AdminBackendPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(ADMIN_COOKIE)?.value === "1";

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  const status = await getBackendStatus();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
            Hekal Admin System
          </p>

          <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
            Backend
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal/60">
            Check the connection between your website, Supabase database,
            Supabase storage, and admin backend routes.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/database"
            className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
          >
            Database
          </Link>
        </div>
      </div>

      <div
        className={`rounded-[2rem] border p-6 shadow-sm ${
          status.allOk
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`mt-1 rounded-full p-2 ${
              status.allOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status.allOk ? <CheckCircle2 size={26} /> : <XCircle size={26} />}
          </div>

          <div>
            <h2
              className={`text-2xl font-bold ${
                status.allOk ? "text-green-900" : "text-red-900"
              }`}
            >
              {status.allOk
                ? "Backend is connected"
                : "Backend needs attention"}
            </h2>

            <p
              className={`mt-2 text-sm leading-6 ${
                status.allOk ? "text-green-800" : "text-red-800"
              }`}
            >
              {status.allOk
                ? "Your website can read from Supabase database and storage."
                : "One or more backend checks failed. Check the error messages below."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <StatusCard
          title="Supabase URL"
          description="NEXT_PUBLIC_SUPABASE_URL"
          ok={status.supabaseUrlExists}
          icon={<Server size={22} />}
          value={status.supabaseUrlExists ? "Found" : "Missing"}
        />

        <StatusCard
          title="Service Role Key"
          description="SUPABASE_SERVICE_ROLE_KEY"
          ok={status.serviceRoleExists}
          icon={<Server size={22} />}
          value={status.serviceRoleExists ? "Found" : "Missing"}
        />
      </div>

      <section className="mt-10 rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
        <div className="mb-5">
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            Database Tables
          </p>

          <h2 className="mt-2 text-2xl font-bold text-ink">
            Supabase database connection
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {status.tables.map((table) => (
            <StatusCard
              key={table.name}
              title={table.name}
              description={table.error ?? "Connected"}
              ok={table.ok}
              icon={<Database size={22} />}
              value={table.ok ? `${table.count} rows` : "Failed"}
            />
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
        <div className="mb-5">
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            Storage
          </p>

          <h2 className="mt-2 text-2xl font-bold text-ink">
            Supabase image storage
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {status.storage.map((bucket) => (
            <StatusCard
              key={bucket.name}
              title={bucket.name}
              description={bucket.error ?? "Connected"}
              ok={bucket.ok}
              icon={<HardDrive size={22} />}
              value={bucket.ok ? "Available" : "Failed"}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function StatusCard({
  title,
  description,
  ok,
  icon,
  value,
}: {
  title: string;
  description: string;
  ok: boolean;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white/60 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
            {title}
          </p>

          <p className="mt-2 text-xs leading-5 text-charcoal/60">
            {description}
          </p>
        </div>

        <span className={ok ? "text-green-700" : "text-red-700"}>
          {icon}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-mono text-xl font-bold text-ink">{value}</p>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
            ok
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {ok ? "OK" : "Error"}
        </span>
      </div>
    </div>
  );
}