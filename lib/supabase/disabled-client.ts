const missingSupabaseError = {
  message: "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
}

function createDisabledQuery() {
  const query: Record<string, unknown> = {
    select: () => query,
    insert: () => query,
    update: () => query,
    delete: () => query,
    eq: () => query,
    neq: () => query,
    order: () => query,
    single: () => Promise.resolve({ data: null, error: missingSupabaseError }),
    maybeSingle: () => Promise.resolve({ data: null, error: missingSupabaseError }),
    then: (resolve: (value: { data: null; error: typeof missingSupabaseError; count: null }) => void) =>
      Promise.resolve({ data: null, error: missingSupabaseError, count: null }).then(resolve),
  }

  return query
}

export function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export function createDisabledServerClient() {
  return {
    from: () => createDisabledQuery(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: missingSupabaseError }),
    },
  }
}

export function createDisabledBrowserClient() {
  return {
    channel: () => ({
      on() {
        return this
      },
      subscribe() {
        return this
      },
    }),
    removeChannel: () => undefined,
  }
}
