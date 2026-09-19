# WORK12 — Macroetapa 7 de 10

## Leituras como Rito · V595

Base instalada auditada: V594, commit `71a1b48`.

## Resultado

Tarot Livre e Carta do Dia agora compartilham uma única máquina de tempo e
presença. Ela não cria outra carta, outra interpretação, outra Orbe ou outro
universo. Ela governa apenas o nascimento das camadas:

1. símbolo;
2. silêncio;
3. essência;
4. profundidade somente quando chamada.

A interface deixa de despejar informação. A leitura passa a chegar como um
encontro, preservando os motores, as cartas e as regras já aprovadas.

## Tarot Livre

- A carta nasce primeiro.
- O nome espera o intervalo de silêncio.
- Não existe significado automático no jogo.
- Depois da essência, uma única intenção curta — **Símbolo** — pode continuar
  horizontalmente até a carta exata na Biblioteca.
- A viagem usa o coordenador V592 e a mesma Orbe persistente V591.

## Carta do Dia

- A carta continua determinada uma única vez por dia pela autoridade existente.
- Identidade e essência chegam depois do símbolo.
- As camadas antigas começam recolhidas.
- **Mergulhar** revela a profundidade; **Recolher** volta ao essencial.
- A constelação profunda é horizontal e mostra no máximo duas intenções por vez.
- O antigo comentário automático da Whit foi removido.
- **Whit, fica** permanece como convite explícito da pessoa.

## Whit e silêncio

Whit não narra a leitura nem reage com frase a cada carta. A V595 usa a alma
física já existente na Orbe para sustentar escuta, reflexão e presença. Fala só
continua disponível quando a pessoa a chama deliberadamente.

Nenhum campo, pergunta, Diário, carta privada ou emoção é lido para decidir o
timing. Não há inferência emocional, modelo, API ou armazenamento novo.

## Performance

- 1 máquina de estados para as duas leituras.
- 1 timer adiável e cancelável no máximo.
- 0 novos canvases.
- 0 novos renderers.
- 0 loops permanentes de animação.
- 0 MutationObservers.
- Efeitos pesados pausados durante a sequência e qualquer viagem.
- Movimento essencial preservado em iPhone e em modo de movimento reduzido.

## Arquivos de produção

Substituídos:

- `app-v208.js`
- `daily-world-v509.js`
- `index.html`
- `page-loader-v1.js`
- `sw.js`

Novos:

- `reading-ritual-core-v595.js`
- `reading-ritual-core-v595.css`

Os núcleos V590–V594 de universo, Orbe, viagem, SOPRO e presença Whit foram
preservados. O motor do Tarot Livre permanece intacto.

## QA aprovado

- V595 estrutura, contratos e conteúdo protegido: 191/191.
- V595 rito e silêncio em runtime: 30/30.
- V595 Service Worker atômico e offline: 110/110.
- V595 boot recuperável: 10/10.
- V594 presença Whit: 34/34.
- V593 SOPRO e menu vivo: 45/45.
- V592 histórico coordenado: 33/33.
- V591 Orbe persistente: 41/41.
- V590 Universo Vivo: 33/33.
- V586 balões mágicos: 35/35.
- V585 linguagem das realidades: 21/21.

Total: **583/583 PASS**.

## Lei cumprida

Uma Orbe. Um universo. Uma leitura que sabe esperar.

Símbolo. Silêncio. Sentido.

