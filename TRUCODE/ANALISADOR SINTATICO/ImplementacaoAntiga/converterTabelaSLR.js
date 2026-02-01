import XLSX from "xlsx";
import fs from "fs";

// Caminho do seu arquivo
const workbook = XLSX.readFile("../slr_table.csv.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Converte para JSON genérico
const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// A primeira linha tem os cabeçalhos (tokens e não-terminais)
const cabecalhos = json[0].slice(1); // ignora a coluna "estado"
const tabela = {};

// Percorre as linhas e cria o objeto
for (let i = 1; i < json.length; i++) {
  const linha = json[i];
  const estado = linha[0];
  if (estado === undefined || estado === "") continue;

  const entradas = {};
  for (let j = 1; j < linha.length; j++) {
    const valor = linha[j];
    if (valor && valor.toString().trim() !== "") {
      entradas[cabecalhos[j - 1]] = valor.toString().trim();
    }
  }

  tabela[estado] = entradas;
}

// Gera código JS exportável
const conteudo = `// Gerado automaticamente
export const tabelaSLR = ${JSON.stringify(tabela, null, 2)};
`;

fs.writeFileSync("./TabelaSLR.js", conteudo);
console.log("✅ Arquivo TabelaSLR.js gerado com sucesso!");
