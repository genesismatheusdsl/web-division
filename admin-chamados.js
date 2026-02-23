// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://webdivision23-boop.supabase.co";
const SUPABASE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== INICIAR SISTEMA =====
document.addEventListener("DOMContentLoaded", async () => {

  console.log("Iniciando sistema admin...");

  const tabela = document.getElementById("tabelaChamados");

  if (!tabela) {
    console.error("Elemento tabelaChamados não encontrado no HTML.");
    return;
  }

  // 🔐 Verifica sessão
  const { data: { session }, error: sessionError } =
    await supabaseClient.auth.getSession();

  console.log("Session:", session);
  console.log("Session error:", sessionError);

  if (!session) {
    console.warn("Sem sessão ativa. Redirecionando...");
    window.location.href = "cliente.html";
    return;
  }

  const user = session.user;

  // 🔎 Verifica se é admin
  const { data: roleData, error: roleError } = await supabaseClient
    .from("usuarios")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("RoleData:", roleData);
  console.log("RoleError:", roleError);

  if (roleError || !roleData || roleData.role !== "admin") {
    console.warn("Usuário não é admin.");
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


// ===== CARREGAR CHAMADOS =====
async function carregarChamados(tabela) {

  console.log("Buscando chamados...");

  const { data, error } = await supabaseClient
    .from("chamados")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Chamados retornados:", data);
  console.log("Erro chamados:", error);

  if (error) {
    console.error("Erro ao buscar chamados:", error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.warn("Nenhum chamado encontrado.");
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
      <td>${chamado.id ? chamado.id.substring(0,8) : "-"}</td>
      <td>${chamado.descricao || chamado.titulo || "-"}</td>
      <td>${chamado.status || "-"}</td>
      <td>-</td>
      <td>${chamado.created_at ? new Date(chamado.created_at).toLocaleDateString() : "-"}</td>
    `;

    tabela.appendChild(tr);
  });

  document.getElementById("totalChamados").textContent = total;
  document.getElementById("abertos").textContent = abertos;
  document.getElementById("andamento").textContent = andamento;
  document.getElementById("resolvidos").textContent = resolvidos;

  console.log("Chamados carregados com sucesso ✅");
}
