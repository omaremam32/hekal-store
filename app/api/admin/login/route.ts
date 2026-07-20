import { NextResponse } from "next/server";

const ADMIN_COOKIE = "hekal-admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");

  const adminPassword = process.env.ADMIN_PASSWORD || "emam123";

  if (password !== adminPassword) {
    return NextResponse.redirect(
      new URL("/admin/login?error=1", request.url),
      { status: 303 }
    );
  }

  const response = NextResponse.redirect(new URL("/admin/orders", request.url), {
    status: 303,
  });

  response.cookies.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}