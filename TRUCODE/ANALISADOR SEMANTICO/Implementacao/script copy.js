// =============================================
// ANALISADOR LÉXICO - TRUCODE
// =============================================
let codigo_fonte = "";

// TABELA DE SÍMBOLOS - PALAVRAS RESERVADAS TRUCODE
function getTabelaSimbolos() {
    return [
        // Comandos de E/S
        { type: "RECEBE" },
        { type: "MOSTRA" },

        // Tipos de dados
        { type: "OURO" },
        { type: "ESPADA" },
        { type: "COPA" },
        { type: "PAUS" },

        // Operadores relacionais
        { type: "RECUA" },
        { type: "MATA" },
        { type: "BATE" },
        { type: "SEGURA" },
        { type: "CANTA" },
        { type: "BLEFA" },

        // Operadores aritméticos
        { type: "KING" },
        { type: "JACK" },
        { type: "QUEEN" },
        { type: "AS" },
        { type: "RESTO" },

        // Estruturas de controle
        { type: "TRUCO" },
        { type: "CORRE" },
        { type: "SEGUE" },
        { type: "DISTRIBUI" },
        { type: "DE" },
        { type: "ATE" },
        { type: "VALE" },
        { type: "CORTA" },
        { type: "PASSO" },
        // ==================

        // Constantes booleanas
        { type: "REAL" },
        { type: "FAKE" },

        // Operadores lógicos simbólicos
        { type: "##" },
        { type: "??" },
        { type: "XX" },

        // Delimitadores
        { type: "(" },
        { type: ")" },
        { type: "[" },
        { type: "]" },
        { type: "{" },
        { type: "}" },
        { type: "#" },
        { type: "," }
    ];
}
// ANALISADOR LÉXICO
function executarAnalisadorLexicoAFD(codigo_fonte, tabela_simbolos) {
    let index = 0;
    let estado = 1;
    let caractere = '';
    let lexema = "";
    let flag_erro = false;
    let tokens = [];
    let linha = 1;
    let coluna = 1;

    function proximoCaractere() {
        if (index < codigo_fonte.length) {
            caractere = codigo_fonte[index++];
            coluna++;
            if (caractere === '\n') {
                linha++;
                coluna = 1;
            }
            return true;
        }
        return false;
    }

    let hasChars = proximoCaractere();

    while (hasChars && !flag_erro) {
        switch (estado) {
            case 1:
                if (isLetter(caractere)) {
                    estado = 2;
                    lexema += caractere;
                    hasChars = proximoCaractere();
                } else if (isDigit(caractere)) {
                    estado = 4;
                    lexema += caractere;
                    hasChars = proximoCaractere();
                } else if (isAspas(caractere)) {
                    estado = 8;
                    lexema += caractere;
                    hasChars = proximoCaractere();
                } else if (isWhiteSpace(caractere)) {
                    lexema = "";
                    hasChars = proximoCaractere();
                } else if (isComentChar(caractere)) {
                    estado = 11;
                    lexema += caractere;
                    hasChars = proximoCaractere();
                } else if (isCharOR(caractere)) {
                    estado = 16;
                    lexema += caractere;
                    hasChars = proximoCaractere();
                    mrow;
                } else if (isDelimitadorFimDeLinha(caractere)) {
                    estado = 18;
                    lexema = caractere;
                    hasChars = proximoCaractere();
                } else if (isDelimitador(caractere)) {
                    estado = 22;
                    lexema = caractere;
                    hasChars = proximoCaractere();
                } else {
                    estado = "ERRO";
                }
                break;

            case 2:
                if (isAlphaNum(caractere)) {
                    lexema += caractere;
                    hasChars = proximoCaractere();
                } else {
                    if (lexema.length > 12) {
                        mostrarResultado(`⚠️ Aviso: Identificador '${lexema}' (linha ${linha}) excede 12 caracteres. Truncado para '${lexema.substring(0, 12)}'.`, "warning");
                        lexema = lexema.substring(0, 12);
                    }

                    estado = 1;
                    tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna: coluna - lexema.length });
                    lexema = "";
                }
                break;

            case 4:
                if (isDigit(caractere)) {
                    lexema += caractere;
                    hasChars = proximoCaractere();
                } else if (isPoint(caractere)) {
                    lexema += caractere;
                    hasChars = proximoCaractere();
                    estado = 5;
                } else {
                    estado = 1;
                    tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna: coluna - lexema.length });
                    lexema = "";
                }
                break;

            case 5:
                if (isDigit(caractere)) {
                    lexema += caractere;
                    hasChars = proximoCaractere();
                    estado = 6;
                } else {
                    estado = "ERRO";
                }
                break;

            case 6:
                if (isDigit(caractere)) {
                    lexema += caractere;
                    hasChars = proximoCaractere();
                } else {
                    estado = 1;
                    tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna: coluna - lexema.length });
                    lexema = "";
                }
                break;

            case 8:
                if (isValidChar(caractere)) {
                    lexema += caractere;
                    hasChars = proximoCaractere();
                } else if (isAspas(caractere)) {
                    lexema += caractere;
                    hasChars = proximoCaractere();
                    estado = 1;
                    tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna: coluna - lexema.length });
                    lexema = "";
                } else if (caractere === '\n') {
                    estado = "ERRO";
                } else {
                    estado = "ERRO";
                }
                break;

            case 11:
                if (isComentChar(caractere)) {
                    lexema += caractere;
                    estado = 12;
                    hasChars = proximoCaractere();
                } else {
                    estado = "ERRO";
                }
                break;

            case 12:
                if (isComentString(caractere)) {
                    lexema += caractere;
                    hasChars = proximoCaractere();
                } else if (caractere === '\n') {
                    estado = 1;
                    tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna: coluna - lexema.length });
                    lexema = "";
                    hasChars = proximoCaractere();
                } else {
                    estado = "ERRO";
                }
                break;

            case 16:
                if (isCharOR(caractere)) {
                    lexema += caractere;
                    estado = 1;
                    tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna: coluna - lexema.length });
                    lexema = "";
                    hasChars = proximoCaractere();
                } else {
                    estado = "ERRO";
                }
                break;

            case 18:
                if (isDelimitadorFimDeLinha(caractere)) {
                    lexema += caractere;
                    tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna: coluna - lexema.length });
                    estado = 1;
                    lexema = "";
                    hasChars = proximoCaractere();
                } else {
                    tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna: coluna - lexema.length });
                    estado = 1;

                }
                break;

            case 22:
                tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna: coluna - lexema.length });
                estado = 1;
                lexema = "";
                break;

            case "ERRO":
                mostrarResultado(`❌ Erro léxico: Caractere '${caractere}' inesperado (linha ${linha}, coluna ${coluna})`, "error");
                lexema = "";
                flag_erro = true;
                break;
        }
    }



    // Processar último lexema
    if (lexema.length > 0 && !flag_erro) {
        if (lexema[0] === '"') {
            if (lexema.length > 1 && lexema[lexema.length - 1] === '"') {
                tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna });
            } else {
                mostrarResultado(`❌ Erro léxico: String não fechada '${lexema}'`, "error");
            }
        } else if (lexema.startsWith('@@')) {
            tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna });
        } else {
            tokens.push({ ...obterToken(lexema, tabela_simbolos), linha, coluna });
        }
    }

    return tokens;
}

