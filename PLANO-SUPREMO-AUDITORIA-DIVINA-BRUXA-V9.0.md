# Divina Bruxa — Plano Supremo V9.0
## Auditoria completa do site público e do GitHub

**Data da auditoria:** 01/09/2026  
**Marca:** Divina Bruxa  
**Universo:** Orbe das Realidades  
**Fonte pública:** https://www.divinabruxa.com.br/  
**Repositório auditado:** https://github.com/divinabruxa/divinabruxa.github.io

## 1. Diagnóstico executivo

O site já possui uma identidade visual forte: roxo profundo, dourado, orbe
central, menu radial, navegação inferior e uma Home que apresenta Tarot Livre,
Tiragens, Carta do Dia, Escola, Orbe IA, Diário, Consultas, Loja, Música,
Conta, Admin e vídeos. A Home pública é uma boa base de marca.

O problema principal agora não é falta de ideias. É a coexistência de várias
gerações do aplicativo no mesmo repositório. A aplicação pública principal
carrega a arquitetura V5/V6; os módulos V8.30 estão armazenados, mas o
`index.html` atual não carrega `divina-v8-loader.js`; e o `404.html` aponta para
um build moderno cujos chunks não estão presentes. O próximo plano precisa
consolidar uma única fonte de verdade antes de acrescentar novas camadas.

## 2. Inventário encontrado no GitHub

| Área | Quantidade/estado observado |
|---|---:|
| Arquivos versionados | 574 |
| Tamanho aproximado do checkout | 377 MB |
| HTML | 81 |
| CSS | 98 |
| JavaScript | 85 |
| WebP | 79 |
| JPG/JPEG | 78 |
| PNG | 44 |
| JSON | 26 |
| Cartas HTML | 78 |
| Pastas na raiz | 0; tudo está achatado |
| Branch ativa | `main` |
| Commit mais recente auditado | `8ab7dba` — Add files via upload |

O inventário contém 78 páginas de cartas, 98 folhas de estilo, 85 scripts e
diversas gerações V5, V6, V7 e V8.30. Há pelo menos um par de arquivos
exatamente duplicados: `BACKEND-STAGING-CONTRACT-V6.md` e sua cópia com `(2)`.

## 3. Problemas P0 encontrados

### P0.1 — Erro de execução no app principal

`app.js` executa `$('#userRegister').onsubmit = ...`, mas o `index.html` atual
não possui `#userRegister`. O navegador registra:

`TypeError: Cannot set properties of null (setting 'onsubmit')`

Como o erro ocorre no meio da inicialização, o código depois dessa linha fica
sem garantia de execução. Isso inclui a configuração do login administrativo,
o botão de instalação e o registro do service worker.

**Correção:** usar binding opcional/guardado para formulários ausentes e testar
que toda a inicialização continua mesmo quando uma área é opcional.

### P0.2 — `404.html` aponta para arquivos inexistentes

O 404 publicado referencia `index-C4TgfmtU.css`, `index-BrnhCKFY.js`,
`framework-CXnKph_e.js`, `icone.svg` e outros chunks que não existem no
repositório auditado. Ao abrir uma rota inexistente, o navegador registra falha
ao importar `index-BrnhCKFY.js` e exibe a página sem o CSS completo.

**Correção:** escolher um único runtime e reescrever o 404 para usar os ativos
reais, ou publicar o build completo correspondente. Nunca deixar referências a
chunks órfãos.

### P0.3 — V8.30 armazenado, mas não ativado

O `index.html` carrega `app.js?v=90` e folhas V5. Não há a linha do
`divina-v8-loader.js?v=8.28`. Logo, a camada V8.30 não está ativa só porque
seus arquivos existem no GitHub.

**Correção:** instalar o loader em branch de teste, validar, e somente então
promover para `main`. Não fazer upload do ZIP como se o GitHub o descompactasse.

### P0.4 — PWA com cache antigo

O service worker usa `CACHE='divina-bruxa-v77-menu-ring-v8-124'` e lista um
conjunto anterior de ativos. Com o erro P0.1, novas instalações podem nem
registrar o worker.

**Correção:** criar uma versão de cache única, precachear apenas o shell
validado, atualizar de forma atômica e testar instalação, atualização e offline.

## 4. Pontos fortes que devem ser preservados

- Orbe principal e menu mágico aprovados pela proprietária.
- Linguagem visual escura, roxa e dourada.
- Marca principal “Divina Bruxa”; “Orbe das Realidades” como universo.
- 78 cartas normais, sem cartas invertidas.
- Navegação com Home, Caminhos, Orbe IA, Diário e Conta.
- 78 páginas editoriais individuais de cartas.
- Conteúdo profundo já existente para várias cartas e tiragens.
- Preços aprovados: Premium R$199,90; Orbe IA R$89,90/mês e 400 créditos.
- Luna 1 crédito, Terra 10 créditos e Sol desativado.
- Consultas: Mesa Real 500; Pensamentos 500; Conselho 300; Pergunta 150.
- Privacidade explícita e aviso de que IA, conta e pagamentos precisam de servidor.

