# DIVINA BRUXA — V535 · Fonte de Verdade e Orbe Fluida

Data do corte: 12 de setembro de 2026  
Base confirmada: V534 em `origin/main` (`50e296aa3743ff74671f584a38340566b4bcf211`)  
Plano: Divina Bruxa 3.0 — Universo Vivo  
Macroetapa: 1 de 14  
Ambiente: STAGING  
Pacote: incremental, plano, sem remoções e sem alterações de CSS

## Veredito

**PASS_WITH_BLOCKERS — 104 PASS · 0 FAIL · 4 BLOCKED.**

A V535 conclui a Fonte de Verdade e o Registro Vivo e corrige estruturalmente a lentidão percebida na navegação da Orbe. O visual aprovado não foi redesenhado: não há CSS novo nem alteração da imagem, do recorte, da escala ou da geometria principal.

O ganho foi verificado por contratos determinísticos e orçamentos de execução. A medição perceptiva final ainda precisa acontecer nos aparelhos físicos da proprietária; por isso, não existe declaração de produção pronta.

## As 14 macroetapas do Plano Supremo 3.0

| # | Versão | Macroetapa | Estado neste corte |
|---:|---:|---|---|
| 1 | V535 | Fonte de Verdade e Registro Vivo | CONCLUÍDA |
| 2 | V536 | Barramento de Vitalidade e Gramática Viva | PRÓXIMA |
| 3 | V537 | Origem, Home, Menu e Descoberta | PLANEJADA |
| 4 | V538 | Universo do Tarot Vivo | PLANEJADA |
| 5 | V539 | Sabedoria Viva Profunda | PLANEJADA |
| 6 | V540 | Whit Presença Profunda | PLANEJADA |
| 7 | V541 | Experiências, Conteúdo e Conversão | PLANEJADA |
| 8 | V542 | Identidade, Direitos, Skins e Presença | PLANEJADA |
| 9 | V543 | Observatório e Estúdio Editorial | PLANEJADA |
| 10 | V544 | Biblioteca Pública, 78 Cartas, Guias e Busca | PLANEJADA |
| 11 | V545 | Paridade PT-BR, Inglês e Espanhol | PLANEJADA |
| 12 | V546 | PWA, Performance, Offline e Recuperação | PLANEJADA |
| 13 | V547 | Segurança, Privacidade e Matriz Física | PLANEJADA |
| 14 | V548 | QA Supremo 3.0 e Owner Review | PLANEJADA |

## Diagnóstico da lentidão

| Gargalo encontrado | Comportamento anterior | Correção V535 |
|---|---|---|
| Fila de navegação | Toques em destinos diferentes eram encadeados e podiam executar depois. | Uma única passagem ativa; toques excedentes são coalescidos, sem backlog. |
| Montagem no gesto | `pointerdown` podia importar CSS, construir DOM e inicializar o mundo. | O gesto apenas aquece import/CSS; a montagem acontece fora do hot path. |
| Preparação bloqueante | A rota esperava o módulo inteiro, com timeout de até 15 s. | Orçamento máximo de 48 ms, ou 24 ms no perfil restrito; o módulo pode terminar depois da abertura. |
| Fechamento do Menu | A rota aguardava todas as animações do Menu, com watchdog de até 1,2 s. | Menu fecha em paralelo e é reassentado no commit, sem bloquear a rota. |
| Viagem longa | Perfil normal somava cerca de 714 ms nas quatro fases. | Perfil tátil soma 442 ms; perfil restrito, 348 ms; movimento reduzido, 226 ms. |
| Cópias da Orbe | Espelho de viagem podia pintar a 30 fps e até 760 px; projeções, a 24 fps. | Touch: 18 fps e 560 px; restrito: 12 fps e 460 px; projeções caem para 5/8 fps durante a passagem. |
| Universo no iPhone | `deviceMemory` ausente podia classificar Safari móvel como cinematográfico. | Toque/mobile começa equilibrado; 45 fps/1,58× ou protegido a 30 fps/1,32×. Durante a passagem: 30/24 fps. |
| Rolagem concorrente | O commit iniciava `smooth scroll` junto da chegada da Orbe. | O commit usa reposicionamento imediato; a viagem continua sendo a única animação narrativa. |

Redução nominal do perfil tátil: **272 ms, aproximadamente 38%**, sem remover as fases `lift`, `flight`, `arrival` e `settle`.

## Fonte de Verdade e Registro Vivo

