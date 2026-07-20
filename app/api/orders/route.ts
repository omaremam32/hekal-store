import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import type { CartLine } from "@/lib/types";

interface OrderRequestBody {
  customer: {
    name: string;
    phone: string;
    email?: string;
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
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { customer, items } = body;

  const name = customer?.name?.trim();
  const phone = customer?.phone?.trim();
  const email = customer?.email?.trim() || null;
  const address = customer?.address?.trim();
  const city = customer?.city?.trim();
  const governorate = customer?.governorate?.trim();

  if (!name || !phone || !address || !city || !governorate) {
    return NextResponse.json(
      { error: "Missing required customer fields" },
      { status: 400 }
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const validItems = items
    .filter((item) => item.variantId && Number(item.quantity) > 0)
    .map((item) => ({
      variant_id: item.variantId,
      quantity: Math.floor(Number(item.quantity)),
    }));

  if (validItems.length === 0) {
    return NextResponse.json(
      { error: "Cart does not contain valid items" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer.rpc("create_order", {
    p_customer_name: name,
    p_phone: phone,
    p_email: email,
    p_address: address,
    p_city: city,
    p_governorate: governorate,
    p_items: validItems,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Order could not be created" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    orderId: data,
  });
}