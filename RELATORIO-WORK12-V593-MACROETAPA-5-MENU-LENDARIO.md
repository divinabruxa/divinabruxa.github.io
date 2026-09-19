# WORK12 — Macroetapa 5 de 10

## V593 · Menu Lendário

A grade desapareceu. O antigo menu orbital, que exibia treze destinos ao mesmo tempo, agora revela no máximo duas intenções vivas por sopro. A única Orbe permanece fisicamente no centro e continua sendo a passagem para a Origem e para todas as realidades.

## A nova gramática

- **SOPRO** chama o campo de intenções.
- Duas intenções nascem sem pipocar.
- Um toque no céu ou um gesto horizontal dissolve o par atual.
- O próximo par nasce somente depois da dissolução.
- Tocar uma intenção inicia: aceitar, dissolver, viajar, chegar.
- Tocar a Orbe volta à Origem pela mesma viagem coordenada.
- Nenhuma opção gira sozinha. Se a pessoa não age, o universo respeita o silêncio.

O primeiro sopro é deliberadamente essencial:

- **Revelar · Tarot**
- **Receber · Hoje**

Os demais caminhos aparecem progressivamente: Tiragens, Biblioteca, Escola, Diário, Whit, Consultas, Loja, Skins, Música, Vídeos, Premium, Conta e Sinais.

## Vida sem excesso

Cada intenção tem quatro estados reais: nascimento, respiração, aceitação e dissolução. Há apenas uma animação CSS leve, limitada às duas intenções visíveis. Não existe `setInterval`, observador de DOM, novo canvas, novo renderizador ou novo loop JavaScript.

O universo pesado pausa durante abertura, troca de intenções, fechamento e viagem. A rotação automática foi proibida. A Whit permanece presença silenciosa e não produz fala por toque.

## Continuidade protegida

Foram mantidos sem alteração:

- coordenador e histórico V592;
- núcleo físico da Orbe e renderizador V591;
- Universo Vivo V590;
- ponte da alma da Whit;
- Tarot Livre e sua regra de 78 cartas sem repetição;
- Carta do Dia;
- gestos, skins e física de viagem.

O Menu Lendário reutiliza a mesma `#orb` e o mesmo `#orbCanvas`. Não cria mini-Orbe, projeção, portal visual nem corpo viajante alternativo.

## iPhone primeiro

As zonas orgânicas foram verificadas em cinco perfis: iPhone SE de primeira e segunda geração, iPhone 13 mini, iPhone 15 e iPhone 15 Pro Max. Áreas seguras, orientação horizontal, movimento reduzido, foco por teclado e cores forçadas permanecem contemplados.

## Auditoria

| Camada | Verificações | Resultado |
|---|---:|---|
| Estrutura, contratos, iPhone e conteúdo protegido | 217 | PASS |
| Ciclo vivo do Menu Lendário | 45 | PASS |
| Service Worker atômico V593 | 90 | PASS |
| Histórico coordenado V592 | 33 | PASS |
| Orbe persistente V591 | 41 | PASS |
| Universo único V590 | 33 | PASS |
| **Total** | **459** | **PASS** |

## Arquivos de produção alterados

1. `app-v208.js`
2. `index.html`
3. `orbital-menu-v502.js`
4. `orbital-menu-v502.css`
5. `sw.js`

Esta entrega é cumulativa sobre a V592 e não reenvia os núcleos antigos que permaneceram intactos.

