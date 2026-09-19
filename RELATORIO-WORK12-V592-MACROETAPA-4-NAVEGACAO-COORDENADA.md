# WORK12 V592 — Macroetapa 4/10

## Navegação Coordenada

A V592 transforma navegação em continuidade real. O toque comum, a abertura por link direto, o histórico do navegador, voltar, avançar, o retorno ao Início e a recuperação de uma realidade passam pela mesma máquina de estados e pela mesma viagem física da Orbe.

Não foi criada outra animação, outro canvas, outro renderer ou outra Orbe. A magia desta entrega está na coerência: a rota técnica pode mudar, mas a experiência só declara a nova realidade depois da chegada.

## Correção central

Na V591, voltar, avançar e entrar diretamente em uma coordenada conseguiam revelar o conteúdo, porém podiam contornar a viagem central e deixar o estado semântico em `ACCEPT`. A V592 elimina essa divisão.

Agora a sequência é única:

`intenção → silêncio → partida → viagem → chegada → revelação → repouso`

## Entregue

- uma autoridade central para toque, deep link, voltar e avançar;
- histórico V592 com entrada monotônica por coordenada;
- deduplicação de `popstate` + `hashchange`;
- deep links válidos conduzidos pela Orbe;
- deep links inválidos recolhidos com segurança ao Início;
- apenas uma navegação física em voo;
- fila de uma única intenção futura, sempre substituída pela vontade mais recente;
- rota de origem preservada semanticamente até a chegada;
- chegada duplicada coalescida em uma só revelação;
- retorno garantido ao estado `REST`;
- retorno do menu ao Início conduzido pela mesma autoridade;
- repetição de carregamento conduzida pelo mesmo coordenador;
- compatibilidade mínima da alma Whit com a autoridade V592, sem nova fala e sem novo efeito.

## Preservado sem alteração física

- Núcleo da Orbe V591;
- renderer e relógio físico V591;
- viagem por coordenadas V583;
- Universo Vivo Global V590;
- 30 skins;
- Tarot Livre com 78 cartas sem repetição e orientação direta;
- Carta do Dia por ciclo de Brasília;
- balões mágicos, linguagem das realidades e menu visual existentes.

## Performance e iPhone

- nenhum novo loop de animação;
- nenhum novo `MutationObserver`;
- nenhum novo canvas;
- nenhuma nova camada visual;
- histórico coordenado por eventos e microtarefas;
- efeitos pesados continuam dormindo durante a viagem;
- service worker atômico com 12 arquivos essenciais e rede primeiro para código.

## QA

- V592 estrutural e contratos: 213/213;
- máquina de estados e fila viva: 58/58;
- histórico, deep links, voltar e avançar: 33/33;
- service worker atômico: 69/69;
- regressão da Orbe V591: 41/41;
- regressão do Universo V590: 33/33.

**Total: 447/447 verificações aprovadas.**

## Arquivos principais substituídos

1. `app-v208.js`
2. `index.html`
3. `navigation.js`
4. `page-loader-v1.js`
5. `sw.js`
6. `whit-orb-soul-bridge-v581.js`
7. `work12-foundation-v589.js`

## Próximo movimento

A Macroetapa 5/10 fará a nova cara aparecer: o Menu Lendário deixa de se comportar como lista e passa a nascer como uma ou duas intenções orgânicas ao redor da Orbe, com Home sempre acessível e silêncio real entre aparições.

