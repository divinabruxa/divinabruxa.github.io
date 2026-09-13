# QA V558 — Consultas Supremas

Resultado final: **213/213 verificações aprovadas**.

| Bloco | Resultado |
| --- | ---: |
| Catálogo, formulário, ADMIN, e-mail, privacidade, iPhone e páginas públicas | 80/80 |
| Regressão de navegação iOS e Orbe única | 35/35 |
| Service Worker em execução simulada | 26/26 |
| Regressão completa da Whit Local V557 | 72/72 |

Também foram aprovados:

- sintaxe dos módulos JavaScript alterados;
- quatro valores em centavos e em BRL;
- versão de tabela de preços V558;
- `price_snapshot` capturado no servidor e mantido no aparelho;
- edição futura via ADMIN, owner e MFA;
- remoção da igualdade rígida que bloqueava novos preços;
- campos obrigatórios e consentimentos;
- fallback de e-mail automático quando o provedor não responde;
- ausência de marketing, WhatsApp/SMS e cobrança automática;
- zero animações infinitas na nova camada visual;
- `content-visibility`, alvos mínimos de 48px e fonte de 16px nos campos para iPhone;
- Reduced Motion;
- 321 páginas HTML preservadas.

## Verificação STAGING

Migração `consultas_supremas_v558` aplicada com sucesso. O catálogo remoto devolveu:

- Mesa Real Profissional — 25000 centavos;
- Leitura de Mente — 20000 centavos;
- Carta de Conselho — 15000 centavos;
- Pergunta — 5000 centavos;
- versão `consultas-2026-09-13-v558`.

Os avisos de segurança e performance do Supabase foram consultados depois da migração. Nenhum novo alerta foi introduzido por esta alteração. O provedor de e-mail permanece `not_configured`; por isso o fallback manual permanece visível e verdadeiro.
