const supabase = window.supabase.createClient(
  "SUA_URL_AQUI",
  "SUA_ANON_KEY_AQUI"
);

const tabela = document.getElementById("tabelaChamados");

async function carregarChamados() {

  const { data, error } = await supabase
    .from("chamados")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    console.log("Erro:", error);
    return;
  }

  console.log("Chamados encontrados:", data);

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
      <td>${chamado.titulo}</td>
      <td class="status-${chamado.status.replace(" ","")}">
        ${chamado.status}
      </td>
      <td>${chamado.prioridade || "-"}</td>
      <td>${new Date(chamado.criado_em).toLocaleDateString()}</td>
    `;

    tabela.appendChild(tr);
  });

  document.getElementById("totalChamados").textContent = total;
  document.getElementById("abertos").textContent = abertos;
  document.getElementById("andamento").textContent = andamento;
  document.getElementById("resolvidos").textContent = resolvidos;
}

carregarChamados();
