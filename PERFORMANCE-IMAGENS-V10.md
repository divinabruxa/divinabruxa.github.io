# Divina Bruxa — Macroetapa 3: performance e imagens

## Objetivo

Manter o glamour da Orbe das Realidades reduzindo espera, consumo de dados e travamentos em celulares. A imagem original nunca é apagada: primeiro criamos versões derivadas e comparamos visualmente.

## Prioridades

1. A primeira tela deve carregar a orbe principal, menu e fundo essencial.
2. Cartas e skins entram sob demanda, não todas no primeiro carregamento.
3. WebP/AVIF são preferidos; PNG/JPG permanecem como fallback.
4. Cada imagem deve declarar largura, altura e `decoding="async"` quando não for crítica.
5. A orbe mantém qualidade visual em 1x, 2x e telas de alta densidade.
6. `prefers-reduced-motion` e conexão lenta não podem impedir a leitura.

## Metas de orçamento

- HTML inicial: até 100 KB comprimido.
- CSS inicial: até 250 KB comprimido.
- JavaScript inicial: até 250 KB comprimido.
- Imagens críticas: até 1,5 MB na primeira tela.
- Largest Contentful Paint: até 2,5 s em rede móvel mediana.
- Layout shift: CLS abaixo de 0,1.
- Nenhuma tela deve baixar 78 cartas completas simultaneamente.

## Tratamento do acervo

- Orbes: derivados responsivos 64/128/256/512/1024 px.
- Cartas: miniatura para grades, média para resultados e alta apenas na leitura.
- Skins: catálogo com miniaturas; pacote completo somente após seleção.
- Fundo cósmico: uma versão comprimida e uma alternativa de baixo consumo.
- Toda troca de skin deve reutilizar dimensões e proporções, evitando saltos de layout.

## Critério de saída

Todas as páginas essenciais passam pelo orçamento em desktop, Android e iPhone, com fallback visual intacto e sem carregamento em massa do acervo.
