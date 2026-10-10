# Whit Alma Divina — Macroetapa 1 de 8

Diagnóstico concluído sobre o repositório `divinabruxa/divinabruxa.github.io`, branch `main`, commit `f8abdccdf22b0023c3a5443c9e3be693dd59fc07`, versão declarada 4.2.1. Análise realizada em 10/10/2026. A cópia local corresponde ao commit consultado no GitHub. Não foi publicada nenhuma alteração.

## Resultado principal

O código já tem um ponto principal `whitTarotReading`, mas esse ponto continua apoiado em muitas camadas antigas. A confusão não se resolve apagando arquivos com “arbitrio” no nome: a aplicação usa funções de seed e hash deles, e o service worker também os armazena. A nova versão deve substituir o caminho de interpretação e depois remover as dependências antigas de forma verificável.

Há também um problema concreto de sensibilidade às posições: no exemplo Estrela → Torre → Sol, inverter os rótulos de Origem, Agora e Próximo movimento não mudou a essência. Isso é evidência de um caso específico; não prova que todas as posições são ignoradas em todas as tiragens.

## Entradas e destinos encontrados

| Experiência | Entrada real | Motor e contexto |
| --- | --- | --- |
| Tarot Livre | `app.js`, objeto tarot, método invent | `whitTarotReading` recebe apenas a carta atual e posição numérica; não recebe toda a sequência nem pergunta |
| Carta do Dia | `app.js`, objeto daily, método creation | Uma carta, data como posição, seed local e scope carta-do-dia |
| Cruz Celta | `app.js`, spreads.renderSynthesis | Cartas reveladas, posições definidas, intenção e scope tiragem-cruz-celta |
| Mesa Real | Mesmo renderSynthesis | Mesmo fluxo, até 78 cartas e posições Linha/Casa |
| Modal de carta | Evento dialogArbitrioAction | Chama o gateway com o contexto; pode começar mostrando a síntese da tiragem |
| Área Whit | `whit-world-v401.js` | Chama storyResponse de `whit-divine-soul-engine-v408.js`, mantendo contexto de conversa |

`index.html` carrega `app.js?v=4.2.1-lancamento`. As páginas públicas tarot-livre.html, carta-do-dia.html e tiragens-de-tarot.html são portas editoriais para a experiência do roteador; não são o lugar principal para trocar o motor. Conferir todas as rotas e aliases na integração posterior.

## Caminho de interpretação e dependências

`app.js` → `whit-divine-soul-engine-v408.js` → Inteligência Superior v407 → Reader v406 → Orbe Realidades v405 → Vida v404 → Alma v403 → História v402.

O gateway v408 também consulta Knowledge v410, Position v411, Dialogue v412, Human Reality v413, Narrative Consciousness v414, Soul Voice v415, Living Depth v416, Supreme Counsel v417, Proving Ground v418 e Soul Consultation v419. O grafo completo de imports locais está no manifesto.

O ramo de Matéria importa Espírito, que importa Mente; esses caminhos e a ponte de Arbítrio mantêm dependências dos motores anteriores. O v370 reexporta hash e seed do v360. O nome de um elemento HTML contendo “Arbitrio” não prova que ele executa o motor de ficção antigo.

## Exibição: onde a história se perde ou fica condensada

- Tarot Livre: renderArbitrio coloca título e essência na tela, mas define arbitrioStory e arbitrioClosing como texto vazio. O aprofundamento continua disponível por botões. Não é correto afirmar que toda história desapareceu do site.
- Modal: renderDialogArbitrio também limpa o fechamento e apresenta a essência com opções de aprofundamento.
- Tiragens: renderSynthesis mostra synthesis.essence, limpa synthesisClosing e synthesisFacts. O campo essence do gateway é uma junção dos parágrafos, não uma essência editorial separada.
- Carta do Dia: render mostra a presença, a história completa no bloco depthMessage e o fechamento. Este modo já exibe mais campos que Tarot Livre; precisa de melhoria narrativa, não de diagnóstico de campo inexistente.
- “Reler” pode renovar a seed: daily.renewFiction e spreads.renewFiction criam outra variação sem trocar as cartas. O novo contrato deve distinguir releitura estável de nova variação explicitamente escolhida.