- 17 realidades na mesma ordem de `route-registry-v180.js`.
- Para cada realidade: família, nome, propósito, assinatura, portal, âncoras de viagem e, quando aplicável, pouso semântico.
- `supreme-orb-core-v501.js`, `orb-ios-journey-core-v525.js` e `orb-universal-presence-v526.js` deixam de manter mapas duplicados.
- Verdades canônicas registradas: 78 cartas diretas, 6 colunas, 15 tiragens, Cruz Celta com 10 posições, Mesa Real 13 × 6, Escola com 17 módulos/124 aulas e 30 skins.
- Autoridade comercial ativa preservada em `commercial-truth-v200.js`: R$ 500, R$ 500, R$ 300 e R$ 150.
- Divergências históricas de preço permanecem marcadas como decisão da proprietária; nenhuma superfície é reescrita silenciosamente.
- O Registro Vivo não lê campos, Diário, storage, APIs ou conteúdo privado e não cria loop de animação.

## Tests

| Escopo | Resultado | Evidência |
|---|---:|---|
| QA determinístico V535 | 104 PASS · 0 FAIL · 4 BLOCKED | `node qa-v535-fonte-verdade-orbe-fluida.mjs` |
| Sintaxe JavaScript do corte | PASS | 12 módulos verificados |
| Registro e roteador | PASS | 17/17 rotas, ordem e aliases canônicos |
| Navegação | PASS | single-flight, menu não bloqueante, preparação 48/24 ms |
| Viagem móvel | PASS | 442/348/226 ms por perfil; mirror budgetado |
| Home e Orbe | PASS | uma Home, uma Orbe e um canvas principal |
| Cofre visual legado | PASS | `node verify-visual-lock-v1.mjs` |
| Catálogo canônico | PASS | `node verify-catalog-v5.mjs` · 33/33 |
| Tarot e Tiragens | PASS | 78 únicas; 6 colunas; 15 métodos; Cruz Celta 10; Mesa Real 13 × 6 |
| Grafo de módulos | PASS | imports locais resolvidos |
| Referências locais | PASS | `index.html` e service worker sem recurso ausente |
| PWA/cache | PASS | app, páginas de instalação, SW e quatro caches alinhados em V535 |
| Segredos | PASS | nenhum valor reconhecível de chave secreta |

Suítes antigas que congelam hashes, números de versão ou o conteúdo de um pacote histórico não são gates desta entrega incremental. O gate vigente é a suíte V535, acompanhado pelos testes independentes do catálogo e do cofre visual.

## Preservações confirmadas

- A única Orbe física continua em `#orb`; nenhum motor independente foi criado.
- O Universo visual continua sendo V524 e recebe a energia da mesma Orbe.
- A matéria interna continua acompanhando o gesto; o corpo da esfera permanece imóvel.
- Toque simples desperta; toque duplo abre Tarot Livre uma vez.
- Sem `navigator.vibrate`; apenas a ponte háptica nativa opcional já existente.
- Sem número 33 ou texto novo dentro da Orbe principal.
- Whit V527, Tarot V528, Sabedoria Viva V529, Experiências V530, Identidade V531, Admin V532, Responsividade V533 e QA V534 permanecem conectados.
- Sem billing real, publicação, DNS, submissão em lojas ou Sol.

## Blocked

1. **Dispositivos físicos:** medir a navegação em iPhone, iPad e Android reais; retrato/paisagem, teclado, voltar/avançar, segundo plano, Safari e PWA instalada.
2. **Proprietária real:** validar e-mail, MFA TOTP AAL2, códigos de recuperação, revogação e nova sessão.
3. **Mesa Real autenticada:** validar entitlement Premium STAGING, 13 × 6, autosave, retomada e continuidade em outro aparelho.
4. **Backup/restore:** executar restauração isolada e registrar RPO/RTO.

## Checklist depois de instalar

- Atualizar a Home uma vez e confirmar visual idêntico da Orbe.
- Abrir o Menu e tocar rapidamente em destinos diferentes; apenas o primeiro voo deve ser concluído, sem rotas atrasadas abrindo depois.
- Navegar por todas as 17 realidades e confirmar que a tela abre enquanto conteúdos pesados terminam de preparar.
- Confirmar que o Menu desaparece junto da passagem, sem espera extra e sem rolagem suave concorrente.
- Fazer toque simples, arraste, segure e toque duplo na Orbe; o corpo não deve sair do lugar e o Tarot Livre deve abrir uma vez.
- No iPhone, testar Safari e PWA instalada em retrato e paisagem; observar fluidez do voo, do Universo e dos pousos.
- Confirmar Tarot Livre com 78 cartas, 6 colunas, orientação direta e sem repetição.
- Confirmar que Auth, Whit gerativa, billing, Admin e envio de Consultas continuam exigindo conexão segura.

## Próxima macroetapa

**V536 — Barramento de Vitalidade e Gramática Viva.** A etapa seguinte conectará sinais de vida, estados e ritmos compartilhados entre os mundos, usando o Registro Vivo V535 como base e preservando o orçamento de navegação conquistado aqui.
