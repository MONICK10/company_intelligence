import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl) {
  console.error(
    '[Supabase] VITE_SUPABASE_URL is missing — add it to your .env file and restart the dev server.',
  )
}
if (!supabaseAnonKey) {
  console.error(
    '[Supabase] VITE_SUPABASE_ANON_KEY is missing — add it to your .env file and restart the dev server.',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

export const isSupabaseMisconfigured = !supabaseUrl || !supabaseAnonKey