## 5. O novo plano supremo por macroetapas

### Macroetapa 0 — Cofre e decisão de runtime

Criar backup imutável, branch de trabalho e inventário com hashes. Decidir uma
fonte única de runtime: o caminho recomendado é manter a aplicação estática
compatível com GitHub Pages, com uma única Home, um único menu e uma única
orbe. Arquivos de gerações antigas ficam fora do caminho ativo até serem
avaliados; nada é apagado sem inventário e branch de retorno.

**Saída:** mapa de autoridade, lista de arquivos ativos e lista de arquivos
legados/órfãos.

### Macroetapa 1 — Conserto do boot P0

Corrigir bindings opcionais no `app.js`; garantir que `#userLogin`,
`#adminLogin`, `#installApp` e o service worker não quebrem quando uma seção
não estiver presente. Remover qualquer desbloqueio administrativo local e deixar
claro que autorização real será de servidor.

**Saída:** zero erros de inicialização e registro confirmado do PWA.

### Macroetapa 2 — Uma aplicação, uma rota de erro

Eliminar o split-brain entre o Home V5/V6 e o `404.html` de build moderno.
Recriar `404.html` usando ativos que realmente existem ou concluir o build que
ele referencia. Validar Home, `/#home`, 404, `offline.html` e todas as rotas de
cartas.

**Saída:** nenhuma referência quebrada e aparência consistente em qualquer URL.

### Macroetapa 3 — Ativação controlada da camada V8

Instalar o loader V8.28 uma única vez no `index.html` de uma branch de teste.
Confirmar que todas as 20 folhas e 20 módulos carregam, que a ordem visual não
é destruída e que o menu/orbe aprovados permanecem intactos.

**Saída:** V8 ativa em staging, com retorno por remoção de uma única linha.

### Macroetapa 4 — Skins universais e regressão das orbes

Validar as 30 skins em orbe principal, menu interior, mini-orbe do dock, orbes
contextuais e componentes adicionados dinamicamente. Confirmar persistência,
fallback de imagem, troca sem piscar e respeito a movimento reduzido.

**Saída:** matriz de evidências de skins em iPhone, Android e computador.

### Macroetapa 5 — Tarot como produto central

Testar as 78 cartas, mapeamento imagem/nome, Tarot Livre sem repetição, reset,
embaralhamento, Mesa Real 13×6, Carta do Dia determinística no fuso de Brasília
e tiragens com posições corretas. Corrigir a experiência para que revelar uma
tiragem faça a tela rolar suavemente até o resultado, sem deixar a usuária
pensar que o toque falhou.

**Saída:** testes automatizados e manuais de Tarot sem carta invertida.

### Macroetapa 6 — Conteúdo editorial de autoridade

Consolidar significados profundos, símbolos, luz, tensão, amor, carreira,
dinheiro, espiritualidade, conselho e pergunta de reflexão. Criar revisão
editorial para as 78 cartas, tiragens, Escola e Carta do Dia. Separar claramente
reflexão simbólica de previsão, terapia, diagnóstico, finanças ou prova de
pensamentos de terceiros.

**Saída:** biblioteca confiável, humana e atualizável.

### Macroetapa 7 — SEO técnico das 78 cartas

Adicionar `og:image`, JSON-LD de artigo/entidade quando apropriado, breadcrumbs,
links entre cartas e tiragens, `sitemap.xml`, `robots.txt`, canonical consistente,
hreflang PT-BR/EN/ES planejado e metadados não truncados. Manter Conta, Diário,
Orbe IA, Admin e Checkout fora do índice quando forem privados.

**Saída:** cada carta pode ser encontrada, compartilhada e entendida sem
duplicação de conteúdo.

### Macroetapa 8 — PWA, performance e peso visual

Reescrever o cache V77 em uma versão controlada. Criar ícones em tamanhos
adequados, testar instalação no iPhone e Android, usar lazy loading e não
carregar 78 imagens grandes ao mesmo tempo. Otimizar a orbe de 5,9 MB e as
skins de aproximadamente 2–3 MB sem perder o visual. Corrigir a estratégia
`network-first`/fallback para não armazenar respostas indiscriminadamente.

**Saída:** instalação, atualização, offline permitido e desempenho medidos.

### Macroetapa 9 — Conta, Diário e confiança

Tirar o Admin do modelo de login local. Implementar Auth e sessão em backend,
RLS default deny, MFA da proprietária, Diário privado, exportação/exclusão e
logs sem corpo de diário. Revisar o `adminUser` público e qualquer caminho que
pareça autenticar no navegador.

