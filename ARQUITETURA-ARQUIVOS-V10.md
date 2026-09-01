# Divina Bruxa — Macroetapa 2: arquitetura profissional

Como o envio atual é feito arquivo por arquivo na raiz do GitHub, a organização será controlada por contratos, prefixos, manifests e dependências explícitas. Nenhum arquivo será apagado ou movido automaticamente.

## Camadas oficiais

1. **Entrada** — `index.html`, `404.html`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`.
2. **Runtime** — `app.js`, `navigation*.js`, `*-engine*.js`, `*-runtime*.js`.
3. **Estilo** — `app.css`, `motion.css`, `*-design-system*.css`, estilos por experiência.
4. **Dados editoriais** — JSON e páginas das 78 cartas.
5. **Mídia** — orbes, cartas, skins, áudio e vídeo.
6. **Qualidade** — arquivos `qa-*.mjs`, `verify-*.mjs`, manifests e relatórios.
7. **Políticas** — privacidade, monetização, notificações, confiança e instalação.

## Convenção de nomes

- Versões oficiais: `divina-<dominio>-v10.<ext>`.
- Contratos: `<dominio>-contract-v10.<ext>`.
- Verificadores: `<dominio>-guard-v10.mjs`.
- Relatórios: `<dominio>-report-v10.<ext>`.
- Nunca reutilizar o mesmo nome para engines diferentes.
- Todo arquivo novo deve declarar versão e dependências no manifest.

## Regra de dependências

O navegador carrega somente `app.js`. Cada módulo importado deve aparecer no manifest e possuir uma única responsabilidade. Arquivos históricos podem permanecer na raiz, mas não podem ser importados pelo runtime canônico.

## Critério de saída

Nenhuma dependência circular, nenhum engine duplicado, nenhum arquivo novo sem proprietário funcional e nenhum recurso crítico sem fallback.
