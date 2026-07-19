import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import type { CartLine } from "@/lib/types";

interface OrderRequestBody {
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    governorate: string;
  };
  items: CartLine[];
}

export async function POST(request: Request) {
  let body: OrderRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { customer, items } = body;

  if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city || !customer?.governorate) {
    return NextResponse.json({ error: "Missing required customer fields" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const rpcItems = items.map((item) => ({
    variant_id: item.variantId,
    quantity: item.quantity,
  }));

  const { data, error } = await supabaseServer.rpc("create_order", {
    p_customer_name: customer.name,
    p_phone: customer.phone,
    p_email: customer.email || null,
    p_address: customer.address,
    p_city: customer.city,
    p_governorate: customer.governorate,
    p_items: rpcItems,
  });

  if (error) {
    // Stock/variant errors raised from the SQL function surface here
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ orderId: data });
}
