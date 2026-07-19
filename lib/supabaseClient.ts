import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Used in client components — respects Row Level Security, read-only for
// products/variants. Never has permission to write orders directly.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
