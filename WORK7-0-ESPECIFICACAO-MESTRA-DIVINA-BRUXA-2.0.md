# WORK7.0 — ESPECIFICAÇÃO MESTRA DA DIVINA BRUXA 2.0

**Status:** contrato oficial de produto e implementação  
**Data:** 10 de setembro de 2026  
**Base de execução:** V207 publicada  
**Primeira entrega:** V208  
**Escopo:** produto, UX, conteúdo, frontend, backend, banco de dados, Whit/IA, privacidade, acessibilidade, offline, performance e qualidade.

## 1. Visão do produto

A Divina Bruxa 2.0 será um ecossistema de Tarot no qual cada destino parece continuar a mesma presença viva. A Orbe não é decoração: ela é o coração perceptivo da experiência. A Whit não substitui os mundos: conecta os mundos com consentimento. Conteúdo profundo, operação verdadeira e fluidez formam uma única promessa.

O objetivo não é parecer que há mais recursos. É permitir que a pessoa realmente:

**descubra → experimente → compreenda → pratique → registre → retorne → aprofunde → contrate**

## 2. Ordem de autoridade

1. Instrução explícita mais recente da criadora.
2. Este contrato WORK7.0 e o Plano Supremo 2.0 vigente.
3. Runtime da última versão realmente publicada.
4. Decisões recuperadas do chat Whit e documentos derivados compatíveis.
5. Addons e planos históricos.
6. Legado técnico.

Conflitos nunca serão fundidos silenciosamente. A decisão mais nova vence e a antiga permanece apenas como histórico.

## 3. Travas imutáveis

### Visual

- Preservar integralmente Orbe, imagem, shader, cores, luz, recorte circular, escala aprovada, identidade, Menu Mágico, dock e páginas.
- Home com somente a Orbe viva no espaço central. Nenhum título, subtítulo, chamada, card, preço ou bloco editorial visível volta para esse espaço.
- Cabeçalho, marca, botão do menu e dock permanecem.
- Nenhuma “magia” artificial por explosões, aleatoriedade agressiva, tremor, excesso de partículas ou atraso cenográfico.
- O visual só muda quando houver autorização explícita para aquela região e versão.

### Tarot

- Exatamente 78 cartas oficiais.
- Cartas sempre diretas; zero invertidas e zero rotação simulando inversão.
- Tarot Livre sem repetição antes de esgotar as 78.
- Tarot Livre sem significado automático dentro da experiência livre.
- Seis cartas por fileira no Tarot Livre.
- Mesa Real do aplicativo com 78 posições em 13 fileiras de 6.
- Consulta humana “Mesa Real” é um serviço separado da Mesa Real do aplicativo.

### Comércio

- Premium: R$199,90, pagamento único.
- Premium inclui todas as 30 skins.
- Cada skin também pode ser comprada separadamente pelo preço já registrado em seu catálogo.
- Orbe IA: R$89,90/mês, 400 créditos; não está incluída no Premium.
- Luna custa 1 crédito; Terra custa 10; Sol permanece desligada.
- Créditos extras: 200 por R$39,90; 600 por R$99,90; 1.500 por R$199,90.
- Consultas: Mesa Real R$250; Leitura de Mentes R$150; Carta de Conselho R$100; Pergunta R$50.
- Produção e cobrança real permanecem desligadas até nova autorização escrita.

### Privacidade

- Diário privado por padrão.
- Whit não lê Diário, pergunta, tiragem, conversa ou aula silenciosamente.
- Admin nunca mostra o corpo individual do Diário.
- Analytics nunca recebe texto privado, pergunta, resposta, cartas de uma leitura, conversa, título, tag íntima ou fingerprint.
- Toda memória de Whit é consultável, apagável, exportável e desligável.
- Público direcionado a maiores de 18 anos.

### Entrega

- Uma macroetapa por vez.
- Somente arquivos novos ou realmente substituídos.
- ZIP plano, sem pastas internas.
- Nenhuma exclusão de legado, `CNAME`, cartas ou assets sem inventário e autorização separados.

