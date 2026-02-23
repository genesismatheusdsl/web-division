document.addEventListener("DOMContentLoaded", async () => {

  if (window.lucide) {
    lucide.createIcons();
  }

  // ✅ Usa o client global (NÃO cria outro)
  const client = window.supabaseClient;

  // 🔐 Verifica sessão
  const { data: { session }, error } = await client.auth.getSession();

  if (error || !session) {
    window.location.href = "login.html";
    return;
  }

  const user = session.user;

  // 🔎 Verifica se é admin
  const { data: roleData } = await client
    .from("usuarios")
    .select("role")
    .eq("id", user.id)
    .single();

  if (roleData?.role === "admin") {
    window.location.href = "admin-chamados.html";
    return;
  }

  document.getElementById("nomeCliente").textContent =
    user.email || "Cliente";

  // 🚪 Logout
  const logoutBtn = document.querySelector(".logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await client.auth.signOut();
      window.location.href = "login.html";
    });
  }

  const modal = document.getElementById("modalChamado");
  const btnNovo = document.getElementById("btnNovoChamado");

  if (btnNovo) {
    btnNovo.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }

  const salvarBtn = document.getElementById("salvarChamado");

  if (salvarBtn) {
    salvarBtn.addEventListener("click", async () => {

      const titulo = document.getElementById("tituloChamado").value;
      const descricao = document.getElementById("descricaoChamado").value;
      const prioridade = document.getElementById("prioridadeChamado").value;

      if (!titulo) {
        alert("Digite um título");
        return;
      }

      const { error } = await client
        .from("chamados")
        .insert([
          {
            cliente_id: user.id,
            titulo,
            descricao,
            prioridade
          }
        ]);

      if (error) {
        alert("Erro ao salvar chamado");
        console.log(error);
        return;
      }

      modal.style.display = "none";
      carregarChamados(user.id);
    });
  }

  async function carregarChamados(clienteId) {

    const { data, error } = await client
      .from("chamados")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("criado_em", { ascending: false }); // ✅ coluna correta

    if (error) {
      console.log(error);
      return;
    }

    const tabela = document.getElementById("tabelaChamados");
    if (!tabela) return;

    tabela.innerHTML = "";

    document.getElementById("chamadosCount").textContent = data.length;

    data.forEach(chamado => {

      const row = `
        <tr>
          <td>${chamado.id.substring(0,8)}</td>
          <td>${chamado.titulo}</td>
          <td>${chamado.prioridade || "-"}</td>
          <td>${chamado.criado_em ? new Date(chamado.criado_em).toLocaleDateString() : "-"}</td>
        </tr>
      `;

      tabela.innerHTML += row;
    });
  }

  carregarChamados(user.id);

});
