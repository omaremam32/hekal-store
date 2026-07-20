import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

const ADMIN_COOKIE = "hekal-admin";

const allowedStatuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export async function PATCH(request: Request) {
  const isLoggedIn = cookies().get(ADMIN_COOKIE)?.value === "1";

  if (!isLoggedIn) {
    return NextResponse.json(
      { error: "Unauthorized. Please login again." },
      { status: 401 }
    );
  }

  let body: {
    orderId?: string;
    status?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const orderId = body.orderId;
  const status = body.status;

  if (!orderId) {
    return NextResponse.json(
      { error: "Missing order ID." },
      { status: 400 }
    );
  }

  if (!status || !allowedStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid order status." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id, status")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Could not update order status. Check the orders table.",
      },
      { status: 400 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Order was not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    orderId: data.id,
    status: data.status,
  });
}