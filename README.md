# 📊 Relatório Interativo de Notas - FIMCA

Aplicação web para leitura, visualização interativa e exportação de relatórios de notas em `.xlsx` e `pdf`, com agrupamento por disciplinas, fases, alunos e entregas.

Desenvolvido para facilitar o acompanhamento do desempenho dos alunos por professores da FIMCA e outras instituições de ensino.

---

## 🔍 Funcionalidades

✅ Importar arquivos Excel de relatórios em dois formatos:
- **Notas**: notas de 0 a 10, média 7.
- **Porcentagem de participação**: participação de 0% a 100%, média 70%.

📋 Exibir disciplinas em cards com número total de alunos  
📊 Visualizar cada aluno com **nota final** ou **participação (%)** e situação (Aprovado/Reprovado)  
🧾 Modal com detalhes de entregas organizadas por fase (Fase 1, 2, 3 e Entrega Final)  
🔴 Destaque automático para alunos reprovados  
🔁 Alternância entre visualização por disciplina ou todas as disciplinas  
📥 Exportar com totais em **Excel (.xlsx)**  
📄 Exportar relatório final formatado em **PDF** com visual profissional  

---

## 🧑‍🏫 Como Usar (Professores)

### Acesse a aplicação:
**[Relatório de Notas por Disciplina](https://lucasglgoncalves.github.io/relatorio-notas-fimca/)**

### Etapas:

1. Clique em **“Importar Relatório - Notas”** ou **“Importar Relatório - Porcentagem”**
2. Envie um arquivo `.xlsx` no formato gerado pelo portal do professor

### Após o envio:

- Cada disciplina aparecerá como um **card**
- Clique no card para ver a **tabela com os alunos e notas totais**
- Clique no nome do aluno para ver a **modal com as entregas por fase**

### Ações adicionais:

🔄 **Ver Todas as Disciplinas**  
📊 **Exportar com Total (.xlsx)**  
📄 **Exportar PDF formatado (por disciplina)**

---

## 📁 Estrutura do Projeto

```

.
├── index.html
├── js/
│   └── script.js
├── README.md
└── .github/
└── workflows/
└── pages.yml

```

---

## 🌐 Deploy com GitHub Pages

Este projeto é configurado para deploy automático via GitHub Actions.

**Como ativar:**
- Vá em `Settings → Pages` no repositório
- Em **Build and deployment**, selecione:
  - `Source`: GitHub Actions
- Salve e aguarde o deploy automático após cada `push` na branch `main`

---

## 💼 Portfólio do Desenvolvedor

Este projeto foi desenvolvido como uma solução real aplicada ao ambiente acadêmico, e também como um exemplo técnico de:

📊 Organização de dados em tempo real com JavaScript  
🧑‍💻 UX acessível para uso por professores sem conhecimento técnico  
📁 Manipulação de arquivos `.xlsx` diretamente no navegador  
🖨️ Geração de relatórios PDF com formatação elegante  
💡 Aplicação moderna com JavaScript + Tailwind CSS  
🚀 Deploy contínuo com GitHub Actions + Pages  

---

## 🛠️ Tecnologias Utilizadas

- HTML5  
- Tailwind CSS  
- JavaScript  
- SheetJS (`xlsx.js`)  
- jsPDF (`jspdf.umd.min.js`)  
- GitHub Pages  
- GitHub Actions  

---

## 🧩 Melhorias Futuras

🔍 Filtro por fase ou curso  
🧾 Ícones por tipo de entrega (Quiz, Arquivo, Fórum, etc.)  
✅ Filtro por situação (Aprovado/Reprovado)  
🔐 Login com conta Google para uso institucional privado  

---

🎓 **Desenvolvido para professores. Inspirado pela simplicidade. Refinado para resultados.**
