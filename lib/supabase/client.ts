import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Mesmo projeto Supabase do purion-os — insere na tabela leads_site existente
// (politica de RLS já permite insert público). Ver PLACEHOLDERS.md.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
