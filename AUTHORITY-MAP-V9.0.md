# Divina Bruxa — Mapa de Autoridade V9.0

## Fonte pública observada

- Site: `https://www.divinabruxa.com.br/`
- Repositório: `https://github.com/divinabruxa/divinabruxa.github.io`
- Branch auditada: `main`
- Commit auditado: `8ab7dbabe29d4c7dd53ef36718b12773754b7aa0`

## Autoridade atual, preservada

| Camada | Fonte atual | Decisão |
|---|---|---|
| Entrada principal | `index.html` | Preservar e corrigir com backup |
| Inicialização | `app.js` | Preservar comportamento; corrigir erro P0 |
| Conteúdo/preços | `config.js`, dados de Tarot e significados | Preservar decisões aprovadas |
| Tarot visual | `card-00.webp` a `card-77.webp` e 78 páginas HTML | Preservar |
| Orbes | `divina-orb-v68.png`, `divina-orb-v48.png`, `divina-orb.png` e motor existente | Preservar até comparação visual |
| Skins | arquivos `skin-*.png` | Preservar e mapear para o sistema universal |
| Domínio | `CNAME` | Preservar; não alterar DNS |
| PWA atual | `sw.js`, `manifest.webmanifest` | Atualizar somente em branch de teste |

## Candidato de evolução

Os arquivos `*-v8.*` das Macroetapas anteriores são uma camada de evolução,
não a autoridade atual. Eles só passam a ser oficiais depois de instalados no
`index.html`, validados no navegador e aprovados pela proprietária.

## Não são autoridade

- Chunks citados no `404.html` que não existem no repositório.
- Folhas e scripts de gerações antigas que não são referenciados pelo runtime.
- Cópias com sufixos como `(2)` quando o conteúdo é idêntico.
- Qualquer estado salvo somente em `localStorage` para autenticação, admin,
  Premium, créditos ou segurança.

## Regra de exclusão

Nada será apagado nesta macroetapa. Arquivos legados só podem ser removidos
depois de backup, hash, identificação de referências, comparação visual e
aprovação explícita. O retorno sempre deve ser possível por branch/commit.

## Decisão arquitetural proposta

Construir uma única aplicação estática para o frontend público, com backend
separado para Auth, Diário, Admin, Premium, Orbe IA, Consultas e Billing. A
Home, o menu e a orbe aprovados continuam sendo a identidade visual; a
consolidação reduz conflitos entre gerações.

