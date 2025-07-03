import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qwwqcjkvjzgdrdibvjaa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3d3Fjamt2anpnZHJkaWJ2amFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDE3ODIsImV4cCI6MjA2NDg3Nzc4Mn0.L4m9_jEUqb1EVeZEdSETX6TrvTRWJX6FKBDJFvlw6QI";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3d3Fjamt2anpnZHJkaWJ2amFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTMwMTc4MiwiZXhwIjoyMDY0ODc3NzgyfQ.I0qHh-hBJrT3wPw_jTx0kAr6yCi3G7CaMo2787DUd6o";

// Regular client for authentication
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client with service key to bypass RLS for admin operations
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
