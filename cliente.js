// ===== CONFIGURAÇÃO SUPABASE =====
const SUPABASE_URL = "https://hixywpfmakojtiwhufrd.supabase.co";
const SUPABASE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", async () => {

  // ===== ATIVAR ÍCONES LUCIDE =====
  if (window.lucide) {
    lucide.createIcons();
  }

  // ===== VERIFICAR USUÁRIO LOGADO =====
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    window.location.href = "login.html";
    return;
  }

  const user = data.user;

  // Mostrar nome/email do cliente
  document.getElementById("nomeCliente").textContent =
    user.user_metadata?.nome || user.email || "Cliente";

  // ===== LOGOUT =====
  const logoutBtn = document.querySelector(".logout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "login.html";
    });
  }

});
