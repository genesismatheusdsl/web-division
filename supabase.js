// ===== CONFIG GLOBAL SUPABASE =====
const SUPABASE_URL = "https://webdivision23-boop.supabase.co";
const SUPABASE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

const { createClient } = supabase;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: "webdivision-auth"
  }
});

window.supabaseClient = supabaseClient;

console.log("Supabase global iniciado ✅");