## 4. Contrato universal de experiência 2.0

Cada mundo deve funcionar como uma experiência, não como uma tela estática.

### Estados obrigatórios

| Estado | O que a pessoa percebe | Regra técnica |
|---|---|---|
| `loading` | A Orbe ou esqueleto útil mantém continuidade | Nunca cobrir uma tela válida por atraso artificial |
| `ready` | Conteúdo e ação principal disponíveis | Foco e leitura assistiva posicionados corretamente |
| `empty-honest` | Explicação verdadeira e próximo passo útil | Nunca inventar registro para preencher espaço |
| `offline` | O que existe localmente continua utilizável | Explicar claramente o que exige conexão |
| `retryable-error` | Erro compreensível e ação de tentar novamente | Preservar dados digitados e contexto |
| `auth-required` | Motivo claro para entrar | Nunca perder rascunho ao autenticar |
| `locked` | Direito necessário, preço e alternativa honesta | Sem urgência falsa ou fechamento escondido |
| `syncing` | Alteração local já segura, sincronização em andamento | Fila idempotente e recuperável |
| `success` | Resultado confirmado com próximo passo real | Nunca confirmar antes da autoridade do backend |
| `maintenance` | Recurso indisponível sem bloquear o ecossistema | Kill switch e degradação segura |

### Regras de movimento

- Uma intenção gera uma ação.
- A última intenção válida vence.
- Transições podem ser interrompidas e revertidas sem pisca.
- A tela anterior permanece pintada até a próxima estar pronta.
- Animações usam o relógio compartilhado e dormem fora da rota/viewport.
- `prefers-reduced-motion` preserva significado e resposta.
- A háptica web permanece silenciosa; somente uma ponte nativa futura pode executá-la.

### Regras de conteúdo

- Todo conteúdo tem estado editorial: `draft`, `review`, `published`, `archived`.
- Somente `published` aparece como disponível ao público.
- Conteúdo em preparação é identificado como preparação, sem data, item ou disponibilidade inventados.
- Cada conteúdo profundo terá autoria, revisão, metodologia, fontes quando aplicável e data de atualização.
- IA nunca transforma texto gerado automaticamente em verdade editorial publicada sem revisão humana.

## 5. Arquitetura técnica 2.0

### 5.1 Frontend

Manter a SPA/PWA atual e evoluir por adaptadores versionados.

Camadas alvo:

1. **Shell protegido:** header, Home, Orbe, menu, dock, offline e recuperação.
2. **Núcleo de movimento:** um relógio para Orbe, mini-Orbes, menu e transições.
3. **Navegação transacional:** intenção → preparo → passagem → confirmação → foco/scroll → conclusão.
4. **Registro de mundos:** rota, importador, capacidades, política offline e orçamento.
5. **Motores de domínio:** Tarot, Tiragens, Escola, Diário, Conteúdo, Mídia, Conta e Comércio.
6. **Whit Core:** barramento de capacidades e contexto consentido.
7. **Telemetria mínima:** somente eventos permitidos, sem conteúdo íntimo.

Regras:

- Não criar uma segunda fonte de verdade para estado já possuído por um motor.
- Não montar listener, observer, timer, player ou renderer duas vezes ao voltar à rota.
- Todo carregamento assíncrono relevante recebe cancelamento ou token de versão.
- Toda escrita local tem confirmação e mecanismo de recuperação.
- Nenhum módulo futuro entra no caminho crítico da Home.

### 5.2 Backend

Fronteiras sugeridas, todas em STAGING até autorização posterior:

