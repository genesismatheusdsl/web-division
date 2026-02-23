const SUPABASE_URL = "https://hixywpfmakojtiwhufrd.supabase.co";
const SUPABASE_KEY = "sb_publishable_BPWbQWIx8yXMhgoCWjyxfw_RB7P5dYk";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", async () => {

  if (window.lucide) {
    lucide.createIcons();
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    window.location.href = "login.html";
    return;
  }

  const user = data.user;

  document.getElementById("nomeCliente").textContent =
    user.email || "Cliente";

  // LOGOUT
  document.querySelector(".logout").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  });

  // ===== MODAL =====
  const modal = document.getElementById("modalChamado");
  const btnNovo = document.getElementById("btnNovoChamado");

  btnNovo.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // SALVAR CHAMADO
  document.getElementById("salvarChamado").addEventListener("click", async () => {

    const titulo = document.getElementById("tituloChamado").value;
    const descricao = document.getElementById("descricaoChamado").value;
    const prioridade = document.getElementById("prioridadeChamado").value;

    if (!titulo) {
      alert("Digite um título");
      return;
    }

    const { error } = await supabase
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

  // CARREGAR CHAMADOS
  async function carregarChamados(clienteId) {

    const { data, error } = await supabase
      .from("chamados")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("criado_em", { ascending: false });

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
          <td>${new Date(chamado.criado_em).toLocaleDateString()}</td>
        </tr>
      `;

      tabela.innerHTML += row;
    });
  }

  carregarChamados(user.id);

});
