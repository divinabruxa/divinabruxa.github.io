# QA V545 — Paridade PT-BR, Inglês e Espanhol

Macroetapa 11 de 14 da Divina Bruxa 3.0, instalada sobre a V544.

## Resultado automatizado

O script `qa-v545-paridade-internacional.mjs` aprovou **7.121 de 7.121 verificações**. Ele confere individualmente as 156 páginas localizadas, os 78 pares recíprocos em português, os oito novos mundos, todos os caminhos locais, sitemaps, metadados e travas de fluidez. Testes físicos não são contados como aprovados automaticamente.

## Contratos fechados

- Três idiomas públicos: PT-BR, inglês e espanhol.
- Nove mundos públicos alcançáveis pela navegação internacional.
- 78 cartas por idioma; 234 páginas de carta no total.
- Orientação direta em todas as cartas; nenhuma carta invertida operacional.
- Canonical e quatro alternates em cada página individual.
- 90 URLs em cada sitemap internacional.
- Música baseada nos dois álbuns reais configurados.
- Vídeos preservados com zero episódios enquanto o piloto não for publicado.
- Loja internacional editorial, sem checkout interno, preço ou estoque copiado.

## Verificação manual depois do deployment

1. Abrir `english.html` e `espanol.html` no iPhone.
2. Percorrer os nove caminhos do menu em cada idioma.
3. Abrir a biblioteca, pesquisar uma carta e tocar no significado completo.
4. Trocar PT/EN/ES dentro de uma carta maior e de uma menor.
5. Navegar entre carta anterior e seguinte.
6. Abrir Tiragens, Música, Vídeos e Loja nos dois idiomas.
7. Confirmar rolagem suave, alvos de toque e safe areas em retrato e paisagem.
8. Reabrir o PWA e confirmar que a V545 substituiu o cache anterior.

## Travas preservadas

- `production_publish_authorized=false`
- `dns_changes_authorized=false`
- `real_billing_authorized=false`
- `store_submission_authorized=false`
- `ORBE_AI_SOL_ENABLED=false`
