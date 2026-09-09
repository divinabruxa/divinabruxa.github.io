# Checklist de Go-Live V198

Marque somente com link para evidência. `N/A` exige justificativa e aprovação.

## Antes de solicitar autorização

- [ ] V197: 1221/1221, P0=0 e P1=0.
- [ ] V198: QA integral aprovado e hashes conferidos.
- [ ] Testes físicos iPhone/Android, VoiceOver/TalkBack, offline e rede lenta aprovados.
- [ ] Commit, artefato, responsável, janela e rollback registrados.
- [ ] Política de privacidade, termos, suporte, exclusão/exportação e reembolso revisados.
- [ ] Nenhum segredo em cliente, repositório, ZIP, log ou captura.

## G2 — dados

- [ ] Produção separada de STAGING.
- [ ] Changelog Supabase revisto no dia do corte; Node 22+ confirmado.
- [ ] Migrações ensaiadas em restauração e plano reverso aprovado.
- [ ] RLS e testes negativos/positivos aprovados em toda tabela exposta.
- [ ] Security Advisor e Performance Advisor sem P0/P1.
- [ ] Backup/PITR e restauração testados; SSL, MFA, SMTP e rate limits configurados.

## G3/G4 — domínio e e-mail

- [ ] Domínio verificado no GitHub antes do DNS; configuração do host precede o corte.
- [ ] DNS anterior exportado; TTL, A/CNAME, propagação e rollback revisados.
- [ ] HTTPS, canonical, raiz, `www`, PWA e rotas críticas aprovados.
- [ ] Subdomínio Resend verificado; SPF/DKIM/DMARC, TLS e Return-Path revisados.
- [ ] Templates localizados, bounce/complaint/supressão e retenção testados.

## G5 — comércio

- [ ] Checkout Sessions/Billing em sandbox e catálogo Product/Price reconciliado.
- [ ] Chave restrita, versão da API, `integration_identifier` e segredo de webhook no cofre.
- [ ] Duplicidade, atraso, reordenação, retry, reconciliação e idempotência testados.
- [ ] Compra, renovação, pendência, cancelamento, reembolso, disputa e restore testados.
- [ ] Impostos e registros confirmados por profissional; `automatic_tax` só então decidido.
- [ ] Play Billing e IAP mapeados; créditos comprados não expiram.

## G6 — operação

- [ ] SLO, painéis, alertas, plantão e runbooks testados.
- [ ] Telemetria consentida não contém pergunta, diário, cartas ou resposta pessoal.
- [ ] Suporte `orbedasrealidades@hotmail.com` funcional e respostas padrão prontas.
- [ ] Status page e comunicação de incidente/reembolso preparadas.

## Autorização final, ainda ausente na V198

- [ ] Publicar web em produção.
- [ ] Alterar DNS.
- [ ] Criar/migrar Supabase de produção.
- [ ] Ativar Resend real.
- [ ] Ativar cobrança Stripe live.
- [ ] Enviar Google Play.
- [ ] Enviar App Store.
- [ ] Ligar Orbe IA Sol.

