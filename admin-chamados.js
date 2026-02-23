// ===== CRIAR CLIENT SUPABASE =====
const supabaseClient = window.supabase.createClient(
  "https://webdivision23-boop.supabase.co",
  "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk"
);

const tabela = document.getElementById("tabelaChamados");

// ===== INICIAR SISTEMA =====
async function iniciar() {

  const { data: userData, error } = await supabaseClient.auth.getUser();

  if (error || !userData || !userData.user) {
    window.location.href = "login.html";
    return;
  }

  const user = userData.user;

  const { data: roleData, error: roleError } = await supabaseClient
    .from("usuarios")
    .select("role")
    .eq("id", user.id)
    .single();

  if (roleError || !roleData || roleData.role !== "admin") {
    alert("Acesso restrito ao administrador.");
    window.location.href = "cliente.html";
    return;
  }

  carregarChamados();
}

// ===== CARREGAR CHAMADOS =====
async function carregarChamados() {

  const { data, error } = await supabaseClient
    .from("chamados")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Erro ao buscar chamados:", error);
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
      <td>${chamado.descricao}</td>
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

iniciar();
