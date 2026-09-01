# Divina Bruxa — Macroetapa 8: mobile, PWA e acessibilidade

## Objetivo

Fazer a Orbe funcionar com conforto em telas pequenas, sem cortes, sobreposição do dock ou gestos impossíveis. A magia deve ser inclusiva e continuar legível sem animações.

## Requisitos mobile

- Layout mobile-first entre 320 px e 430 px.
- Áreas tocáveis mínimas de 44 × 44 px.
- Respeito a `safe-area-inset` do iPhone.
- Nenhum scroll horizontal.
- Teclado virtual não cobre campos nem ações.
- Menu e dock não cobrem conteúdo longo.
- Cartas mantêm proporção e têm fallback textual.

## Requisitos PWA

- Manifest com nome, ícones, tema e modo standalone.
- Service worker versionado e atualizável.
- Tela offline informativa, sem prometer recursos indisponíveis.
- Tarot Livre, Carta do Dia já revelada, diário local e conteúdo baixado podem funcionar offline.
- IA, compra, restauração e cobrança permanecem online.

## Acessibilidade

- Foco visível e ordem de tabulação coerente.
- Rótulo para todo campo, botão e imagem relevante.
- `aria-live` para revelação de cartas e mensagens.
- Contraste WCAG AA.
- `prefers-reduced-motion` sem perda de função.
- Não depender apenas de cor, brilho ou som.
- Erros explicados em linguagem clara.

## Critério de saída

Passar em iPhone, Android e desktop; 320 px sem overflow; navegação completa por teclado; VoiceOver/TalkBack com rótulos; instalação e atualização PWA verificadas.
