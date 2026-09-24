# Divina Bruxa — Fechamento Supremo V631

## Estado

**Candidata à validação física da proprietária.** A correção automatizada foi concluída, mas a declaração de lançamento depende da prova tátil e visual no iPhone publicado.

## Arquivos de produção substituídos

- `cosmos-entry-intention-v610.js`
- `cosmos-entry-intention-v610.css`
- `orbital-menu-v502.js`
- `orbital-menu-v502.css`

Os dois arquivos da entrada incorporam o V630 porque ele ainda não foi instalado. Os dois arquivos do menu recebem a correção V631. O pacote pode ser instalado diretamente sobre o WORK13/V629.

## Correções comprovadas

1. **Menu legado potencialmente visível:** o `#orbMenu` agora é silenciado pelo próprio motor (`hidden`, `inert` e `aria-hidden`) e também por uma regra CSS ligada à autoridade V631. O estado anterior é preservado para uma reversão limpa.
2. **“Origem” duplicado e cabeçalho visível:** o cabeçalho inteiro desaparece enquanto o universo está aberto. A única referência de retorno fica na Orbe central, nomeada “Início”.
3. **Descoberta dos outros caminhos:** no primeiro repouso, os dois balões fazem um único deslocamento horizontal de oito pixels e retornam ao silêncio. Não há rotação automática, navegação automática ou animação permanente. O sinal é desativado em Movimento Reduzido.
4. **Foco preso em controles invisíveis:** a ordem de teclado passa pelo pentagrama existente, pela Orbe física e pelos balões visíveis; o antigo botão técnico deixa de participar da jornada.
5. **Folha visual antiga em cache:** o menu carrega a autoridade e a consulta de estilo V631.

O impacto incremental dos dois arquivos realmente alterados é de aproximadamente **458 bytes comprimidos em gzip**. Nenhuma biblioteca, imagem, canvas, fonte ou dependência foi adicionada.

## Contrato preservado

- Um pentagrama existente; nenhum novo botão visual.
- Uma Orbe física; nenhum canvas ou renderer adicional.
- Quinze mundos e Origem preservados.
- No máximo dois balões vivos por vez.
- Toque no céu e gesto horizontal percorrem os oito sopros.
- O mesmo pentagrama abre e fecha.
- A mesma Orbe viaja até o destino.
- Tarot Livre mantém a ação exclusiva de revelar cartas.
- Home, mundos, páginas públicas, conteúdo, preços, SEO, Memojis e backend permanecem congelados.
- WORK13 permanece concluído; WORK14 não foi criado.

## Auditoria V631

- Estrutural: **123/123**
- Entrada e pentagrama: **119/119**
- Menu e navegação: **103/103**
- Oito geometrias de iPhone: **152/152**
- Acessibilidade: **41/41**
- Total V631: **538/538**

O runtime percorreu os quinze mundos, preservou a mesma Orbe e concluiu trinta ciclos consecutivos de abrir e fechar sem vazamento de trava ou temporizador.

## Regressões congeladas

- V630: **315/315**
- V626, V628 e V629: **591/591**
- Total de regressões: **906/906**
- Auditoria acumulada: **1.444/1.444**

## Limite da prova

As geometrias automatizadas verificam iPhones de 320 a 430 pixels em retrato e 844 × 390 em paisagem. Elas não substituem a inspeção do resultado publicado, o toque real, o Safari/PWA e a percepção humana de beleza e clareza.
