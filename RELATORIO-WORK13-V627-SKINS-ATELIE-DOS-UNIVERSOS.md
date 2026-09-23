# WORK13 · V627 · Skins · Ateliê dos Universos

## Resultado

Skins agora é o **Ateliê dos Universos**: uma chegada silenciosa, uma forma em foco e uma única ação explícita para revelar a coleção. A V627 preserva o catálogo canônico já instalado — **30 skins, sendo 1 gratuita e 29 pagas** — sem criar nomes, preços, direitos ou mecanismos paralelos.

## Experiência

- A forma atual aparece antes da galeria.
- `ABRIR O ATELIÊ` é a única ação principal na chegada.
- A galeria completa e o motor V201 só são montados após esse gesto.
- Tocar em uma skin atualiza a prévia central e prepara somente o ativo escolhido.
- Tocar na prévia produz uma resposta curta da Orbe existente; não aplica, não navega e não fala.
- Ao sair de Skins, a profundidade recolhe e o Ateliê volta ao estado de foco.
- Busca, filtros, compra unitária preparada e comparação com Premium permanecem disponíveis dentro da galeria.

## Catálogo e direitos

| Regra | V627 |
|---|---:|
| Skins totais | 30 |
| Gratuitas | 1 |
| Pagas | 29 |
| Faixas unitárias | R$ 19,90 · R$ 29,90 · R$ 39,90 · R$ 49,90 |
| Premium inclui todas | Sim |
| Prévia exige propriedade | Não |
| Prévia concede propriedade | Não |
| Autoridade de direito | Snapshot da Conta/servidor |
| Cobrança real | Bloqueada |

A V627 não adiciona direitos no frontend. Aplicação, restauração entre aparelhos e sincronização continuam passando pelo `SkinsEngineV201`, pelo Runtime V12 e pela Conta segura já existentes.

## Continuidade cósmica

- A troca é global e ocorre sem recarregar a página.
- Home, Menu, mini-Orbes, Tarot e portais continuam recebendo a mesma forma ativa.
- O mundo observa a travessia por três realidades e confirma a consistência quando a pessoa retorna ao Ateliê.
- A forma ativa permanece disponível offline quando o Runtime já possui o ativo; a Clássica Divina continua sendo o chão seguro.
- Nenhuma lógica, seleção, resultado ou significado do Tarot é alterado.
- O pentagrama V613 continua sendo o menu global.
- O V626 Vídeos e todos os mundos anteriores permanecem preservados.

## Performance e acessibilidade

- Uma Orbe canônica, um canvas canônico e zero renderers novos.
- Zero loops permanentes, autoplay, arraste obrigatório ou navegação automática.
- Galeria carregada sob demanda e imagens preparadas por escolha/proximidade pelo motor existente.
- Safe areas, `viewport-fit=cover`, teclado móvel, retrato e paisagem preservados.
- Alvos de toque de 44–48 px, busca com 16 px, foco visível e retorno de foco ao fechar.
- Movimento reduzido, contraste aumentado e cores forçadas têm tratamento próprio.

## QA executado

| Suite | Resultado | Asserções |
|---|---:|---:|
| V627 estrutural | PASS | 84/84 |
| V627 runtime determinístico | PASS | 46/46 |
| V627 iPhone, 8 geometrias | PASS | 65/65 |
| V626 estrutural | PASS | 71/71 |
| V626 backend e segurança | PASS | 42/42 |
| V626 iPhone, 8 geometrias | PASS | 60/60 |
| V626 runtime determinístico | PASS | 38/38 |
| V625 Música iPhone | PASS | 51/51 |
| V625 Música runtime | PASS | 45/45 |
| V625 Música estrutural | PASS | 62/62 |
| Boot herdado V625 | PASS | 40/40 |
| **Total** | **PASS** | **604/604** |

Também passaram a verificação sintática os módulos JavaScript da entrega. O Service Worker agora valida 82 ativos essenciais antes de assumir o cache V627.

## Limite consciente desta entrega

Os testes de iPhone são determinísticos sobre oito geometrias; não substituem a inspeção final em um aparelho físico. Nenhuma mutação foi feita no Supabase e nenhuma cobrança foi habilitada. Após instalar em STAGING, valide visualmente uma skin gratuita e uma skin pertencente à conta, atravesse três realidades e reabra o PWA offline.

## Próximo mundo

Notificações, ainda dentro do WORK13. Nenhum WORK14 foi criado.
