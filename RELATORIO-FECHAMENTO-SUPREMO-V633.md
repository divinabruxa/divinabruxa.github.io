# Divina Bruxa — Fechamento Supremo V633

## Resultado

A V633 substitui a falsa porta repetida dos mundos por uma regra única: **a Orbe chega sozinha; o primeiro toque abre a realidade atual; somente o pentagrama abre o menu**.

Não é WORK14. Não reconstrói a Home, a Orbe, o canvas, o menu ou os motores funcionais. Corrige a camada global que estava escondendo os mundos já instalados.

## Falha comprovada no site publicado

A auditoria de `https://divinabruxa.com.br/` confirmou:

- Os módulos WORK13 V614–V628 estão no servidor e são carregados.
- Consultas possui o conteúdo real com quatro leituras, valores, formulário e protocolo, mas `living-commerce-path-v608.css` mantém `#consultationApp` em `display:none` enquanto o modo fica preso em `guide`.
- O botão visível “Mergulhar” atravessa somente a camada V585/V596. Ele não aciona a ação real `consultations-start` da V608.
- Escola e Diário têm `#schoolApp` e `#journalApp` completos, porém ocultos atrás do limiar.
- Loja e Premium têm seus apps completos, porém a camada de guia prevalece.
- Vídeos contém o Cinema da Orbe V626 (`.vw626`), incluindo os portais Memojis e De Frente com o Tarot, mas a raiz estava invisível.
- Notificações mostrava simultaneamente limiar, navegação técnica, pacto, profundidade, Jardim do Retorno e o mundo V628.
- Em várias rotas havia até cinco camadas disputando a tela: limiar, câmara, guia, profundidade e conteúdo real.

Por isso a instalação do WORK13 parecia não ter mudado o site. Os mundos estavam presentes, mas a primeira camada repetida os cobria.

## Arquivos de produção substituídos

| Arquivo | Mudança |
| --- | --- |
| `cosmos-entry-intention-v610.js` | Novo contrato da Orbe: abre a realidade atual, nunca o menu fechado; conecta as ações reais de Consultas, Loja e Premium; atravessa uma única vez os limiares de Escola, Diário e demais mundos; preserva gestos próprios de Tarot, Carta do Dia, Biblioteca e Whit. |
| `cosmos-entry-intention-v610.css` | Isola visualmente a única Orbe na chegada; remove andaimes repetidos; revela os apps reais; mantém o conteúdo em outro plano; adiciona somente uma transição curta de entrada. |

## O que desaparece da experiência visível

- palavra “Mergulhar”;
- verbo vertical repetido;
- frase explicativa ao redor da Orbe;
- listas técnicas V529/V530/V531/V539/V541/V561/V608;
- guias intermediários que impediam o conteúdo real;
- ação de abrir o menu ao tocar a Orbe dentro de um mundo.

Essas estruturas permanecem no código para compatibilidade. A V633 apenas retira sua autoridade visual e de navegação.

## O que fica preservado

- Home atual;
- uma Orbe e um canvas canônicos;
- menu V631 com dois balões por vez;
- pentagrama global;
- Tarot Livre e sua revelação pela Orbe;
- Carta do Dia, Tiragens, Biblioteca e Whit com seus gestos próprios;
- quatro consultas e seus valores atuais;
- formulário, privacidade, protocolo e confirmação por e-mail;
- Música V625;
- Cinema da Orbe V626 e área de Memojis;
- Skins V627;
- Sinais do Cosmos V628;
- Orquestra V629;
- movimento reduzido, teclado, áreas seguras e alvos de 48 px;
- zero cobrança real nova, zero publicação automática e zero WORK14.

## QA executado

**1.613 verificações aprovadas**:

- V633 estrutural: 76/76;
- V633 runtime e navegação: 116/116;
- V633 iPhone: 152/152;
- V633 acessibilidade: 41/41;
- compatibilidade do menu V631: 103/103;
- regressão iPhone do menu V631 com o CSS V633: 152/152;
- acessibilidade do menu V631: 41/41;
- Música V625: 198/198;
- Vídeos/Memojis V626: 211/211;
- Notificações V628: 167/167;
- Orquestra V629: 213/213;
- Consultas V621 runtime + iPhone: 143/143.

Perfis iPhone cobertos: 320×568, 375×667, 360×780, 390×844, 393×852, 430×932 e 844×390 em paisagem.

## Falhas e limites não escondidos

- A V633 ainda não está publicada por este pacote. A confirmação visual final no domínio só pode acontecer depois da instalação.
- Alguns harnesses estruturais históricos dos pacotes incrementais V610–V624 não puderam ser reexecutados porque os ZIPs incrementais disponíveis não contêm todas as dependências antigas que esses harnesses tentam abrir. Eles encerram com `ENOENT`; não foram contados como aprovação nem como regressão funcional.
- A auditoria ao vivo e os testes específicos confirmaram os arquivos e conteúdos instalados, mas a ida e volta final no iPhone real deve ser repetida depois da publicação da V633.

## Critério de aceite pós-instalação

1. Home permanece visualmente igual.
2. Pentagrama abre o menu em qualquer rota.
3. Cada rota chega com apenas uma Orbe visível.
4. O primeiro toque não abre o menu: abre o mundo atual.
5. Consultas mostra as quatro leituras.
6. Diário mostra o editor; Escola mostra o caminho; Loja mostra a curadoria.
7. Vídeos mostra os portais Memojis e De Frente com o Tarot.
8. Voltar ao pentagrama, trocar de mundo e repetir não cria Orbe, canvas, player ou menu duplicado.

Até essa prova pós-instalação, a Divina Bruxa não deve ser declarada pronta para lançamento.