| Serviço | Autoridade |
|---|---|
| Identidade | sessão, conta verificada, MFA administrativa e revogação |
| Conteúdo | publicação, revisão, idioma, versão e disponibilidade |
| Tarot diário | data de Brasília e atribuição idempotente por pessoa/dia |
| Sincronização | progresso, favoritos, Diário, skins e preferências |
| Whit | consentimento, contexto, memória, créditos, streaming e kill switches |
| Comércio | catálogo, checkout TEST, webhooks, direitos, restauração e reembolso |
| Consultas | protocolo, estado, contato por e-mail e rastreabilidade |
| Notificações | consentimento, agenda, deduplicação, expiração e deep link |
| Operação | auditoria administrativa, jobs, backup, restauração e incidentes |

Toda operação com efeito externo usa chave idempotente. Segredos e `service_role` ficam somente no backend. Nenhum sucesso comercial é confiado ao frontend.

### 5.3 Banco de dados

Antes de novas migrações, a V212/V220 deverá produzir um mapa canônico das tabelas existentes e de seus equivalentes versionados. A consolidação é aditiva e reversível; nada é apagado pelo WORK7.0.

#### Domínios canônicos alvo

| Domínio | Entidades principais | Classificação |
|---|---|---|
| Identidade | profiles, preferences, consents, devices, sessions | privada da conta |
| Conteúdo | cards, card_meanings, lessons, modules, spreads, media, products | pública publicada / editorial privada |
| Tarot | tarot_sessions, revealed_cards, daily_cards, spread_sessions | privada da conta |
| Escola | enrollments, lesson_progress, quiz_attempts, favorites | privada da conta |
| Diário | journal_entries, journal_relations, journal_sync_ops | íntima e privada |
| Whit | ai_threads, ai_messages, memory_items, context_grants, usage_reservations | íntima/operacional |
| Comércio | products, prices, purchases, subscriptions, entitlements, credit_ledger | financeira/operacional |
| Skins | skin_catalog, owned_skins, equipped_skin | pública + privada da conta |
| Consultas | consultation_requests, status_events, email_deliveries | confidencial/operacional |
| Notificações | notification_preferences, device_subscriptions, deliveries | privada/operacional |
| Operação | audit_events, webhook_events, jobs, backups | restrita |

#### Regras Supabase/Postgres

- RLS habilitada em toda tabela de schema exposto.
- Permissões explícitas por papel e por operação; `TO authenticated` nunca é autorização suficiente sem predicado de posse.
- Políticas de posse usam `user_id` indexado e identidade autenticada.
- `UPDATE` exige política de `SELECT`, `USING` e `WITH CHECK`.
- Dados de autorização ficam em `app_metadata`, nunca em `user_metadata` editável.
- Views expostas usam `security_invoker` quando suportado; caso contrário ficam em schema privado sem acesso de cliente.
- Funções privilegiadas ficam fora de `public`, revogam execução pública e verificam a pessoa/escopo internamente.
- Ledger comercial e de créditos é append-only; correções são novos eventos compensatórios.
- Webhooks guardam provedor, event ID único, hash/assinatura verificada, ambiente e estado de processamento.
- Índices seguem padrões reais de consulta; nenhum índice especulativo sem medição.
- Testes negativos provam isolamento entre duas contas e entre usuário/admin.

### 5.4 Whit 2.0 e inteligência artificial

A Whit possui dois níveis claramente separados:

1. **Presença Whit local:** guia rotas, oferece próximos passos, reconhece estados do produto e mantém linguagem/persona. Pode funcionar sem custo de API, mas não finge gerar raciocínio novo.
2. **Inteligência Whit:** conversa, tutoria e aprofundamento gerativo pelo backend. Tem custo real, usa créditos e nunca é apresentada como gratuita ou consciente.

#### Contrato de capacidades

Cada adaptador declara:

- o que pode fornecer;
- o escopo exato;
- se exige login;
- se exige consentimento;
- tempo de validade do consentimento;
- política de retenção;
- como revogar;
- fallback sem IA.

Exemplos permitidos somente após gesto explícito:

- “Conversar com Whit sobre esta tiragem” envia apenas aquela tiragem.
- “Pedir ajuda nesta aula” envia apenas o identificador e o conteúdo autorizado daquela aula.
- “Refletir sobre esta entrada” envia somente a entrada escolhida, nunca o Diário inteiro.

