# WORK7.0 — V211 — MENU 2.0: PRECISÃO, ACESSIBILIDADE E FECHAMENTO DEFINITIVO

## Escopo

V211 fecha a trilha Menu 2.0 sem redesenho. A máquina de estados V210 permanece soberana. Esta versão acrescenta uma camada não visual para foco, inert, teclado e contenção de interação concorrente.

## Comportamento

- Enquanto o Menu está ativo, marca/fundo, Orbe e dock deixam de aceitar intenção concorrente.
- O botão Menu continua disponível para fechar.
- Ao estado OPEN, o foco entra no destino atual ou no primeiro destino disponível.
- Tab e Shift+Tab circulam entre botão Menu e destinos disponíveis.
- Setas percorrem destinos; Home/End saltam para início/fim.
- Escape continua sob a autoridade V210 e devolve foco ao ponto de origem.
- Durante CLOSING/NAVIGATING, os itens deixam de aceitar nova intenção antes do último quadro.
- VoiceOver/teclado não podem escapar para elementos atrás do Menu.
- `inert` nativo é usado quando suportado; há fallback de `tabindex` para navegadores antigos.

## Regiões congeladas

Nenhum CSS, shader, imagem da Orbe, geometria orbital, posição de ícone, dock, página, conteúdo ou regra comercial é alterado.

## Gate V211

1. V210 permanece com os seis estados.
2. O módulo V211 não cria renderer/WebGL nem handlers de gesto da Orbe.
3. Menu fechado permanece `aria-hidden=true` e inerte.
4. Menu aberto permite foco somente na passagem e no botão de fechamento.
5. Fundo não recebe clique/toque enquanto a passagem está ativa.
6. Tab, Shift+Tab, setas, Home, End e Escape têm comportamento determinístico.
7. Reduced motion não depende de timers V211.
8. Nenhum dado privado é lido, armazenado ou emitido.
9. P0=0/P1=0 na prova determinística disponível nesta entrega.

## Próxima macroetapa

Após instalação e aprovação: V212 — Whit 2.0 Core.
