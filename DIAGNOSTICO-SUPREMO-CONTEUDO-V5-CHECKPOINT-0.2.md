# Diagnóstico Supremo de Conteúdo — Divina Bruxa V5

## Checkpoint 0.2 concluído

**Base inspecionada:** V77 — Centro Mobile Exato  
**Escopo:** conteúdo, rotas, motores, catálogo, páginas, PWA e integrações  
**Regra:** nenhuma alteração na aparência aprovada  
**Data técnica:** 31 de agosto de 2026

---

## 1. Resultado executivo

A V77 possui uma base visual aprovada e uma estrutura funcional capaz de sustentar a próxima fase. O diagnóstico confirmou:

- 14 telas registradas no aplicativo;
- 14 destinos de navegação;
- nenhum botão `data-go` apontando para tela inexistente;
- nenhuma tela principal sem caminho de acesso;
- 78 registros de tarot únicos;
- O Louco no índice 0;
- Rei de Ouros no índice 77;
- zero orientação invertida;
- 78 imagens individuais válidas;
- 78/78 imagens associadas corretamente ao atlas original;
- 78 páginas editoriais individuais;
- 78 conjuntos profundos de significados já escritos;
- sitemap com Home + 78 cartas;
- sintaxe válida em todos os arquivos JavaScript atuais.

O maior achado é positivo: o conteúdo profundo das 78 cartas já existe em `tarot-meanings.js` e nas páginas `carta-*.html`, mas o aplicativo principal ainda usa o gerador simplificado de `meaning-engine.js`. A próxima fase não precisa reescrever tudo do zero; precisa criar uma fundação canônica e integrar corretamente o conteúdo rico.

---

## 2. Proteções confirmadas

O diagnóstico não alterou:

- Orbe principal;
- motor WebGL;
- mini-orbes;
- Menu Mágico;
- menu inferior;
- centralização mobile;
- abertura e fechamento dos menus;
- imagens das cartas;
- estilos ou animações;
- navegação V75/V77;
- service worker V77.

Nenhum arquivo do site precisa ser substituído neste checkpoint.

---

## 3. Auditoria das 78 cartas

### Catálogo atual

`tarot-data.js` contém exatamente 78 cartas:

- 22 Arcanos Maiores;
- 14 cartas de Copas;
- 14 cartas de Espadas;
- 14 cartas de Paus;
- 14 cartas de Ouros.

Resultado:

- IDs únicos: 78/78;
- nomes únicos: 78/78;
- primeira: O Louco;
- última: Rei de Ouros;
- orientação invertida encontrada: 0;
- imagem ausente: 0;
- imagem corrompida: 0.

### Imagens

- 77 arquivos JPG;
- 1 arquivo PNG (`card-47.png`);
- todas as 78 imagens medem 300 × 450 px;
- atlas `tarot-atlas.webp`: 3000 × 3600 px;
- comparação visual automatizada confirmou 78/78 associações corretas entre arquivo individual e posição no atlas.

### Conteúdo profundo recuperado

`tarot-meanings.js` possui:

- versão candidata 2.0.0;
- 78 cartas;
- 78 orientações `normal`;
- 15 camadas editoriais por carta;
- validação interna aprovada sem erros.

Camadas disponíveis:

- essência;
- energia do dia;
- palavras-chave;
- luz;
- tensão;
- amor;
- relacionamentos;
- carreira;
- dinheiro;
- espiritualidade;
- desafio;
- conselho;
- símbolos;
- pergunta de reflexão;
- ação prática.

### Páginas editoriais

- 78 arquivos `carta-*.html`;
- título presente em 78/78;
- descrição presente em 78/78;
- canonical presente em 78/78;
- conteúdo completo presente em 78/78;
- stylesheet compartilhado `card-page.css`;
- sitemap contém 78 URLs de cartas e a Home.

### Problema principal

O aplicativo usa `meaning-engine.js`, que gera textos menores a partir de naipe e número. O conteúdo profundo de `tarot-meanings.js` ainda não alimenta Carta do Dia nem Tiragens.

