# Divina Bruxa — Achados da Auditoria V9.0

## Observações ao vivo

1. A Home pública apresenta uma orbe central forte, menu mágico e caminhos para
   Tarot Livre, Tiragens, Carta do Dia, Escola, Orbe IA, Diário, Consultas,
   Música, Loja, Conta e Admin.
2. Ao carregar a aplicação, o navegador registra `TypeError: Cannot set
   properties of null (setting 'onsubmit')` em `app.js`, linha 69, porque
   `#userRegister` não existe no HTML atual.
3. Ao abrir uma rota inexistente, o `404.html` tenta importar
   `index-BrnhCKFY.js` e outros chunks ausentes; a página aparece sem o CSS
   completo e registra falha de importação dinâmica.
4. A página de Tiragens revela conteúdo, mas o resultado fica abaixo da área
   inicialmente visível; a jornada precisa rolar até a leitura para comunicar
   que o toque funcionou.

## Observações no repositório

- 574 arquivos e aproximadamente 377 MB no checkout auditado.
- 81 HTML, 98 CSS, 85 JavaScript, 79 WebP, 78 JPG/JPEG, 44 PNG, 26 JSON,
  12 MJS, 58 TXT, 9 Markdown, 1 webmanifest, 1 SVG e 1 ICO.
- 78 páginas de cartas têm título, descrição, canonical e `og:title`.
- As 78 páginas não têm `og:image`, JSON-LD ou hreflang.
- Não há `robots.txt` nem `sitemap.xml` na raiz auditada.
- O PWA usa cache `divina-bruxa-v77-menu-ring-v8-124`.
- O `index.html` não referencia `divina-v8-loader.js`.
- O arquivo `config.js` contém `adminUser: 'Isis33'`; identidade e autorização
  administrativas não devem ser decididas no frontend público.
- Existe uma duplicata exata de `BACKEND-STAGING-CONTRACT-V6.md`.

## Prioridade absoluta

Corrigir o boot, unificar o 404, atualizar o PWA e só então ativar o V8.30.
Depois disso, executar a matriz real de Tarot, skins, orbes, mobile, SEO,
privacidade e monetização.

