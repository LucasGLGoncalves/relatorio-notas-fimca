# 📊 Relatório Interativo de Notas - FIMCA

Aplicação web para leitura e visualização interativa de relatórios de notas em `.xlsx`, com agrupamento por disciplinas, fases, alunos e entregas.

Desenvolvido para facilitar o acompanhamento do desempenho dos alunos por professores da FIMCA e outras instituições.

---

## 🔍 Funcionalidades

- ✅ Importar arquivos Excel de relatórios de notas
- 📋 Exibir disciplinas em cards com número de alunos
- 📊 Visualizar cada aluno com nota total por disciplina
- 🧾 Modal com detalhes de entregas organizadas por fase
- 🔴 Destaque automático para alunos reprovados
- 🔁 Alternância entre visualização por disciplina ou todas
- 📥 Exportação de relatório com notas totais (Excel)

---

## 🧑‍🏫 Como Usar (Professores)

1. **Acesse a aplicação online** (ex: via GitHub Pages):
![Relatório de Notas por Disciplina](https://lucasglgoncalves.github.io/relatorio-notas-fimca/)

2. **Clique em “Importar Relatório”**  
Envie um arquivo `.xlsx` no formato padrão exportado da FIMCA (com colunas como `nome_completo`, `nome_disciplina`, `fase`, `entrega`, `tipo`, `nota`, etc.).

3. **Visualize os dados:**
- Cada disciplina aparece como um **card** com o número de alunos.
- Clique em um card para ver a **tabela de alunos** com **nota total** e **situação (Aprovado/Reprovado)**.
- Clique no nome do aluno para abrir a **modal com detalhes por fase e entrega**.

4. **Ver todas as disciplinas juntas:**  
Use o botão **“Ver Todas as Disciplinas”** no topo.

5. **Exportar com totais:**  
Clique em **“Exportar com Total”** para baixar um novo arquivo `.xlsx` com:
- Nome do aluno
- Disciplina
- Nota total
- Situação

---

## 📁 Estrutura

```bash
.
├── index.html
├── js/
│   └── script.js
├── README.md
└── .github/
 └── workflows/
     └── pages.yml

---

## 🌐 Deploy com GitHub Pages

Este projeto é configurado para **deploy automático** via **GitHub Actions**.

**Como configurar:**

1. Vá em `Settings → Pages` no repositório
2. Em **Build and deployment**, selecione:
   - **Source**: `GitHub Actions`
3. Salve e aguarde o deploy automático após cada `push` na branch `main`

---

## 💼 Portfólio do Desenvolvedor

Este projeto foi desenvolvido como uma solução prática para gestão acadêmica e também como vitrine de:

- 📊 Organização de dados em tempo real
- 🧑‍💻 UX simplificada para uso por não técnicos
- 📁 Manipulação de arquivos `.xlsx` diretamente no navegador
- 💡 Aplicação com **JavaScript** + **Tailwind CSS**
- 🚀 Deploy contínuo via **GitHub Actions** + **Pages**

---

## 🛠️ Tecnologias

- HTML5
- Tailwind CSS
- JavaScript
- [SheetJS (xlsx.js)](https://sheetjs.com/)
- GitHub Pages
- GitHub Actions

---

## 🧩 Melhorias Futuras

- 🔍 Filtro por fase ou curso
- 🧾 Ícones por tipo de entrega (Quiz, Arquivo, etc.)
- ✅ Filtro por situação (Aprovado/Reprovado)
- 🔐 Login com conta Google (uso privado por instituição)
