// ARMAZENA COMO STRING O CÓDIGO-FONTE DA LINGUAGEM.
let codigo_fonte = "";

// BOTÃO PARA CARREGAR UM ARQUIVO DE CÓDIGO-FONTE DA LINGUAGEM.
// document.getElementById("input-carregar-codigo-fonte").addEventListener('change', (e) => {
//     const arquivo = e.target.files[0];

//     if (!arquivo) {
//         console.log("Falha ao carregar arquivo.");
//         return;
//     }

//     const leitor = new FileReader();

//     leitor.onload = function () {
//         const conteudo = leitor.result;

//         console.log("Conteúdo do Código-Fonte Carregado:");
//         console.log(conteudo);

//         executarAnalisadorLexicoAFD(conteudo, getTabelaSimbolos());

//         alert("ANÁLISE LÉXICA EXECUTADA.");
//     };

//     leitor.readAsText(arquivo);
// });

// BOTÃO QUE DISPARA O ANALISADOR LÉXICO.

document.getElementById("button-analisador-lexico").addEventListener('click', () => {
    // Recebe o código-fonte inserido na textarea do frontend.
    codigo_fonte = document.getElementById("console").value;

    if (codigo_fonte.length > 0) {
        // Executa a análise léxica e gera os tokens.
        executarAnalisadorLexicoAFD(codigo_fonte, getTabelaSimbolos());

        alert("ANÁLISE LÉXICA EXECUTADA.");
    } else {
        console.log("Nenhum código-fonte encontrado!");
    }
});

// FUNCAO RESPONSÁVEL POR RETORNAR A TABELA DE SIMBOLOS CONTENDO AS PALAVRAS-RESERVADAS.
function getTabelaSimbolos() {
    return [
        { type: "ID" },
        { type: "BOOLEAN" },
        { type: "RECEBE" },
        { type: "MOSTRA" },
        { type: "OURO" },
        { type: "ESPADA" },
        { type: "COPA" },
        { type: "PAUS" },
        { type: "TRUCO" },
        { type: "CORRE" },
        { type: "SEGUE" },
        { type: "DISTRIBUI" },
        { type: "DE" },
        { type: "ATE" },
        { type: "PASSO" },
        { type: "VALE" },
        { type: "CORTA" },
        { type: "KING" },
        { type: "JACK" },
        { type: "QUEEN" },
        { type: "AS" },
        { type: "RESTO" },
        { type: "BATE" },
        { type: "BLEFA" },
        { type: "MATA" },
        { type: "RECUA" },
        { type: "CANTA" },
        { type: "SEGURA" },
        { type: "##" },
        { type: "??" },
        { type: "XX" },
        { type: "(" },
        { type: ")" },
        { type: "[" },
        { type: "]" },
        { type: "{" },
        { type: "}" },
        { type: "#" },
        { type: "," }
    ]
}

