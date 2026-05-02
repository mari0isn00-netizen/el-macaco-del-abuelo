import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/app/actions/admin"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Skip auth check for login page
  // The middleware or page-level check will handle it
  return <>{children}</>
}
