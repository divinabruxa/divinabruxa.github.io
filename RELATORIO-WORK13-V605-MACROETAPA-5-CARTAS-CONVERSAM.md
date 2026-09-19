# WORK13 V605 — Cartas que Conversam · Tiragens em Camadas

## Resultado

A Macroetapa 5 leva a respiração da Carta do Dia para as Tiragens sem criar
outro motor. Cada posição agora chega como carta, recebe uma pausa curta e só
então mostra uma frase de essência. O conteúdo completo permanece recolhido até
a pessoa tocar em **Aprofundar esta carta**.

Quando a tiragem termina, até três vozes do desenho — abertura, mudança de tom e
resposta — colocam cartas e posições em relação. Em seguida aparece uma única
frase de síntese, curta e responsável. **Aprofundar a tiragem** abre somente três
camadas: o que observar, uma reflexão e um caminho possível.

## Arquivos de produção

Substituídos:

- `app-v208.js`
- `index.html`
- `sw.js`

Novos:

- `cosmic-spread-reading-v605.js`
- `cosmic-spread-reading-v605.css`

## Sequência viva

1. Carta: imagem, nome e posição chegam primeiro.
2. Silêncio: 520 ms no modo comum, 280 ms no modo limitado e 140 ms com
   movimento reduzido.
3. Essência: somente a primeira frase editorial aprovada aparece.
4. Conversa: abertura, ponto de mudança e resposta ligam cartas às posições.
5. Síntese: uma frase reúne o fio da tiragem sem declarar destino.
6. Profundidade: só abre após pedido explícito e volta a recolher sem refazer a
   tiragem.

As 15 tiragens foram verificadas. A Cruz Celta preserva 10 posições. A Mesa Real
preserva as 78 cartas únicas em 13 × 6 e resume o desenho com no máximo três
vozes, sem criar uma parede de texto.

## Proteções mantidas

- WORK12 V600, snapshot V601, memória V602, ressonância V603 e leitura diária
  V604 intactos.
- Oito arquivos centrais de Tiragens verificados sem alteração: motor, política,
  mundo, camada suprema, síntese anterior, carregador, catálogo e Tarot Livre.
- Quatro tiragens gratuitas e onze Premium; autoridade Premium continua no
  servidor.
- Cartas sempre diretas, únicas e reveladas pela mesma Orbe.
- Tarot Livre permanece com 78 cartas, sem repetição e sem significados
  automáticos.
- A V605 não lê pergunta, intenção, Diário ou carta ainda não revelada.
- Identidades já reveladas são usadas apenas em memória local e transitória para
  formar a conversa; nada é salvo ou enviado pela nova camada.
- Nenhuma chamada de rede, modelo, navegação ou intervenção nova da Whit.
- Uma Orbe física e um canvas; nenhum renderer, observador ou loop permanente
  novo. Existe no máximo um timer curto durante a pausa.
- Interface compacta para iPhone, landscape, movimento reduzido e cores
  forçadas.

## Qualidade

- V605: 988 verificações aprovadas.
- Leitura diária V604 preservada: 371 verificações de runtime aprovadas.
- Ressonância V603 preservada: 128 verificações de runtime aprovadas.
- Memória V602 preservada: 63 verificações de runtime aprovadas.
- Regressão compatível WORK12: 320 verificações aprovadas.
- Total: **1870/1870 PASS**.
- Service worker atômico: 33 arquivos essenciais.
- 24 arquivos protegidos do WORK12 e 8 arquivos centrais das Tiragens
  verificados sem alteração.
- Snapshot V600: SHA-256
  `871a9118fa58eb1f1dd118110bda21a68f071ef3d00cb56b8ae6109aa1ac816d`.

## Próxima macroetapa autorizada

Macroetapa 6: Whit viva pelo silêncio, pela utilidade e pelo timing — presença
quando há algo verdadeiro a oferecer, ausência quando não precisa aparecer.
