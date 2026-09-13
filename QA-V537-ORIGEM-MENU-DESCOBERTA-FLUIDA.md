# DIVINA BRUXA V537 — QA de Origem, Menu e Descoberta Fluida

Plano Supremo Divina Bruxa 3.0 — Macroetapa 3 de 14  
Data: 13 de setembro de 2026  
Base obrigatória: V536 instalada  
Estado: **PASS_WITH_BLOCKERS**

## Escopo verificado

- Home fechada visualmente apenas com a Orbe canônica.
- Busca local das 17 realidades e cinco trilhas de descoberta.
- Breadcrumb contextual fora da Home.
- Integração com Barramento/Gramática V536.
- Remoção estrutural do fogo no Tarot Livre e no Universo V524.
- Preservação das 78 cartas diretas, grade de 6 e Mesa Real 13 × 6.
- App, PWA, service worker e páginas de instalação alinhados.

## Resultado automatizado

- 108 verificações totais
- 103 PASS
- 0 FAIL
- 4 BLOCKED por dependerem de aparelhos ou métricas reais
- 1 NOT RUN: navegador headless indisponível no executor
- 0 P0/P1 automatizado conhecido

Comando:

```bash
node qa-v537-origem-menu-descoberta-fluida.mjs
```

Evidências estruturais: o JavaScript do Tarot Livre não contém ativação da
chama antiga; o Universo V524 não contém uniforms, função GLSL, estado,
geometria, desenho Canvas ou API do fogo; o CSS do altar não possui animações
infinitas. A Orbe canônica, o Universo único e as transições curtas de ação
continuam presentes.

## Gates físicos

- Tarot Livre: 20 revelações, histórico, embaralhar e reset em iPhone/Android.
- Menu: abrir, buscar, escolher, voltar, retrato e paisagem.
- Web Vitals de campo: LCP p75 ≤ 2,5 s, INP p75 ≤ 150 ms, CLS Home 0,000.
- VoiceOver/TalkBack, teclado, foco e movimento reduzido.

Esses quatro itens permanecem BLOCKED até evidência real e não autorizam
publicação em produção.

O percurso automatizado Home → Menu → Busca → Tarot foi tentado, mas o executor
não possui o binário Chromium. O item foi registrado como NOT RUN, nunca como
PASS presumido.

Próxima entrega do plano: **V538 — Universo do Tarot Vivo**.
