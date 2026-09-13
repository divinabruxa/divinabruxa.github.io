# Divina Bruxa 3.0 — Operação de Segurança e Privacidade V547

Data do corte: 13 de setembro de 2026  
Ambiente: `divina-bruxa-staging` (`kyphdsamyygavmkzyezr`)  
Macroetapa: 13 de 14

## Estado comprovado neste corte

- Migração `seguranca_privacidade_continuidade_v547` aplicada no STAGING.
- Correção idempotente `v547_rate_limit_runtime_fix` aplicada no STAGING.
- `admin-api` ativo na versão 9, `admin-media-v320` na versão 3 e `admin-analytics-v322` na versão 2.
- As três funções exigem origem permitida, sessão owner, e-mail verificado, MFA/AAL2 e códigos de recuperação antes de retornar dados administrativos.
- Rate limit é transacional no banco. O banco recebe somente uma fingerprint SHA-256 com pepper; IP e user-agent brutos não são persistidos.
- Recovery code passa por consumo atômico; duas solicitações concorrentes não podem consumir o mesmo código.
- Conteúdo íntimo continua fora dos snapshots: Diário, perguntas de Consulta, prompts, respostas, senhas, segredos e contatos.
- As 12 políticas Whit foram preservadas e otimizadas para avaliar `auth.uid()` uma vez por consulta.
- Os dois índices ausentes das chaves estrangeiras de `video_episodes` foram criados.
- Cobrança real, produção, DNS, lojas e Sol permanecem bloqueados.

## Estado que continua aguardando ação real

- Proprietárias ativas: **0** no momento do corte. Isto é um bloqueio honesto, não um erro de senha.
- A allowlist contém **1 hash** do e-mail oficial. Nenhum e-mail bruto é guardado na tabela privada.
- Backup externo automático: **não conectado**.
- Restore em ambiente isolado: **não verificado**.
- Matriz física: **0 aprovações automáticas**.

## Primeira ativação da proprietária — sem editar código

1. Na área **Conta**, crie uma conta usando o e-mail oficial já definido pelo projeto.
2. Abra a mensagem de confirmação e verifique esse e-mail.
3. Volte ao site e abra **Admin**.
4. Entre com a mesma conta. O servidor compara o hash do e-mail verificado com a allowlist privada; nenhum nome ou papel local libera acesso.
5. Cadastre o TOTP em um aplicativo autenticador e confirme o primeiro código.
6. Gere os 10 códigos de recuperação e guarde-os fora do navegador, de preferência em cofre criptografado.
7. Saia e entre novamente para validar o ciclo completo.

Nunca coloque senha, código MFA ou recovery code no GitHub, em diagnóstico, em e-mail ou no Diário.

## Respostas esperadas dos portões

| Situação | Resposta esperada |
|---|---|
| Sem sessão | `401 missing_session` |
| Conta comum | `403 forbidden`, sem dados Admin |
| E-mail não verificado | `403 email_not_verified` |
| Owner sem MFA/AAL2 | `401 mfa_required` |
| Owner sem recovery codes | `428 recovery_codes_required` |
| Origem não permitida | `403 origin_denied` |
| Cabeçalho de escrita inválido | `403 request_guard_denied` |
| Corpo maior que o limite | `413 request_body_too_large` |
| Limite excedido | `429 rate_limit_exceeded` + `Retry-After` |

## Privacidade operacional

| Dado | Padrão | Pode chegar ao Admin/analytics? | Controle |
|---|---|---|---|
| Diário | Local | Não | Sincronização separada e escolhida |
| Pergunta de Tarot/Consulta | Local ou fluxo solicitado | Não | Conta/solicitação autenticada |
| Prompt e resposta Whit | Local ou serviço solicitado | Não | Contexto explícito e removível |
| Analytics opcional | Desligado | Só eventos permitidos | Centro de Privacidade; retenção até 90 dias |
| Sessão Admin | Cookie HttpOnly/Secure | Só validação no servidor | Logout, expiração e revogação |
| Senha/MFA/recovery | Nunca em diagnóstico | Não | Auth, TOTP e hash de uso único |

## Incidente — ordem de resposta

1. **Conter:** bloquear o acesso afetado, sair de sessões abertas e manter produção/billing fechados.
2. **Preservar evidência sanitizada:** horário, módulo, resultado e identificador técnico; nunca copiar conteúdo privado ou credenciais.
3. **Revogar:** sessões administrativas afetadas e fator MFA comprometido.
4. **Rotacionar:** service role e peppers dedicados quando houver suspeita de exposição. Depois da rotação, gerar novos recovery codes.
5. **Verificar:** RLS, flags de ambiente, Edge Functions ativas e advisors.
6. **Recuperar:** restaurar somente a partir de backup com hash e testar em alvo isolado.
7. **Comunicar:** usar o canal oficial e seguir obrigações aplicáveis; não fazer promessa jurídica automática.
8. **Aprender:** registrar causa, correção e prevenção sem inserir texto íntimo em auditoria.

## Critério para a Macroetapa 14

A V548 não pode declarar a obra pronta enquanto houver falha crítica conhecida. Itens físicos ou operacionais sem evidência permanecem `NÃO EXECUTADO` ou `BLOQUEADO`; nunca viram `PASSOU` por dedução.
