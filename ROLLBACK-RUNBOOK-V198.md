# Runbook de Rollback V198

## Disparo

Rollback imediato para qualquer P0: indisponibilidade de rota crítica, corrupção/perda de dados, vazamento de segredo, concessão ou cobrança incorreta, falha sistêmica de autenticação, violação de política de loja ou ausência de evidência de recuperação.

## Comando humano

O líder do incidente declara `STOP`, congela novas promoções e registra horário UTC, sintoma, versão, impacto e dono. Não apagar evidência. Não rotacionar ou restaurar sem registrar o estado anterior.

## Ordem segura

1. Desabilitar novas compras/concessões por feature flag server-side; preservar consulta e suporte.
2. Reverter o artefato web para o último commit aprovado e invalidar somente caches previstos.
3. Se o defeito for backend, pausar writes afetados; não executar downgrade destrutivo.
4. Restaurar dados somente a partir de backup validado e após estimar perda/RPO; preferir migração corretiva aditiva.
5. Se o domínio falhar, restaurar exatamente os registros e TTL exportados antes do corte.
6. Revogar/rotacionar segredo comprometido no provedor, atualizar o cofre e redeployar; nunca divulgar o valor no ticket.
7. Pausar rollout nas lojas; disponibilizar correção ou retirada conforme console e política.
8. Reconciliar pagamentos e direitos desde o último checkpoint; corrigir usuários de forma idempotente.

## Validação pós-rollback

- Rotas críticas PT-BR/EN/ES, Home, Orbe, Tarot, login e offline.
- Erros e latência voltaram à linha de base.
- Nenhuma cobrança ou concessão permanece sem reconciliação.
- Banco consistente; backup e trilha de auditoria preservados.
- Comunicação enviada aos afetados quando exigida, sem expor dados pessoais.

## Encerramento

Não retomar no mesmo impulso. Abrir causa raiz, corrigir, reproduzir o teste que falhou, executar todas as suítes, obter nova autorização e criar uma nova janela. O rollback não é autorização para qualquer outra mudança externa.

