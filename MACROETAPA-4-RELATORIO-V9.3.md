# Divina Bruxa — Macroetapa 4 / Skins universais V9.3

## Entrega

Esta camada sincroniza a skin ativa em todas as superfícies de orbe: orbe
principal, mini-orbe da marca, orbe do menu mágico, orbe da mesa de Tarot,
orbes contextuais e superfícies criadas dinamicamente.

## Como funciona

- O catálogo universal continua sendo a fonte dos nomes e imagens.
- O bridge marca superfícies atuais e futuras com `MutationObserver`.
- O evento `orbe:skin-change` atualiza CSS, imagens e o motor da orbe.
- A preferência continua persistida pelo sistema universal existente.
- `prefers-reduced-motion` é respeitado.

## Arquivos

- `orb-skin-bridge-v9.js`
- `skin-universal-v9.css`
- `SKIN-UNIVERSAL-VERIFICATION-V9.3.mjs`

Esta etapa não altera cartas, conteúdo, autenticação, pagamentos ou backend.
