import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "hekal-admin";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(ADMIN_COOKIE)?.value === "1";

  if (isLoggedIn) {
    redirect("/admin/dashboard");
  }

  redirect("/admin/login");
}