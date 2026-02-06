#  TRUCODE

Projeto desenvolvido para a disciplina de **Compiladores** – Bacharelado em Ciência da Computação.

O TRUCODE é uma linguagem educacional inspirada em termos de baralho, criada para implementar as três principais etapas de um compilador:

*  Análise Léxica
*  Análise Sintática (LR)
*  Análise Semântica
*  Geração de Código Intermediário (Three Address Code – TAC)

---

##  Objetivo do Projeto

Implementar um compilador completo para a linguagem **TRUCODE**, seguindo o método apresentado em aula:

1. Definição da linguagem (léxico e sintaxe)
2. Construção da gramática LR
3. Implementação da análise semântica
4. Geração de código intermediário (3 endereços)

O projeto permite visualizar:

* Tokens reconhecidos
* Trajetória do parser (Shift/Reduce)
* Trajetória da análise semântica
* Código intermediário gerado

---

##  Estrutura da Linguagem

###  Tipos Primitivos

| Tipo     | Palavra-chave | Equivalente |
| -------- | ------------- | ----------- |
| Inteiro  | `OURO`        | int         |
| Real     | `ESPADA`      | float       |
| String   | `COPA`        | string      |
| Booleano | `PAUS`        | boolean     |

---

###  Operadores

#### Lógicos

* `##` → AND
* `??` → OR
* `XX` → NOT

#### Relacionais

* `MATA` → >
* `RECUA` → <
* `SEGURA` → <=
* `CANTA` → >=
* `BATE` → ==
* `BLEFA` → !=

#### Aritméticos

* `KING` → +
* `JACK` → -
* `AS` → *
* `QUEEN` → /
* `RESTO` → %

---

##  Estruturas de Controle

### IF / ELSE

```trucode
TRUCO(condicao) {
   ...
}
CORRE {
   ...
}
```

### WHILE

```trucode
SEGUE(condicao) {
   ...
}
```

### FOR

```trucode
DISTRIBUI i DE 0 ATE 10 PASSO 1 {
   ...
}
```

---

##  Regras Semânticas Importantes

* Tipagem estática e explícita.
* Escopo global único.
* Redeclaração permitida como **reatribuição tipada**.
* Tipo da variável não pode ser alterado após primeira declaração.
* Toda variável deve ser declarada antes do uso.
* Condições de controle devem ser booleanas (`PAUS`).

---

##  Código Intermediário (TAC)

O compilador gera código de três endereços utilizando:

* Temporários (`t1`, `t2`, ...)
* Rótulos (`L1`, `L2`, ...)
* Saltos condicionais (`ifFalse`)
* Saltos incondicionais (`goto`)

Exemplo:

```
t1 = a MATA b
ifFalse t1 goto L1
PRINT "Maior"
goto L2
label L1
PRINT "Menor"
label L2
```

---

##  Interface

A aplicação possui interface web com os seguintes botões:

*  Análise Léxica
*  Análise Sintática
*  Análise Semântica
*  Gerar Código 3 Endereços
*  Limpar

A análise semântica e a geração de TAC exibem também a trajetória das etapas.

---


## 🚀 Como Executar

1. Clone o repositório:

   ```
   git clone https://github.com/phoberti/TRUCODE
   ```

2. Abra o arquivo HTML no navegador.

Não é necessário servidor backend.

---

## 👨‍🎓 Contexto Acadêmico

Projeto desenvolvido para fins acadêmicos como parte da disciplina de **Compiladores**, aplicando:

* Construção de gramática LR
* Tabela ACTION/GOTO
* Análise semântica dirigida pela sintaxe
* Geração de código intermediário

---

## 👤 Autores

- Pedro Henrique de Oliveira Berti
- Luiz Eduardo Garzon de Oliveira
- Weberson Leite


Bacharelado em Ciência da Computação
