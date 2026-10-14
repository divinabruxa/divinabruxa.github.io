# Whit Alma Divina — Macroetapa 7 de 8

**Pronta para instalação: organização dos aprofundamentos e limpeza do caminho ativo.** Nenhuma mudança foi publicada diretamente pela assistente.

## Experiência

A história completa aparece como primeira ação. Dimensões e capítulos ficam em grupos recolhidos, usando details/summary nativos. Os capítulos só aparecem quando há conteúdo real para eles. Cada botão controla o painel correspondente e informa a escolha pelo estado aria-pressed.

A nova folha de estilo atua somente na organização da leitura e no acesso contextual à Whit. Prevê alvos de toque de 44px, quebra de texto e uma coluna de botões em telas até 600px. Isso é uma implementação responsiva; ainda precisa de inspeção em navegador real.

O renderer evita reconstruir controles quando seus rótulos e textos não mudaram. Assim, uma atualização com a mesma leitura preserva o aprofundamento aberto e os elementos existentes. Se a leitura muda, a resposta anterior é fechada para não misturar textos de contextos diferentes.

No Tarot Livre, um acesso contextual abre a realidade própria da Whit. As cinco intenções e o comportamento do menu global foram preservados; não houve redesenho da Home ou Orbe.

## Limpeza real e arquivos históricos

Os dois arquivos arbitrio-engine-v360.js e arbitrio-engine-v370.js tiveram suas implementações antigas substituídas. Não contêm mais o antigo banco de ficção ou a integração do motor do Amor. Geradores antigos agora recusam chamadas com um erro explícito de aposentadoria. Hash e seed são apenas aliases das utilidades neutras novas.

23 módulos antigos foram retirados do precache. A lista exata está no JSON de módulos aposentados. O cache recebe uma nova versão e a ativação remove caches anteriores conforme o mecanismo existente.

O grafo estático de imports de app.js foi percorrido recursivamente: nenhuma dependência ativa aponta para os motores aposentados. Carta do Dia, Tarot Livre, tiragens, Biblioteca e a área própria da Whit continuam no núcleo novo.

**Distinção importante para a instalação:** os demais arquivos históricos de interpretação não foram apagados fisicamente. Permanecem no repositório para comparação, retorno e testes antigos; estão fora da aplicação ativa e do cache inicial. Este pacote não é uma exclusão completa de todo arquivo histórico. A presença de nomes antigos em elementos HTML ou variáveis também não representa execução de um motor antigo.

Alguns testes anteriores importam deliberadamente o gateway histórico para verificar a versão de retorno. Isso não é um fallback da aplicação pública. Os testes novos verificam a cadeia efetivamente usada pelo app.

## Validação

Base instalada: 44e04bbb60e2af2a8dfde14dac98dbb38f77d74d.

**157 testes aprovados, zero falhas:** 146 anteriores e 11 novos. Os novos verificam o grafo ativo, ausência de módulos aposentados no cache, desativação dos dois geradores, preservação do mapa de intenções, agrupamento de controles, conteúdo por clique, aria-controls/aria-pressed e preservação de resposta ao redesenhar a mesma leitura.

Os testes de controles usam um modelo mínimo de DOM executado em Node. Não representam teste visual, teclado em navegador, leitor de tela real ou Safari. Não foi concluída validação visual em navegador/iPhone físico nem uma sessão real de PWA offline. A existência das dependências e a cobertura do cache continuam verificadas pelos testes anteriores.

## O que fica para o fechamento

A macroetapa 8 fará revisão final de qualidade, integridade, acessibilidade e desempenho, com relato separado do que puder ser verificado de fato no ambiente publicado. Uma certificação visual ou de iPhone só será declarada se houver evidência correspondente.

O novo motor é local e editorial. Não requer pagamento de API, não conhece fatos privados e não afirma consciência literal. A pessoa pode abrir histórias simbólicas ricas e escolher aprofundamentos sem interrupções automáticas fora do Tarot.

Próxima: **8/8 — prova final de qualidade e pacote de fechamento.**
