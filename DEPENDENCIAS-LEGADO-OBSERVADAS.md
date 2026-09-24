# Dependências do legado observadas

Este documento registra sinais objetivos do estado atual. Ele não declara que
cada arquivo antigo é inútil; declara que a autoridade está fragmentada.

## Documento principal

- `index.html`: 42.804 bytes.
- 38 referências diretas a arquivos CSS.
- Quatro referências diretas a scripts externos.
- Seções e hosts de diversos mundos convivem no mesmo documento.

## Aplicação

`app-v208.js` importa, entre outros:

- runtime V12;
- navegação, carregador de páginas e motor da Orbe;
- núcleos V501, V511, V518, V524 e V526;
- presença/WHIT V307–V316, V527, V540, V581 e V594;
- camadas de Work 12 V589–V598;
- camadas de Work 13 V602–V610;
- mundos V614–V627;
- inicializadores dinâmicos para PWA, menu, tiragens e biblioteca.

Esse encadeamento produz múltiplas responsabilidades no mesmo ponto de entrada.

## Service worker

`sw.js` declara:

- cache `divina-bruxa-work13-v627-skins-atelie-dos-universos`;
- pré-cache de vários mundos e estilos V598–V627;
- leitura e validação textual de `index.html`, `app-v208.js` e contratos;
- mensagens específicas de mundos, inclusive loja e vídeos;
- limpeza apenas de caches com o prefixo histórico.

Na 3.0 o service worker deve cuidar de cache e atualização. Ele não deve ser o
orquestrador nem o auditor de todas as realidades.

## Raiz pública

Todos os 2.810 arquivos rastreados estão na raiz. Além do runtime e do conteúdo,
essa raiz contém 39 arquivos SQL, 29 TypeScript, 374 MJS e centenas de documentos
de instalação/auditoria. A 3.0 precisa separar claramente:

- código publicado;
- conteúdo/dados;
- ativos;
- testes;
- documentação;
- fonte de backend/migrações.

## Ativos pesados observados

- `divina-orb-v48.png`: 5.900.400 bytes.
- `tarot-cosmos-deep-v514.webp`: 4.152.080 bytes.
- `tarot-cosmos-master-v513.webp`: 3.584.930 bytes.
- diversas skins PNG entre aproximadamente 2,6 e 3,3 MB cada.

Esses arquivos devem ser preservados até a seleção visual. Depois, as versões
de entrega precisam ser responsivas e otimizadas, mantendo o original fora do
carregamento inicial.

## Consequência arquitetural

A nova versão deve começar com orçamento de peso, rotas e responsabilidades.
Copiar o `index.html`, o `app-v208.js` ou o `sw.js` atuais para a 3.0 levaria o
mesmo problema para a base nova.