// FUNÇÃO PARA OBTER TOKENS
function obterToken(lexema, tabela_simbolos) {
    // Verifica constantes booleanas primeiro
    if (lexema === "REAL" || lexema === "FAKE") {
        return { token: "BOOLEAN", lexema, tipo: "BOOL" };
    }

    // Verifica números
    if (isNumInt(lexema)) {
        return { token: "NUM_INT", lexema, tipo: "INT" };
    }

    if (isNumReal(lexema)) {
        return { token: "NUM_REAL", lexema, tipo: "FLOAT" };
    }

    // Verifica string
    if (isString(lexema)) {
        return { token: "STRING", lexema, tipo: "STRING" };
    }

    // Verifica comentário
    if (isComentario(lexema)) {
        return { token: "COMENTARIO", lexema };
    }

    // Busca na tabela de símbolos
    let token = tabela_simbolos.find(t => t.type === lexema);
    if (token) {
        return { token: token.type, lexema };
    } else {
        return { token: "ID", lexema };
    }
}

// FUNÇÕES AUXILIARES
function isLetter(c) { return /^[a-zA-Z]$/.test(c); }
function isAlphaNum(c) { return /^[a-zA-Z0-9_]$/.test(c); }
function isDigit(c) { return /^[0-9]$/.test(c); }
function isNumInt(lexema) { return /^[0-9]+$/.test(lexema); }
function isNumReal(lexema) { return /^[0-9]+\.[0-9]+$/.test(lexema); }
function isPoint(c) { return c === '.'; }
function isAspas(c) { return c === '"'; }
function isValidChar(c) { return c !== '"' && c !== '\n'; }
function isString(lexema) { return /^"[^"]*"$/.test(lexema); }
function isWhiteSpace(c) { return /^[\t\n\r ]$/.test(c); }
function isComentChar(c) { return c === '@'; }
function isComentString(c) { return c !== '\n'; }
function isComentario(lexema) { return lexema.startsWith('@@'); }
function isCharOR(c) { return c === '?'; }
function isDelimitadorFimDeLinha(c) { return c === '#'; }
function isDelimitador(c) { return /^[()\[\]{},]$/.test(c); }

// =============================================
// ANALISADOR SINTÁTICO SLR - TRUCODE
// =============================================

const productions = [
    // 0-2: Produções iniciais
    ["S'", ["lista_comandos"]],
    ["lista_comandos", ["comando", "lista_comandos"]],
    ["lista_comandos", ["comando"]],

    // 3-9: Comandos
    ["comando", ["declaracao"]],
    ["comando", ["atribuicao"]],
    ["comando", ["entrada"]],
    ["comando", ["saida"]],
    ["comando", ["condicional"]],
    ["comando", ["laco_repeticao"]],
    ["comando", ["break"]],

    // 10-13: Declarações e atribuições COM PARÊNTESES.
    ["declaracao", ["ID", "(", "tipo", ")", "#"]],
    ["atribuicao", ["ID", "(", "tipo", ")", "VALE", "valor", "#"]],
    ["entrada", ["RECEBE", "[", "ID", "]", "#"]],
    ["saida", ["MOSTRA", "[", "lista_valores", "]", "#"]],

    // 14-17: Listas de valores
    ["lista_valores", ["valor_saida"]],
    ["lista_valores", ["valor_saida", ",", "lista_valores"]],
    ["valor_saida", ["STRING"]],
    ["valor_saida", ["ID"]],

    // 18-20: Condicionais
    ["condicional", ["TRUCO", "(", "expr", ")", "{", "lista_comandos", "}", "opcional_else"]],
    ["opcional_else", ["CORRE", "{", "lista_comandos", "}"]],
    ["opcional_else", []],

    // 21-24: Laços de repetição
    ["laco_repeticao", ["laco_while"]],
    ["laco_repeticao", ["laco_for"]],
    ["laco_while", ["SEGUE", "(", "expr", ")", "{", "lista_comandos", "}"]],
    ["laco_for", ["DISTRIBUI", "ID", "DE", "valor_for", "ATE", "expr", "PASSO", "valor_for", "{", "lista_comandos", "}"]],

    // 25-27: Valores for
    ["valor_for", ["NUM_INT"]],
    ["valor_for", ["NUM_REAL"]],
    ["valor_for", ["ID"]],

    // 28: Break
    ["break", ["CORTA", "#"]],

    // 29-33: Valores
    ["valor", ["NUM_INT"]],
    ["valor", ["NUM_REAL"]],
    ["valor", ["STRING"]],
    ["valor", ["BOOLEAN"]],
    ["valor", ["ID"]],

    // 34-37: Tipos
    ["tipo", ["OURO"]],
    ["tipo", ["ESPADA"]],
    ["tipo", ["COPA"]],
    ["tipo", ["PAUS"]],

    // 38-40: Expressões
    ["expr", ["term", "expr_tail"]],
    ["expr_tail", ["binop", "term", "expr_tail"]],
    ["expr_tail", []],

    // 41-53: Operadores
    ["binop", ["??"]],
    ["binop", ["##"]],
    ["binop", ["RECUA"]],
    ["binop", ["MATA"]],
    ["binop", ["BATE"]],
    ["binop", ["SEGURA"]],
    ["binop", ["CANTA"]],
    ["binop", ["BLEFA"]],
    ["binop", ["KING"]],
    ["binop", ["JACK"]],
    ["binop", ["AS"]],
    ["binop", ["QUEEN"]],
    ["binop", ["RESTO"]],

    // 54-56: Termos
    ["term", ["XX", "term"]],
    ["term", ["(", "expr", ")"]],
    ["term", ["valor"]]
];