**Classificação:** `PARCIAL — CONTEÚDO RICO EXISTE, MAS NÃO ESTÁ INTEGRADO`.

---

## 4. Mapa das telas e classificação

| Área | Estado | Evidência | Próxima necessidade |
|---|---|---|---|
| Home / Orbe Viva | FUNCIONAL E APROVADA | V77 aceita; navegação ativa | Congelar e proteger por regressão |
| Menu Mágico | FUNCIONAL E APROVADO | Todas as rotas principais acessíveis | Não adicionar item vazio |
| Menu inferior | FUNCIONAL E APROVADO | Início, Caminhos, Orbe IA, Diário e Conta | Preservar |
| Tarot Livre | FUNCIONAL LOCAL | 78 posições, sem repetição, reset, embaralhar e persistência local | Testes automáticos e futura sincronização |
| Carta do Dia | PARCIAL | Fuso Brasília e persistência local funcionam | Backend por conta e conteúdo profundo |
| Tiragens | PARCIAL | 6 estruturas, cartas únicas e salvamento no Diário | Estruturas oficiais, contexto, síntese e retomada |
| Biblioteca das 78 cartas | PARCIAL AVANÇADA | 78 páginas e conteúdo profundo existem | Integrar ao app e criar acesso editorial |
| Escola do Tarot | PLACEHOLDER | Apenas título e introdução | Construir 17 módulos e 78 aulas |
| Diário | PARCIAL FUNCIONAL | Criar, buscar, excluir, exportar e agregar localmente | Editar, autosave, favoritos, calendário, offline/sync |
| Espelho | PARCIAL | Estatísticas locais simples | Agregados úteis, explicáveis e sem diagnóstico |
| Orbe IA | BLOQUEADA / DEMONSTRAÇÃO | `apiBase` vazio; resposta informa falta do servidor | Backend, conta, créditos, custos e segurança |
| Consultas | PARCIAL COM DADOS ANTIGOS | Formulário abre e-mail | Corrigir serviços, preços, telefone e privacidade |
| Premium | PLACEHOLDER COM DADOS ANTIGOS | Planos locais sem checkout | Corrigir oferta oficial e implementar STAGING |
| Skins | PARCIAL VISUAL | Vitrine existe na Home | Catálogo, direitos e seleção persistente |
| Loja/Amazon | PARCIAL FUNCIONAL | 21 produtos, busca, filtros, favoritos e disclosure | Administração, revisão editorial e métricas seguras |
| Vídeos | PLACEHOLDER | Rota existe; `youtubeVideos` contém 0 itens | Temporadas, episódios e conteúdo real |
| Música | PARCIAL FUNCIONAL | 2 álbuns configurados no Spotify | Metadados, páginas editoriais e administração |
| Conta | PLACEHOLDER | Formulário apenas informa futura ativação | Supabase STAGING, Auth, perfil e sincronização |
| Admin | PLACEHOLDER | Reconhece somente nome público; sem autenticação real | Backend, MFA, RLS e módulos administrativos |
| PWA | PARCIAL | Manifesto, ícone e service worker ativos | Cache completo, offline real e migração segura |
| SEO | PARCIAL AVANÇADO | 78 páginas, canonical, sitemap e robots | Integração da biblioteca e revisão final |
| Analytics | AUSENTE | Nenhum motor de eventos oficial | Modelo sem textos privados |
| Idiomas EN/ES | AUSENTE | Interface atual em PT-BR | Internacionalização após fonte PT-BR estável |
| Notificações | AUSENTE | Nenhuma infraestrutura atual | Implementar apenas em STAGING/aplicativo |

---

## 5. Regras atuais que já funcionam

### Tarot Livre

