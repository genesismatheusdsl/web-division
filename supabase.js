// =====================================
// CONFIG GLOBAL SUPABASE - WEB DIVISION
// =====================================

// ⚠️ NÃO declarar essas variáveis em outros arquivos
const SUPABASE_URL = "https://webdivision23-boop.supabase.co";
const SUPABASE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

// Garante que o Supabase já foi carregado
if (!window.supabase) {
  console.error("Supabase SDK não carregado!");
} else {

  // Evita recriar o client se já existir
  if (!window.supabaseClient) {

    const { createClient } = window.supabase;

    window.supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storageKey: "webdivision-auth"
        }
      }
    );

    console.log("Supabase global iniciado ✅");

  } else {
    console.log("Supabase já estava iniciado ⚠️");
  }
}
