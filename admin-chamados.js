// ===== CONFIG SUPABASE =====
const supabaseUrl = "COLE_SUA_URL_AQUI";
const supabaseKey = "COLE_SUA_ANON_KEY_AQUI";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ===== ELEMENTOS =====
const tabela = document.querySelector("#tabela-chamados tbody");
const buscaInput = document.getElementById("busca-chamado");
let chamados = [];

// ===== CARREGAR CHAMADOS =====
async function carregarChamados() {
  const { data, error } = await supabase
    .from("chamados")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar chamados:", error);
    return;
  }

  chamados = data;
  renderizarChamados(chamados);
}

// ===== RENDERIZAR TABELA =====
function renderizarChamados(lista) {
  tabela.innerHTML = "";

  lista.forEach(chamado => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${chamado.id}</td>
      <td>${chamado.descricao}</td>
      <td class="status-${chamado.status.replace(" ", "")}">
        ${chamado.status}
      </td>
      <td>${new Date(chamado.created_at).toLocaleString()}</td>
    `;

    tabela.appendChild(tr);
  });
}

// ===== BUSCA =====
buscaInput.addEventListener("input", () => {
  const termo = buscaInput.value.toLowerCase();

  const filtrados = chamados.filter(c =>
    c.descricao.toLowerCase().includes(termo)
  );

  renderizarChamados(filtrados);
});

// ===== FILTROS =====
document.querySelectorAll(".btn-filtro").forEach(btn => {
  btn.addEventListener("click", () => {

    const filtro = btn.getAttribute("data-filtro");

    if (filtro === "todos") {
      renderizarChamados(chamados);
    } else {
      const filtrados = chamados.filter(c =>
        c.status.toLowerCase() === filtro
      );
      renderizarChamados(filtrados);
    }
  });
});

// ===== INICIAR =====
carregarChamados();
