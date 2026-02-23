document.addEventListener("DOMContentLoaded", async () => {

  console.log("Iniciando sistema admin...");

  const tabela = document.getElementById("tabelaChamados");
  if (!tabela) return;

  // 🔐 Verifica sessão
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "cliente.html";
    return;
  }

  const user = session.user;

  // 🔎 Verifica se é admin
  const { data: roleData } = await supabaseClient
    .from("usuarios")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!roleData || roleData.role !== "admin") {
    window.location.href = "cliente.html";
    return;
  }

  console.log("Admin autenticado ✅");

  carregarChamados(tabela);

  // 🚪 Logout
  document.getElementById("logout").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });

});


async function carregarChamados(tabela) {

  const { data, error } = await supabaseClient
    .from("chamados")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    tabela.innerHTML = `<tr><td colspan="5">Erro ao carregar</td></tr>`;
    return;
  }

  if (data.length === 0) {
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
}
