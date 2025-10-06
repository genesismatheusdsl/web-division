/* cliente.js - integração Supabase */

/* === Configuração Supabase === */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znicegmkzlzdjfwhkpxi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuaWNlZ21remx6ZGpmd2hrcHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzU2NjksImV4cCI6MjA3NTM1MTY2OX0.2s0b3lWSZiem6apTdA8ytHbXMGVt_dIjg27zDnqsHDc';
const supabase = createClient(supabaseUrl, supabaseKey);
/* ============================== */

document.addEventListener("DOMContentLoaded", async () => {
  // Cria ícones lucide se estiverem disponíveis
  if (window.lucide) lucide.createIcons();

  // Pega usuário logado
  const { data: { user }, error: userErr } = await supabase.auth.getUser();

  if (userErr || !user) {
    console.error('Erro ou usuário não logado:', userErr);
    window.location.href = 'login.html';
    return;
  }

  // Busca dados do cliente na tabela 'clientes'
  const { data: clienteData, error: clienteErr } = await supabase
    .from('clientes')
    .select('user_id, nome, chamados, projetos, pagamentos, contratos')
    .eq('user_id', user.id)
    .single();

  if (clienteErr) {
    console.warn('Registro de cliente não encontrado ou erro:', clienteErr);
    // fallback para mostrar email e zeros
    document.getElementById("nomeCliente").textContent = user.email || 'Cliente';
    document.getElementById("chamadosCount").textContent = 0;
    document.getElementById("projetosCount").textContent = 0;
    document.getElementById("pagamentosCount").textContent = 0;
    document.getElementById("contratosCount").textContent = 0;
  } else {
    // Atualiza dados reais do cliente
    document.getElementById("nomeCliente").textContent = clienteData.nome || user.email || 'Cliente';
    document.getElementById("chamadosCount").textContent = clienteData.chamados ?? 0;
    document.getElementById("projetosCount").textContent = clienteData.projetos ?? 0;
    document.getElementById("pagamentosCount").textContent = clienteData.pagamentos ?? 0;
    document.getElementById("contratosCount").textContent = clienteData.contratos ?? 0;
  }

  // Logout
  const logoutBtn = document.querySelector('.menu .logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      localStorage.removeItem('userSession');
      window.location.href = 'login.html';
    });
  }

  // Exemplo opcional: carregar chamados do cliente
  // await carregarChamados(user.id);
});

/* Função exemplo para buscar chamados do cliente
async function carregarChamados(userId) {
  const { data, error } = await supabase
    .from('chamados')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const tbody = document.getElementById('tabelaChamados');
  tbody.innerHTML = ''; // limpa tabela
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${item.id}</td>
      <td>${item.descricao}</td>
      <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
      <td>${new Date(item.created_at).toLocaleDateString()}</td>
    `;
    tbody.appendChild(tr);
  });
}
*/
