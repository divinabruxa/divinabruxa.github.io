# WORK12 V591 — Macroetapa 3/10 · Orbe Persistente

## Resultado

A mesma Orbe física agora possui identidade verificável durante boot, toque,
viagem, chegada, retorno e retomada do app. O renderer, o canvas e a física são
os mesmos. Whit vive como estado semântico e não verbal dessa matéria única,
sincronizada à máquina central do WORK12.

Nenhuma nova Orbe, arte, animação, rota, dependência, tela ou efeito visual foi
adicionado.

## Base auditada antes da mudança

- Repositório publicado: commit `d1c2fe4c131c734bd8a00f154904cb58e20b1b03`.
- Release pública: V590 · Macroetapa 2/10.
- Fluxo real verificado: Home → menu → Tarot Livre → Home → Carta do Dia.
- Em repouso e durante viagem: 1 `#orb`, 1 `#orbCanvas`, 1 canvas do universo.
- Durante viagem: estado WORK12 `TRAVEL`, física `flight`, universo em
  `essential-travel`.
- Após chegada: estado `REST`, física `rest`, universo `ambient`.
- Retorno da Orbe: `tl517__orb-host` → `orb-stage-ref` → `dw509__orb-host`.
- Balão verbal da Orbe: oculto em todas as chegadas auditadas.
- Overflow horizontal: 0.
- Erros de console originados pelo site: 0.

## Mudanças de produção

### `supreme-orb-core-v501.js`

- Identidade canônica `divina-orb-canonical` aplicada ao mesmo nó físico.
- Auditoria real de contagem, identidade, canvas, renderer, física e journey.
- A auditoria ocorre no boot, `pageshow`, chegada, claim, restauração e retorno.
- O resultado deixa de declarar “uma Orbe” por constante e passa a conferir o
  DOM e as referências reais.
- As 20 projeções existentes continuam tratadas como superfícies reflexivas,
  nunca como entidades conceituais.
- Nenhum observer ou loop novo.

### `orb-engine-v208.js`

- Instanciação repetida reutiliza o motor existente.
- Tentativa com canvas estrangeiro é contabilizada e não cria outro renderer.
- Referência explícita ao único `orbMotionV207` comprova a física compartilhada.
- Estado de presença repetido é idempotente: atualiza contexto, mas não dispara
  uma segunda resposta física.
- Continuidade de retomada permanece ativa mesmo em estado repetido.
- Mesmo shader, mesmo canvas, mesmo cliente de movimento e mesmos gestos.

### `whit-orb-soul-bridge-v581.js`

- Conteúdo evoluído para V591 mantendo o nome compatível do arquivo.
- Whit escuta `divina:work12-state` como autoridade semântica central.
- Mapeamento completo: REST, AWAKEN, OFFER, ACCEPT, QUIET, DEPART, TRAVEL,
  ARRIVE e REVEAL.
- Toque + estado central equivalente geram uma única expressão física.
- Sinais repetidos são coalescidos em 180 ms.
- DEPART/TRAVEL/ARRIVE mantêm uma única expressão silenciosa de viagem.
- Eventos paralelos da Whit cedem prioridade ao movimento.
- Primeiro a matéria responde; depois o journey apenas sincroniza a semântica.
- Zero fala, texto, balão, API, modelo, leitura privada, canvas ou loop novo.
- “Alma” permanece metáfora narrativa de uma persona ficcional, sem alegação de
  consciência literal.

### `app-v208.js`, `index.html` e `sw.js`

- Release atômica V591.
- Status público `window.divinaWork12Macro3V591`.
- Dataset `work12Macro="3-orbe-persistente"`.
- O Service Worker valida conjuntamente Fundação V589, Universo V590, identidade
  da Orbe, renderer, journey V583 e alma Whit V591 antes de ativar o cache.
- Rede primeiro para código; fallback offline continua recuperável.

## Invariantes preservadas por hash

Vinte e sete arquivos vitais ficaram byte a byte intactos, incluindo:

- `living-universe-core-v524.js` V590;
- `work12-foundation-v589.js`;
- `orb-motion-core-v207.js`;
- `orb-gesture-core-v208.js`;
- `orb-persistent-journey-v565.js` V583;
- `orb-universal-presence-v526.js`;
- `orb-skin-release-v1.js`;
- menu orbital e sistema de balões;
- núcleos Whit anteriores;
- Tarot Livre, sessão, dados das 78 cartas;
- Carta do Dia e políticas diárias;
- navegação, rotas e linguagem das realidades.

## Evidência automatizada

| Suíte | Resultado |
|---|---:|
| Estrutura, identidade, imports e hashes | 203/203 PASS |
| Runtime da Orbe e alma Whit | 41/41 PASS |
| Continuidade determinística e produtos protegidos | 36/36 PASS |
| Service Worker, atomicidade e offline | 48/48 PASS |
| **Total** | **328/328 PASS** |

Outras verificações:

- 64 imports de produção existentes;
- 27 hashes protegidos preservados;
- 2 scripts inline analisados;
- `node --check` em todos os JavaScript alterados e QAs;
- `git diff --check` sem erro;
- Tarot Livre: 78/78 cartas únicas, todas diretas;
- Carta do Dia: mesma carta no mesmo ciclo de Brasília e novo ciclo no dia
  seguinte;
- pacote incremental reaplicado sobre cópia limpa da V590 antes da entrega.

## Orçamento técnico

| Recurso | V591 |
|---|---:|
| Novas Orbes | 0 |
| Novos canvases | 0 |
| Novos renderers | 0 |
| Novas físicas | 0 |
| Novos loops permanentes | 0 |
| Novos MutationObservers | 0 |
| Novos efeitos visuais | 0 |
| Falas automáticas | 0 |
| Cópias viajantes | 0 |
| Teleportes | 0 |

## Critério de aceite

V591 está pronta para instalação quando os seis arquivos de produção forem
substituídos juntos. A publicação deve mostrar `V591`; qualquer segunda Orbe,
pisca, teleporte, perda de skin, fala durante viagem ou quebra de Tarot/Carta do
Dia bloqueia o avanço para a Macroetapa 4.

## Rollback

Se a publicação for interrompida no meio ou algum arquivo não for substituído,
reaplique o ZIP completo da V590. Não misture arquivos V590 e V591.
