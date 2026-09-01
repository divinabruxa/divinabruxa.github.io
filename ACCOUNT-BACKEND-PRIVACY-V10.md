# Divina Bruxa — Macroetapa 14: conta, backend e privacidade

## Objetivo

Sair do estado de demonstração local e criar uma base segura para contas, sincronização, compras, diário e administração. Staging e produção serão ambientes totalmente separados.

## Conta

- Cadastro, login, logout, recuperação e confirmação de e-mail.
- Sessões curtas para áreas sensíveis e revogação após exclusão.
- MFA obrigatório para a proprietária e administradores.
- Autorização baseada em dados confiáveis do servidor, nunca em `user_metadata` editável.
- Nenhuma chave `service_role` ou segredo no navegador.

## Dados essenciais

Perfis, preferências, entitlements, compras, assinaturas, créditos IA, cartas diárias, tiragens, escola, diário, skins, consultas, conteúdo, notificações, auditoria, webhooks, backups e solicitações LGPD.

## RLS e acesso

Toda tabela exposta deve ter RLS habilitado. Regra padrão: negar. Usuários só acessam suas próprias linhas; o administrador acessa apenas funções autorizadas e agregados operacionais. Views sensíveis não ficam públicas.

## LGPD

Privacy Center, consentimento versionado, preferências de marketing, exportação, exclusão, mapa de dados, retenção, fornecedores, incidentes e canal oficial. O Diário nunca aparece em analytics, suporte ou painel administrativo.

## Critério de saída

Staging separado, migrations revisadas, RLS testado com usuário A/B, MFA do owner, recuperação de conta, exportação/exclusão verificadas e zero segredo no frontend.