class SLRParser {
    constructor() {
        this.productions = productions;
        this.actionTable = this.createActionTable();
        this.gotoTable = this.createGotoTable();
        this.stack = [0];
        this.symbols = []; // Pilha sintática + semântica, { token, lexema, tipo }
        this.errors = [];
        this.tokens = [];
        this.currentTokenIndex = 0;
    }

    createActionTable() {
        // =================================================================
        // TABELA SLR
        // =================================================================

        // Tokens que podem iniciar um comando
        const startCmd = ['ID', 'RECEBE', 'MOSTRA', 'TRUCO', 'SEGUE', 'DISTRIBUI', 'CORTA'];
        // Tokens que podem seguir um comando (iniciar outro, ou finalizar)
        const followCmd = [...startCmd, '$', '}'];

        // Tokens que podem seguir um 'valor' (em atribuição OU expressão)
        const followExprValue = [
            '#', ')', 'PASSO', '??', '##', 'RECUA', 'MATA', 'BATE',
            'SEGURA', 'CANTA', 'BLEFA', 'KING', 'JACK', 'AS', 'QUEEN', 'RESTO'
        ];

        // Tokens que podem iniciar um 'term' (o que vem depois de um binop)
        const firstTerm = [
            'NUM_INT', 'NUM_REAL', 'STRING', 'BOOLEAN', 'ID', 'XX', '('
        ];

        // Função auxiliar para criar regras de redução
        const reduce = (rule, tokens) => {
            const actions = {};
            for (const token of tokens) {
                actions[token] = rule;
            }
            return actions;
        };

        return {
            0: { 'ID': 'S11', 'RECEBE': 'S28', 'MOSTRA': 'S33', 'TRUCO': 'S43', 'SEGUE': 'S83', 'DISTRIBUI': 'S90', 'CORTA': 'S104' },
            1: { '$': 'acc' },
            2: { 'ID': 'S11', 'RECEBE': 'S28', 'MOSTRA': 'S33', 'TRUCO': 'S43', 'SEGUE': 'S83', 'DISTRIBUI': 'S90', 'CORTA': 'S104', '$': 'R2', '}': 'R2' },
            3: { '$': 'R1', '}': 'R1' },
            4: reduce('R3', followCmd),
            5: reduce('R4', followCmd),
            6: reduce('R5', followCmd),
            7: reduce('R6', followCmd),
            8: reduce('R7', followCmd),
            9: reduce('R8', followCmd),
            10: reduce('R9', followCmd),
            11: { '(': 'S12' },
            12: { 'OURO': 'S14', 'ESPADA': 'S15', 'COPA': 'S16', 'PAUS': 'S17' },
            13: { ')': 'S18' },
            14: { ')': 'R34' },
            15: { ')': 'R35' },
            16: { ')': 'R36' },
            17: { ')': 'R37' },
            18: { '#': 'S19', 'VALE': 'S20' },
            19: reduce('R10', followCmd),
            20: {
                'NUM_INT': 'S22',
                'NUM_REAL': 'S23',
                'STRING': 'S24',
                'BOOLEAN': 'S25',
                'ID': 'S26',
                'XX': 'S46',
                '(': 'S47'
            },
            21: { '#': 'S27' },
            22: reduce('R29', followExprValue),
            23: reduce('R30', followExprValue),
            24: reduce('R31', followExprValue),
            25: reduce('R32', followExprValue),
            26: reduce('R33', followExprValue),
            27: reduce('R11', followCmd),
            28: { '[': 'S29' },
            29: { 'ID': 'S30' },
            30: { ']': 'S31' },
            31: { '#': 'S32' },
            32: reduce('R12', followCmd),
            33: { '[': 'S34' },
            34: { 'ID': 'S37', 'STRING': 'S38' },
            35: { ']': 'S39' },
            36: { ',': 'S41', ']': 'R14' },
            37: { ',': 'R17', ']': 'R17' },
            38: { ',': 'R16', ']': 'R16' },
            39: { '#': 'S40' },
            40: reduce('R13', followCmd),
            41: { 'ID': 'S37', 'STRING': 'S38' },
            42: { ']': 'R15' },
            43: { '(': 'S44' },
            44: { 'NUM_INT': 'S22', 'NUM_REAL': 'S23', 'STRING': 'S24', 'BOOLEAN': 'S25', 'ID': 'S26', 'XX': 'S46', '(': 'S47' },
            45: { ')': 'R40', 'PASSO': 'R40', '??': 'S52', '##': 'S53', 'RECUA': 'S54', 'MATA': 'S55', 'BATE': 'S56', 'SEGURA': 'S57', 'CANTA': 'S58', 'BLEFA': 'S59', 'KING': 'S60', 'JACK': 'S61', 'AS': 'S62', 'QUEEN': 'S63', 'RESTO': 'S64' },
            46: { 'NUM_INT': 'S22', 'NUM_REAL': 'S23', 'STRING': 'S24', 'BOOLEAN': 'S25', 'ID': 'S26', 'XX': 'S46', '(': 'S47' },
            47: { 'NUM_INT': 'S22', 'NUM_REAL': 'S23', 'STRING': 'S24', 'BOOLEAN': 'S25', 'ID': 'S26', 'XX': 'S46', '(': 'S47' },
            48: reduce('R56', followExprValue),
            49: { ')': 'R38', 'PASSO': 'R38' },
            50: { 'NUM_INT': 'S22', 'NUM_REAL': 'S23', 'STRING': 'S24', 'BOOLEAN': 'S25', 'ID': 'S26', 'XX': 'S46', '(': 'S47' },
            51: { ')': 'R41', 'PASSO': 'R41' },
            52: reduce('R41', firstTerm),
            53: reduce('R42', firstTerm),
            54: reduce('R43', firstTerm),
            55: reduce('R44', firstTerm),
            56: reduce('R45', firstTerm),
            57: reduce('R46', firstTerm),
            58: reduce('R47', firstTerm),
            59: reduce('R48', firstTerm),
            60: reduce('R49', firstTerm),
            61: reduce('R50', firstTerm),
            62: reduce('R51', firstTerm),
            63: reduce('R52', firstTerm),
            64: reduce('R53', firstTerm),
            65: reduce('R54', followExprValue),
            66: { ')': 'S67' },
            67: reduce('R55', followExprValue),
            68: { ')': 'R40', 'PASSO': 'R40', '??': 'S52', '##': 'S53', 'RECUA': 'S54', 'MATA': 'S55', 'BATE': 'S56', 'SEGURA': 'S57', 'CANTA': 'S58', 'BLEFA': 'S59', 'KING': 'S60', 'JACK': 'S61', 'AS': 'S62', 'QUEEN': 'S63', 'RESTO': 'S64' },
            69: { ')': 'R39', 'PASSO': 'R39' },
            70: { ')': 'S71' },
            71: { '{': 'S72' },
            72: { 'ID': 'S11', 'RECEBE': 'S28', 'MOSTRA': 'S33', 'TRUCO': 'S43', 'SEGUE': 'S83', 'DISTRIBUI': 'S90', 'CORTA': 'S104', '$': 'R2', '}': 'R2' },
            73: { '}': 'S74' },
            74: { 'CORRE': 'S76', ...reduce('R20', followCmd) },
            75: reduce('R18', followCmd),
            76: { '{': 'S78' },
            77: reduce('R20', followCmd),
            78: { 'ID': 'S11', 'RECEBE': 'S28', 'MOSTRA': 'S33', 'TRUCO': 'S43', 'SEGUE': 'S83', 'DISTRIBUI': 'S90', 'CORTA': 'S104', '$': 'R2', '}': 'R2' },
            79: { '}': 'S80' },
            80: reduce('R19', followCmd),
            81: reduce('R21', followCmd),
            82: reduce('R22', followCmd),
            83: { '(': 'S84' },
            84: { 'NUM_INT': 'S22', 'NUM_REAL': 'S23', 'STRING': 'S24', 'BOOLEAN': 'S25', 'ID': 'S26', 'XX': 'S46', '(': 'S47' },
            85: { ')': 'S86' },
            86: { '{': 'S87' },
            87: { 'ID': 'S11', 'RECEBE': 'S28', 'MOSTRA': 'S33', 'TRUCO': 'S43', 'SEGUE': 'S83', 'DISTRIBUI': 'S90', 'CORTA': 'S104', '$': 'R2', '}': 'R2' },
            88: { '}': 'S89' },
            89: reduce('R23', followCmd),
            90: { 'ID': 'S91' },
            91: { 'DE': 'S92' },
            92: { 'NUM_INT': 'S93', 'NUM_REAL': 'S94', 'ID': 'S95' },
            93: { 'ATE': 'R25', '{': 'R25' },
            94: { 'ATE': 'R26', '{': 'R26' },
            95: { 'ATE': 'R27', '{': 'R27' },
            // =================================
            96: { 'ATE': 'S97' },
            97: { 'NUM_INT': 'S22', 'NUM_REAL': 'S23', 'STRING': 'S24', 'BOOLEAN': 'S25', 'ID': 'S26', 'XX': 'S46', '(': 'S47' },
            98: { 'PASSO': 'S99' },
            99: { 'NUM_INT': 'S93', 'NUM_REAL': 'S94', 'ID': 'S95' },
            100: { '{': 'S101' },
            101: { 'ID': 'S11', 'RECEBE': 'S28', 'MOSTRA': 'S33', 'TRUCO': 'S43', 'SEGUE': 'S83', 'DISTRIBUI': 'S90', 'CORTA': 'S104', '$': 'R2', '}': 'R2' },
            102: { '}': 'S103' },
            103: reduce('R24', followCmd),
            104: { '#': 'S105' },
            105: reduce('R28', followCmd)
        };
    }