**Saída:** nenhuma função de confiança depende de código público.

### Macroetapa 10 — Premium, IA e consultas em sandbox

Configurar primeiro Supabase STAGING e Stripe sandbox. Premium é uma compra
única de R$199,90; Orbe IA é R$89,90/mês com 400 créditos; Checkout Sessions,
Billing, Customer Portal, webhooks assinados, idempotência e ledger de créditos.
Consultas usam o fluxo aprovado, com e-mail operacional
orbedasrealidades@hotmail.com e coleta mínima necessária. Nenhum segredo fica
no GitHub Pages.

**Saída:** compra, assinatura, reembolso, revogação e créditos testados sem
cobrança real.

### Macroetapa 11 — Loja, Amazon, Música e comunidade

Revisar links afiliados, disclosure, disponibilidade e preços externos. Criar
Música e “De Frente com o Tarot” como conteúdo editorial real, com capas,
episódios, transcrições, SEO e chamadas claras. Preparar comunidade sem expor
dados privados ou prometer contato sobrenatural verificável.

**Saída:** áreas de retorno diário com conteúdo renovável e confiável.

### Macroetapa 12 — Design de páginas e mobile premium

Criar uma gramática visual única para Home, Tarot, Tiragens, Escola, Diário,
IA, Loja, Consultas, Conta e Admin. Preservar orbe/menu e usar cartões, vazios,
carregamento, erro, sucesso, foco, toque e estados offline consistentes. Testar
larguras pequenas, safe areas, teclado, VoiceOver, TalkBack, zoom 200% e
redução de movimento.

**Saída:** nenhuma página parece um protótipo abandonado ou uma geração antiga.

### Macroetapa 13 — Retenção ética e conteúdo diário

Carta do Dia sem revelar a carta na notificação; desafios da Escola, histórico,
favoritos, calendário do Diário, novas skins e episódios. Métricas agregadas de
DAU/WAU/MAU, funil e retenção apenas com consentimento e sem texto privado.

**Saída:** razões reais para voltar diariamente, sem notificações invasivas.

### Macroetapa 14 — QA supremo de lançamento

Executar sintaxe, referências, console, 404, PWA, offline, Tarot 78, Carta do
Dia concorrente, tiragens, skins, acessibilidade, segurança, RLS, webhooks
duplicados, créditos simultâneos, backup/restore e cobrança sandbox. Exigir
P0=0 e P1=0, evidência por teste e aprovação da proprietária.

**Saída:** relatório PASS/FAIL/BLOCKED/NOT RUN reproduzível.

### Macroetapa 15 — Lançamento progressivo

Só depois de staging aprovado: deploy controlado, smoke test, monitoramento,
alertas, suporte, jurídico e autorização explícita. Produção, DNS, lojas,
cobrança real e Sol da Orbe IA continuam desligados até os respectivos sinais
de aprovação.

**Saída:** lançamento reversível, monitorado e sem surpresa financeira.

## 6. O que precisa ser feito agora, em ordem

1. Criar branch de teste e backup do `main`.
2. Corrigir o erro de `#userRegister` no `app.js`.
3. Corrigir ou substituir o `404.html` com chunks inexistentes.
4. Atualizar o service worker e confirmar que ele realmente registra.
5. Ativar o loader V8.28 na branch de teste.
6. Testar skins, orbes, menu, Tarot Livre, tiragens e Carta do Dia.
7. Medir iPhone, Android e computador; registrar capturas de toda falha.
8. Somente após isso consolidar SEO, conteúdo, backend e monetização.

## 7. Critério de perfeição

O site será considerado pronto para produção somente quando:

- o console estiver sem erros críticos;
- Home, 404 e offline usarem o mesmo universo visual;
- V8 estiver realmente ativa e não apenas armazenada;
- todas as orbes acompanharem a skin selecionada;
- Tarot tiver 78 cartas normais, sem repetição indevida e sem invertidas;
- as 78 páginas tiverem SEO compartilhável;
- PWA funcionar em instalação, atualização e offline permitido;
- Conta, Diário, Admin e pagamentos dependerem de backend seguro;
- P0 e P1 forem zero, com evidências reais;
- a proprietária aprovar a experiência em seus aparelhos;
- produção só for liberada com autorização explícita.

## 8. Estado real após esta auditoria

**Visual da Home:** forte e identificável.  
**Base de conteúdo:** ampla.  
**Repositório:** rico, porém excessivamente achatado e com gerações misturadas.  
**Runtime V8.30:** presente no GitHub, não confirmado como ativo no `index.html`.  
**Bloqueadores críticos:** erro de boot, 404 órfão, PWA V77 e ausência de backend real.  
**Próxima macroetapa recomendada:** Macroetapa 0 — Cofre, decisão de runtime e correção P0.

