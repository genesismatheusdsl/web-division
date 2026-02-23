// ================================
// WEB DIVISION - ADMIN CHAMADOS
// ================================

// ⚠️ NÃO configurar Supabase aqui
// Ele já vem do supabase.js via window.supabaseClient

document.addEventListener("DOMContentLoaded", async () => {

  console.log("Iniciando sistema admin...");

  const tabela = document.getElementById("tabelaChamados");
  if (!tabela) return;

  // 🔐 Verifica sessão
  const { data: { session }, error } =
    await window.supabaseClient.auth.getSession();

  console.log("Sessão:", session);

  if (!session) {
    console.log("Sem sessão, redirecionando...");
    window.location.href = "login.html";
    return;
  }

  const user = session.user;

  // 🔎 Verifica se é admin
  const { data: roleData, error: roleError } =
    await window.supabaseClient
      .from("usuarios")
      .select("role")
      .eq("id", user.id)
      .single();

  console.log("Role:", roleData);

  if (roleError || !roleData || roleData.role !== "admin") {
    console.log("Não é admin, redirecionando...");
    window.location.href = "cliente.html";
    return;
  }

  console.log("Admin autenticado ✅");

  carregarChamados(tabela);

  // 🚪 Logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await window.supabaseClient.auth.signOut();
      window.location.href = "index.html";
    });
  }

});

// ================================
// CARREGAR CHAMADOS
// ================================

async function carregarChamados(tabela) {

  const { data, error } = await window.supabaseClient
    .from("chamados")
    .select("*")
    .order("criado_em", { ascending: false }); // ✅ nome correto da coluna

  console.log("Chamados:", data);

  if (error) {
    console.error(error);
    tabela.innerHTML = `<tr><td colspan="5">Erro ao carregar</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    tabela.innerHTML = `<tr><td colspan="5">Nenhum chamado encontrado</td></tr>`;
    return;
  }

  tabela.innerHTML = "";

  let total = data.length;
  let abertos = 0;
  let andamento = 0;
  let resolvidos = 0;

  data.forEach(chamado => {

    // ⚠️ Só conta status se existir
    if (chamado.status === "aberto") abertos++;
    if (chamado.status === "em andamento") andamento++;
    if (chamado.status === "resolvido") resolvidos++;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${chamado.id?.substring(0,8) || "-"}</td>
      <td>${chamado.titulo || chamado.descricao || "-"}</td>
      <td>${chamado.status || "-"}</td>
      <td>${chamado.prioridade || "-"}</td>
      <td>${chamado.criado_em ? new Date(chamado.criado_em).toLocaleDateString() : "-"}</td>
    `;

    tabela.appendChild(tr);
  });

  const totalEl = document.getElementById("totalChamados");
  const abertosEl = document.getElementById("abertos");
  const andamentoEl = document.getElementById("andamento");
  const resolvidosEl = document.getElementById("resolvidos");

  if (totalEl) totalEl.textContent = total;
  if (abertosEl) abertosEl.textContent = abertos;
  if (andamentoEl) andamentoEl.textContent = andamento;
  if (resolvidosEl) resolvidosEl.textContent = resolvidos;
}