    createGotoTable() {
        return {
            0: { 'lista_comandos': 1, 'comando': 2, 'declaracao': 4, 'atribuicao': 5, 'entrada': 6, 'saida': 7, 'condicional': 8, 'laco_repeticao': 9, 'break': 10 },
            2: { 'lista_comandos': 3, 'comando': 2, 'declaracao': 4, 'atribuicao': 5, 'entrada': 6, 'saida': 7, 'condicional': 8, 'laco_repeticao': 9, 'break': 10, 'laco_while': 81, 'laco_for': 82 },
            12: { 'tipo': 13 },
            20: {
                'valor': 21,
                'expr': 21   // <-- novo!
            },
            34: { 'lista_valores': 35, 'valor_saida': 36 },
            41: { 'lista_valores': 42, 'valor_saida': 36 },
            44: { 'expr': 70, 'term': 45, 'valor': 48 },
            45: { 'expr_tail': 49, 'binop': 50 },
            46: { 'term': 65 },
            47: { 'expr': 66, 'term': 45, 'valor': 48 },
            50: { 'term': 68, 'valor': 48 },
            68: { 'expr_tail': 69, 'binop': 50 },
            72: { 'lista_comandos': 73, 'comando': 2, 'declaracao': 4, 'atribuicao': 5, 'entrada': 6, 'saida': 7, 'condicional': 8, 'laco_repeticao': 9, 'break': 10, 'laco_while': 81, 'laco_for': 82 },
            74: { 'opcional_else': 75 },
            78: { 'lista_comandos': 79, 'comando': 2, 'declaracao': 4, 'atribuicao': 5, 'entrada': 6, 'saida': 7, 'condicional': 8, 'laco_repeticao': 9, 'break': 10, 'laco_while': 81, 'laco_for': 82 },
            84: { 'expr': 85, 'term': 45, 'valor': 48 },
            87: { 'lista_comandos': 88, 'comando': 2, 'declaracao': 4, 'atribuicao': 5, 'entrada': 6, 'saida': 7, 'condicional': 8, 'laco_repeticao': 9, 'break': 10, 'laco_while': 81, 'laco_for': 82 },
            92: { 'valor_for': 96 },
            97: { 'expr': 98, 'term': 45, 'valor': 48 },
            99: { 'valor_for': 100 },
            101: { 'lista_comandos': 102, 'comando': 2, 'declaracao': 4, 'atribuicao': 5, 'entrada': 6, 'saida': 7, 'condicional': 8, 'laco_repeticao': 9, 'break': 10, 'laco_while': 81, 'laco_for': 82 }
        };
    }

