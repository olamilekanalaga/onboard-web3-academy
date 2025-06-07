import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qwwqcjkvjzgdrdibvjaa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3d3Fjamt2anpnZHJkaWJ2amFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDE3ODIsImV4cCI6MjA2NDg3Nzc4Mn0.L4m9_jEUqb1EVeZEdSETX6TrvTRWJX6FKBDJFvlw6QI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
