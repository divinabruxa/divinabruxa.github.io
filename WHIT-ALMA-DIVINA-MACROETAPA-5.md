# Whit Alma Divina — Macroetapa 5 de 8

**Pronta para instalação: Carta do Dia estável e leitura opcional de sequência no Tarot Livre.** Não houve publicação direta pela assistente.

## Tarot Livre

A nova seção “Whit · ler a sequência da mesa” reúne pergunta opcional, ação de leitura, essência, aprofundamentos e seletor das oito leituras recentes. Fica dentro do Tarot Livre; não altera o menu global, a Home ou a Orbe.

A leitura utiliza o conjunto completo de cartas já reveladas, na ordem do sorteio, independentemente da carta que o cursor estiver mostrando. Não inclui cartas ocultas e não influencia o sorteio. A consulta individual existente permanece disponível.

Uma nova carta ou pergunta torna a leitura anterior uma versão preservada; não ocorre geração automática. Um clique explícito cria a leitura atualizada. Reabrir o mesmo conjunto e pergunta usa o texto salvo sem chamar o motor novamente. O identificador considera ordem e pergunta integral normalizada apenas por espaços nas extremidades, sem depender só de um hash sujeito a colisão.

O histórico guarda até oito registros locais. Reiniciar o círculo limpa a mesa e a pergunta atuais, sem apagar esses registros. A interface informa se uma leitura corresponde à mesa e pergunta atuais ou se é uma versão anterior. Cada registro conserva a versão do motor e a proveniência das cartas.

## Carta do Dia

A primeira leitura desta versão cria um registro de texto associado à data e identidade da carta. Reabrir ou recarregar recupera esse texto. O botão de releitura não renova a seed. Mesmo se o compositor for atualizado, uma leitura válida já salva permanece igual naquele ciclo.

O sorteio diário continua usando a função existente, baseada na data de Brasília. Esta etapa não altera a regra de seleção da carta nem implementa sorteio individual por conta. Seeds legadas, quando existentes, são preservadas na primeira migração do texto. Sem seed legada, a seed é derivada de data e carta.

Uma data nova tem outro registro. A data é conferida na navegação, na revelação, no botão de releitura, ao ampliar a carta, ao recuperar o foco/visibilidade e a cada 30 segundos enquanto a aba está visível. Portanto uma aba ociosa pode atualizar o aviso até 30 segundos após a virada; a interação confere imediatamente a data.

Antes desta etapa, não havia snapshot do texto diário. A instalação não consegue recuperar um texto antigo que nunca foi salvo: a estabilidade começa na primeira leitura produzida/guardada por esta versão.

## Persistência e limites

Criado whit-alma-divina-sessoes-v1.js. Ele não sorteia cartas e chama somente o gerador fornecido pela aplicação. Armazena campos necessários à apresentação, sem guardar todo o grafo de análise. Dados inválidos são recusados ou recuperados por uma nova leitura da carta/conjunto real.

Quando o armazenamento falha, existe uma cópia em memória para manter a sessão utilizável. Ela não sobrevive ao fechamento/recarregamento. O estado de revelação diária também tem fallback em memória. O histórico é local, não sincronizado entre contas, abas ou dispositivos; ao reabrir o site ele recupera o armazenamento disponível.

A nova folha de estilo se limita aos campos e controles dessa seção: fonte de 16px, largura adaptável e texto com quebra de linha. Nenhum desenho global foi modificado. O cache offline inclui o novo módulo e CSS. A referência de app.js e a versão de cache foram atualizadas.

## Validação

Base instalada: b4bf30b516f9f41db8c0ad8e8cf6b8b881fba44f.

**129 testes aprovados, zero falhas:** 113 anteriores e 16 novos. Foram testados estabilidade diária, releitura sem chamada ao motor, recuperação após recarga/atualização, mudança de ciclo de Brasília, dados corrompidos, armazenamento negado, ordem de sequência, histórico, mudança de pergunta, preservação de leituras e integração estática dos controles/cache.

Os testes anteriores incluem verificação de IDs únicos e existência das referências locais. Os testes novos não equivalem a interação em navegador real. Não foi concluída validação visual em navegador, Safari ou iPhone físico. Tampouco foi certificada uma sessão real offline; a cobertura do cache foi verificada por testes de dependências e configuração.

## Continuidade

Esta etapa mantém o compositor da voz 1.1. Uma sequência usa as relações reais da base nova e uma história única. A leitura de 78 cartas ainda não tem os capítulos próprios de uma Mesa Real: isso pertence à macroetapa 6.

Próxima: **6/8 — Cruz Celta e Mesa Real**, com narrativa organizada por relações e aprofundamentos próprios das tiragens grandes.