    setTokens(tokens) {
        this.tokens = tokens.filter(token => token.token !== "COMENTARIO");
        this.currentTokenIndex = 0;
        this.stack = [0];
        this.symbols = [];
        this.errors = [];
        this.trajectory = []; // <-- ADICIONE ESTA LINHA
    }

    getCurrentToken() {
        if (this.currentTokenIndex < this.tokens.length) {
            return this.tokens[this.currentTokenIndex];
        }
        return { token: '$', lexema: '$', linha: 0, coluna: 0 };
    }

    parse() {
        let step = 0;
        const maxSteps = 1000;

        while (step++ < maxSteps) {
            const state = this.stack[this.stack.length - 1];
            const currentToken = this.getCurrentToken();
            const tokenType = currentToken.token;

            if (this.actionTable[state] && this.actionTable[state][tokenType]) {
                const action = this.actionTable[state][tokenType];

                if (action === 'acc') {
                    this.trajectory.push("✅ ACEITO (acc)"); // <-- ADICIONAL
                    if (this.errors.length > 0) {
                        return { success: false, errors: this.errors, trajectory: this.trajectory };
                    }
                    return { success: true, errors: [], trajectory: this.trajectory };

                } else if (action.startsWith('S')) {
                    // ==========================
                    // REGISTRAR SHIFT
                    // ==========================
                    const nextState = parseInt(action.substring(1));
                    this.trajectory.push(`➡️ Empilhar (Shift): ${currentToken.lexema} (Ir para S${nextState})`);
                    this.stack.push(nextState);


                    // Preservando informações semânticas que o lexer já sabe.
                    this.symbols.push({
                        token: currentToken.token,
                        lexema: currentToken.lexema,
                        tipo: currentToken.tipo ?? null,
                        linha: currentToken.linha,
                        coluna: currentToken.coluna
                    });

                    // for (let index = 0; index < this.symbols.length; index++) {
                    //     console.log(this.symbols[index]);
                    // }

                    this.currentTokenIndex++;

                } else if (action.startsWith('R')) {
                    // ==========================
                    // REGISTRAR REDUCE
                    // ==========================
                    const productionNum = parseInt(action.substring(1));
                    const production = this.productions[productionNum];
                    const ruleString = `${production[0]} -> ${production[1].length > 0 ? production[1].join(' ') : 'ε'}`;
                    this.trajectory.push(`⬅️ Reduzir (Reduce): ${ruleString}`);

                    console.log("Trajetória Shift e Reduce: ", this.trajectory);
                    console.log("Numero da Produção:", productionNum);
                    this.reduce(productionNum);


                } else {
                    this.errors.push(`Ação inválida: ${action} no estado ${state}`);
                    return { success: false, errors: this.errors, trajectory: this.trajectory };
                }

            } else {
                const expected = this.actionTable[state] ? Object.keys(this.actionTable[state]).join(', ') : 'nenhuma';
                this.errors.push(`Erro sintático na linha ${currentToken.linha}, coluna ${currentToken.coluna}. Token inesperado: '${currentToken.lexema}'. Esperado: ${expected}`);
                this.recoverFromError();
                if (this.errors.length > 5) {
                    this.errors.push("Muitos erros encontrados. Análise abortada.");
                    return { success: false, errors: this.errors, trajectory: this.trajectory };
                }
            }

            if (this.currentTokenIndex >= this.tokens.length && this.stack.length === 2 && this.stack[1] === 1) {
                if (this.errors.length > 0) {
                    return { success: false, errors: this.errors, trajectory: this.trajectory };
                }
                return { success: true, errors: [], trajectory: this.trajectory };
            }
        }

        this.errors.push("Análise muito longa - possível loop infinito");
        return { success: false, errors: this.errors, trajectory: this.trajectory };
    }