#### Memória

| Nível | Persistência | Exemplo | Controle |
|---|---|---|---|
| Sessão | até encerrar/apagar conversa | contexto recente | limpar conversa |
| Preferência | até alteração/exclusão | idioma, reduced motion | Conta/Privacidade |
| Memória explícita | somente após salvar conscientemente | objetivo de estudo | listar, editar, exportar, apagar |

#### Créditos e execução

`autorizar → reservar crédito → executar → transmitir → confirmar débito`  
Falha técnica antes da entrega: `liberar/restituir reserva`.  
Retry com a mesma chave: nunca cobrar novamente.

Métricas permitidas: modelo comercial, tokens, custo, cache, latência, erro, reserva, confirmação e código de falha. Prompt, resposta, Diário, pergunta e cartas não entram em analytics.

### 5.5 Performance

| Área | Orçamento final |
|---|---|
| Home | CLS 0,000 após primeiro quadro estável |
| Rotas | CLS p75 ≤ 0,05 |
| Interação | INP p75 ≤ 150 ms |
| Orbe/Menu | handler próprio p95 ≤ 4 ms |
| Quadro Orbe | JS p95 ≤ 2 ms no caminho quente |
| 60 Hz | frame p95 ≤ 16,7 ms |
| 120 Hz | frame p95 ≤ 8,3 ms em aparelho compatível |
| Long tasks | zero >50 ms atribuível à Orbe/Menu em 60 s de uso normal |
| Navegação | zero tela branca ou rota duplicada em 250 mudanças |
| LCP | p75 ≤ 2,5 s em medição real |
| Memória | sem crescimento persistente após soak e coleta |

Os números serão medidos por dispositivo e cenário. Uma melhora média não aprova uma regressão de toque, acessibilidade ou aparelhos limitados.

### 5.6 Observabilidade sem vigilância

Envelope permitido:

- `event_name`
- `schema_version`
- `occurred_at`
- `route_id`
- `session_id` pseudônimo e rotativo
- `locale`
- `device_class` ampla
- `result` técnico
- `duration_bucket`
- `error_code` controlado
- `consent_version` quando aplicável

Campos livres e texto pessoal são proibidos. Retenção é definida por categoria e exclusão de conta dispara o fluxo correspondente.

## 6. Especificações por experiência

### 6.1 Início / Orbe das Realidades — V208–V209

**Promessa:** entrar diretamente na presença da Orbe, sem ruído editorial.

- UX: apenas a Orbe central no espaço útil; toque pulsa; toque duplo abre Tarot Livre uma vez; segurar, arrastar e girar moldam a matéria; gesto cancelado não navega; teclado abre de forma equivalente.
- Frontend: um renderer WebGL, uma instância, um relógio, geometria cacheada, amostra mais recente por quadro, fallback estático interativo e ciclo de vida completo.
- Backend/DB: nenhum requisito para o funcionamento base; skin equipada sincroniza futuramente por preferência de conta.
- Whit: presença não verbal/local pode responder a estado; nenhum dado privado é necessário.
- Performance: nada de layout read no `pointermove`; nada de scroll/overscroll capturado fora da Orbe; nenhum loop invisível.
- Gate: bateria completa de gesto V208; 30 skins e recuperação de contexto V209; regressão visual zero.

### 6.2 Menu 2.0 — V210–V211

**Promessa:** o universo inteiro está acessível em uma passagem contínua.

- UX: preservar as duas órbitas, posições, ícones, rótulos, mini-Orbe e composição aprovados; abrir/fechar reversível; Escape, foco inicial e retorno de foco.
- Frontend: máquina única `CLOSED/OPENING/OPEN/REVERSING/CLOSING/NAVIGATING`; `inert` e `aria-hidden` coerentes; fundo não recebe toque.
- Conteúdo: todos os destinos reais; nenhum item que leve a tela vazia.
- Performance: somente transform/opacity durante transição; camadas dormem fechadas.
- Gate: 100 ciclos + 100 reversões, matriz de viewport, teclado, leitor de tela e zoom 200%.

