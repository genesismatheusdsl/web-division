// login.js - integração Supabase (pronto para usar)
// Usa as informações do seu projeto (URL + anon key)

const SUPABASE_URL = 'https://znicegmkzlzdjfwhkpxi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuaWNlZ21remx6ZGpmd2hrcHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzU2NjksImV4cCI6MjA3NTM1MTY2OX0.2s0b3lWSZiem6apTdA8ytHbXMGVt_dIjg27zDnqsHDc';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// elementos da UI (mantive os ids que você já tem)
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");
const successMsg = document.getElementById("login-success");
const forgotLink = document.getElementById("forgot-password");

// Função utilitária para mostrar erro
function showError(text) {
  if (errorMsg) errorMsg.textContent = text;
  if (successMsg) successMsg.textContent = "";
  console.warn("LOGIN - " + text);
}

// Função utilitária para mostrar sucesso
function showSuccess(text) {
  if (successMsg) successMsg.textContent = text;
  if (errorMsg) errorMsg.textContent = "";
  console.log("LOGIN - " + text);
}

// 1) Verifica se já existe sessão ativa
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn("Erro ao pegar sessão:", error);
      return;
    }
    console.log("Sessão atual (getSession):", data);
    if (data?.session) {
      // sessão ativa -> redireciona direto pro painel
      console.log("Sessão ativa encontrada. Redirecionando para cliente.html");
      window.location.href = "cliente.html";
    }
  } catch (err) {
    console.error("Exceção em getSession:", err);
  }
})();

// 2) Listener do formulário de login
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

      if (error) {
        // Mensagem amigável + log completo
        showError("❌ " + (error.message || "Email ou senha incorretos"));
        return;
      }

      // sucesso: data contém session e user
      showSuccess("✅ Login realizado com sucesso!");
      console.log("Usuário logado:", data.user);

      // salva info útil para debug/session (não salva senha)
      try {
        localStorage.setItem("sb_user", JSON.stringify({ id: data.user?.id, email: data.user?.email }));
      } catch (err) {
        console.warn("Não foi possível gravar localStorage:", err);
      }

      // redireciona pro painel (aguarda meio segundo pra UX)
      setTimeout(() => window.location.href = "cliente.html", 600);
    } catch (err) {
      console.error("Erro inesperado no login:", err);
      showError("Erro inesperado. Veja o console para detalhes.");
    }
  });
} else {
  console.warn("login.js: form #login-form não encontrado no DOM.");
}

// 3) Recuperação de senha (reset)
if (forgotLink) {
  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailPrompt = prompt("Digite seu e-mail cadastrado para receber o link de recuperação:");

    if (!emailPrompt) return;

    try {
      showSuccess("Enviando link de recuperação...");
      const redirectTo = window.location.origin + "/reset.html"; // ajuste se tiver outra URL
      const { data, error } = await supabase.auth.resetPasswordForEmail(emailPrompt, { redirectTo });

      console.log("resetPasswordForEmail:", { data, error });
      if (error) {
        showError("Erro ao enviar e-mail: " + (error.message || "verifique o e-mail"));
      } else {
        alert("Link de recuperação enviado para " + emailPrompt + ". Peça para checar a caixa de spam.");
        showSuccess("Link de recuperação enviado.");
      }
    } catch (err) {
      console.error("Erro inesperado ao solicitar reset:", err);
      showError("Erro inesperado ao solicitar recuperação.");
    }
  });
} else {
  console.warn("login.js: link #forgot-password não encontrado no DOM.");
}

// DEBUG helpers (úteis pra dev)
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
