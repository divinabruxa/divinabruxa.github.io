# Divina Bruxa — Macroetapa 14 / QA Supremo

O verificador cobre a integridade estática que pode ser comprovada localmente:
78 páginas de cartas, 78 imagens, assets das orbes, skins, referências do
index, SEO, PWA e padrões de chaves Stripe expostas.

Testes ainda dependentes de ambiente real permanecem explicitamente fora deste
script: iPhone/Android físicos, VoiceOver/TalkBack, rede 2G, cache instalado,
Auth/RLS, webhooks, billing sandbox, restauração de backup e envio de e-mail.
Esses itens devem ser executados na branch de staging e classificados como
PASS, FAIL, BLOCKED ou NOT RUN com evidência.