### 6.3 Whit / Orbe IA — V212

**Promessa:** uma guia simbólica, original, útil e transparente que conecta o ecossistema com consentimento.

- UX: conversa cancelável, streaming ancorado, copiar, tentar novamente, excluir, histórico e controle de memória; queda do serviço nunca prende a tela.
- Conteúdo: linguagem simbólica e responsável; não afirmar consciência, telepatia, contato com pessoa real, destino inevitável ou certeza sobrenatural.
- Frontend: presença local separada do cliente gerativo; adaptadores por capacidade; uma conversa ativa por conta no baseline.
- Backend: proxy seguro, limites, moderação, reservas de crédito, idempotência, kill switches e métricas técnicas.
- DB: threads/mensagens privadas; memórias explícitas; grants de contexto; ledger e uso operacional separados.
- Privacidade: nenhuma leitura implícita; nenhum conteúdo em analytics ou Admin.
- Gate: capacidades desligáveis, memória apagável, consentimento comprovável, Sol desligada e zero chamada paga real.

### 6.4 Tiragens 2.0 — V213

**Promessa:** escolher um método, compreender cada posição e concluir uma leitura sem quebra de continuidade.

- UX: preservar os 15 métodos atuais, filtros e desenhos aprovados; escolha → preparação → distribuição → revelação → síntese/salvar.
- Conteúdo: posições, regras e significados editoriais reais; Mesa Real 13 × 6; cartas únicas em cada método.
- Frontend: sessão transacional, pré-decodificação da próxima carta, DOM agrupado, retomada e cancelamento ao reiniciar/sair.
- Backend/DB: sessão e cartas por pessoa quando salvar; autosave Premium conforme direito; idempotência.
- Whit: aprofundamento opcional só para aquela tiragem e após consentimento.
- Gate: todos os métodos sem duplicação, posição errada, carta repetida, salto ou sessão corrompida.

### 6.5 Tarot Livre 2.0 — V214

**Promessa:** liberdade para atravessar o baralho inteiro sem interpretação imposta.

- UX: Orbe como gatilho; revelar uma carta por intenção; transição de sucção/espiral aprovada; reset e embaralhar restantes; grid 6 por fileira.
- Conteúdo: somente nome/arte e controles necessários; zero significado dentro do Livre.
- Frontend: shuffle único, 78 sem repetição, zero inverted, sessão recuperável e transição sem quadro preto.
- Backend/DB: pode funcionar localmente; sincronização de sessão somente se autorizada/necessária.
- Whit: não interrompe nem interpreta automaticamente; ação de aprofundar, se existir, é separada e consentida.
- Gate: dez sessões completas de 78 cartas sem repetição, ausência, inversão ou congelamento.

### 6.6 Biblioteca 2.0 — V215

**Promessa:** a referência mais profunda e navegável das 78 cartas em português, com equivalência planejada para EN/ES.

- UX: busca instantânea, filtros, favoritos, comparação e relações; páginas indexáveis; imagem sempre estável.
- Conteúdo por carta: descrição observável, arquétipo, luz/sombra, amor, trabalho, dinheiro, espiritualidade, conselho, símbolos, cores, personagens, objetos, combinações, tiragens relacionadas, fontes, autoria e revisão.
- Frontend: índice local, render progressivo, deep links e cancelamento de busca.
- Backend/DB: catálogo editorial versionado e publicação por idioma; favoritos privados.
- Whit: responde sobre a carta aberta apenas mediante ação; diferencia conteúdo editorial de síntese gerada.
- Gate: 78/78 completas, únicas, interligadas, sem placeholder e com revisão registrada.

### 6.7 Carta do Dia 2.0 — V216

**Promessa:** um ritual diário consistente, profundo e sem manipulação.

