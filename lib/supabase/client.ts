import { createBrowserClient } from '@supabase/ssr'
import { createDisabledBrowserClient, hasSupabaseConfig } from "@/lib/supabase/disabled-client"

export function createClient() {
  if (!hasSupabaseConfig()) {
    return createDisabledBrowserClient() as never
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
