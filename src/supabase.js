import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────────────────────
// Replace these two values with your own from supabase.com
// Project Settings → API → Project URL & anon/public key
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://srdgijhzytqkwhxwqjiq.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZGdpamh6eXRxa3doeHdxamlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjUzODUsImV4cCI6MjA5NjMwMTM4NX0.8JJRnU83zpjGx2z_Bh26caV4SslRTA5YJTf7P1lP6-8'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
