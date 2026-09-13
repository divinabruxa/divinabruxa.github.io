# DIVINA BRUXA V536 — QA da Vitalidade e Gramática Viva

Plano Supremo Divina Bruxa 3.0 — Macroetapa 2 de 14  
Data: 13 de setembro de 2026  
Base obrigatória: V535 instalada  
Estado: **PASS_WITH_BLOCKERS**

## Resultado automatizado

- 77 verificações totais
- 73 PASS
- 0 FAIL
- 4 BLOCKED por exigirem evidência humana ou ambiente conectado
- 0 P0/P1 automatizado conhecido

Comando:

```bash
node qa-v536-vitalidade-gramatica-viva.mjs
```

## Contrato entregue

O `vitality-bus-v536.js` converte sinais públicos já emitidos por Orbe, Menu,
roteador e carregador em um estado único. O barramento possui oito fases e 18
sinais oficiais, coalescidos por microtarefas. Não existe loop de animação,
requisição de rede, leitura de formulário, armazenamento ou coleta de conteúdo.

O `living-grammar-v536.js` projeta esse estado em 11 atributos semânticos no
elemento raiz. O CSS associado contém somente tokens de tempo e movimento
reduzido: não acrescenta filtro, sombra, transformação ou animação visual.

## Evidências principais

- Barramento instanciado antes do despertar da Orbe para não perder sinais.
- Uma única saída pública: `divina:vitality`.
- Histórico efêmero limitado a 24 sinais e nunca persistido.
- Detalhes sanitizados por lista fechada de campos escalares.
- Assinaturas canceláveis por `AbortSignal`.
- Erros de rota, página ou viagem convergem para recuperação explícita.
- Segundo plano converge para pausa; retorno converge para presença.
- Offline/online, Menu, Orbe e páginas usam o mesmo vocabulário.
- V535 single-flight, orçamento tátil de 442 ms e scroll não concorrente preservados.
- Uma Home, uma Orbe física, um canvas e zero número 33 dentro da Orbe.
- Whit básica continua local, com zero chamada de modelo acrescentada.
- Tarot mantém 78 cartas diretas, únicas, grade de 6 e Mesa Real 13 × 6.
- App, PWA, HTML e quatro caches alinhados na V536.
- 40 referências locais do HTML e 192 recursos do service worker resolvidos.

## Validações manuais bloqueadas

| Gate | Evidência necessária |
| --- | --- |
| Fluidez física | Home → Menu → Tarot → voltar em iPhone e Android reais, sem travamento perceptível |
| Acessibilidade física | VoiceOver/TalkBack e movimento reduzido em aparelhos reais |
| Segurança ADMIN | Owner real com AAL2/RLS e resposta 403 para conta comum no ambiente conectado |
| Mesa Real Premium | Sessão autenticada no STAGING, 78 cartas e nenhuma cobrança real |

Esses gates não são falhas do pacote e não autorizam produção. Permanecem
formalmente bloqueados até evidência real na Macroetapa 14.

## Verificação pós-instalação pela proprietária

1. Atualize o site uma vez e reabra a PWA.
2. Toque uma vez na Orbe: ela deve responder sem abrir uma página.
3. Toque duas vezes: Tarot Livre deve abrir uma única vez.
4. Abra e feche o Menu e visite duas páginas em sequência.
5. Confirme que não há congelamento, salto horizontal ou segunda Orbe.
6. Ative “Reduzir Movimento” no aparelho e repita a navegação.

Próxima entrega autorizada pelo plano: **V537 — Origem, Home, Menu e Descoberta**.