- UX: uma carta, significado profundo, reflexão, prática e pergunta opcional de Diário; histórico e lembrete opt-in; sem punição por sequência quebrada.
- Frontend: cache da carta já revelada e funcionamento offline após a primeira abertura.
- Backend/DB: atribuição idempotente por conta/data em `America/Sao_Paulo`; para visitante, continuidade por dispositivo sem fingir sincronização universal.
- Whit: aprofundamento opcional daquela carta, sem ler o Diário.
- Notificação: nunca revela a carta no alerta.
- Gate: mesma carta durante todo o dia e em todos os dispositivos da conta; zero corrida de atribuição.

### 6.8 Escola completa 2.0 — V217

**Promessa:** uma jornada real do primeiro contato à leitura avançada.

- Conteúdo: 17 módulos; 78 aulas de cartas + 46 teóricas = 124 aulas atuais; exercícios, quizzes explicados, revisão espaçada, desafios e plano de 30 dias.
- UX: trilha, progresso, retomada, busca, filtros, favoritos, notas e feedback; certificado somente com critérios verificáveis.
- Frontend: lições sob demanda, pré-carregamento da próxima unidade e offline Premium baixado conscientemente.
- Backend/DB: progresso, tentativas e favoritos por conta; publicação/versionamento editorial.
- Whit: tutora opcional da aula atual; não substitui conteúdo editorial nem responde como verdade absoluta.
- Gate: percurso iniciante/intermediário/avançado completo, sem aula vazia ou progresso perdido.

### 6.9 Diário e Espelho 2.0 — V218

**Promessa:** registrar e perceber padrões pessoais com soberania e privacidade.

- UX: título, texto, data, humor, tags, favorito, relações, autosave, busca, calendário, timeline, exportação e exclusão.
- Frontend: local-first, escrita sem atraso, fila de sync idempotente, recuperação de rascunho e conflito explícito.
- Backend/DB: corpo privado por pessoa; metadados mínimos; export/delete; criptografia e retenção documentadas.
- Espelho: somente agregados explicáveis; nunca diagnóstico médico, psicológico ou certeza espiritual.
- Whit: recebe uma entrada escolhida por gesto e consentimento temporário; o Diário inteiro nunca é varrido.
- Analytics/Admin: zero corpo, título, tag, pergunta ou resumo.
- Gate: nenhum rascunho perdido, conflito recuperável e testes negativos de acesso cruzado.

### 6.10 Skins 2.0 — V209 e V219

**Promessa:** vestir a mesma presença viva com propriedade e continuidade.

- UX: 30 skins reais; experimentar, possuir, equipada, incluída no Premium, comprar separadamente e restaurar são estados distintos.
- Frontend: preview temporário; thumb → full atômico; uma autoridade de textura; mudança global em Orbe principal, dock e demais superfícies.
- Backend/DB: catálogo e preços versionados; direito vindo de Premium ou compra individual; preferência equipada por conta.
- Comércio: frontend nunca cria direito; confirmação vem de webhook/restore validado em STAGING.
- Performance: apenas a skin escolhida é pré-decodificada; sem download duplo ou flash.
- Gate: 30/30 sem troca incorreta, direito perdido, cobrança, regressão ou duas autoridades WebGL.

### 6.11 Premium 2.0 — V219

**Promessa:** uma compra única clara, valiosa e separada da IA.

- Verdade: R$199,90 uma vez; inclui tiragens avançadas, Mesa Real do app, Escola completa, Diário avançado, histórico/favoritos/exportação/offline Premium, personalização e todas as 30 skins.
- UX: comparador Free/Premium/Orbe IA; estado atual; restaurar; histórico; paywall honesto com fechar visível e alternativa “Agora não”.
- Backend/DB: produto, preço, compra e entitlement; webhooks idempotentes; reembolso/revogação e reconciliação.
- Regra: não inclui Orbe IA, créditos extras ou consultas.
- Gate: direitos determinísticos e restauráveis em Stripe TEST; nenhuma cobrança live.

### 6.12 Conta 2.0 — V220

