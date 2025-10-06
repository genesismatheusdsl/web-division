// login.js - Integração Supabase com debug visual completo

// === CONFIGURAÇÃO SUPABASE ===
const SUPABASE_URL = 'https://znicegmkzlzdjfwhkpxi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuaWNlZ21remx6ZGpmd2hrcHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzU2NjksImV4cCI6MjA3NTM1MTY2OX0.2s0b3lWSZiem6apTdA8ytHbXMGVt_dIjg27zDnqsHDc';

// Criando client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === ELEMENTOS DO DOM ===
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");
const successMsg = document.getElementById("login-success");
const forgotLink = document.getElementById("forgot-password");

// === FUNÇÕES DE DEBUG VISUAL ===
function showError(text, debug = "") {
  if (errorMsg) errorMsg.textContent = text + (debug ? " | Debug: " + debug : "");
  if (successMsg) successMsg.textContent = "";
  console.warn("LOGIN - " + text, debug);
}

function showSuccess(text, debug = "") {
  if (successMsg) successMsg.textContent = text + (debug ? " | Debug: " + debug : "");
  if (errorMsg) errorMsg.textContent = "";
  console.log("LOGIN - " + text, debug);
}

// === VERIFICAÇÃO DE SESSÃO ATIVA ===
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log("Sessão atual (getSession):", { data, error });
    if (error) showError("Erro ao verificar sessão", JSON.stringify(error));
    else if (data?.session) {
      showSuccess("Sessão ativa encontrada, redirecionando...", JSON.stringify(data));
      setTimeout(() => window.location.href = "cliente.html", 500);
    }
  } catch (err) {
    console.error("Erro getSession:", err);
    showError("Erro inesperado ao verificar sessão", JSON.stringify(err));
  }
})();

// === LOGIN ===
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showError("");
    showSuccess("");

    const email = (document.getElementById("email")?.value || "").trim();
    const senha = (document.getElementById("senha")?.value || "").trim();

    if (!email || !senha) {
      showError("Preencha todos os campos.");
      return;
    }

    try {
      showSuccess("Tentando autenticar...");
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
      console.log("Resposta signInWithPassword:", { data, error });

      if (error || !data?.user) {
        showError("Login falhou!", JSON.stringify(error || data));
        return;
      }

      showSuccess("Login realizado com sucesso!", JSON.stringify(data));
      localStorage.setItem("sb_user", JSON.stringify({ id: data.user.id, email: data.user.email }));

      setTimeout(() => window.location.href = "cliente.html", 600);

    } catch (err) {
      console.error("Erro inesperado no login:", err);
      showError("Erro inesperado no login", JSON.stringify(err));
    }
  });
} else {
  console.warn("form #login-form não encontrado no DOM.");
}

// === RECUPERAÇÃO DE SENHA ===
if (forgotLink) {
  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailPrompt = prompt("Digite seu e-mail cadastrado:");

    if (!emailPrompt) return;

    try {
      showSuccess("Enviando link de recuperação...");
      const { data, error } = await supabase.auth.resetPasswordForEmail(emailPrompt, { redirectTo: window.location.origin + "/reset.html" });
      console.log("resetPasswordForEmail:", { data, error });

      if (error) showError("Erro ao enviar e-mail", JSON.stringify(error));
      else {
        alert("Link de recuperação enviado para " + emailPrompt);
        showSuccess("Link enviado com sucesso!", JSON.stringify(data));
      }

    } catch (err) {
      console.error("Erro reset password:", err);
      showError("Erro inesperado ao solicitar recuperação.", JSON.stringify(err));
    }
  });
} else {
  console.warn("link #forgot-password não encontrado no DOM.");
}

// === DEBUG HELPERS ===
window.__supabase_debug = {
  supabase,
  printSession: async () => {
    const s = await supabase.auth.getSession();
    console.log("getSession:", s);
    const u = await supabase.auth.getUser();
    console.log("getUser:", u);
  },
  clearLocal: () => {
    localStorage.removeItem("sb_user");
    console.log("localStorage sb_user removido");
  }
};
