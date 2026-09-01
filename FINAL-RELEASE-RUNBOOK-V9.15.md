# Divina Bruxa — Macroetapa 15 / Liberação progressiva

## Ordem oficial

1. **Staging:** instalar os ZIPs por macroetapa em branch de teste e preencher
   a matriz QA com evidências.
2. **Piloto:** somente após QA Supremo sem P0/P1, revisão de privacidade,
   segurança e conteúdo, com grupo convidado pequeno.
3. **Produção:** somente depois de aprovação explícita da proprietária,
   checklist jurídico, observabilidade e plano de rollback.

## Bloqueios mantidos

Publicação de produção, DNS, cobrança real, envio às lojas e Sol da Orbe IA
continuam desativados. Não há autorização implícita neste pacote.

## Rollback

Reverter o último commit de staging, restaurar o `sw.js` anterior e limpar o
cache do PWA. Preservar CNAME, cartas, skins, orbes, motor e navegação.