    // ==========================
    // REGISTRAR REDUCE
    // ==========================
    reduce(productionNum) {
        const production = this.productions[productionNum];
        const lhs = production[0];
        const rhs = production[1];

        console.log(production);

        const rhsSymbols = [];

        // Salvando símbolos do lado direito da produção.
        for (let i = 0; i < rhs.length; i++) {
            this.stack.pop();
            rhsSymbols.unshift(this.symbols.pop());
        }

        // Não-terminal.
        let atributo = {
            token: lhs,
            lexema: lhs,
            tipo: null
        };

        console.log(productionNum);

        // Regras semânticas.
        try {
            switch (productionNum) {

                // ============================
                // VALORES 
                // ["valor", ["NUM_INT"]],
                // ["valor", ["NUM_REAL"]],
                // ["valor", ["STRING"]],
                // ["valor", ["BOOLEAN"]],
                // ["valor", ["ID"]],
                // ============================

                case 29: // valor -> NUM_INT
                    atributo.tipo = tipo.INT;
                    break;

                case 30: // valor -> NUM_REAL
                    atributo.tipo = tipo.FLOAT;
                    break;

                case 31: // valor -> STRING
                    atributo.tipo = tipo.STRING;
                    break;

                case 32: // valor -> BOOLEAN
                    atributo.tipo = tipo.BOOL;
                    break;

                case 33: // valor -> ID
                    atributo.tipo = buscar(rhsSymbols[0].lexema);
                    break;

                // ============================
                // TIPOS
                // ["tipo", ["OURO"]],
                // ["tipo", ["ESPADA"]],
                // ["tipo", ["COPA"]],
                // ["tipo", ["PAUS"]],
                // ============================

                case 34: // tipo -> OURO
                    atributo.tipo = tipo.INT;
                    break;

                case 35: // tipo -> ESPADA
                    atributo.tipo = tipo.FLOAT;
                    break;

                case 36: // tipo -> COPA
                    atributo.tipo = tipo.STRING;
                    break;

                case 37: // tipo -> PAUS
                    atributo.tipo = tipo.BOOL;
                    break;


                // ============================
                // DECLARAÇÃO
                // ["declaracao", ["ID", "(", "tipo", ")", "#"]],
                // ============================

                case 10: { // declaracao -> ID ( tipo ) #
                    const nome = rhsSymbols[0].lexema;
                    const tipoVar = rhsSymbols[2].tipo;

                    declarar(nome, tipoVar);
                    console.log("DECLARAÇÃO EXECUTADA.");

                    break;
                }

                // ============================
                // ATRIBUIÇÃO
                // ["atribuicao", ["ID", "(", "tipo", ")", "VALE", "expr", "#"]],
                // ============================

                case 11: {
                    const nome = rhsSymbols[0].lexema;
                    const tipoDeclarado = rhsSymbols[2].tipo;
                    const tipoValor = rhsSymbols[5].tipo;

                    if (!tabela_simbolos_semantico.has(nome)) {
                        if (!tiposCompativeis(tipoDeclarado, tipoValor)) {
                            throw `Tipos incompatíveis na declaração de '${nome}': ${tipoDeclarado} <- ${tipoValor}`;
                        }
                        declarar(nome, tipoDeclarado);
                    } else {
                        const tipoExistente = buscar(nome);
                        if (!tiposCompativeis(tipoExistente, tipoValor)) {
                            throw `Tipos incompatíveis em atribuição: ${tipoExistente} <- ${tipoValor}`;
                        }
                    }
                    break;
                }


                // ============================
                // 54-56: Termos
                // ["term", ["XX", "term"]],
                // ["term", ["(", "expr", ")"]],
                // ["term", ["valor"]]
                // ============================
                case 56:
                    atributo.tipo = rhsSymbols[0].tipo;
                    break;

                case 55:
                    atributo.tipo = rhsSymbols[1].tipo;
                    break;

                case 54: {
                    const t = rhsSymbols[1].tipo;
                    if (t !== tipo.INT && t !== tipo.FLOAT) {
                        throw `Operador unário XX inválido para ${t}`;
                    }
                    atributo.tipo = t;
                    break;
                }

                // ============================
                // 38-40: Expressões
                // ["expr", ["term", "expr_tail"]],
                // ["expr_tail", ["binop", "term", "expr_tail"]],
                // ["expr_tail", []],
                // ============================
                case 38: {
                    const tTerm = rhsSymbols[0].tipo;
                    const tTail = rhsSymbols[1].tipo;

                    atributo.tipo = tTail !== null ? tTail : tTerm;
                    break;
                }

                case 39: {
                    const op = rhsSymbols[0].lexema;
                    const tTerm = rhsSymbols[1].tipo;
                    const tTail = rhsSymbols[2].tipo;

                    if (tTail === null) {
                        atributo.tipo = tTerm;
                    } else {
                        atributo.tipo = tipoResultado(op, tTerm, tTail);
                    }
                    break;
                }


                case 40:
                    atributo.tipo = null;
                    break;

                // ============================
                // 41-53: Operadores
                // ["binop", ["??"]],
                // ["binop", ["##"]],
                // ["binop", ["RECUA"]],
                // ["binop", ["MATA"]],
                // ["binop", ["BATE"]],
                // ["binop", ["SEGURA"]],
                // ["binop", ["CANTA"]],
                // ["binop", ["BLEFA"]],
                // ["binop", ["KING"]],
                // ["binop", ["JACK"]],
                // ["binop", ["AS"]],
                // ["binop", ["QUEEN"]],
                // ["binop", ["RESTO"]],
                // ============================
                case 41:
                case 42:
                case 43:
                case 44:
                case 45:
                case 46:
                case 47:
                case 48:
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                    atributo.lexema = rhsSymbols[0].lexema;
                    break;
            }
        } catch (e) {
            this.errors.push(`ERRO SEMÂNTICO: ${e}`);
        }

        // Empilha o símbolo reduzido.
        this.symbols.push(atributo);


        const currentState = this.stack[this.stack.length - 1];
        if (this.gotoTable[currentState] && this.gotoTable[currentState][lhs]) {
            this.stack.push(this.gotoTable[currentState][lhs]);
        } else {
            this.errors.push(`Erro de GOTO: estado ${currentState}, símbolo ${lhs}`);
        }
    }

