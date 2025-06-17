// src/supabase/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://erlldebnhztrpzapzvrk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybGxkZWJuaHp0cnB6YXB6dnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNDY2MDQsImV4cCI6MjA2NTcyMjYwNH0.TB4E_pxgU0R9UBPeqfWO2xqtrJNDFaTLEOZfbJmYq5s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
