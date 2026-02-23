// CONFIGURAÇÃO SUPABASE NOVA
const SUPABASE_URL = "https://hixywpfmakojtiwhufrd.supabase.co";
const SUPABASE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", async () => {

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("nomeCliente").textContent =
    user.email || "Cliente";

  // Logout
  document.querySelector(".logout").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  });

});