**Promessa:** uma identidade segura que continua a jornada sem aprisioná-la.

- UX: criar conta, entrar, verificar e-mail, recuperar, sessões/dispositivos, preferências, exportar, excluir e encerrar conta.
- Frontend: inicialização idempotente, retorno preservado e nenhum formulário duplicado.
- Backend/DB: Auth, sessões curtas para ações sensíveis, RLS default deny, isolamento por pessoa, revogação e trilha administrativa.
- Sincronização: Carta do Dia, Escola, Diário, favoritos, compras e skin equipada por opção/capacidade.
- Admin: MFA obrigatório e autorização em metadata controlada pelo backend.
- Gate: duas contas nunca acessam dados uma da outra; exclusão/exportação executáveis em STAGING.

### 6.13 Consultas 2.0 — V220

**Promessa:** contratar atendimento humano com clareza, contexto e rastreabilidade.

- Serviços: Mesa Real R$250; Leitura de Mentes R$150; Carta de Conselho R$100; Pergunta R$50.
- UX: comparar, escolher, preencher, revisar, consentir, enviar, receber protocolo e acompanhar estado.
- Campos mínimos: nome, e-mail, serviço e pergunta/contexto necessário; contato operacional por e-mail, sem WhatsApp.
- Backend/DB: solicitação durável; eventos `received/awaiting-confirmation/confirmed/completed/cancelled`; e-mail transacional idempotente em STAGING.
- Regra: não mostrar falsa agenda, vaga, confirmação ou pagamento.
- Whit: pode explicar diferenças entre serviços; nunca finge realizar a consulta humana contratada.
- Gate: submissão única, protocolo rastreável e e-mail controlado; zero cobrança real.

### 6.14 Loja Mística 2.0 — V221

**Promessa:** curadoria transparente, não catálogo inflado.

- Conteúdo: preservar as 21 escolhas existentes e seus destinos oficiais; preço/disponibilidade externos são apresentados como externos e sujeitos ao parceiro.
- UX: finalidade, por que foi escolhido, transparência de afiliado e saída clara para parceiro.
- Frontend: imagens e detalhes sob demanda; retorno da loja externa preserva contexto quando possível.
- Backend/DB: catálogo editorial, status, destino validado, código de afiliado configurado fora do conteúdo quando aplicável.
- Whit: recomenda somente itens realmente publicados e nunca inventa disponibilidade.
- Gate: zero link falso, produto inventado, código ausente tratado como ativo ou alegação comercial enganosa.

### 6.15 Música 2.0 — V221

**Promessa:** escutar o trabalho autoral no mesmo universo, sem autoplay ou players órfãos.

- Conteúdo: 2 álbuns oficiais, créditos, contexto e destinos oficiais.
- UX: catálogo → detalhe → ouvir; play/pause confiável; saída para plataforma externa claramente marcada.
- Frontend: player carregado por intenção; um player ativo; pausa ao sair quando apropriado; retorno sem duplicar áudio.
- Backend/DB: catálogo editorial e estados de publicação; nenhum stream hospedado sem direito.
- Whit: orienta entre obras existentes, sem imitar voz/letra ou inventar faixa.
- Gate: zero autoplay, áudio duplicado, capa vazia ou faixa inexistente.

### 6.16 Vídeos / De Frente com o Tarot 2.0 — V221

**Promessa:** um espaço editorial honesto para a futura série.

- Verdade atual: nenhum episódio oficial publicado; piloto em preparação.
- UX enquanto vazio: explicar formato, proposta e estado real; oferecer retorno ao ecossistema, sem cards fictícios.
- UX quando publicado: temporadas, episódios, descrição, créditos, acessibilidade, transcrição e link oficial.
- Frontend: player somente após intenção; desmontar ao sair; poster e proporção estáveis.
- Backend/DB: workflow `draft/review/published/archived`; somente publicado aparece.
- Whit: nunca inventa episódios, convidados, datas, falas ou disponibilidade.
- Gate: o estado vazio é útil e verdadeiro; publicação futura exige registro oficial completo.

