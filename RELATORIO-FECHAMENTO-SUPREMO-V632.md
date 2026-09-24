# Divina Bruxa — Fechamento Supremo V632

## Estado

**Correção cirúrgica pronta para validação física.** Um conflito real foi encontrado no V631 publicado e corrigido em um único arquivo.

## Falha comprovada

Depois de entrar em um mundo e reabrir o menu pelo pentagrama, a Orbe central aparecia como “Início”, mas o toque não voltava para a Home. A captura global destinada a abrir o menu nos mundos interceptava o evento antes que o próprio menu pudesse transformá-lo em retorno.

No Tarot Livre, o retorno funcionava, porém o nome acessível da Orbe ainda dizia “revelar a próxima carta” durante o menu aberto, embora o gesto naquele estado voltasse para a Home.

## Correção

- Com o menu fechado, a Orbe dos mundos continua abrindo o universo quando essa é sua função.
- Com o menu aberto, clique e teclado deixam de ser interceptados e são entregues ao menu.
- A Orbe central passa a anunciar: “Orbe central. Toque para voltar ao Início”.
- Com o menu fechado, Tarot Livre, Carta do Dia, Tiragens, Biblioteca e Diário mantêm suas ações próprias.
- Pentagrama, Orbe, menu, rotas, física e mundos não foram recriados.

O impacto incremental é de aproximadamente **70 bytes comprimidos em gzip**. Nenhuma dependência, imagem, estilo, animação ou operação gráfica foi adicionada.

## Arquivo substituído

- `cosmos-entry-intention-v610.js`

## Auditoria publicada do V631

- Home abriu pelo pentagrama existente.
- Menu antigo permaneceu oculto e o cabeçalho não reapareceu.
- Oito sopros e quinze mundos estavam presentes.
- Somente dois balões ficaram visíveis por vez.
- Viagem para Notificações concluída com uma única Orbe.
- Música e Vídeos abriram diretamente com o pentagrama global presente.
- Tarot Livre revelou uma carta sem abrir o menu.
- Retorno do Tarot para a Home pela Orbe funcionou.
- Páginas públicas mantiveram marca, cores e linguagem visual do universo.
- Integridade após as viagens: uma Orbe, um canvas, um pentagrama e uma raiz de menu.
- Nenhum erro próprio da Divina Bruxa apareceu no console; as mensagens observadas pertenciam à extensão do navegador remoto.

O navegador remoto tem latência própria e não substitui o toque no iPhone da proprietária. Por isso a fluidez física ainda precisa ser confirmada após esta instalação.

## Auditoria automatizada

- V632 estrutural: **35/35**
- V632 entrada/runtime: **125/125**
- Total V632: **160/160**
- Regressões V626–V631: **1.444/1.444**
- Auditoria acumulada: **1.604/1.604**

## Congelado

- Home e mundos
- `orbital-menu-v502.js` e `orbital-menu-v502.css`
- `cosmos-entry-intention-v610.css`
- `index.html`, `app-v208.js` e `sw.js`
- páginas públicas e SEO
- conteúdo, preços, Memojis, backend e Supabase
