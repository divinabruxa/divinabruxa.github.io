# Divina Bruxa — Macroetapa 8 / PWA e performance V9.7

Esta camada reduz trabalho inicial do navegador sem alterar a arte da orbe ou
as imagens das cartas. Imagens abaixo da primeira dobra recebem carregamento
lazy, `IntersectionObserver` antecipa a próxima área visível e o estado online/
offline fica disponível para os controles que exigem rede.

O manifesto passa a declarar atalhos para Tarot Livre e Carta do Dia, mantendo
o modo instalável e a identidade visual atual. A experiência offline continua
limitada ao que foi previamente carregado/cacheado; IA, compras e billing não
são liberados sem conexão.
