# QA V547 — Segurança, Privacidade e Matriz Física

Macroetapa 13 de 14 da Divina Bruxa 3.0, construída sobre a V546.

## Resultado automatizado

O script estrutural `qa-v547-seguranca-privacidade-matriz.mjs` aprovou **12.578 de 12.578 verificações**. O laboratório isolado do Service Worker aprovou **26 de 26 verificações funcionais** de instalação atômica, ativação, segregação de autoridade, offline, entitlement, corrupção, reparo e falta simulada de espaço no cache. Resultado automatizado combinado: **12.604 de 12.604 verificações aprovadas**.

Testes físicos permanecem explicitamente pendentes e não são contados como aprovados automaticamente. O ambiente desta sessão não possuía binário de navegador executável; nenhum teste visual foi inventado. O laboratório `laboratorio-fisico-v547.html` começa com zero PASS e oferece 9 perfis e 59 casos manuais.

## Segurança validada

- ADMIN sem senha fixa ou papel salvo no JavaScript público.
- Owner somente por servidor, e-mail verificado, MFA/AAL2, sessão em cookie HttpOnly e recovery codes.
- Rate limit transacional no banco e fingerprint SHA-256 com pepper; IP e user-agent brutos não são persistidos.
- Recovery code consumido por escrita condicional única.
- Corpos de escrita limitados, JSON obrigatório, origem exata e Fetch Metadata.
- Respostas administrativas com `no-store`, HSTS, frame negado, CSP restritiva e política de permissões.
- Funções V547 do banco sem execução por `anon` ou `authenticated`; somente `service_role`.
- Novas tabelas com RLS e FORCE RLS.
- Advisors do Supabase sem achado crítico ou erro. Dois WARN de RPCs V201 autenticadas foram revisados e permanecem intencionais/self-bound; 19 INFO são tabelas default-deny. Os 53 INFO de índices sem uso aguardam tráfego representativo antes de qualquer remoção.

## Privacidade validada

- Analytics e marketing opcionais começam desligados.
- Retenção técnica declarada em até 90 dias.
- Diário, perguntas, prompts e respostas não entram em analytics ou snapshots ADMIN.
- Localização precisa não é coletada pelo fluxo permitido.
- Exportação e exclusão ficam no fluxo autenticado da Conta.
- Senha, MFA, recovery codes, chave TOTP e QR efêmero são apagados quando a pessoa abandona a rota/página.
- Exportações de diagnóstico e matriz são sanitizadas.

## Cobertura pública

- 321 de 321 páginas HTML receberam CSP, política de referrer e marca V547.
- Links em nova aba possuem `noopener` e `noreferrer`.
- Manifesto e Service Worker usam corte V547.
- GitHub Pages não é tratado como se lesse `_headers`; CSP/referrer em meta continuam presentes, enquanto HSTS e `frame-ancestors` dependem da camada de hospedagem.

## Regressões preservadas

- Uma Orbe canônica V501 e nenhum motor novo na V547.
- Tarot Livre ativo continua no runtime V517/V538, sem motor de fogo/WebGL, 78 cartas diretas, sem repetição e Mesa Real 13 × 6.
- Whit Local continua sem API paga.
- Escola mantém 17 módulos e 124 aulas.
- Catálogo mantém 30 skins, sendo 29 pagas individualmente e incluídas no Premium.
- Produção, DNS, billing real, lojas e Sol continuam bloqueados.

## Pendências verdadeiras para a V548

1. Ativar a primeira proprietária com e-mail oficial verificado, TOTP e recovery codes.
2. Executar os perfis físicos que estiverem realmente disponíveis e exportar a matriz sanitizada.
3. Conectar backup externo autorizado ou manter o controle bloqueado; executar restore em alvo isolado antes de qualquer selo.
4. Fazer a revisão final da proprietária, corrigir somente falhas reais e encerrar o Plano 3.0.
