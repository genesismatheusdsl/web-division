// ================================
// WEB DIVISION - LOGIN SUPABASE
// ================================

const SUPABASE_URL = "https://hixywpfmakojtiwhufrd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");
const successMsg = document.getElementById("login-success");

// ================================
// LOGIN
// ================================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorMsg.textContent = "";
    successMsg.textContent = "";

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      errorMsg.textContent = "Preencha todos os campos.";
      return;
    }

    successMsg.textContent = "Autenticando...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error) {
      errorMsg.textContent = "Email ou senha inválidos.";
      successMsg.textContent = "";
      return;
    }

    const user = data.user;

    // 🔎 Buscar role do usuário
    const { data: roleData, error: roleError } = await supabaseClient
      .from("usuarios")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || !roleData) {
      errorMsg.textContent = "Erro ao verificar permissões.";
      successMsg.textContent = "";
      return;
    }

    successMsg.textContent = "Login realizado com sucesso!";

    // 🔥 Redirecionamento correto
    setTimeout(() => {
      if (roleData.role === "admin") {
        window.location.href = "admin-chamados.html";
      } else {
        window.location.href = "cliente.html";
      }
    }, 600);
  });
}
