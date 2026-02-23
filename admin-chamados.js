// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://webdivision23-boop.supabase.co";
const SUPABASE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const tabela = document.getElementById("tabelaChamados");

// ===== INICIAR SISTEMA =====
document.addEventListener("DOMContentLoaded", async () => {

  // 🔐 Verifica sessão corretamente
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
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

  if (roleError || !roleData || roleData.role !== "admin") {
    window.location.href = "cliente.html";
    return;
  }

  console.log("Admin autenticado ✅");

  carregarChamados();

  // 🚪 Logout
  document.getElementById("logout").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });

});


// ===== CARREGAR CHAMADOS =====
async function carregarChamados() {

  const { data, error } = await supabaseClient
    .from("chamados")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar chamados:", error);
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
      <td>${chamado.id.substring(0,8)}</td>
      <td>${chamado.descricao || "-"}</td>
      <td>${chamado.status}</td>
      <td>-</td>
      <td>${new Date(chamado.created_at).toLocaleDateString()}</td>
    `;

    tabela.appendChild(tr);
  });

  document.getElementById("totalChamados").textContent = total;
  document.getElementById("abertos").textContent = abertos;
  document.getElementById("andamento").textContent = andamento;
  document.getElementById("resolvidos").textContent = resolvidos;
}
