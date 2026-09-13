# Divina Bruxa — Política de Backup e Restore V547

Ambiente atual: STAGING no plano Free. Esta política registra metas; ela não inventa uma execução.

## Metas registradas

- RPO alvo: 24 horas.
- RTO alvo: 8 horas.
- Retenção pretendida: 30 dias.
- Exportação pretendida do banco: a cada 24 horas.
- Cópia externa: obrigatoriamente criptografada.
- Storage: inventariado e copiado separadamente do banco.
- Manifesto: SHA-256 obrigatório para cada conjunto.
- Restore: sempre em alvo isolado antes de qualquer uso operacional.

## Estado na V547

| Controle | Estado |
|---|---|
| Política no schema privado | Configurada |
| Cofre de execuções isolado | Configurado |
| Leitura direta pelo navegador | Bloqueada |
| Agendador externo | Pendente |
| Backup criptografado com evidência | Pendente |
| Cópia separada do Storage | Pendente |
| Restore completo verificado | Pendente |

O plano Free atual não deve ser tratado como se fornecesse, por si só, o histórico operacional pretendido. Antes de produção, conecte uma rotina autorizada de exportação externa ou escolha um plano com a política de backup necessária. Isso é uma decisão operacional, não uma nova versão do site.

## Checklist de uma execução válida

1. Criar exportação do banco sem imprimir tokens no terminal ou em logs.
2. Inventariar buckets e exportar objetos separadamente.
3. Criptografar o conjunto antes do envio ao armazenamento externo.
4. Gerar SHA-256 do banco, dos objetos e do manifesto.
5. Registrar somente estado, provedor, horário, retenção, hash e código sanitizado de falha.
6. Restaurar em projeto/branch isolado, nunca sobre o STAGING original.
7. Validar esquema, RLS, funções, contagens esperadas e arquivos do Storage.
8. Destruir o alvo temporário somente depois de preservar o relatório sanitizado.

## Critério de “RESTORE VERIFICADO”

O selo só pode mudar para `VERIFICADO` quando uma restauração real terminar sem falhas críticas e o relatório incluir data, alvo isolado, manifesto e hash. Abrir um ZIP, listar tabelas ou confiar na existência de uma rotina não basta.
