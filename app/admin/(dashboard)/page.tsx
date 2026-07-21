import { redirect } from "next/navigation";
import { getStaffRole } from "../actions";

export default async function AdminIndexPage() {
  const role = await getStaffRole();
  if (role === "admin") redirect("/admin/stolovi");
  if (role === "waiter") redirect("/admin/porudzbine");
  redirect("/admin/login");
}
