# QA V556 — Diário privado e Espelho Vivo

Resultado: **132/132 verificações aprovadas**.

## Diário

- Escrita principal imediatamente acessível; conexões e metadados opcionais ficam recolhidos.
- Busca, filtros, favoritos, calendário, revisões, vínculos e portabilidade preservados.
- Doze memórias por carregamento, com abertura progressiva do histórico.
- Um único mapa de vínculos por renderização; nenhuma releitura quadrática do armazenamento.
- Atlas leve na linha do tempo; nenhuma arte completa solicitada para miniaturas.
- Falhas de armazenamento propagadas corretamente aos mundos de origem.
- Origem Biblioteca reconhecida sem perder tipo ou carta.

## Espelho e privacidade

- Espelho local agregado, reflexivo e explicitamente não diagnóstico.
- Textos, perguntas, relações, revisões, humores, cartas e etiquetas fora da projeção pública.
- Admin e analytics recebem somente contagens estruturais permitidas.
- Whit recebe no máximo uma entrada escolhida, somente depois de confirmação.
- Sincronização privada desligada por padrão, com consentimento explícito na Conta.
- Rascunhos sempre locais, inclusive quando a sincronização de entradas salvas é ativada.

## Ritmo, Orbe e fluidez

- Presença registrada apenas quando a pessoa escolhe; visitar a página não altera o ritmo.
- Sequência calculada por dias consecutivos reais.
- Orbe canônica conduz escrita, Espelho e calendário; nenhuma Orbe duplicada.
- Zero loops de animação permanentes e zero MutationObserver nesta experiência.
- Rolagem imediata, pintura diferida, sem blur pesado, com Reduced Motion.
- Layout próprio para iPhone e alvos de toque de no mínimo 48 px.
- Regressão de navegação iOS: 35/35.
- Service Worker V556: 26/26, incluindo instalação, reparo, offline e fail-closed.
