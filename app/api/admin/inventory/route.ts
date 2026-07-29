import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

const ADMIN_COOKIE = "hekal-admin";

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "inventory route is working",
  });
}

export async function PATCH(request: Request) {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorized. Please login again." },
      { status: 401 }
    );
  }

  let body: {
    variantId?: string;
    stock?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const variantId = body.variantId;
  const stock = Number(body.stock);

  if (!variantId) {
    return NextResponse.json(
      { error: "Missing variant ID." },
      { status: 400 }
    );
  }

  if (!Number.isFinite(stock) || stock < 0) {
    return NextResponse.json(
      { error: "Stock must be 0 or more." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("product_variants")
    .update({
      stock: Math.floor(stock),
    })
    .eq("id", variantId)
    .select("id, stock")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message || "Could not update stock." },
      { status: 400 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Variant was not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    variantId: data.id,
    stock: data.stock,
  });
}