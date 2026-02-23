const supabase = window.supabase.createClient(
  "SUA_URL_AQUI",
  "SUA_ANON_KEY_AQUI"
);

const tabela = document.getElementById("tabelaChamados");

async function iniciar() {

  // 1️⃣ Verifica login
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData.user) {
    window.location.href = "login.html";
    return;
  }

  const user = userData.user;

  // 2️⃣ Verifica se é admin
  const { data: roleData, error: roleError } = await supabase
    .from("usuarios")
    .select("role")
    .eq("id", user.id)
    .single();

  if (roleError || !roleData || roleData.role !== "admin") {
    alert("Acesso restrito ao administrador.");
    window.location.href = "cliente.html";
    return;
  }

  // 3️⃣ Se passou aqui, é admin
  carregarChamados();
}

async function carregarChamados() {

  const { data, error } = await supabase
    .from("chamados")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    console.log(error);
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
      <td>${chamado.titulo}</td>
      <td>${chamado.status}</td>
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

iniciar();
