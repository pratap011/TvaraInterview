import { createClient } from '@supabase/supabase-js'

// Replace with your Supabase project URL and anon key
const SUPABASE_URL:string = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Create a single supabase client for your project
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)