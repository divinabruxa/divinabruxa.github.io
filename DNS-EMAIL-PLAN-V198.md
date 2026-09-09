# Plano DNS e E-mail V198

Este arquivo é um roteiro; não contém valores de conta nem autoriza mudanças.

## Inventário obrigatório

Registrar: registrador, titular, domínio escolhido, host GitHub correto, zona atual exportada, TTLs, MX, SPF, DKIM, DMARC, CAA e responsável. Não substituir registros de e-mail existentes por aproximação.

## Ordem GitHub Pages

1. Verificar a propriedade do domínio na organização/conta correta.
2. Adicionar o domínio ao repositório Pages correto antes do DNS.
3. Após autorização, publicar no apex os quatro A oficiais documentados pelo GitHub e apontar `www` por CNAME ao host `usuario.github.io` confirmado.
4. Não usar wildcard. Aguardar propagação, que pode levar até 24 horas.
5. Ativar Enforce HTTPS quando disponível e testar raiz, `www`, canonical, assets, manifest e service worker.

## Ordem Resend

1. Escolher subdomínio transacional dedicado.
2. Adicionar e verificar o domínio no Resend; copiar apenas registros exibidos para a conta autorizada.
3. Conferir SPF/DKIM, DMARC, Return-Path e TLS sem quebrar MX/SPF existentes.
4. Manter tracking desligado para autenticação e mensagens sensíveis.
5. Testar destinatários internos, bounce, complaint, supressão e Reply-To antes de tráfego real.

## Rollback

Restaurar a exportação exata da zona anterior. Não apagar o domínio verificado do host durante investigação, pois isso pode ampliar risco de tomada. Se e-mail degradar, pausar envios e restaurar os registros anteriores; preservar logs sem conteúdo sensível.

