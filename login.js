// login.js - integração Supabase revisado

const SUPABASE_URL = 'https://znicegmkzlzdjfwhkpxi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuaWNlZ21remx6ZGpmd2hrcHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzU2NjksImV4cCI6MjA3NTM1MTY2OX0.2s0b3lWSZiem6apTdA8ytHbXMGVt_dIjg27zDnqsHDc';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");
const successMsg = document.getElementById("login-success");
const forgotLink = document.getElementById("forgot-password");

function showError(text) {
  if (errorMsg) errorMsg.textContent = text;
  if (successMsg) successMsg.textContent = "";
  console.warn("LOGIN - " + text);
}

function showSuccess(text) {
  if (successMsg) successMsg.textContent = text;
  if (errorMsg) errorMsg.textContent = "";
  console.log("LOGIN - " + text);
}

// Verifica sessão ativa
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn("Erro ao pegar sessão:", error);
    } else if (data?.session) {
      console.log("Sessão ativa encontrada, redirecionando...");
      window.location.href = "cliente.html";
    }
  } catch (err) {
    console.error("Erro getSession:", err);
  }
})();

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showError("");
    showSuccess("");

    const email = (document.getElementById("email")?.value || "").trim();
    const senha = (document.getElementById("senha")?.value || "").trim();

    if (!email || !senha) {
      showError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      showSuccess("Tentando autenticar...");
      console.log("Tentando login com:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
      });

      console.log("Resposta signInWithPassword:", { data, error });

      if (error || !data?.user) {
        showError("❌ " + (error?.message || "Email ou senha incorretos"));
        return;
      }

      showSuccess("✅ Login realizado com sucesso!");
      console.log("Usuário logado:", data.user);

      localStorage.setItem("sb_user", JSON.stringify({ id: data.user.id, email: data.user.email }));

      setTimeout(() => window.location.href = "cliente.html", 600);

    } catch (err) {
      console.error("Erro inesperado no login:", err);
      showError("Erro inesperado. Veja o console.");
    }
  });
} else {
  console.warn("form #login-form não encontrado no DOM.");
}

if (forgotLink) {
  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailPrompt = prompt("Digite seu e-mail cadastrado:");

    if (!emailPrompt) return;

    try {
      showSuccess("Enviando link de recuperação...");
      const { data, error } = await supabase.auth.resetPasswordForEmail(emailPrompt, { redirectTo: window.location.origin + "/reset.html" });
      console.log("resetPasswordForEmail:", { data, error });

      if (error) showError("Erro ao enviar e-mail: " + error.message);
      else {
        alert("Link de recuperação enviado para " + emailPrompt);
        showSuccess("Link enviado.");
      }

    } catch (err) {
      console.error("Erro reset password:", err);
      showError("Erro inesperado ao solicitar recuperação.");
    }
  });
} else {
  console.warn("link #forgot-password não encontrado no DOM.");
}