// FUNCAO RESPONSÁVEL POR EXECUTAR A ANÁLISE LÉXICA.
function executarAnalisadorLexicoAFD(codigo_fonte, tabela_simbolos) {

    let index = 0;              // Index do caractere atual lido.
    let estado = 1;             // Estado atual do AFD.
    let caractere = '';
    let lexema = "";
    let flag_erro = false;      // Flag para sinalizar erros.
    let tokens = new Array();   // Array de tokens -> [{type, lexema}, {...}].

    // Percorre todo o codigo-fonte.
    while (index < codigo_fonte.length) {
        caractere = codigo_fonte[index];

        // Simula AFD.
        switch (estado) {
            case 1: // ESTADO 1.
                console.log("CARACTERE DE ENTRADA ESTADO 1: ", caractere);

                if (isLetter(caractere)) { // Verifica letras a-Z.
                    // ESTADO 1 -> ESTADO 2 (ID).
                    estado = 2;
                    lexema += caractere;
                    index++;
                } else if (isDigit(caractere)) { // Verifica digitios 0-9.
                    // ESTADO 1 -> ESTADO 4 (NUM_INT ou NUM_REAL).
                    estado = 4;
                    lexema += caractere;
                    index++;
                } else if (isAspas(caractere)) { // Verifica aspa ".      
                    // ESTADO 1 -> ESTADO 8 (STRING).
                    estado = 8;

                    if (lexema != caractere) {
                        lexema += caractere;
                    }

                    index++;
                } else if (isWhiteSpace(caractere)) { // Verifica whitespaces [\t\n\r ].
                    // ESTADO 1  -> ESTADO 14 (WHITESPACES).
                    // ESTADO 14 -> ESTADO 14 (WHITESPACES).
                    // ESTADO 14 -> ESTADO 15 (WHITESPACES).
                    lexema = "";
                    index++;
                } else if (isComentChar(caractere)) { // Verifica caractere de comentário @.
                    // ESTADO 1 -> ESTADO 11 (COMENTARIO).
                    lexema += caractere;
                    index++;
                    estado = 11;
                } else if (isCharOR(caractere)) { // Verifica caractere ?.
                    // ESTADO 1 -> ESTADO 16 (OR - ??).
                    lexema += caractere;
                    index++;
                    estado = 16;
                } else if (isDelimitadorFimDeLinha(caractere)) { // Verifica caractere #.
                    // ESTADO 1 -> ESTADO 18 (AND ## ou DELIMITADOR FIM DE LINHA).
                    estado = 18;
                    index++;
                    lexema = caractere;
                } else if (isDelimitador(caractere)) { // Verifica delimitadores.
                    // ESTADO 1 -> ESTADO 22 (DELIMITADORES).
                    index++;
                    estado = 22;
                    lexema = caractere;
                } else {
                    // ESTADO 1 -> ESTADO ERRO.
                    console.log("ESTADO DE ERRO ACIONADO.");
                    estado = "ERRO";
                }

                console.log("LEXEMA DE SAIDA ESTADO 1: ", lexema);
                break;
            case 2: // ESTADO 2 (ID).
                console.log("CARACTERE DE ENTRADA ESTADO 2: ", caractere);

                if (isAlphaNum(caractere)) {
                    // ESTADO 2 -> ESTADO 2 (ID).
                    lexema += caractere;
                    index++
                } else {
                    // ESTADO 2 -> ESTADO 3 (OUTRO).
                    console.log("CARACTERE DE ENTRADA ESTADO 3: ", caractere);

                    estado = 1;

                    tokens.push(obterToken(lexema, tabela_simbolos)); // Token ID.
                    console.log("TOKEN GERADO ESTADO 3: ", tokens[tokens.length - 1]);

                    // Não avanca o index, permanecendo no mesmo caractere lido.
                    // Recebe o ultimo caractere lido (retrocede o cabecote para a ultima posicao).
                    lexema = caractere;

                    console.log("LEXEMA DE SAIDA ESTADO 3: ", lexema);
                }

                console.log("LEXEMA DE SAIDA ESTADO 2: ", lexema);
                break;
            case 4: // ESTADO 4 (NUM_INT ou NUM_REAL).
                console.log("CARACTERE DE ENTRADA ESTADO 4: ", caractere);

                if (isDigit(caractere)) {
                    // ESTADO 4 -> ESTADO 4 (NUM_INT ou NUM_REAL).
                    lexema += caractere;
                    index++;
                } else if (isPoint(caractere)) {
                    // ESTADO 4 -> ESTADO 5 (NUM_REAL).
                    lexema += caractere;
                    index++;
                    estado = 5;
                }
                else {
                    // ESTADO 4 -> ESTADO 7 (OUTRO).
                    console.log("CARACTERE DE ENTRADA ESTADO 7: ", caractere);

                    estado = 1;

                    tokens.push(obterToken(lexema, tabela_simbolos)); // Token NUM_INT.
                    console.log("TOKEN GERADO ESTADO 7: ", tokens[tokens.length - 1]);

                    lexema = caractere;

                    console.log("LEXEMA DE SAIDA ESTADO 7: ", lexema);
                }

                console.log("LEXEMA DE SAIDA ESTADO 4: ", lexema);
                break;
            case 5: // ESTADO 5 (NUM_REAL).
                console.log("CARACTERE DE ENTRADA ESTADO 5: ", caractere);

                if (isDigit(caractere)) {
                    // ESTADO 5 -> ESTADO 6 (NUM_REAL).
                    // ESTADO 6 -> ESTADO 6 (NUM_REAL).

                    lexema += caractere;
                    index++;
                } else {
                    // ESTADO 6 -> ESTADO 7 (NUM_REAL).
                    console.log("CARACTERE DE ENTRADA ESTADO 5-6-7: ", caractere);

                    estado = 1;

                    tokens.push(obterToken(lexema, tabela_simbolos)); // Token NUM_REAL.
                    console.log("TOKEN GERADO ESTADO 7: ", tokens[tokens.length - 1]);

                    lexema = caractere;

                    console.log("LEXEMA DE SAIDA ESTADO 5-6-7: ", lexema);
                }

                console.log("LEXEMA DE SAIDA ESTADO 5: ", lexema);
                break;
            case 8: // ESTADO 8 (STRING).
                console.log("CARACTERE DE ENTRADA ESTADO 8: ", caractere);

                if (isValidChar(caractere)) {
                    // ESTADO 8 -> ESTADO 8 (STRING).
                    lexema += caractere;
                    index++
                } else if (isAspas(caractere)) {
                    // ESTADO 8 -> ESTADO 9 (STRING).
                    console.log("CARACTERE DE ENTRADA ESTADO 8-9: ", caractere);

                    index++;
                    estado = 1;
                    lexema += caractere;

                    tokens.push(obterToken(lexema, tabela_simbolos)); // Token STRING.
                    console.log("TOKEN GERADO ESTADO 9: ", tokens[tokens.length - 1]);

                    lexema = "";

                    console.log("LEXEMA DE SAIDA ESTADO 8-9: ", lexema);
                } else {
                    estado = "ERRO";
                }

                console.log("LEXEMA DE SAIDA ESTADO 8: ", lexema);
                break;
            case 11: // ESTADO 11 (COMENTÁRIO).
                console.log("CARACTERE DE ENTRADA ESTADO 11: ", caractere);

                if (isComentChar(caractere)) {
                    // ESTADO 11 -> ESTADO 12 (COMENTÁRIO).
                    lexema += caractere;
                    estado = 12;
                    index++;
                } else {
                    estado = "ERRO";
                }

                console.log("LEXEMA DE SAIDA DO ESTADO 11: ", lexema);
                break;
            case 12: // ESTADO 12 (COMENTÁRIO).
                console.log("CARACTERE DE ENTRADA DO ESTADO 12: ", caractere);

                if (isComentString(caractere)) {
                    // ESTADO 12 -> ESTADO 12 (COMENTARIO).
                    lexema += caractere;
                    index++;
                } else if (isComentChar(caractere)) {
                    lexema = caractere;
                    estado = "ERRO";
                }
                else {
                    // Não insere o \n explicitamente.

                    estado = 1;
                    index++;

                    // tokens.push(obterToken(lexema, tabela_simbolos)); // Token COMENTARIO.
                    console.log("TOKEN DE COMENTARIO RECONHECIDO - ESTADO 13: ", lexema);

                    lexema = "";
                }

                console.log("LEXEMA DE SAIDA DO ESTADO 12: ", lexema);
                break;
            case 16: // ESTADO 16 (OR - ??).
                console.log("CARACTERE DE ENTRADA DO ESTADO 16: ", caractere);

                if (isCharOR(caractere)) {
                    // ESTADO 16 -> ESTADO 17 -> ESTADO 20 (OR - ??).

                    lexema += caractere;
                    index++;
                    estado = 1;

                    tokens.push(obterToken(lexema, tabela_simbolos)); // TOKEN OPERADOR LOGICO ?? (OR)
                    console.log("TOKEN GERADO ESTADO 20: ", tokens[tokens.length - 1]);

                    lexema = "";
                } else {
                    estado = "ERRO";
                    lexema = caractere;
                }

                console.log("LEXEMA DE SAIDA DO ESTADO 16-17-20: ", lexema);
                break;
            case 18: // ESTADO 18 (AND ## ou DELIMITADOR FIM DE LINHA).
                console.log("CARACTERE DE ENTRADA DO ESTADO 18: ", caractere);

                if (isDelimitadorFimDeLinha(caractere)) {
                    // ESTADO 18 -> ESTADO 19 -> ESTADO 20 (## AND).
                    lexema += caractere;

                    tokens.push(obterToken(lexema, tabela_simbolos));
                    console.log("TOKEN GERADO ESTADO 20: ", tokens[tokens.length - 1]); // Token ## AND.

                    index++;
                    estado = 1;
                    lexema = "";
                } else {
                    tokens.push(obterToken(lexema, tabela_simbolos)); // Token DELIMITADOR #
                    console.log("TOKEN GERADO ESTADO 21: ", tokens[tokens.length - 1]); // Token ## AND.

                    estado = 1;
                }

                console.log("LEXEMA DE SAIDA DO ESTADO 18: ", lexema);
                break;
            case 22: // ESTADO 22 (DELIMITADORES).
                console.log("CARACTERE DE ENTRADA DO ESTADO 22: ", caractere);

                tokens.push(obterToken(lexema, tabela_simbolos));
                console.log("TOKEN GERADO ESTADO 23: ", tokens[tokens.length - 1]); // Token DELIMITADORES.

                estado = 1;
                lexema = "";

                console.log("LEXEMA DE SAIDA DO ESTADO 22: ", lexema);
                break;
            case "ERRO": // ESTADO DE ERRO.
                console.log("ERRO - LEXEMA NAO RECONHECIDO: ", lexema);
                lexema = "";
                flag_erro = true;
                break;
            default:
                console.log("ERRO - ESTADO INVÁLIDO PARA O AFD.");
                break;
        }

        // PARA A ANÁLISE LEXICA QUANDO DETECTA ERRO.
        if (flag_erro) break;
    }

    // PROCESSA O ÚLTIMO TOKEN.
    if (lexema.length > 0) {
        console.log("PROCESSANDO O ULTIMO TOKEN.");

        // TRATAMENTO DE STRING.
        if (lexema[0] === '"') {
            // CASOS TRATADOS: "nome ou nome" e "".
            if (lexema.length > 1 && lexema[lexema.length - 1] === '"') {
                tokens.push(obterToken(lexema, tabela_simbolos));
                console.log("TOKEN GERADO ESTADO 9: ", tokens[tokens.length - 1]); // Token String.

                lexema = "";
                estado = 1;
                index = 0;
            } else {
                console.log("ERRO - FORMA DE STRING INVALIDA: ", lexema);
            }
        } else if (lexema[0] === '@') { // TRATAMENTO DE COMENTÁRIO.
            if (lexema[1] === '@') {
                // tokens.push(obterToken(lexema, tabela_simbolos));
                console.log("TOKEN DE COMENTARIO RECONHECIDO - ESTADO 13: ", lexema); // Token COMENTÁRIO.

                lexema = "";
                estado = 1;
                index = 0;
            } else {
                console.log("ERRO - LEXEMA NÃO RECONHECIDO: ", lexema);
            }

        } else if (lexema.length < 2 && lexema[0] === '?') {
            console.log("ERRO - LEXEMA NÃO RECONHECIDO: ", lexema);
        } else if (lexema[lexema.length - 1] === '.') {
            console.log("ERRO - LEXEMA NÃO RECONHECIDO: ", lexema)
        }
        else {
            tokens.push(obterToken(lexema, tabela_simbolos));
            console.log("ULTIMO TOKEN GERADO: ", tokens[tokens.length - 1]);
        }
    }

    console.log("Caractere Final: ", caractere);
    console.log("Ultimo Lexema: ", lexema);
    console.log("Index Final: ", index);
    console.log("Estado Final: ", estado);
    console.log("Lista de Tokens: ", tokens);

    return tokens;
}