- cria um baralho com 78 IDs;
- embaralha com `crypto.getRandomValues`;
- move cada carta de `waiting` para `revealed`;
- bloqueia toque durante a animação;
- salva a mesa no armazenamento local;
- valida 78 IDs únicos ao restaurar;
- força toda carta para orientação normal;
- permite embaralhar somente as restantes;
- pede confirmação antes de recomeçar uma mesa usada.

### Carta do Dia

- usa `America/Sao_Paulo`;
- mantém a mesma carta durante a data local de Brasília no dispositivo;
- salva intenção e carta localmente;
- permite guardar a experiência no Diário.

### Tiragens

- embaralha as 78 cartas;
- usa `slice`, impedindo repetição dentro da leitura;
- possui Cruz Celta com 10 posições;
- salva um resumo no Diário.

### Diário

- escapa HTML do conteúdo digitado;
- salva localmente;
- busca por texto;
- exclui com confirmação;
- exporta JSON;
- gera estatísticas simples.

---

## 6. Problemas prioritários encontrados

### Prioridade alta — verdade do produto

1. A tela de Consultas usa preços antigos:
   - Mesa Real atual no código: R$ 200; oficial: R$ 500;
   - Leitura de Mentes atual: R$ 200; serviço oficial: Leitura de Pensamentos, R$ 500;
   - Carta de Conselho atual: R$ 100; oficial: R$ 300;
   - serviço Pergunta de R$ 150 está ausente.
2. O formulário chama telefone de “WhatsApp (opcional)”, diferente da regra oficial de telefone obrigatório e sem exigência de WhatsApp.
3. A tela Premium usa planos antigos de R$ 19,90 e R$ 39,90 por mês; a oferta oficial é Premium vitalício de R$ 199,90 e Orbe IA de R$ 89,90/mês com 400 créditos.
4. A interface da IA ainda usa o nome “Whit”; o nome oficial é Orbe IA.
5. O Espelho ainda mostra a métrica “invertidas no Tarot Livre”, mesmo o produto proibindo cartas invertidas.

### Prioridade alta — conteúdo

1. Conteúdo profundo das 78 cartas não está integrado ao aplicativo.
2. Carta do Dia mostra apenas parte das camadas oficiais.
3. Tiragens usam texto genérico e uma síntese fixa.
4. Escola não possui módulos implementados.
5. Biblioteca profunda não possui entrada própria dentro do aplicativo.

### Prioridade alta — segurança e persistência

1. Conta e Admin não possuem backend.
2. Carta do Dia não é sincronizada entre dispositivos.
3. Diário existe somente no aparelho atual.
4. Orbe IA não possui endpoint configurado.
5. Não existe ledger de créditos.

### Prioridade média — PWA e operação

1. O cache inicial possui 28 itens, mas não inclui os motores funcionais de Tarot, Ritual, Tiragens, Diário, Comércio, Mídia, IA, dados e significados.
2. `offline.html` existe, mas não está no cache inicial.
3. Nenhuma imagem de carta entra no cache inicial.
4. Não existe fila de sincronização offline.
5. Vídeos ainda não possuem episódios cadastrados.

---

## 7. Estado do Menu Mágico

O menu atual já oferece acesso para:

- Início;
- Tarot Livre;
- Tiragens;
- Escola do Tarot;
- Orbe IA;
- Consultas;
- Música;
- Conta;
- Carta do Dia;
- Loja Mística;
- Diário;
- De Frente com o Tarot;
- Premium;
- Admin.

Resultado da validação:

- destinos únicos: 14;
- telas existentes: 14;
- destinos quebrados: 0;
- telas sem acesso: 0.

### Decisão

Nenhum item será adicionado neste checkpoint. A futura **Biblioteca das 78 Cartas** receberá acesso no Menu Mágico somente quando a tela interna estiver pronta e conectada aos 78 conteúdos profundos. Isso evita criar um botão bonito que leva a uma área vazia.

---

## 8. Arquivos que controlam cada área

