// ===== CONFIG GLOBAL SUPABASE =====
const SUPABASE_URL = "https://webdivision23-boop.supabase.co";
const SUPABASE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

const { createClient } = supabase;

// deixa global para todas as páginas
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase global iniciado ✅");