// FUNCAO PARA OBTER OS TOKENS DA LINGUAGEM.
function obterToken(lexema, tabela_simbolos) {

    // Numeros Inteiros.
    if (isNumInt(lexema)) {
        return { type: "NUM_INT", lexema };
    }

    // Numeros Reais.
    if (isNumReal(lexema)) {
        return { type: "NUM_REAL", lexema };
    }

    // String.
    if (isString(lexema)) {
        return { type: "STRING", lexema };
    }

    // Comentario.
    // if (isComentario(lexema)) {
    //     return { type: "COMENTARIO", lexema }
    // }

    // Constantes Booleanas.
    if (lexema === "REAL" || lexema === "FAKE") {
        return { type: "BOOLEAN", lexema };
    }

    let token = tabela_simbolos.find(token => token.type === lexema);
    if (token) { // Palavra-Reservada?
        return { type: token.type, lexema };
    } else { // ID.
        return { type: "ID", lexema };
    }
}

// FUNCOES PARA VERIFICAR PADROES PARA OS TOKENS.
function isLetter(c) {
    return /^[a-zA-Z]$/.test(c);
}

function isAlphaNum(c) {
    return /^[a-zA-Z0-9_]$/.test(c);
}

function isDigit(c) {
    return /^[0-9]$/.test(c);
}

