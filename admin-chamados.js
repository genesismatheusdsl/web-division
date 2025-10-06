// Lista de chamados simulada
let chamados = [
  { numero: 1234, cliente: "João", empresa: "Empresa A", prioridade: "Alta", status: "Aberto", descricao: "Problema no sistema", data: new Date() },
  { numero: 5678, cliente: "Maria", empresa: "Empresa B", prioridade: "Média", status: "Em andamento", descricao: "Erro ao acessar", data: new Date() },
  { numero: 9101, cliente: "Carlos", empresa: "Empresa C", prioridade: "Baixa", status: "Resolvido", descricao: "Dúvida no cadastro", data: new Date() }
];

const tabelaChamados = document.querySelector("#tabela-chamados tbody");

function atualizarTabela() {
  const busca = document.getElementById("busca-chamado").value.toLowerCase();
  tabelaChamados.innerHTML = "";

  chamados.forEach(c => {
    if(busca && !(
      c.numero.toString().includes(busca) ||
      c.cliente.toLowerCase().includes(busca) ||
      c.empresa.toLowerCase().includes(busca) ||
      c.descricao.toLowerCase().includes(busca)
    )) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.numero}</td>
      <td>${c.cliente}</td>
      <td>${c.empresa}</td>
      <td>${c.prioridade}</td>
      <td class="status-${c.status.replace(" ", "")}">${c.status}</td>
      <td>${c.descricao}</td>
      <td>${c.data.toLocaleString()}</td>
    `;
    tabelaChamados.appendChild(tr);
  });
}

// Busca rápida
document.getElementById("busca-chamado").addEventListener("input", atualizarTabela);

// Filtros
document.querySelectorAll(".btn-filtro").forEach(btn => {
  btn.addEventListener("click", () => {
    const filtro = btn.getAttribute("data-filtro");
    if(filtro === "todos") atualizarTabela();
    else {
      tabelaChamados.innerHTML = "";
      chamados.filter(c => c.status === filtro).forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.numero}</td>
          <td>${c.cliente}</td>
          <td>${c.empresa}</td>
          <td>${c.prioridade}</td>
          <td class="status-${c.status.replace(" ", "")}">${c.status}</td>
          <td>${c.descricao}</td>
          <td>${c.data.toLocaleString()}</td>
        `;
        tabelaChamados.appendChild(tr);
      });
    }
  });
});

// Inicializa a tabela
atualizarTabela();
