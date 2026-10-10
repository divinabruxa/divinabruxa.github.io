# Plano Supremo — Whit Alma Divina

Divina Bruxa · Universo Tarot · 10 de outubro de 2026

## Decisão de produto

Criar uma nova inteligência narrativa tarológica: Whit Alma Divina. Substituir os motores antigos de interpretação, incluindo o motor chamado Livre Arbítrio, por um fluxo único que produza histórias simbólicas profundas, compreensíveis e relevantes. A pessoa mantém autonomia; retirar um módulo de software não transforma uma leitura em sentença sobre sua vida.

Este arquivo é o plano de implementação para o GitHub. Não é um código executável e sua inclusão no repositório não modifica o site. A implementação começa pela inspeção da versão atual do código.

Total: **8 macroetapas**, executadas e verificadas uma por uma.

## Experiência que queremos entregar

A pessoa chega com uma pergunta, um sentimento ou curiosidade. Whit identifica o assunto, observa a estrutura da tiragem e constrói uma história com começo, conflito, movimento e direção. O texto mostra relações entre símbolos; não se limita a explicar cartas uma a uma. A magia nasce da linguagem, da atmosfera e da precisão com que a narrativa acompanha a tiragem.

Amor revela vínculos, reciprocidade e limites. Mente distingue desejo, receio e interpretação. Atitudes transformam reflexão em possibilidades concretas. Espiritualidade oferece símbolos de propósito, passagem, pertencimento e renovação. Essas dimensões participam de uma história única, sem quatro respostas desconectadas.

Profundidade não significa repetição. A leitura oferece uma essência inicial, uma narrativa completa e possibilidades de aprofundamento. A pessoa escolhe quanto explorar.

## Pacto de ficção simbólica

Apresentar na entrada do Universo Tarot e junto à leitura: **“Uma história simbólica criada a partir do Tarot para inspirar reflexão. Não revela fatos privados nem garante acontecimentos.”**

Whit pode criar cenas, imagens, metáforas e possibilidades. Deve sinalizar cenas inventadas como imagens narrativas: “Imagine…”, “Nesta história simbólica…”, “Como imagem dessa passagem…”. Não inventar acontecimentos pessoais, nomes, traições, gravidez, doenças, pensamentos de terceiros, mensagens de entidades ou datas como se fossem revelações comprovadas.

Personalizar com o que a pessoa contou e com as cartas sorteadas. Não fingir que conhece sua vida. Não apresentar conselhos médicos, jurídicos ou financeiros como orientação especializada. Evitar fatalismo, ameaças espirituais e pressão para comprar uma consulta.

## Macroetapa 1 — Diagnóstico e proteção da versão atual

**Objetivo:** localizar os pontos reais de interpretação antes de alterar o site.

- Identificar entradas de Carta do Dia, Tarot Livre, Cruz Celta e Mesa Real; localizar chamadas, módulos, eventos, scripts e dependências dos motores antigos.
- Registrar quais funções sorteiam cartas, quais geram texto e quais apenas desenham a interface.
- Separar o módulo chamado Livre Arbítrio de regras de navegação, sorteio ou persistência que possam ter nome parecido.
- Criar um ponto de retorno no Git e guardar exemplos das leituras atuais para comparação.
- Preservar Home, Orbe, universo visual, menu e imagens de cartas. Alterar o Universo Tarot apenas onde necessário para a nova leitura.

**Entrega:** mapa de chamadas, arquivos afetados, plano de migração e versão de retorno.

**Aceite:** nenhuma mudança visual incidental; cada caminho que gera uma leitura tem origem e destino conhecidos. Nenhum motor é apagado nesta etapa.

## Macroetapa 2 — Identidade das 78 cartas e posições

**Objetivo:** construir a base que dá sentido às histórias.

- Modelar as 78 cartas com identidade própria: situações, forças, tensões, expressão afetiva, movimento mental, atitudes possíveis e simbolismo espiritual.
- Incluir relações entre cartas: reforço, oposição, transição, bloqueio e resolução; evitar apenas concatenar palavras-chave.
- Definir as posições de cada tiragem e validar a disposição usada pelo site. Uma mesma carta no obstáculo não deve exercer o mesmo papel que no conselho.
- Considerar naipes, números, figuras da corte, presença de Arcanos Maiores, repetições e ausências como contexto narrativo.
- Não refazer artes nem introduzir cartas invertidas sem uma decisão específica posterior.

**Entrega:** catálogo estruturado de cartas, mapa de posições e regras de combinação.

**Aceite:** cobertura das 78 cartas; papéis diferentes por posição; interpretações revisadas para evitar contradições e associações arbitrárias.

## Macroetapa 3 — Núcleo único Whit Alma Divina

**Objetivo:** todos os modos de leitura usam o mesmo motor, com comportamento adequado a cada experiência.

Fluxo proposto: entrada validada → contexto → análise tarológica → arco narrativo → composição → verificação → resposta.

