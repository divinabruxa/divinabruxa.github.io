# Whit Alma Divina — Macroetapa 3 de 8

**Concluída: núcleo único e integração das entradas atuais.** O novo código será ativado quando este pacote for publicado no GitHub. Não houve publicação feita pela assistente; o pacote é entregue para instalação pela usuária.

## O que mudou

Criados whit-alma-divina-core-v1.js e whit-alma-divina-utils-v1.js. O núcleo valida cartas e posições, classifica assunto e intenção da pergunta, analisa relações pela base nova, compõe uma essência e uma história e entrega aprofundamentos de vínculos, mente, atitudes, espiritualidade e posições. As leituras mantêm rastreabilidade às identidades canônicas usadas.

app.js importa o novo núcleo e as utilidades neutras. Carta do Dia, Tarot Livre, sínteses de tiragens e modal de carta passam pelo novo whitTarotReading. A Biblioteca recebeu adaptação explícita para consulta de uma carta, pois o rótulo de seu modal não é uma posição de tiragem.

whit-world-v401.js chama a nova storyResponse. Nomes de cartas são reconhecidos na ordem mencionada. Um pedido explícito para tirar uma carta gera uma carta; uma pergunta sem mesa ou nome de carta recebe convite para revelar cartas. Acompanhamentos preservam as cartas e a seed enquanto atualizam o enquadramento quando necessário. Não são criadas pesquisas externas nem comandos de navegação automáticos. Histórico local existente é preservado.

As sementes e hashes agora vêm de um módulo neutro, sem importar Arbítrio, Amor, Mente, Espírito ou Matéria. Nomes internos de variáveis e elementos HTML antigos foram mantidos onde necessários para não alterar a interface; isso não significa que o motor antigo esteja sendo chamado.

O cache do service worker inclui os cinco módulos novos e usa outra versão. index.html muda somente a versão da referência a app.js. Home, Orbe, menu e disposição das cartas não foram redesenhados.

## Contrato e limites

Entrada: cards, scope ou spreadId, positions opcionais, question/intention e seed opcional. Núcleo editorial inicial em PT-BR; outros idiomas são rejeitados explicitamente, sem fingir uma tradução.

Saída: title, essence, paragraphs/story, closing, tendencyText, counselText, depthOptions, depthResponses, consultationContext, análise estruturada, validação e proveniência. Entrada sem campo cards retorna null; cartas vazias ou inválidas e posições incoerentes produzem erro. Não existe retorno silencioso para um motor narrativo antigo.

A essência sinaliza ficção simbólica para reflexão. A história completa esclarece que não revela fatos privados nem garante acontecimentos. Futuro é possibilidade; sentimentos de terceiros não são afirmados como informação conhecida.

O núcleo é local e baseado em conteúdo editorial e regras. Não tem consciência literal nem acesso oculto à vida da pessoa. A verificação desta etapa assegura integridade estrutural e ausência de fallback; uma revisão literária profunda continua necessária na etapa 4. Não é um verificador universal da verdade de um texto.

## Evidência de validação

Base instalada: 359511c34e58fee905bd36eb40f80d62acb0ba34.

**95 testes aprovados, zero falhas:** 63 da versão existente, 17 da base nova e 15 do núcleo/integração. Alguns testes existentes ainda importam os motores anteriores e verificam sua integridade de retorno; os 15 novos verificam o núcleo que este pacote conecta à aplicação.

Foram exercitadas as 78 cartas e as 15 tiragens, incluindo Mesa Real completa. Os casos de teste confirmam alterações por carta, posição, assunto e intenção, continuidade sem novo sorteio implícito, comportamento explícito da área Whit, validação das entradas e inclusão dos módulos no cache. A verificação estática confirma que app.js e a área Whit importam o núcleo novo.

Não foi possível concluir o teste de interface em navegador neste ambiente. Não foi realizado teste em iPhone físico ou Safari. O funcionamento do cache foi verificado por testes automatizados e pela cobertura dos imports; não foi certificado por uma sessão real de navegação offline nesta etapa.

## O que permanece para as próximas etapas

- Etapa 4: lapidar a voz, reduzir repetição, enriquecer cenas e movimentos, ampliar a variedade narrativa e revisar os textos por tema.
- Etapa 5: leitura opcional de uma sequência no Tarot Livre; estabilidade e apresentação da Carta do Dia.
- Etapa 6: capítulos próprios de Cruz Celta e Mesa Real, sem despejar significados isolados. O aprofundamento por posições desta etapa é material explicativo auxiliar, não a narrativa principal.
- Etapa 7: revisar a experiência do Universo Tarot, finalizar migração e remover fisicamente os módulos antigos e entradas do cache que já não forem necessários.
- Etapa 8: revisão editorial final, validação visual, desempenho, acessibilidade, iPhone e prova do lançamento.

O Tarot Livre continua consultando a carta atual: esta etapa não altera o comportamento de revelação nem interpreta automaticamente toda a mesa. A composição inicial já é nova e funcional, mas ainda não é a voz literária final prometida pelo plano.

## Retorno

O arquivo de retorno contém os textos originais dos quatro arquivos substituídos. Os módulos da etapa 2 permanecem instalados e não são removidos. Antes de restaurar, comparar quaisquer alterações feitas depois da base para não perder trabalho novo. Um retorno publicado deve atualizar o cache para evitar estados misturados.