### 6.17 Notificações 2.0 — V222

**Promessa:** presença escolhida, nunca vigilância ou interrupção manipulativa.

- Categorias: Carta do Dia, Escola, Consultas, Conta/Segurança, Billing, Orbe IA, Música, Episódios, Skins e Marketing.
- UX: opt-in por categoria, canal, frequência, horário silencioso, pausa total e deep link; desligar é imediato.
- Padrão: 22h–8h em `America/Sao_Paulo`; eventos críticos de segurança seguem política explícita própria.
- Backend/DB: preferências versionadas, dispositivo, consentimento, agenda, dedupe key, expiração, envio e resultado.
- Privacidade: nunca segmentar por Diário, pergunta, tiragem, cartas ou conversa.
- Whit: linguagem simbólica pode dar presença, mas nunca afirma previsão certa ou conhecimento oculto.
- Gate: zero envio sem consentimento, duplicado, vencido, fora de horário ou baseado em conteúdo privado.

### 6.18 Admin, Analytics e Mapa — V223

**Promessa:** operar com fatos sem observar intimidade.

- Admin: owner autorizada, MFA, privilégio mínimo, módulos sob demanda, auditoria e kill switches.
- Analytics: DAU/WAU/MAU, retenção, funis, aquisição e economia por produto; apenas eventos mínimos.
- Mapa: país/região agregados com limiar de privacidade; sem localização precisa individual.
- Diário/Whit: apenas saúde técnica e contagens agregadas permitidas; nenhum conteúdo.
- Gate: MFA e RLS comprovados, painéis estáveis e schemas rejeitando campos privados.

### 6.19 SEO/ASO, LGPD, PWA e fluidez global — V224–V226

- SEO público: Home, 78 cartas, Tiragens, Escola, Consultas, Música, Episódios publicados e Loja; canonical, hreflang PT-BR/EN/ES, sitemap, robots, OG e dados estruturados.
- `noindex`: Conta, Diário, Whit/conversas, Admin, checkout, consulta individual e URLs sensíveis.
- LGPD: mapa de dados, consentimentos, vendors, retenção, exportação, correção, exclusão, incidentes e linguagem clara.
- PWA: Tarot Livre, Diário local, Escola Premium baixada, Carta do Dia já revelada e skins disponíveis offline; Whit, compras, restore e billing bloqueados offline com explicação.
- V225: uma navegação transacional, manifesto autoritativo, cache atômico e última versão boa recuperável.
- V226: matriz PT-BR/EN/ES, mobile/desktop/PWA/offline/BFCache/rede, acessibilidade e soak completo.

## 7. Critérios de aceite transversais

- P0 = 0 e P1 = 0.
- Regressão visual zero fora de exceção explicitamente autorizada.
- Nenhuma tela branca, preta involuntária, vazia enganosa ou loader órfão.
- Nenhuma ação duplicada por clique, toque, retry, webhook ou retorno de rede.
- Nenhum dado íntimo em analytics, logs, Admin, URL ou cache público.
- Nenhum conteúdo ou disponibilidade inventado.
- Toda tela possui estados de loading, vazio honesto, offline, erro e recuperação aplicáveis.
- Conteúdo público profundo tem autoria/revisão/data conforme o domínio.
- Teclado, toque, leitor de tela, zoom 200%, reduced motion e save-data não bloqueiam tarefa principal.
- Rollback, hashes e evidência acompanham cada versão.

## 8. Contrato de execução

O WORK7.0 não tentará implementar dezenove macroetapas ao mesmo tempo. Esta especificação fixa o destino; cada versão transforma somente a autoridade prevista na ordem oficial.

A V208 inicia o trabalho no ponto mais sensível da experiência: a relação física entre a pessoa e a Orbe. Quando a criadora instalar e aprovar a V208, a V209 concluirá skins e resiliência da Orbe. O Menu 2.0 só começa depois desse fechamento.
