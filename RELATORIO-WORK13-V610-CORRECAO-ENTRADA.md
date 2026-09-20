# WORK13 V610 — Correção Suprema da Entrada

Correção concluída dentro do WORK13, sobre o V610 instalado. A Home não foi reconstruída.

## O que muda

- nasce uma única intenção, `Entrá`, abaixo da Orbe canônica;
- `Entrá` e a própria Orbe respondem imediatamente ao toque;
- a abertura reutiliza a continuidade V598 e o menu vivo V593;
- os balões mostram somente os nomes das 15 realidades públicas;
- a Orbe, o canvas, o motor, a viagem e o roteador continuam únicos;
- nenhum tutorial, caixa, navegação automática, nova Orbe ou WORK14 foi criado.

## Proteções

- `cosmos-final-orchestra-v610.js` permanece idêntico ao pacote V610 instalado (SHA-256 `ebfe097b…ca0`);
- toque duplo na Orbe continua pertencendo ao Tarot Livre;
- no máximo duas intenções continuam visíveis por quadro, conforme o menu V593;
- o novo CSS não usa keyframes, filtros nem backdrop blur;
- o convite desaparece quando o menu nasce, durante a viagem e fora da Home.

## Verificação executada

| Camada | Resultado |
|---|---:|
| Estrutura e proteção | 58/58 PASS |
| Resposta, menu e nomes | 45/45 PASS |
| 7 perfis iPhone + ciclo de 15 realidades | 66/66 PASS |
| Orquestra final V610 preservada | 120/120 PASS |
| Continuidade de 17 rotas preservada | 76/76 PASS |
| Total desta execução | 365/365 PASS |

Os perfis iPhone foram verificados de forma determinística (375×667 a 932×430), incluindo retrato, paisagem, safe areas e movimento reduzido. O passe tátil em aparelho físico deve ser feito após a publicação, conforme as instruções de instalação; este relatório não afirma teste em hardware físico.
