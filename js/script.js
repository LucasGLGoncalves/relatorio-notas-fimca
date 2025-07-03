
let globalData = {};
let exportData = [];
let isPorcentagem = false;

document.getElementById('fileInputEAD').addEventListener('change', handleFileEAD);
document.getElementById('fileInputPresencial').addEventListener('change', handleFilePresencial);
document.getElementById('verTodasBtn').addEventListener('click', () => renderTabela(globalData));
document.getElementById('exportarBtn').addEventListener('click', exportarComTotal);
document.getElementById('exportarPdfBtn').addEventListener('click', exportarParaPDF);
document.getElementById('closeModal').onclick = () => {
  document.getElementById('modal').classList.add('hidden');
};

function handleFileEAD(e) {
  processFile(e, prepararDadosEAD);
}

function handleFilePresencial(e) {
  processFile(e, prepararDadosPresencial);
}

function processFile(e, preparador) {
  isPorcentagem = preparador.name === 'prepararDadosPresencial';
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);
    globalData = preparador(json);
    renderDisciplinas(globalData);
    renderTabela(globalData);
    document.getElementById('verTodasBtn').classList.remove('hidden');
    document.getElementById('exportarBtn').classList.remove('hidden');
    document.getElementById('exportarPdfBtn').classList.remove('hidden');
    document.getElementById('filtroAluno').addEventListener('input', () => renderTabela(globalData));
  };
  reader.readAsArrayBuffer(file);
}

function prepararDadosEAD(data) {
  const disciplinaMap = {};
  exportData = [];

  data.forEach(linha => {
    const disciplina = linha["nome_disciplina"];
    const aluno = linha["nome_completo"];
    const entrega = {
      entrega: linha["entrega"],
      tipo: linha["tipo"],
      nota: tratarNota(linha["nota"]),
      fase: linha["fase"],
    };
    if (!disciplinaMap[disciplina]) disciplinaMap[disciplina] = {};
    if (!disciplinaMap[disciplina][aluno]) disciplinaMap[disciplina][aluno] = [];
    disciplinaMap[disciplina][aluno].push(entrega);
  });

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

function prepararDadosPresencial(data) {
  const disciplinaMap = {};
  exportData = [];

  data.forEach(linha => {
    const disciplina = linha["projeto_turma"];
    const aluno = linha["nome"];
    const entrega = {
      entrega: linha["nome_projeto"] || "Projeto",
      tipo: "Atividade",
      nota: tratarNotaPresencial(linha["percentual_atividades"]),
      fase: linha["fase"],
    };
    if (!disciplinaMap[disciplina]) disciplinaMap[disciplina] = {};
    if (!disciplinaMap[disciplina][aluno]) disciplinaMap[disciplina][aluno] = [];
    disciplinaMap[disciplina][aluno].push(entrega);
  });

  Object.entries(disciplinaMap).forEach(([disciplina, alunos]) => {
    Object.entries(alunos).forEach(([aluno, entregas]) => {
      const fasesNormais = ['FASE 1', 'FASE 2', 'FASE 3', 'ENTREGA FINAL'];
      const notasFases = fasesNormais.map(faseRef => {
        return entregas
          .filter(ent => normalizarFase(ent.fase) === faseRef)
          .reduce((acc, cur) => acc + cur.nota, 0);
      });

      const media = notasFases.reduce((a, b) => a + b, 0) / 4;
      exportData.push({
        aluno,
        disciplina,
        "Participação (%)": media.toFixed(1),
        situacao: media >= 70 ? 'Aprovado' : 'Reprovado'
      });
    });
  });

  return disciplinaMap;
}

function tratarNota(valor) {
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string') {
    const limpa = valor.replace(',', '.').replace(/[^\d.]/g, '').trim();
    const num = parseFloat(limpa);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function tratarNotaPresencial(valor) {
  return isNaN(parseFloat(valor)) ? 0 : parseFloat(valor);
}

function normalizarFase(fase) {
  if (!fase) return 'OUTROS';
  return fase.toString().replace(/[ -⁯ ]/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
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
  const filtro = document.getElementById('filtroAluno')?.value?.toLowerCase() || '';

  Object.entries(data).forEach(([disciplina, alunos]) => {
    const section = document.createElement('div');
    section.innerHTML = `<h2 class="text-xl font-bold mb-4">${disciplina}</h2>`;

    const table = document.createElement('table');
    table.className = "min-w-full bg-white shadow rounded";
    table.innerHTML = `
      <thead>
        <tr class="bg-gray-200">
          <th class="text-left p-2">Aluno</th>
          <th class="text-left p-2">${isPorcentagem ? 'Participação (%)' : 'Nota Total'}</th>
          <th class="text-left p-2">Situação</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    Object.entries(alunos).forEach(([aluno, entregas]) => {
      if (!aluno.toLowerCase().includes(filtro)) return;
      const notas = entregas.map(e => e.nota);
      const notaTotal = isPorcentagem ? notas.reduce((a, b) => a + b, 0) / 4 : notas.reduce((a, b) => a + b, 0);
      const situacao = isPorcentagem ? (notaTotal >= 70 ? 'Aprovado' : 'Reprovado') : (notaTotal >= 7 ? 'Aprovado' : 'Reprovado');

      const tr = document.createElement('tr');
      tr.className = `hover:bg-gray-100 cursor-pointer ${situacao === 'Reprovado' ? 'bg-red-100' : ''}`;
      tr.innerHTML = `
        <td class="p-2 underline text-blue-600">${aluno}</td>
        <td class="p-2">${isPorcentagem ? notaTotal.toFixed(1) + "%" : notaTotal.toFixed(2)}</td>
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
  const fases = {};

  entregas.forEach(ent => {
    const fase = normalizarFase(ent.fase);
    if (!fases[fase]) fases[fase] = [];
    fases[fase].push(ent);
  });

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
        itemDiv.innerHTML = `<div class="font-semibold text-sm">entrega: ${ent.tipo || '(Sem tipo)'}. | nota: ${ent.nota}</div>
                             <div class="text-sm text-gray-700">${ent.entrega || '(Sem descrição)'}</div>`;
        content.appendChild(itemDiv);
      });
    }
  });

  document.getElementById('modal').classList.remove('hidden');
}

