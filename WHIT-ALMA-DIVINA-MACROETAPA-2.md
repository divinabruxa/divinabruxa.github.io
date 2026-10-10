# Whit Alma Divina — Macroetapa 2 de 8

**Concluída: nova base editorial tarológica e posições.** Esta entrega contém código novo, ainda independente da interface pública. O motor antigo segue ativo até a integração da etapa 3.

## O que foi criado

- 78 perfis próprios, identificados pelo catálogo canônico existente. Cada carta possui situação simbólica, força, tensão, atitude e imagem espiritual; dimensões de amor, mente, ação e espírito são âncoras para a composição posterior.
- Conteúdo editorial novo: não copia nem importa os textos dos motores narrativos anteriores. Os perfis são uma interpretação autoral para ficção simbólica, não regras universais sobre o Tarot ou evidências sobre a vida de alguém.
- As 15 tiragens que já existem no projeto têm seus rótulos e acessos preservados. Carta do Dia e Tarot Livre têm adaptadores próprios.
- Posições exercem papéis diferentes: situação, obstáculo, intenção, base, passado, possibilidade futura, postura, ambiente, expectativa, síntese e outros. Uma carta no obstáculo é tratada pela sua tensão; no conselho, por uma atitude possível.
- Relações direcionais reconhecem reforços, contrastes e transições. Esperança → ruptura difere de ruptura → esperança. Elementos, naipes, números repetidos, corte, presença de Maiores e temas são dados de contexto.
- Dois Caminhos mantém A e B como alternativas, sem transformar B em consequência de A. Cruz Celta relaciona situação, desafio, base, passado, movimentos e síntese; a Mandala relaciona centro e casas.
- Mesa Real usa as coordenadas existentes: 6 linhas, 13 casas por linha, 78 posições. Vizinhanças horizontais e verticais somam 137 relações numa mesa completa. O centro geométrico contém duas posições: índices 32 e 45. Não atribui uma área de vida fixa a cada coordenada.
- Tiragens parciais só relacionam posições presentes; posições desconhecidas, cartas repetidas, identificadores inválidos e orientação invertida são recusados.

## Arquivos de código

| Arquivo | Responsabilidade |
| --- | --- |
| whit-alma-divina-base-v1.js | Base nova das 78 cartas e quatro dimensões |
| whit-alma-divina-posicoes-v1.js | Papéis narrativos e geometria das tiragens |
| whit-alma-divina-relacoes-v1.js | Contexto por posição, combinações e análise estruturada |
| whit-alma-divina-base.test.mjs | 17 verificações do comportamento da nova base |

As dependências existentes são apenas data/cards.js e spread-state-v310.js, que fornece as definições e importa a utilidade de estado/sorteio. Nenhum novo módulo executa ações no DOM, grava perguntas ou chama serviços externos.

## Interface técnica para a etapa 3

`whitCard(referencia)`: resolve ID numérico, ID canônico ou objeto canônico. Não aceita nomes livres; o gateway futuro fará a validação e resolução necessárias.

`whitPosition(spreadId, indiceOuRotulo)`: resolve uma posição da tiragem; rótulo desconhecido é erro, não uma posição genérica silenciosa. Carta do Dia aceita 0 ou Hoje. Tarot Livre aceita índice de 0 a 77.

`whitRelation(primeira, segunda)`: retorna direção, tipo, texto relacional e contexto elemental.

`analyzeWhitLayout({cards, spreadId, positions})`: retorna cartas contextualizadas, relações, elementos, temas, contagens, números repetidos, centro e referências de abertura/encerramento. Positions é opcional e pode usar os índices ou rótulos reais. Quando fornecida, deve ter uma posição única para cada carta. Omitir positions significa ordem canônica das posições a partir da primeira.

A análise é estruturada. Não é ainda o gateway `whitTarotReading`, não inclui classificação de pergunta nem produz história completa. A abertura e o encerramento são referências de organização; numa Mesa Real, não devem ser tratados como profecia da primeira/última casa.

## Validação

Base de referência: commit `4758d73ce949f7d4c90abed93db829a0e0b9a420`. A atualização instalada da macroetapa 1 foi encontrada no GitHub e comparada com a versão anterior: alterou apenas os arquivos dessa entrega, sem modificar o aplicativo.

17 testes novos passaram, incluindo identidade das 78 cartas, inversão de posições, obstáculo versus conselho, direção de relações, bordas da Mesa Real, ramificações de Dois Caminhos, centro da Mandala e rejeição de entradas inválidas.

63 testes existentes passaram. Total: **80 aprovados, zero falhas**. A evidência da execução está no arquivo de validação.

Não houve validação visual ou teste em iPhone físico nesta etapa, pois os novos arquivos ainda não foram conectados à interface. O desempenho de renderização será avaliado na integração.

## Instalação e continuidade

Enviar os arquivos desta entrega à raiz do GitHub. Não incluir scripts no HTML, não substituir app.js, não apagar motores anteriores nem mudar sw.js nesta etapa. O prefixo próprio evita substituir os antigos motores com nome parecido.

O efeito visível virá com o novo gateway e sua integração. Apenas enviar estes arquivos não muda a leitura pública.

Próxima macroetapa: **3/8 — núcleo único Whit Alma Divina**, que receberá cartas, posições e pergunta, consumirá esta base e preparará a migração das entradas atuais.
