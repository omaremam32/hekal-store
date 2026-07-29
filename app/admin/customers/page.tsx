export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminCustomers, {
  type AdminCustomer,
} from "@/components/admin/AdminCustomers";
import { supabaseServer } from "@/lib/supabaseServer";

const ADMIN_COOKIE = "hekal-admin";

type Row = Record<string, unknown>;

function toText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function getCustomers(): Promise<AdminCustomer[]> {
  const { data: ordersRaw, error } = await supabaseServer
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin customers error:", error.message);
    return [];
  }

  const orders = (ordersRaw ?? []) as Row[];
  const customerMap = new Map<string, AdminCustomer>();

  orders.forEach((order) => {
    const phone = toText(order["phone"], "");
    const email = toText(order["email"], "");
    const key = phone || email || String(order["id"]);

    const total = toNumber(
      order["total_egp"] ?? order["subtotal_egp"] ?? order["total"],
      0
    );

    const createdAt = toText(order["created_at"], new Date().toISOString());

    const existing = customerMap.get(key);

    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += total;

      if (new Date(createdAt) > new Date(existing.lastOrderAt)) {
        existing.lastOrderAt = createdAt;
      }

      return;
    }

    customerMap.set(key, {
      id: key,
      customerName: toText(
        order["customer_name"] ?? order["name"] ?? order["customerName"],
        "Customer"
      ),
      phone: phone || "-",
      email: email || null,
      address: toText(order["address"], "-"),
      city: toText(order["city"], "-"),
      governorate: toText(order["governorate"], "-"),
      orderCount: 1,
      totalSpent: total,
      lastOrderAt: createdAt,
    });
  });

  return Array.from(customerMap.values()).sort(
    (a, b) =>
      new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
  );
}

export default async function AdminCustomersPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(ADMIN_COOKIE)?.value === "1";

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  const customers = await getCustomers();

  return <AdminCustomers initialCustomers={customers} />;
}