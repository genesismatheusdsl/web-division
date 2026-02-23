// ================================
// WEB DIVISION - ADMIN CHAMADOS
// ================================

// 🔥 CONFIGURAÇÃO SUPABASE
const SUPABASE_URL = "https://hixywpfmakojtiwhufrd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

document.addEventListener("DOMContentLoaded", async () => {

  console.log("Iniciando sistema admin...");

  const tabela = document.getElementById("tabelaChamados");
  if (!tabela) return;

  // 🔐 Verifica sessão
  const { data: { session }, error } =
    await supabaseClient.auth.getSession();

  console.log("Sessão:", session);

  if (!session) {
    console.log("Sem sessão, redirecionando...");
    window.location.href = "login.html";
    return;
  }

  const user = session.user;

  // 🔎 Verifica se é admin
  const { data: roleData, error: roleError } =
    await supabaseClient
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
      await supabaseClient.auth.signOut();
      window.location.href = "index.html";
    });
  }

});

// ================================
// CARREGAR CHAMADOS
// ================================

async function carregarChamados(tabela) {

  const { data, error } = await supabaseClient
    .from("chamados")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Chamados:", data);

  if (error) {
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

    if (chamado.status === "aberto") abertos++;
    if (chamado.status === "em andamento") andamento++;
    if (chamado.status === "resolvido") resolvidos++;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${chamado.id?.substring(0,8) || "-"}</td>
      <td>${chamado.titulo || chamado.descricao || "-"}</td>
      <td>${chamado.status || "-"}</td>
      <td>${chamado.prioridade || "-"}</td>
      <td>${chamado.created_at ? new Date(chamado.created_at).toLocaleDateString() : "-"}</td>
    `;

    tabela.appendChild(tr);
  });

  document.getElementById("totalChamados").textContent = total;
  document.getElementById("abertos").textContent = abertos;
  document.getElementById("andamento").textContent = andamento;
  document.getElementById("resolvidos").textContent = resolvidos;
}
