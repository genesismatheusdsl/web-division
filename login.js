// 🔐 Configuração Supabase
const SUPABASE_URL = 'https://znicegmkzlzdjfwhkpxi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuaWNlZ21remx6ZGpmd2hrcHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzU2NjksImV4cCI6MjA3NTM1MTY2OX0.2s0b3lWSZiem6apTdA8ytHbXMGVt_dIjg27zDnqsHDc';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");
const successMsg = document.getElementById("login-success");

// ✅ Verifica se já existe sessão ativa
(async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    window.location.href = "cliente.html"; // redireciona se já logado
  }
})();

// 🔑 Login
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";
  successMsg.textContent = "";

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    errorMsg.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha
  });

  if (error) {
    errorMsg.textContent = "❌ " + (error.message || "Email ou senha incorretos!");
  } else {
    successMsg.textContent = "✅ Login realizado com sucesso!";
    localStorage.setItem("userSession", JSON.stringify(data.user));
    setTimeout(() => {
      window.location.href = "cliente.html"; // página do painel
    }, 800);
  }
});

// 🔄 Recuperação de senha
document.getElementById("forgot-password").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = prompt("Digite seu e-mail cadastrado para redefinir a senha:");

  if (email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset.html" // redireciona para reset.html
    });

    if (error) {
      alert("Erro ao enviar e-mail: " + error.message);
    } else {
      alert("Um link de recuperação foi enviado para " + email);
    }
  }
});