| Área | Arquivos principais atuais |
|---|---|
| Estrutura e telas | `index.html` |
| Inicialização | `app.js` |
| Navegação e menus | `navigation.js` |
| Aparência V77 | `visual-v68.css` e folhas preservadas |
| Orbe principal | `orb-engine-v68.js` |
| Mini-orbes | `mini-orb-engine.js` |
| Catálogo de cartas | `tarot-data.js` |
| Tarot Livre | `tarot-engine.js` |
| Carta do Dia | `ritual-engine.js` |
| Tiragens | `spreads-engine.js` |
| Significados simplificados | `meaning-engine.js` |
| Significados profundos | `tarot-meanings.js` |
| Diário e Espelho | `journal-engine.js` |
| Loja, Consultas e Premium | `commerce-engine.js` e `config.js` |
| Música e Vídeos | `media-engine.js` e `config.js` |
| Orbe IA | `ai-engine.js` e futuro backend |
| PWA | `manifest.webmanifest`, `sw.js`, `offline.html` |
| Biblioteca SEO | 78 arquivos `carta-*.html`, `card-page.css`, `sitemap.xml`, `robots.txt` |

---

## 9. Ordem segura recomendada

1. Checkpoint 0.3 — contrato automático de regressão da V77;
2. Checkpoint 1.1 — catálogo canônico unificado;
3. Checkpoint 1.2 — manifesto/hash das 78 imagens;
4. Checkpoint 1.3 — integrar `tarot-meanings.js` ao aplicativo;
5. correção atômica dos nomes, serviços e preços oficiais;
6. Tarot Livre definitivo e testes de 78 cartas;
7. Carta do Dia profunda;
8. Tiragens profundas;
9. Biblioteca interna e acesso no Menu Mágico;
10. Escola do Tarot.

Conta, backend, IA, billing e sincronização entram depois que o núcleo editorial e as regras puras estiverem estáveis.

---

## 10. Testes executados

- sintaxe de todos os arquivos `.js`: `PASS`;
- 78 IDs únicos: `PASS`;
- 78 nomes únicos: `PASS`;
- primeira/última carta: `PASS`;
- zero invertidas no catálogo: `PASS`;
- 78 arquivos de imagem presentes: `PASS`;
- leitura das 78 imagens: `PASS`;
- dimensões 300 × 450: `PASS`;
- associação imagem/atlas 78/78: `PASS`;
- validação do conteúdo profundo 2.0: `PASS`;
- 78 páginas editoriais: `PASS`;
- metadados essenciais das páginas: `PASS`;
- sitemap com 78 cartas: `PASS`;
- rotas do menu sem destino quebrado: `PASS`;
- login real: `NOT RUN — AUSENTE`;
- IA real: `BLOCKED — BACKEND AUSENTE`;
- cobrança: `BLOCKED — NÃO AUTORIZADA`;
- teste visual em navegador: `NOT RUN — NÃO SOLICITADO NESTE CHECKPOINT`.

---

## 11. Entrega deste checkpoint

### CONCLUÍDO

- inventário funcional;
- auditoria de rotas e menu;
- auditoria completa das 78 cartas e imagens;
- descoberta e validação do conteúdo profundo recuperado;
- classificação de todas as áreas;
- ordem segura das próximas implementações.

### PRESERVADO

- V77 completa;
- Orbe e menus;
- 78 artes;
- navegação;
- PWA atual;
- todos os dados existentes.

### SUBSTITUIR NO GITHUB

- nenhum arquivo.

### NOVOS NO GITHUB

- nenhum arquivo.

### REMOVER

- nenhum arquivo.

### PRÓXIMO

**Checkpoint 0.3 — Contrato de Regressão V77.**  
Criar verificações automáticas que impeçam futuras etapas de deslocar a Orbe, quebrar os menus, perder rotas, aceitar menos de 78 cartas ou reintroduzir invertidas. Depois começará o Checkpoint 1.1, com o catálogo canônico unificado.

---

**Status do Checkpoint 0.2:** `PASS`  
**Base visual:** preservada  
**Arquivos do site alterados:** 0  
**Pronta para o próximo `continua`:** sim