Entrada mínima: versão do motor, tipo de tiragem, cartas e posições, pergunta opcional, idioma e contexto explicitamente fornecido. Dados pessoais desnecessários não entram no processamento.

A análise identifica tema, tensão central, progressão, contrastes, símbolos dominantes e possíveis direções. A composição transforma isso em história. A verificação bloqueia cartas inexistentes, posições inválidas, contradições, repetição excessiva e afirmações pessoais inventadas.

Saída proposta: título, essência, história, dimensões relevantes, possibilidades de ação, pergunta de reflexão e aprofundamentos. A análise interna não precisa aparecer na tela, mas deve haver rastreabilidade técnica entre os trechos e as cartas que os sustentam.

Começar com um motor local, sem exigir serviço pago. A riqueza dependerá de uma base editorial ampla e de regras combinatórias; não prometer consciência literal, conhecimento oculto ou criatividade ilimitada de um motor local.

**Entrega:** módulo único, contrato de entrada e saída, tratamento de erros e integração inicial atrás de uma chave de ativação.

**Aceite:** mesmas entradas e mesma chave narrativa produzem leitura estável; variações estilísticas preservam o sentido; erros não acionam silenciosamente um motor antigo.

## Macroetapa 4 — Histórias com amor, mente, atitudes e espiritualidade

**Objetivo:** criar uma voz reconhecível e narrativas vivas, sem textos genéricos.

Cada história deve conter uma situação simbólica, uma tensão sustentada pelas cartas, uma passagem plausível e uma direção útil. A pergunta muda o enquadramento; as cartas governam o desenvolvimento.

Whit será calorosa, intensa, imaginativa e clara. Pode usar imagens de caminhos, casas, marés, fogo, silêncio e encontros, desde que cada imagem tenha função. Evitar floreios que escondem ausência de conteúdo, positividade forçada e linguagem que promete saber tudo.

Oferecer possibilidades diferentes quando a tiragem sustentar uma ambivalência. Explicar o que distingue essas possibilidades em atitudes observáveis, sem fabricar certezas sobre outras pessoas.

Referência de extensão, ajustável após teste: Carta do Dia com 250–450 palavras no texto completo; tiragem pequena com 400–700; Cruz Celta com 650–1.000; Mesa Real com síntese de 250–400 e capítulos opcionais. Não preencher contagem com repetição. A essência permanece visível antes da expansão.

**Entrega:** guia de voz, biblioteca de estruturas narrativas, exemplos por tema e revisão editorial.

**Aceite:** as quatro dimensões aparecem quando pertinentes, não como seções obrigatórias vazias. Mudanças de carta, posição e pergunta alteram conteúdo de forma perceptível.

## Macroetapa 5 — Carta do Dia e Tarot Livre

**Objetivo:** fazer as experiências menores terem valor próprio.

**Carta do Dia:** manter a regra de sorteio diário existente após validá-la. Oferecer tema do dia, história simbólica, uma tensão para observar, uma atitude possível e uma pergunta de reflexão. Reabrir a leitura deve preservar carta e narrativa daquele dia; atualizar o site não deve sortear outra carta por acidente.

**Tarot Livre:** preservar o toque para revelar, o histórico e a mesa de cartas. Adicionar “Ler esta sequência” como ação explícita. Whit interpreta as cartas selecionadas em sua ordem; não interrompe cada revelação com textos automáticos. Uma nova carta permite atualizar a história sem apagar o histórico anterior. O sorteio continua independente do texto e não escolhe cartas para agradar à pergunta.

**Entrega:** integração dos dois modos, leitura expansível e persistência compatível com o site.

**Aceite:** ausência de cartas repetidas onde o modo proíbe; leitura diária estável; toque da Orbe continua funcionando; leitura é opcional no Tarot Livre.

## Macroetapa 6 — Cruz Celta e Mesa Real

**Objetivo:** transformar muitas cartas em uma narrativa organizada.

**Cruz Celta:** interpretar as dez posições como relações entre situação, tensão, contexto, movimento e desfecho simbólico. Entregar essência, história completa, ponto de decisão e aprofundamento por relações relevantes. Não apresentar dez definições desconectadas.

**Mesa Real:** analisar a disposição real usada pelo projeto antes de definir centro, vizinhanças, linhas e progressões. Agrupar temas, selecionar relações significativas e construir capítulos navegáveis. Não inventar uma correspondência entre posições e assuntos que o site não possui. Não despejar 78 descrições na tela.

**Entrega:** adaptadores de tiragem, capítulos e aprofundamentos sustentados pelas cartas.

**Aceite:** troca de posição muda a interpretação; nenhuma carta recebe uma função incompatível com o mapa aprovado; a narrativa não contradiz sua própria essência.

## Macroetapa 7 — Universo Tarot responsivo e migração

**Objetivo:** entregar uma presença clara para Whit dentro do Universo Tarot e concluir a substituição.