    recoverFromError() {
        const syncTokens = ['#', '}', 'RECEBE', 'MOSTRA', 'TRUCO', 'SEGUE', 'DISTRIBUI', 'CORTA', 'ID'];
        let currentToken = this.getCurrentToken();

        while (this.currentTokenIndex < this.tokens.length && !syncTokens.includes(currentToken.token)) {
            this.currentTokenIndex++;
            currentToken = this.getCurrentToken();
        }

        if (this.currentTokenIndex < this.tokens.length) {
            this.stack = [0];
            this.symbols = [];
        } else {
            this.currentTokenIndex++;
        }
    }
}

// =============================================
// ANALISADOR SEMÂNTICO
// =============================================

// Tabela de tipos da linguagem.
const tipo = {
    INT: "OURO",
    FLOAT: "ESPADA",
    STRING: "COPA",
    BOOL: "PAUS",
    ERRO: "ERRO"
};

// Armazenar entidades declaradas. Verificação de tipos.
const tabela_simbolos_semantico = new Map();

function resetTabelaSemantica() {
    tabela_simbolos_semantico.clear();
}

// Funções da tabela de símbolos semântica.
function declarar(nome, tipo) {
    if (tabela_simbolos_semantico.has(nome)) {
        throw `Variável '${nome}' já declarada`;
    }
    tabela_simbolos_semantico.set(nome, { tipo });
}

function buscar(nome) {
    if (!tabela_simbolos_semantico.has(nome)) {
        throw `Variável '${nome}' não declarada`;
    }
    return tabela_simbolos_semantico.get(nome).tipo;
}

// Verifica compatibilidade de tipos.
// Tipos Iguais : OK
// FLOAT <- INT : OK
function tiposCompativeis(dest, src) {
    if (dest === src) return true;
    if (dest === tipo.FLOAT && src === tipo.INT) return true;
    return false;
}

// Verifica operações.
// Operadores Lógicos:
// ## (AND)
// ?? (OR)
// XX (NOT)

// Operadores Relacionais:
// RECUA  (<)
// MATA   (>)
// BATE   (==)
// SEGURA (<=) 
// CANTA  (>=)
// BLEFA  (!=)

// Operadores Aritméticos:
// KING  (+) 
// JACK  (-) 
// QUEEN (/)
// AS    (*)
// RESTO (%)

// Constantes booleanas:
// REAL (True)
// FAKE (False)
function tipoResultado(op, t1, t2) {

    // Aritméticos
    if (['KING', 'JACK', 'AS', 'QUEEN'].includes(op)) {
        if (t1 === tipo.STRING || t2 === tipo.STRING) {
            if (op === 'KING' && t1 === tipo.STRING && t2 === tipo.STRING)
                return tipo.STRING;
            throw `Operador '${op}' inválido para STRING`;
        }
        if (t1 === tipo.FLOAT || t2 === tipo.FLOAT)
            return tipo.FLOAT;
        return tipo.INT;
    }

    // RESTO
    if (op === 'RESTO') {
        if (t1 !== tipo.INT || t2 !== tipo.INT)
            throw `RESTO (%) só é válido para INT`;
        return tipo.INT;
    }

    // Relacionais
    if (['MATA', 'RECUA', 'CANTA', 'SEGURA', 'BATE', 'BLEFA'].includes(op)) {
        if (!tiposCompativeis(t1, t2))
            throw `Comparação inválida: ${t1} ${op} ${t2}`;
        return tipo.BOOL;
    }

    // Lógicos binários
    if (['##', '??'].includes(op)) {
        if (t1 !== tipo.BOOL || t2 !== tipo.BOOL)
            throw `Operador lógico '${op}' exige BOOL`;
        return tipo.BOOL;
    }

    throw `Operador desconhecido: ${op}`;
}

// =============================================
// INTERFACE E INTEGRAÇÃO
// =============================================

const slrParser = new SLRParser();

document.getElementById("input-carregar-codigo-fonte").addEventListener('change', (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = function () {
        const conteudo = leitor.result;
        document.getElementById("console").value = conteudo;
        codigo_fonte = conteudo;
        mostrarResultado("📁 Arquivo carregado com sucesso!", "success");
    };
    leitor.readAsText(arquivo);
});

