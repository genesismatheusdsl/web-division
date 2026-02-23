document.addEventListener("DOMContentLoaded", async () => {

  if (window.lucide) {
    lucide.createIcons();
  }

  const client = window.supabase.createClient(
    "https://hixywpfmakojtiwhufrd.supabase.co",
    "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk"
  );

  // 🔐 Verifica sessão
  const { data: { session }, error } = await client.auth.getSession();

  if (error || !session) {
    window.location.href = "login.html";
    return;
  }

  const user = session.user;

  // 🔎 Verifica se é admin (admin não deve ficar no cliente)
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
  document.querySelector(".logout").addEventListener("click", async () => {
    await client.auth.signOut();
    window.location.href = "login.html";
  });

  const modal = document.getElementById("modalChamado");
  const btnNovo = document.getElementById("btnNovoChamado");

  btnNovo.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  document.getElementById("salvarChamado").addEventListener("click", async () => {

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
          prioridade,
          status: "aberto"
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

  async function carregarChamados(clienteId) {

    const { data, error } = await client
      .from("chamados")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("created_at", { ascending: false }); // ⚠ padronizado

    if (error) {
      console.log(error);
      return;
    }

    const tabela = document.getElementById("tabelaChamados");
    tabela.innerHTML = "";

    document.getElementById("chamadosCount").textContent = data.length;

    data.forEach(chamado => {

      const row = `
        <tr>
          <td>${chamado.id.substring(0,8)}</td>
          <td>${chamado.titulo}</td>
          <td><span class="status ${chamado.status}">${chamado.status}</span></td>
          <td>${chamado.created_at ? new Date(chamado.created_at).toLocaleDateString() : "-"}</td>
        </tr>
      `;

      tabela.innerHTML += row;
    });
  }

  carregarChamados(user.id);

});
