// ===== CRIAR CLIENT SUPABASE (nome diferente para evitar conflito) =====
const supabaseClient = window.supabase.createClient(
  "SUA_URL_AQUI",
  "SUA_ANON_KEY_AQUI"
);

const tabela = document.getElementById("tabelaChamados");

// ===== INICIAR SISTEMA =====
async function iniciar() {

  // 1️⃣ Verifica se está logado
  const { data: userData, error } = await supabaseClient.auth.getUser();

  console.log("Usuário logado:", userData);

  if (error || !userData || !userData.user) {
    window.location.href = "login.html";
    return;
  }

  const user = userData.user;

  // 2️⃣ Verifica se é admin
  const { data: roleData, error: roleError } = await supabaseClient
    .from("usuarios")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("Role encontrada:", roleData);

  if (roleError || !roleData || roleData.role !== "admin") {
    alert("Acesso restrito ao administrador.");
    window.location.href = "cliente.html";
    return;
  }

  // 3️⃣ Se for admin, carrega chamados
  carregarChamados();
}

// ===== CARREGAR CHAMADOS =====
async function carregarChamados() {

  const { data, error } = await supabaseClient
    .from("chamados")
    .select("*")
    .order("created_at", { ascending: false }); // 🔥 AJUSTADO

  console.log("Erro chamados:", error);
  console.log("Dados chamados:", data);

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
      <td>${chamado.descricao}</td> <!-- 🔥 AJUSTADO -->
      <td>${chamado.status}</td>
      <td>-</td>
      <td>${new Date(chamado.created_at).toLocaleDateString()}</td> <!-- 🔥 AJUSTADO -->
    `;

    tabela.appendChild(tr);
  });

  document.getElementById("totalChamados").textContent = total;
  document.getElementById("abertos").textContent = abertos;
  document.getElementById("andamento").textContent = andamento;
  document.getElementById("resolvidos").textContent = resolvidos;
}

iniciar();
