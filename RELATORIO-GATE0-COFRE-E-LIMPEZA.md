# Divina Bruxa 3.0 — Gate 0

## Resultado

O estado atual foi preservado antes de qualquer limpeza. A branch remota
`cofre-pre-divina-3-2026-09-24` foi criada a partir do `main`, no commit
`187aaf2dfaf2f8cdf9ae5864ea9d86a60b9c8b4b`. No momento da verificação ela
estava 0 commits atrás e 0 commits à frente do `main`.

O `main` continua sendo a branch padrão e o site publicado não foi modificado.
Nenhum arquivo foi excluído.

## O que o inventário provou

| Medida | Estado atual |
| --- | ---: |
| Arquivos rastreados | 2.810 |
| Arquivos na raiz | 2.810 |
| Arquivos em pastas | 0 |
| Tamanho da cópia de trabalho | 430 MB |
| Tamanho compactado do Git | 203,44 MiB |
| HTML | 321 |
| CSS | 310 |
| JavaScript `.js` | 341 |
| Módulos/QA `.mjs` | 374 |
| JSON | 394 |
| TXT | 541 |
| Markdown | 160 |
| Imagens | 286 |
| SQL | 39 |
| TypeScript | 29 |
| Famílias com nome/versionamento `V…` ou `WORK…` | 1.035 |
| Instruções/guia/leia/instale por padrão de nome | 249 |
| QA/relatórios/manifestos/hashes por padrão de nome | 462 |

O problema não é apenas visual. O repositório inteiro virou uma pilha plana de
versões, auditorias, contratos, relatórios e runtime. Isso torna muito difícil
saber qual arquivo é autoridade, aumenta o risco de colisão de estilos e deixa
o carregamento e a manutenção frágeis.

## Evidência do acúmulo no runtime

- `index.html` tem 42.804 bytes, 38 referências diretas a CSS e quatro scripts
  com `src`.
- `app-v208.js` importa uma longa cadeia de núcleos e mundos versionados — do
  runtime V12 aos mundos V614–V627 — antes dos módulos dinâmicos.
- `sw.js` usa o cache `divina-bruxa-work13-v627-skins-atelie-dos-universos` e
  pré-carrega uma lista extensa de camadas antigas, com verificações embutidas
  de versões e contratos.
- A própria interface do GitHub precisou truncar a listagem da raiz em 1.000
  itens, omitindo 1.810 entradas.

Essa estrutura explica por que instalar mais um conjunto de arquivos pode não
produzir a mudança esperada: versões antigas, cache, estilos e inicializadores
continuam coexistindo.

## Decisão

A limpeza correta não é apagar a história e tentar consertar o mesmo runtime.
É construir uma árvore nova, curta e explícita, migrando somente conteúdo e
ativos aprovados. O legado permanece recuperável no cofre.

### Preservar como verdade histórica

- A branch-cofre completa e imutável.
- O domínio e o arquivo `CNAME`.
- Os 615 commits existentes.
- Os conteúdos públicos e rotas úteis para SEO.
- O catálogo das 78 cartas e suas páginas públicas.
- Textos, preços, produtos, álbuns, vídeos/Memojis e skins aprovados.
- Dados necessários a consultas, conta e conteúdos privados, sem levar
  segredos ou código de backend para a raiz pública.

### Não transportar automaticamente para o runtime 3.0

- Pacotes `INSTALE`, `LEIA`, hashes, manifestos e relatórios de versões antigas.
- Centenas de arquivos CSS/JS/MJS versionados como camadas cumulativas.
- QA executável e contratos históricos dentro da raiz pública.
- SQL e TypeScript de backend na mesma raiz do site estático.
- O service worker e os nomes de cache herdados.
- Duplicatas de Orbe, fundos e skins sem uma escolha de autoridade.

“Não transportar” não significa “apagar agora”. Cada item será classificado
como migrado, arquivado ou descartável somente depois de existir equivalência
funcional na 3.0.

## Travas antes de qualquer exclusão no GitHub

1. Nova 3.0 funcional fora do `main`.
2. Todas as rotas e mundos mapeados para uma autoridade única.
3. Consulta abrindo e concluindo o fluxo real.
4. Orbe única e menu acessível em toda a jornada.
5. Auditoria repetida em iPhone, ida e volta entre mundos.
6. SEO, 404, CNAME, sitemap e URLs públicas validados.
7. Teste sem cache e após atualização do service worker.
8. Lista final, nominal, dos arquivos que serão substituídos ou removidos.
9. Confirmação final imediatamente antes do corte.
10. Plano de retorno testado usando a branch-cofre.

## Estado ao fechar o Gate 0

- Cofre remoto: concluído.
- Inventário local: concluído.
- Integridade por SHA-256: concluída.
- Exclusões no GitHub: zero.
- Alterações no site publicado: zero.
- Próxima ação segura: Gate 1, a fundação limpa da Divina Bruxa 3.0.
