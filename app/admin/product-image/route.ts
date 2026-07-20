import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const ADMIN_COOKIE = "hekal-admin";
const BUCKET_NAME = "product-images";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 8 * 1024 * 1024;

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function getExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName === "jpg" || fromName === "jpeg") return "jpg";
  if (fromName === "png") return "png";
  if (fromName === "webp") return "webp";

  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";

  return "webp";
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "product-image route is working",
  });
}

export async function POST(request: Request) {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorized. Please login again." },
      { status: 401 }
    );
  }

  const formData = await request.formData();

  const file = formData.get("file");
  const slugValue = String(formData.get("slug") ?? "product");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No image file was uploaded." },
      { status: 400 }
    );
  }

  if (!allowedMimeTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, and WEBP images are allowed." },
      { status: 400 }
    );
  }

  if (file.size > maxFileSize) {
    return NextResponse.json(
      { error: "Image is too large. Maximum size is 8MB." },
      { status: 400 }
    );
  }

  const safeSlug = slugify(slugValue) || "product";
  const extension = getExtension(file);
  const filePath = `admin/${safeSlug}-${Date.now()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseServer.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      {
        error:
          uploadError.message ||
          "Image upload failed. Check the product-images bucket.",
      },
      { status: 400 }
    );
  }

  const { data } = supabaseServer.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return NextResponse.json({
    ok: true,
    path: filePath,
    publicUrl: data.publicUrl,
  });
}