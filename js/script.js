let globalData = {};
let exportData = [];

document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('verTodasBtn').addEventListener('click', () => renderTabela(globalData));
document.getElementById('exportarBtn').addEventListener('click', exportarComTotal);

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);
    globalData = prepararDados(json);
    renderDisciplinas(globalData);
    renderTabela(globalData); // default: mostrar tudo
    document.getElementById('verTodasBtn').classList.remove('hidden');
    document.getElementById('exportarBtn').classList.remove('hidden');
  };
  reader.readAsArrayBuffer(file);
}

function prepararDados(data) {
  const disciplinaMap = {};
  exportData = [];

  data.forEach(linha => {
    const disciplina = linha["nome_disciplina"];
    const aluno = linha["nome_completo"];
    const entrega = {
        entrega: linha["entrega"],
        tipo: linha["tipo"],
        nota: tratarNota(linha["nota"]),
        fase: linha["fase"], // <- ISSO FALTAVA
    };


    if (!disciplinaMap[disciplina]) disciplinaMap[disciplina] = {};
    if (!disciplinaMap[disciplina][aluno]) disciplinaMap[disciplina][aluno] = [];
    disciplinaMap[disciplina][aluno].push(entrega);
  });

  // gerar dados para exportação
  Object.entries(disciplinaMap).forEach(([disciplina, alunos]) => {
    Object.entries(alunos).forEach(([aluno, entregas]) => {
      const total = entregas.reduce((acc, cur) => acc + cur.nota, 0);
      exportData.push({
        aluno,
        disciplina,
        nota_total: total,
        situacao: total >= 7 ? 'Aprovado' : 'Reprovado'
      });
    });
  });

  return disciplinaMap;
}

function renderDisciplinas(data) {
  const container = document.getElementById('disciplinas-container');
  container.innerHTML = '';

  Object.entries(data).forEach(([disciplina, alunos]) => {
    const card = document.createElement('div');
    card.className = "bg-white shadow p-4 rounded cursor-pointer hover:bg-blue-100";
    card.innerHTML = `<h2 class="font-bold text-lg">${disciplina}</h2>
                      <p>${Object.keys(alunos).length} aluno(s)</p>`;
    card.onclick = () => renderTabela({ [disciplina]: alunos });
    container.appendChild(card);
  });
}

function renderTabela(data) {
  const relatorioDiv = document.getElementById('relatorio');
  relatorioDiv.innerHTML = "";

  Object.entries(data).forEach(([disciplina, alunos]) => {
    const section = document.createElement('div');

    section.innerHTML = `<h2 class="text-xl font-bold mb-4">${disciplina}</h2>`;

    const table = document.createElement('table');
    table.className = "min-w-full bg-white shadow rounded";
    table.innerHTML = `
      <thead>
        <tr class="bg-gray-200">
          <th class="text-left p-2">Aluno</th>
          <th class="text-left p-2">Nota Total</th>
          <th class="text-left p-2">Situação</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    const alunosOrdenados = Object.entries(alunos).sort(([a], [b]) => a.localeCompare(b));

    alunosOrdenados.forEach(([aluno, entregas]) => {
      const notaTotal = entregas.reduce((acc, cur) => acc + cur.nota, 0);
      const situacao = notaTotal >= 7 ? 'Aprovado' : 'Reprovado';

      const tr = document.createElement('tr');
      tr.className = `hover:bg-gray-100 cursor-pointer ${situacao === 'Reprovado' ? 'bg-red-100' : ''}`;
      tr.innerHTML = `
        <td class="p-2 underline text-blue-600">${aluno}</td>
        <td class="p-2">${notaTotal.toFixed(2)}</td>
        <td class="p-2">${situacao}</td>
      `;

      tr.addEventListener('click', () => mostrarModal(aluno, disciplina, entregas));
      tbody.appendChild(tr);
    });

    section.appendChild(table);
    relatorioDiv.appendChild(section);
  });
}

function mostrarModal(aluno, disciplina, entregas) {
  document.getElementById('modalTitle').textContent = `${aluno} – ${disciplina}`;
  const content = document.getElementById('modalContent');
  content.innerHTML = '';

  // Agrupar entregas por fase
  const fases = {};
  entregas.forEach(ent => {
    const fase = normalizarFase(ent.fase);
    if (!fases[fase]) fases[fase] = [];
    fases[fase].push(ent);
  });

  // Ordem personalizada das fases
  const ordemDesejada = ['FASE 1', 'FASE 2', 'FASE 3', 'ENTREGA FINAL', 'OUTROS'];

  ordemDesejada.forEach(fase => {
    if (fases[fase]) {
      const faseTitulo = document.createElement('h3');
      faseTitulo.className = "text-md font-bold mt-4 text-gray-800 uppercase";
      faseTitulo.textContent = fase;
      content.appendChild(faseTitulo);

      fases[fase].forEach(ent => {
        const itemDiv = document.createElement('div');
        itemDiv.className = "mb-4 ml-2";

        const tipo = document.createElement('div');
        tipo.className = "font-semibold text-sm";
        tipo.textContent = `entrega: ${ent.tipo || '(Sem tipo)'}.  |  nota: ${ent.nota}`;


        const descricao = document.createElement('div');
        descricao.className = "text-sm text-gray-700";
        descricao.textContent = ent.entrega || '(Sem descrição)';

        itemDiv.appendChild(tipo);
        itemDiv.appendChild(descricao);
        content.appendChild(itemDiv);
      });
    }
  });

  document.getElementById('modal').classList.remove('hidden');
}

function normalizarFase(fase) {
  if (!fase) return 'OUTROS';

  return fase
    .toString()
    .replace(/[\u2000-\u206F\u00A0]/g, ' ') // remove espaços invisíveis
    .replace(/\s+/g, ' ')                  // normaliza múltiplos espaços
    .trim()
    .toUpperCase();                        // padroniza para comparação
}

document.getElementById('closeModal').onclick = () => {
  document.getElementById('modal').classList.add('hidden');
};

function tratarNota(nota) {
  if (typeof nota === 'number') return nota;
  if (typeof nota === 'string') {
    const limpa = nota.replace(',', '.').replace(/[^\d.]/g, '').trim();
    const num = parseFloat(limpa);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function exportarComTotal() {
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Notas Totais");
  XLSX.writeFile(wb, "Relatorio_Com_Total.xlsx");
}