- Usar o acesso ao Universo Tarot já existente no menu; não redesenhar o menu para acomodar o motor.
- Permitir pergunta opcional, seleção de tema, leitura completa, aprofundamento e reinício com rótulos claros.
- Oferecer ações contextuais como “Explorar os vínculos”, “Entender a tensão” e “Ver atitudes possíveis”, somente quando houver conteúdo real correspondente.
- Perguntas de acompanhamento reutilizam a tiragem; uma nova tiragem exige ação explícita.
- Priorizar leitura no celular: tipografia confortável, blocos curtos, expansão acessível, navegação por teclado e respeito à redução de movimento.
- Evitar registro de perguntas íntimas em logs; salvar leituras somente segundo as regras de privacidade do projeto e escolha da pessoa.
- Migrar cada entrada para Whit Alma Divina, verificar ausência de chamadas antigas e então remover os motores substituídos. Preservar apenas utilidades compartilhadas necessárias, com nomes e responsabilidades claros.

**Entrega:** experiência integrada e remoção verificada dos caminhos antigos de interpretação.

**Aceite:** um único motor ativo; nenhum balão automático fora do Tarot; navegação e sorteio preservados; layout verificado em dimensões de iPhone. Emulação não será descrita como teste em iPhone físico.

## Macroetapa 8 — Prova de qualidade e lançamento

**Objetivo:** publicar uma mudança verificável, com retorno possível.

| Verificação | Resultado esperado |
| --- | --- |
| Trocar uma carta | Alterar tensão, direção ou conselho de modo compatível |
| Trocar duas posições | Alterar o papel narrativo das cartas |
| Alterar a pergunta | Alterar o enquadramento sem ignorar o Tarot |
| Reabrir uma leitura salva | Preservar a história e a versão associadas |
| Consultar sem pergunta | Produzir reflexão geral sem inventar biografia |
| Perguntar sobre sentimento de terceiros | Explorar vínculo e reciprocidade sem afirmar pensamentos privados |
| Usar cartas contrastantes | Reconhecer a tensão sem forçar uma resolução positiva |
| Usar muitas cartas | Organizar a leitura sem repetição ou travamento |
| Desativar um componente novo | Demonstrar seu efeito real na composição ou validação |
| Navegar entre Home e Tarot | Preservar comportamento da Orbe e menu |
| Testar erro ou dado inválido | Mostrar recuperação clara sem fabricar leitura |

Revisar um conjunto mínimo de 40 casos distribuídos entre modalidades e temas, incluindo perguntas ausentes, longas e ambíguas. Para cada caso, avaliar fidelidade às cartas, coerência, relevância, clareza, utilidade, transparência simbólica e repetição. Uma falha crítica de integridade ou funcionamento bloqueia o lançamento.

Medir tempo de resposta, custo de renderização e tamanho do pacote na versão atual antes de definir limites finais. Separar composição do texto dos efeitos visuais; não regenerar uma leitura durante animações ou a cada renderização.

**Entrega:** resultados de testes, comparação antes/depois, arquivos novos ou substitutos necessários, instruções de instalação e procedimento de retorno.

**Aceite:** caminhos antigos desativados, testes essenciais aprovados e pacote pronto para revisão. Publicação depende do acesso efetivamente disponível ao repositório; não declarar instalação ou lançamento sem comprovação.

## Exemplo de direção editorial

Exemplo ilustrativo com Estrela → Torre → Sol; não representa uma leitura pessoal da usuária.

“Nesta história simbólica, uma luz que parecia distante começa a mostrar o que você ainda quer preservar. Mas a passagem não acontece pela manutenção de tudo: algo na estrutura precisa mudar para que essa esperança tenha espaço. A ruptura da Torre não apaga a Estrela; põe à prova o lugar onde ela estava apoiada. O Sol encerra a sequência com clareza, não com a promessa de que nada vai doer.

Nos vínculos, essa imagem convida a procurar reciprocidade nas atitudes. Na mente, a pergunta é se você está protegendo um desejo ou tentando sustentar uma certeza que já não se confirma. Uma atitude possível é nomear o que precisa mudar e escolher um primeiro passo pequeno. Espiritualmente, a passagem fala de manter uma luz interior enquanto uma forma antiga deixa de servir. O que continuaria verdadeiro para você se aquela estrutura mudasse?”

O texto completo desenvolvido na macroetapa 4 aprofundará essa estrutura conforme o contexto, sem inventar fatos pessoais para aumentar a sensação de precisão.

## Ordem e regra de conclusão

Executar 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Cada macroetapa termina com entrega concreta, evidência de validação e indicação do que resta. Este plano não marca nenhuma etapa de implementação como concluída.

O objetivo é uma experiência tarológica autoral, rica e memorável. “Maior do mundo” é uma ambição de marca; qualidade, funcionamento e relevância precisam ser demonstrados por resultados reais.
