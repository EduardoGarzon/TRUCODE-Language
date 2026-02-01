import { getTokens } from "./Analisador-Lexico.js";
import { tabelaSLR } from "./TabelaSLR.js";

const producoes = {
    0: ["S'", ["lista_comandos"]],
    1: ["lista_comandos", ["comando", "lista_comandos"]],
    2: ["lista_comandos", ["comando"]],
    3: ["comando", ["declaracao"]],
    4: ["comando", ["atribuicao"]],
    5: ["comando", ["entrada"]],
    6: ["comando", ["saida"]],
    7: ["comando", ["condicional"]],
    8: ["comando", ["laco_repeticao"]],
    9: ["comando", ["break"]],
    10: ["declaracao", ["ID", "[", "tipo", "]", "#"]],
    11: ["atribuicao", ["ID", "[", "tipo", "]", "VALE", "valor", "#"]],
    12: ["entrada", ["RECEBE", "[", "ID", "]", "#"]],
    13: ["saida", ["MOSTRA", "[", "lista_valores", "]", "#"]],
    14: ["lista_valores", ["valor_saida"]],
    15: ["lista_valores", ["valor_saida", ",", "lista_valores"]],
    16: ["valor_saida", ["STRING"]],
    17: ["valor_saida", ["ID"]],
    18: ["condicional", ["TRUCO", "(", "expr", ")", "{", "lista_comandos", "}", "opcional_else"]],
    19: ["opcional_else", ["CORRE", "{", "lista_comandos", "}"]],
    20: ["opcional_else", []],
    21: ["laco_repeticao", ["laco_while"]],
    22: ["laco_repeticao", ["laco_for"]],
    23: ["laco_while", ["SEGUE", "(", "expr", ")", "{", "lista_comandos", "}"]],
    24: ["laco_for", ["DISTRIBUI", "ID", "DE", "valor_for", "ATE", "expr", "PASSO", "valor_for", "{", "lista_comandos", "}"]],
    25: ["valor_for", ["NUM_INT"]],
    26: ["valor_for", ["NUM_REAL"]],
    27: ["valor_for", ["ID"]],
    28: ["break", ["CORTA", "#"]],
    29: ["valor", ["NUM_INT"]],
    30: ["valor", ["NUM_REAL"]],
    31: ["valor", ["STRING"]],
    32: ["valor", ["BOOLEAN"]],
    33: ["valor", ["ID"]],
    34: ["tipo", ["OURO"]],
    35: ["tipo", ["ESPADA"]],
    36: ["tipo", ["COPA"]],
    37: ["tipo", ["PAUS"]],
    38: ["expr", ["term", "expr_tail"]],
    39: ["expr_tail", ["binop", "term", "expr_tail"]],
    40: ["expr_tail", []],
    41: ["binop", ["??"]],
    42: ["binop", ["##"]],
    43: ["binop", ["RECUA"]],
    44: ["binop", ["MATA"]],
    45: ["binop", ["BATE"]],
    46: ["binop", ["SEGURA"]],
    47: ["binop", ["CANTA"]],
    48: ["binop", ["BLEFA"]],
    49: ["binop", ["KING"]],
    50: ["binop", ["JACK"]],
    51: ["binop", ["AS"]],
    52: ["binop", ["QUEEN"]],
    53: ["binop", ["RESTO"]],
    54: ["term", ["XX", "term"]],
    55: ["term", ["(", "expr", ")"]],
    56: ["term", ["valor"]],
};

// Função principal do analisador sintático
function executarAnalisadorSintatico(tokens) {
    const pilha = [];
    pilha.push(0); // Estado inicial
    let ip = 0;    // Ponteiro de tokens

    while (true) {
        const estadoTopo = pilha[pilha.length - 1];
        const tokenAtual = ip < tokens.length ? tokens[ip].type : "$";

        const acao = tabelaSLR[estadoTopo][tokenAtual];

        if (!acao) {
            throw new Error(`Erro sintático no token "${tokenAtual}" na posição ${ip}`);
        }

        if (acao.startsWith("E")) { // Shift
            const novoEstado = parseInt(acao.substring(1));
            pilha.push(tokenAtual); // Empilha símbolo
            pilha.push(novoEstado); // Empilha estado
            ip++; // Avança token
        }
        else if (acao.startsWith("R")) { // Reduce
            const regra = parseInt(acao.substring(1));
            const [A, beta] = producoes[regra];

            // Desempilha 2 * |β| (símbolos e estados)
            pilha.splice(pilha.length - 2 * beta.length, 2 * beta.length);

            // Estado no topo após desempilhar
            const estadoTopoAtual = pilha[pilha.length - 1];

            pilha.push(A); // Empilha LHS
            const desvio = tabelaSLR[estadoTopoAtual][A];
            pilha.push(parseInt(desvio));
        }
        else if (acao === "ACEITA") {
            return "Aceita";
        }
        else {
            throw new Error("Erro desconhecido na tabela SLR");
        }
    }
}

// Botão do frontend
document.getElementById("button-analisador-sintatico").addEventListener('click', () => {
    const codigo_fonte = document.getElementById("console").value;

    if (!codigo_fonte.trim()) {
        alert("Nenhum código-fonte inserido!");
        return;
    }

    // Quebra em linhas e remove linhas vazias
    const linhas = codigo_fonte.split("\n").filter(linha => linha.trim() !== "");

    // Obtenha todos os tokens concatenados
    let tokens = [];
    for (const linha of linhas) {
        const tokensLinha = getTokens(linha);
        tokens = tokens.concat(tokensLinha);
    }

    // Adiciona token de fim de entrada
    tokens.push({type: "$", lexema: "$"});

    console.table(tokens);

    try {
        executarAnalisadorSintatico(tokens);
        alert("✅ Análise sintática concluída com sucesso!");
    } catch (e) {
        alert("❌ Erro sintático: " + e.message);
    }
});