document.getElementById("button-limpar").addEventListener('click', () => {
    document.getElementById("resultados").innerHTML = "";
    mostrarResultado("🧹 Resultados limpos!", "success");
});

function mostrarResultado(mensagem, tipo) {
    const resultados = document.getElementById("resultados");
    const div = document.createElement("div");
    div.className = tipo;
    div.textContent = mensagem;
    div.style.fontWeight = "bold";
    resultados.appendChild(div);
    resultados.scrollTop = resultados.scrollHeight;
}

function mostrarTokens(tokens) {
    const resultados = document.getElementById("resultados");
    const tokensDiv = document.createElement("div");
    tokensDiv.className = "tokens";
    tokensDiv.innerHTML = "<strong>📋 Tokens Reconhecidos:</strong>";

    tokens.forEach(token => {
        const tokenItem = document.createElement("div");
        tokenItem.className = "token-item";
        tokenItem.textContent = `<${token.token}, "${token.lexema}"${token.tipo ? `, "${token.tipo}"` : ""}>`;
        tokensDiv.appendChild(tokenItem);
    });

    resultados.appendChild(tokensDiv);
}

function mostrarTrajetoria(trajectory) {
    const resultados = document.getElementById("resultados");
    const trajectoryDiv = document.createElement("div");
    trajectoryDiv.className = "tokens"; // Reutilizando a classe "tokens" para o estilo
    trajectoryDiv.innerHTML = "<strong>👣 Trajetória da Análise Sintática:</strong>";

    const pre = document.createElement("pre");
    pre.style.fontFamily = "monospace";
    pre.style.marginTop = "10px";
    pre.style.paddingLeft = "10px";
    pre.style.borderLeft = "2px solid #ddd";

    trajectory.forEach(step => {
        const stepItem = document.createElement("div");
        stepItem.textContent = step;
        const texto = stepItem.textContent.trim();
        if (texto.startsWith('⬅️')) { stepItem.style.fontWeight = "bold"; }
        pre.appendChild(stepItem);
    });

    trajectoryDiv.appendChild(pre);
    resultados.appendChild(trajectoryDiv);
}

function mostrarTabelaDeSimbolos(tabela_simbolos_semantico) {
    const resultados = document.getElementById("resultados");

    const tabelaSimbolosDiv = document.createElement("div");
    tabelaSimbolosDiv.className = "tokens";
    tabelaSimbolosDiv.innerHTML = "<strong> 📖 Tabela de Símbolos Semânticos:</strong>";


    let counter = 0;
    tabela_simbolos_semantico.forEach((simbolo, nome) => {
        const item = document.createElement("div");
        item.className = "token-item";

        item.textContent = `Nome do Símbolo [${counter += 1}]: ${nome} | Tipo: ${simbolo.tipo}`;

        tabelaSimbolosDiv.appendChild(item);
    });

    resultados.appendChild(tabelaSimbolosDiv);
}

document.getElementById("button-analisador-lexico").addEventListener('click', () => {
    codigo_fonte = document.getElementById("console").value;
    document.getElementById("resultados").innerHTML = "";

    if (codigo_fonte.length > 0) {
        const tokens = executarAnalisadorLexicoAFD(codigo_fonte, getTabelaSimbolos());
        mostrarResultado(`✅ Análise Léxica Concluída! ${tokens.length} Tokens Encontrados.`, "success");
        mostrarTokens(tokens);
    } else {
        mostrarResultado("❌ Nenhum código-fonte encontrado!", "error");
    }
});

document.getElementById("button-analisador-sintatico").addEventListener('click', () => {
    resetTabelaSemantica();

    codigo_fonte = document.getElementById("console").value;
    document.getElementById("resultados").innerHTML = "";

    if (codigo_fonte.length > 0) {
        const tokens = executarAnalisadorLexicoAFD(codigo_fonte, getTabelaSimbolos());
        slrParser.setTokens(tokens);
        const result = slrParser.parse();

        if (result.success) {
            mostrarResultado("✅ Análise Sintática Concluída!", "success");
            mostrarTrajetoria(result.trajectory);
            mostrarTabelaDeSimbolos(tabela_simbolos_semantico);
        } else {
            mostrarResultado("❌ Erros sintáticos encontrados:", "error");
            result.errors.forEach(error => mostrarResultado("  • " + error, "error"));
            mostrarTabelaDeSimbolos(tabela_simbolos_semantico);
        }
    } else {
        mostrarResultado("❌ Nenhum código-fonte encontrado!", "error");
    }
});

document.getElementById("button-analise-completa").addEventListener('click', () => {
    resetTabelaSemantica();

    codigo_fonte = document.getElementById("console").value;
    document.getElementById("resultados").innerHTML = "";

    if (codigo_fonte.length > 0) {
        mostrarResultado("🔍 Iniciando Análise Completa...", "success");

        const tokens = executarAnalisadorLexicoAFD(codigo_fonte, getTabelaSimbolos());
        mostrarTokens(tokens);

        slrParser.setTokens(tokens);
        const result = slrParser.parse();

        if (result.success) {
            mostrarResultado("🎉 Análise Completa Concluída!", "success");
            mostrarTrajetoria(result.trajectory);
            mostrarTabelaDeSimbolos(tabela_simbolos_semantico);
        } else {
            mostrarResultado("❌ Análise Léxica concluída, mas erros sintáticos encontrados:", "error");
            result.errors.forEach(error => mostrarResultado("  • " + error, "error"));
            mostrarTabelaDeSimbolos(tabela_simbolos_semantico);
        }
    } else {
        mostrarResultado("❌ Nenhum código-fonte encontrado!", "error");
    }
});