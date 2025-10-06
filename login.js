// Inicializa o cliente do Supabase
const SUPABASE_URL = 'https://znicegmkzlzdjfwhkpxi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuaWNlZ21remx6ZGpmd2hrcHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzU2NjksImV4cCI6MjA3NTM1MTY2OX0.2s0b3lWSZiem6apTdA8ytHbXMGVt_dIjg27zDnqsHDc';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Login real com Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert('Usuário ou senha incorretos: ' + error.message);
  } else {
    alert('Login realizado com sucesso!');
    // Redirecionar para o painel
    window.location.href = 'dashboard.html';
  }
});

// Recuperação de senha (integra com Supabase)
const forgotPassword = document.getElementById('forgot-password');
forgotPassword.addEventListener('click', async () => {
  const email = prompt('Informe seu e-mail cadastrado:');
  if (email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://seusite.com/reset.html', // altere para sua página de redefinição
    });

    if (error) {
      alert('Erro ao enviar e-mail: ' + error.message);
    } else {
      alert(`Instruções de recuperação de senha enviadas para ${email}`);
    }
  }
});