function exportarComTotal() {
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Notas Totais");
  XLSX.writeFile(wb, "Relatorio_Com_Total.xlsx");
}

function exportarParaPDF() {
  const relatorioDiv = document.getElementById('relatorio');
  const disciplinas = relatorioDiv.querySelectorAll('div');

  const doc = new jspdf.jsPDF();
  let pageOffset = 20;

  disciplinas.forEach((section, index) => {
    const tituloOriginal = section.querySelector('h2')?.innerText || 'Disciplina';
    const titulo = tituloOriginal.trim();

    const linhas = section.querySelectorAll('table tbody tr');

    // Título centralizado (preserva capitalização original)
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(titulo, 105, 15, { align: 'center' });

    // Cabeçalho da tabela
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setFillColor(220, 220, 220); // cinza claro
    doc.rect(10, pageOffset, 190, 8, 'F');

    const colunaNota = isPorcentagem ? 'participação (%)' : 'nota final';
    doc.text('aluno', 12, pageOffset + 6);
    doc.text(colunaNota, 80, pageOffset + 6);
    doc.text('situação', 160, pageOffset + 6);

    pageOffset += 10;

    linhas.forEach(row => {
      const cols = row.querySelectorAll('td');
      const nome = (cols[0]?.innerText || '').toLowerCase();
      const nota = (cols[1]?.innerText || '').toLowerCase();
      const situacao = (cols[2]?.innerText || '').toLowerCase();

      doc.text(nome, 12, pageOffset);
      doc.text(nota, 80, pageOffset);
      doc.text(situacao, 160, pageOffset);

      pageOffset += 8;
      if (pageOffset > 270) {
        doc.addPage();
        pageOffset = 20;
      }
    });

    if (index < disciplinas.length - 1) {
      doc.addPage();
      pageOffset = 20;
    }
  });

  const nomeArquivo = isPorcentagem ? "relatorio_participacao.pdf" : "relatorio_notas.pdf";
  doc.save(nomeArquivo);
}
