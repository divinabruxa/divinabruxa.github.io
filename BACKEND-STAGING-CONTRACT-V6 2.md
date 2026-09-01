# Divina Bruxa — contrato de staging V6

Este arquivo descreve o backend que será conectado quando a URL pública e a chave `anon`/publishable do Supabase forem configuradas. Não contém segredos e não ativa produção.

## Entidades mínimas

- `profiles`: `id` ligado a `auth.users.id`, nome público, idioma e fuso.
- `entitlements`: plano, origem, início, expiração e status.
- `daily_cards`: uma linha por `user_id + date_brasilia`; carta normal (`reversed=false`).
- `tarot_sessions`: sessões do Tarot Livre; `card_ids` únicos, de 0 a 77.
- `spread_sessions`: tiragens; posições e cartas únicas, sempre `orientation='normal'`.
- `journal_entries`: diário privado por usuário; corpo nunca aparece em analytics/admin.
- `skin_entitlements`: skins cosméticas liberadas por usuário.
- `audit_events`: eventos técnicos mínimos, sem texto do diário nem perguntas privadas.

## Endpoints de skins

- `GET /account/skins`: retorna somente os IDs cosméticos liberados pela conta autenticada.
- `POST /account/skins`: recebe um `skinId` válido e cria uma concessão idempotente em staging.
- `DELETE /account/skins/:skinId`: revoga a concessão somente no ambiente de testes.

Todas as respostas devem usar JSON, sessão por cookie `HttpOnly` e códigos `401/403` quando a conta não estiver autorizada. O cliente mantém fallback local somente enquanto `CONFIG.apiBase` estiver vazio.

## Regras de acesso

1. RLS ativado em todas as tabelas expostas.
2. Usuário só lê ou altera linhas cujo `user_id = auth.uid()`.
3. Admin não lê `journal_entries.body`; apenas agregados sem conteúdo.
4. Cartas, orientações e posições são validadas no servidor; inversões são rejeitadas.
5. Chaves privilegiadas ficam exclusivamente em Edge Functions/servidor.
6. Exclusão e exportação devem apagar/exportar todos os dados do usuário.

## Bloqueios de produção

`production_publish_authorized=false`  
`dns_changes_authorized=false`  
`real_billing_authorized=false`  
`store_submission_authorized=false`  
`ORBE_AI_SOL_ENABLED=false`

## Próxima conexão

Configurar somente `CONFIG.apiBase` e a chave pública do cliente. Nunca inserir `service_role`, senha, chave OpenAI ou segredo de pagamento no GitHub.
