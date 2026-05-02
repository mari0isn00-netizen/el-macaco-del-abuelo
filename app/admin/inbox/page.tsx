import { redirect } from "next/navigation"
import Link from "next/link"
import { checkAdminAuth, getAdminThreads } from "@/app/actions/admin"
import { AdminInboxClient } from "@/components/admin/admin-inbox-client"
import { ArrowLeft } from "lucide-react"

export default async function AdminInboxPage() {
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  const threads = await getAdminThreads()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al panel
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminInboxClient initialThreads={threads} />
      </main>
    </div>
  )
}
