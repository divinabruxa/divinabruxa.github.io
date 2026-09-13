# QA V538 — Universo Vivo do Tarot Livre

## Resultado

- Suíte V538: **155/155 aprovada**
- Falhas V538: **0**
- Validação sintática: aprovada em todos os módulos alterados
- Navegador automatizado local: bloqueado porque o ambiente não possui binário de navegador instalado

## Contratos comprovados

- Baralho canônico com exatamente 78 cartas.
- As 78 cartas são reveladas uma única vez por círculo.
- Todas as cartas permanecem na orientação normal.
- Rei de Ouros permanece como a carta canônica 78.
- A Mesa completa preserva 13 × 6 e a grade visual mantém seis colunas.
- O estado do sorteio é puro, validável e possui impressão digital auditável.
- Sessões anteriores à V538 são migradas sem perder as cartas reveladas.
- Embaralhar não altera cartas já reveladas.
- Reset exige confirmação quando existe progresso.
- Autosave local e coordenação entre abas permanecem ativos.
- O carregamento da imagem integral não bloqueia mais a revelação.
- O atlas funciona como primeira pintura e a definição completa chega progressivamente.
- Orçamento declarado para primeira resposta visual: 100 ms.
- Transição principal reduzida para 440 ms; histórico reduzido para 220 ms.
- Preload limitado, ocioso e suspenso quando a aba está oculta.
- Grade incremental evita reconstruir todas as cartas a cada revelação.
- Não existe gesto de arrastar no JavaScript ativo do Tarot Livre.
- Não existe animação CSS infinita no altar ativo.
- Não existe WebGL, canvas ou importação de motor de fogo no módulo ativo do Tarot Livre.
- O antigo desenho vertical de fogo foi substituído por um pulso radial curto.
- A V538 possui novo cache PWA e inclui o núcleo do Tarot no offline seletivo.

## Testes físicos ainda necessários

1. Revelar 78 cartas em iPhone/Safari e confirmar resposta tátil, rolagem vertical e ausência de travamento.
2. Repetir a sequência em Android/Chrome e em aparelho classificado como limitado.
3. Medir a resposta de entrada em aparelhos reais e confirmar a meta de até 100 ms na maioria das interações.
4. Validar VoiceOver, TalkBack, teclado e preferência de movimento reduzido.
5. Fechar/reabrir o PWA offline e confirmar restauração do círculo e das imagens preparadas.

Esses testes não foram contabilizados como aprovados.