## Sorteio e persistência que devem sobreviver à troca

`lib/tarot-state.js`: sorteio e estado do Tarot Livre. `spread-state-v310.js`: estado e posições das tiragens. `lib/daily-card.js`: data de Brasília, índice diário e chave local. `data/cards.js`: 78 identidades canônicas e orientação normal.

A Carta do Dia atual deriva do hash da data, sem identificador da conta na função dailyCardIndex. A seed narrativa é guardada no aparelho. Portanto o diagnóstico não confirma leitura sincronizada por conta; esse requisito deve ser tratado separadamente se desejado.

Cruz Celta usa: Situação presente; Desafio que atravessa; Consciência e intenção; Base profunda; Passado que se afasta; Futuro próximo; Sua postura; Ambiente e influências; Esperanças e receios; Síntese e direção.

Mesa Real tem 6 linhas com 13 casas por linha. Os rótulos são coordenadas, sem significado temático específico por casa. O novo motor deverá definir a leitura dessas relações antes de atribuir assuntos às casas.

## Validação executada

- Testes existentes: `npm test`, 63 aprovados, 0 falhas.
- Auditoria estática: 57 arquivos rastreados, nenhuma dependência local ausente nesse conjunto.
- Execução real do gateway em Node: 8 exemplos, incluindo Carta do Dia, Tarot Livre, Três Tempos, Cruz Celta e Mesa Real.
- Repetição com entradas/seed iguais: saída estável nos 8 exemplos.
- Troca de pergunta no trio: essência diferente.
- Troca de carta no trio: essência diferente.
- Troca de posições no trio: essência igual — falha de qualidade identificada.

Os testes existentes comprovam principalmente integridade e funcionamento de unidades; não certificam a qualidade literária. Não houve teste visual em navegador, aparelho iPhone físico ou ambiente publicado nesta macroetapa. Não foram avaliados desempenho de renderização nem sentimento de usuários reais.

## Migração concreta para as próximas etapas

1. Na etapa 2, usar o catálogo canônico e as posições reais, com uma base nova de interpretações. Nenhuma carta visual será refeita.
2. Na etapa 3, criar gateway novo com interface compatível com title, essence, paragraphs/story, closing, signature, depthOptions e depthResponses. Também adaptar a conversa storyResponse ou manter essa entrada explicitamente separada até sua migração.
3. Substituir hash/seed por utilidades neutras antes de remover os imports de Arbítrio. Não reaproveitar o conteúdo narrativo antigo como nova alma por simples mudança de nome.
4. Nas etapas 4–6, produzir histórias e exibição completa, interpretar a sequência opcional do Tarot Livre e tornar as posições relevantes.
5. Na etapa 7, migrar app.js e a área Whit, verificar imports vivos e atualizar sw.js/cache. Só então remover os motores de interpretação antigos sem quebrar navegação ou sorteio.
6. Na etapa 8, repetir estes exemplos e adicionar revisão editorial e validação de interface.

## Proteção e retorno

Nada foi modificado no código de execução. Este ZIP não ativa outro motor, não muda menu/Home/Orbe e não remove arquivos.

O commit acima é o ponto de referência. WHIT-ALMA-DIVINA-CHECKPOINT.json contém os textos e SHA-256 dos 57 arquivos analisados. É um backup parcial de fontes, não de imagens, dados de clientes ou infraestrutura. Preservar esse commit e o checkpoint antes da migração.

Não sobrescrever um arquivo atualizado depois deste commit com a cópia antiga sem comparar as mudanças. O manifesto permite conferir quais fontes mudaram. Para retorno posterior, restaurar somente os arquivos da migração, usando o commit de referência ou os textos do checkpoint, e ajustar a versão de cache do service worker conforme a mudança publicada.

**Macroetapa 1 concluída como diagnóstico e proteção. Novo motor ainda não implementado. Próxima: macroetapa 2, base tarológica das 78 cartas e posições.**