function isNumInt(lexema) {
    return /^[0-9]+$/.test(lexema);
}

function isNumReal(lexema) {
    return /^[0-9]+\.[0-9]+$/.test(lexema);
}

function isPoint(c) {
    return c === '.';
}

function isAspas(c) {
    return c === '"';
}

function isValidChar(c) {
    return ((c != '\n') && (c != '"'));
}

function isString(lexema) {
    return /^"[^"\n]*"$/.test(lexema);
}

function isWhiteSpace(c) {
    return /^[\t\n\r ]$/.test(c);
}

function isComentChar(c) {
    return c === '@';
}

function isComentString(c) {
    return (c != '\n' && c != '@');
}

// function isComentario(lexema) {
//     return (lexema[0] === '@' && lexema[1] === '@');
// }

function isCharOR(c) {
    return c === '?';
}

function isDelimitadorFimDeLinha(c) {
    return c === '#';
}

function isDelimitador(c) {
    return /^[#()\[\]{}\,]$/.test(c);
}

// ===================== EXPORTAÇÃO =====================

// Exporta os tokens para serem usados no módulo sintático.
export function getTokens(codigo_fonte) {
    const tabela_simbolos = getTabelaSimbolos();
    const tokens = executarAnalisadorLexicoAFD(codigo_fonte, tabela_simbolos);
    return tokens;
}
