// ================================
// WEB DIVISION - LOGIN SUPABASE
// ================================

// === CONFIGURAÇÃO SUPABASE ===
const SUPABASE_URL = "https://hixywpfmakojtiwhufrd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

// Criando client corretamente (CDN)
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// === ELEMENTOS DOM ===
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");
const successMsg = document.getElementById("login-success");
const forgotLink = document.getElementById("forgot-password");

// ================================
// FUNÇÕES AUXILIARES
// ================================
function showError(message) {
  if (errorMsg) errorMsg.textContent = message;
  if (successMsg) successMsg.textContent = "";
  console.warn("LOGIN ERROR:", message);
}

function showSuccess(message) {
  if (successMsg) successMsg.textContent = message;
  if (errorMsg) errorMsg.textContent = "";
  console.log("LOGIN SUCCESS:", message);
}

// ================================
// VERIFICAR SESSÃO ATIVA
// ================================
(async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (session) {
    showSuccess("Sessão ativa encontrada. Redirecionando...");
    setTimeout(() => {
      window.location.href = "cliente.html";
    }, 600);
  }
})();

// ================================
// LOGIN
// ================================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    showError("");
    showSuccess("");

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      showError("Preencha todos os campos.");
      return;
    }

    showSuccess("Autenticando...");

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error) {
      showError("Email ou senha inválidos.");
      return;
    }

    showSuccess("Login realizado com sucesso!");

    setTimeout(() => {
      window.location.href = "cliente.html";
    }, 800);
  });
}

// ================================
// RECUPERAÇÃO DE SENHA
// ================================
if (forgotLink) {
  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();

    const emailPrompt = prompt("Digite seu e-mail cadastrado:");

    if (!emailPrompt) return;

    showSuccess("Enviando link de recuperação...");

    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      emailPrompt,
      {
        redirectTo: window.location.origin + "/reset.html"
      }
    );

    if (error) {
      showError("Erro ao enviar email de recuperação.");
    } else {
      alert("Link de recuperação enviado para " + emailPrompt);
      showSuccess("Email enviado com sucesso!");
    }
  });
}
