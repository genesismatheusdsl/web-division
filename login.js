const form = document.getElementById('login-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Aqui você pode integrar com Supabase ou outro backend
  // Por enquanto, exemplo básico:
  if(username === 'cliente' && password === '123456') {
    alert('Login realizado com sucesso!');
    // redirecionar para dashboard, ex: window.location.href = 'dashboard.html';
  } else {
    alert('Usuário ou senha inválidos!');
  }
});

const forgotPassword = document.getElementById('forgot-password');
forgotPassword.addEventListener('click', () => {
  const email = prompt('Informe seu e-mail cadastrado:');
  if(email) {
    alert(`Instruções de recuperação de senha enviadas para ${email}`);
    // Aqui você pode integrar com backend para envio real de e-mail
  }
});
