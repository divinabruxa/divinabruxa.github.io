# Diagnóstico — Orbe Suprema 2.0 / Macroetapa 1 / V576

## Causas confirmadas

1. O carregador apenas aquecia o Tarot antes da navegação e construía o altar
   real depois do pouso. A viagem encontrava o HTML provisório; em seguida o
   Tarot substituía esse HTML e tentava reclamar a Orbe outra vez.
2. O menu liberava a Orbe de volta à Home antes de iniciar a viagem. Mesmo com
   a coordenada visual preservada, o corpo físico atravessava uma janela de
   posse incorreta, suficiente para um quadro de salto no Safari.
3. O toque de revelação exige simultaneamente rota ativa e posse física da
   Orbe pelo altar. Como a Orbe permanecia no motor/projeção, o toque gerava
   resposta visual, mas `draw()` era corretamente bloqueado.
4. A publicação estava incoerente: `index.html` e `app-v208.js` pediam V565,
   enquanto o motor e o Service Worker já declaravam V575. O cache podia
   combinar autoridades de gerações diferentes.
5. A espera direta por `Animation.finished` não tinha limite. Em determinadas
   retomadas do Safari/PWA, a promessa podia não encerrar e manter o estado de
   voo ativo.

## Correção aplicada

- O Tarot Livre agora é construído e validado antes do commit da rota.
- O menu começa a fechar, mas entrega a mesma `#orb` diretamente ao motor; não
  existe passagem intermediária pela Home.
- A posse segue uma cadeia exclusiva: host atual -> motor -> host do Tarot.
- O pouso no Tarot só aceita o altar V576 reservado pelo próprio Tarot; alvo
  provisório é recusado.
- O gesto só fica funcional quando esse altar contém fisicamente a Orbe.
- A mini-Orbe do cabeçalho fica suprimida durante a chegada e enquanto o Tarot
  possui a autoridade física, eliminando a duplicidade mostrada na gravação.
- Esperas de animação da viagem e da revelação possuem watchdog e limpeza.
- `index.html`, imports críticos e Service Worker compartilham o epoch V576;
  módulos de autoridade usam rede primeiro e shell atômico apenas como fallback.

## Escopo preservado

Nenhum efeito novo, rota, texto editorial, regra de produto, significado de
carta, arte ou dependência foi adicionado. O baralho continua com 78 cartas
diretas, sem repetição, e histórico de seis cartas por fileira.

## Evidência automatizada

- QA V576: 76/76 — PASS.
- Regressão do carregador V562: PASS.
- Sintaxe Node dos oito substitutos e do QA: PASS.
- `git diff --check`: PASS.
- Primeira revelação determinística: O Louco; estado 1 revelada / 77 aguardando.
- Ciclo completo: 78/78 cartas únicas e diretas.

O teste físico no iPhone descrito no arquivo de instalação é o gate final desta
macroetapa. Nenhuma etapa seguinte deve começar antes dessa aprovação.

