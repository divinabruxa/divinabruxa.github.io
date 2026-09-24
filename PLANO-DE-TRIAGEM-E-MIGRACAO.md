# Plano de triagem e migração

## Princípio

A Divina Bruxa 3.0 não será uma camada V628 colocada sobre as anteriores. Ela
terá uma árvore nova, uma autoridade por função e uma única física de movimento.

## Quatro destinos possíveis

| Destino | Regra | Exemplos |
| --- | --- | --- |
| Migrar | É conteúdo ou função real e ainda é necessário | cartas, textos, produtos, mídia, conta, consultas |
| Reescrever | A função é necessária, mas o código acumulado não é | navegação, Orbe, mundos, estado, service worker |
| Arquivar | Tem valor histórico/probatório, mas não pertence ao site | relatórios, hashes, QA e instruções antigas |
| Descartar | É duplicata ou sobra confirmada após equivalência | versões antigas já cobertas e ativos rejeitados |

## O que precisa de autoridade única

| Área | Autoridade 3.0 esperada |
| --- | --- |
| Entrada | Uma Home, uma Orbe, um convite tátil |
| Navegação | Um controlador de jornada e retorno |
| Movimento | Um conjunto pequeno de tokens e curvas |
| Mundos | Um registro de rotas com estado explícito |
| Conteúdo | Dados separados da apresentação |
| Consulta | Uma máquina de estados testável |
| Conta | Um adaptador de autenticação e sessão |
| SEO | Páginas públicas coerentes com o universo visual |
| Cache | Um service worker pequeno, atualizável e reversível |
| Tema/skins | Um único sistema de tokens, sem trocar lógica |

## Mapa inicial de migração

### Manter e validar

- `CNAME`, domínio canônico e metadados de propriedade.
- Conteúdo das páginas públicas úteis.
- Dados e imagens das 78 cartas.
- Conteúdo editorial em português e idiomas existentes.
- Produtos, preços e avisos de afiliação.
- Álbuns, faixas, vídeos e área para Memojis.
- Skins aprovadas, depois de selecionar uma única versão de cada.
- Regras reais de privacidade, acessibilidade e contato.

### Reescrever do zero

- Casca da aplicação.
- Orbe viva persistente.
- Pentagrama/menu contextual.
- Entrada e retorno de todos os mundos.
- Orquestração de telas e carregamento.
- Fluxo de consultas.
- Estado de conta.
- Sistema de mensagens e feedback tátil/visual.
- CSS estrutural e responsivo.
- Service worker e política de atualização.

### Arquivar fora do runtime

- Arquivos `00-INSTALE-*`, `LEIA-*`, `RELATORIO-*`, `MANIFESTO-*`, `HASHES-*`.
- Contratos e QA de versões encerradas.
- SQL e TypeScript que sejam fonte de backend/migrações.
- Planos e documentos de trabalhos anteriores.

### Só descartar após prova

- CSS/JS/MJS versionados substituídos pela 3.0.
- Imagens realmente duplicadas por hash e sem uso.
- Páginas públicas obsoletas com redirecionamento definido.
- Caches e manifests antigos.
- Ativos rejeitados nominalmente.

## Ordem segura

1. Criar a estrutura limpa fora do `main`.
2. Implementar Home, Orbe, menu e retorno.
3. Ligar um mundo-piloto e provar a arquitetura.
4. Migrar os demais mundos um a um, sem copiar camadas antigas.
5. Migrar conteúdo e mídia por inventário.
6. Validar consulta, conta e integrações reais.
7. Gerar páginas públicas/SEO no mesmo sistema visual.
8. Medir iPhone, acessibilidade, peso, erros e cache.
9. Produzir a lista nominal do corte.
10. Substituir o `main` uma única vez e manter o cofre intacto.

## Regra de exclusão

Nenhum padrão amplo como `*.js`, `*v6*` ou “tudo antigo” deve ser usado para
apagar arquivos. A lista de remoção será produzida a partir do conjunto exato
do novo release, comparada com o `main` e revisada antes do corte.
