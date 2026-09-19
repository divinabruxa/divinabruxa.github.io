# WORK12 — Macroetapa 8 de 10

## Realidades como Câmaras · V596

Base instalada auditada: V595, commit `1f566f1`.

## Resultado

Escola, Diário, Consultas e Loja deixam de chegar como páginas empilhadas. As
quatro realidades passam a obedecer ao mesmo ciclo vivo:

1. limiar com a única Orbe;
2. gesto explícito para mergulhar;
3. presença com uma ou duas intenções visíveis;
4. profundidade apenas depois de nova escolha.

A V596 não reescreve os motores. Ela coordena quando cada camada já existente
pode nascer, preservando conteúdo, dados, formulários, preços e funções.

## Escola — descoberta

- A chegada mostra Orbe, intenção e silêncio.
- Depois do mergulho, aparece o próximo passo real.
- Duas escolhas curtas conduzem a continuidade ou aos três caminhos.
- Jornadas e módulos usam deslocamento horizontal com `scroll-snap` no iPhone.
- Só o estágio ativo ganha profundidade visual.
- Progresso, busca, filtros, revisão e caderno continuam no motor existente.

## Diário — intimidade

- A entrada oferece somente **Escrever** ou **Espelho**.
- Editor, padrões e calendário aparecem pelo gesto correspondente.
- O calendário não desapareceu; apenas deixou de competir no primeiro encontro.
- Autosave, cofre, exportação e privacidade continuam sob o motor aprovado.
- A V596 não lê nenhuma memória, campo ou conteúdo pessoal.

## Consultas — acolhimento claro

- Serviços aparecem como uma passagem horizontal, um de cada vez no iPhone.
- Nome, alcance e valor permanecem claros antes da escolha.
- Formulário, agenda, protocolo e acompanhamento continuam funcionando.
- A tela de solicitação só nasce depois que a pessoa escolhe uma leitura.
- Nenhuma urgência emocional ou fala da Whit interfere na decisão.

## Loja — intenção antes do catálogo

- A chegada oferece a curadoria por intenção.
- Produtos, categorias, filtros e avisos comerciais nascem depois da escolha.
- Um retorno curto, **Intenções**, recolhe o catálogo sem trocar de realidade.
- Links, preços, estoque e confirmação na Amazon continuam preservados.
- Encanto na descoberta; clareza absoluta na decisão.

## Orbe, Whit e silêncio

A Orbe física permanece no limiar. Os antigos hosts internos de Escola e Diário
deixam de reclamá-la na V596, eliminando a percepção de salto ou substituição.
Whit muda apenas o estado sensível da alma da Orbe; não fala automaticamente e
não ganha corpo separado.

## Performance

- 1 máquina de estados para as quatro câmaras.
- 1 timer adiável e cancelável no máximo.
- 0 novos canvases.
- 0 novos renderers.
- 0 loops permanentes de animação.
- 0 `MutationObserver`.
- Efeitos do universo pausados durante viagem e nascimento da câmara.
- Listas longas usam revelação progressiva e deslocamento horizontal nativo.
- Movimento reduzido preserva a ordem e elimina animações decorativas.

## Arquivos de produção

Substituídos:

- `app-v208.js`
- `index.html`
- `journal-world-v317.js`
- `page-loader-v1.js`
- `school-world-v306.js`
- `sw.js`

Novos:

- `reality-chambers-v596.js`
- `reality-chambers-v596.css`

Os núcleos V590–V595 de universo, Orbe, viagem, SOPRO, presença Whit e leituras
como rito foram preservados. Os motores funcionais das quatro realidades também
permanecem protegidos por hash.

## QA aprovado

- V596 estrutura, contratos e 35 arquivos protegidos: 252/252.
- V596 câmaras e estados em runtime: 43/43.
- V596 Service Worker atômico e offline: 129/129.
- V596 boot recuperável: 10/10.
- V595 leituras como rito: 30/30.
- V594 presença Whit: 34/34.
- V593 SOPRO e menu vivo: 45/45.
- V592 histórico coordenado: 33/33.
- V591 Orbe persistente: 41/41.
- V590 Universo Vivo: 33/33.
- V586 balões mágicos: 35/35.
- V585 linguagem das realidades: 21/21.

Total: **706/706 PASS**.

## Lei cumprida

Uma Orbe. Um universo. Quatro câmaras vivas.

Limiar. Intenção. Presença. Profundidade.

