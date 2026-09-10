# WORK7.0 — Rollback V209

Base segura: V208.

A V209 substitui `orb-skin-release-v1.js` e adiciona `orb-resilience-v209.js` + contratos de prova. Ela não substitui `index.html`, `app-v208.js`, `orb-engine-v208.js`, shaders, CSS da Home, navegação, Menu, Tarot ou Service Worker.

Para rollback técnico, restaure somente `orb-skin-release-v1.js` para a cópia V208/V133 anterior e remova `orb-resilience-v209.js`. O restante da V208 permanece intacto.

Nenhuma trava de produção, DNS, billing, loja ou Sol é alterada por esta versão.
