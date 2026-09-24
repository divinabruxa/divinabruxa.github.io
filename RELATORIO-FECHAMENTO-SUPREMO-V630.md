# Divina Bruxa — Fechamento Supremo V630

## Estado

**Candidata à validação física da proprietária.** O pacote não força a declaração de lançamento: a auditoria automatizada está aprovada, mas a prova final em um iPhone real continua obrigatória após a instalação.

## Escopo real

Quatro arquivos existentes foram substituídos. Nenhuma página, mundo, conteúdo, preço, rota, renderer da Orbe, banco, integração ou arquivo estrutural foi incluído.

## Falhas comprovadas e correções

1. **A porta de entrada não dizia “Entrá” e estava separada da Orbe na Home.** A mesma presença agora vive junto da Orbe na Home, exibe “Entrá” e reage ao toque. Ao abrir ou viajar, o mesmo nó — sem clone — assume a posição discreta global.
2. **O menu mostrava instrução técnica.** A orientação continua disponível para leitor de tela, mas deixa de aparecer como elemento visual do universo.
3. **Havia sete ciclos visuais permanentes entre entrada e menu.** Foram removidos. Permanecem apenas transições curtas, acionadas por gesto ou mudança de estado.
4. **O menu carregava uma folha de estilo identificada por autoridade antiga.** A autoridade V630 foi alinhada entre JavaScript e CSS, evitando reaproveitamento visual obsoleto.

## Contrato preservado

- Uma Orbe física; nenhum canvas, renderer ou Orbe adicional.
- No máximo dois balões vivos ao redor da Orbe.
- Quinze destinos existentes e Origem preservados.
- A mesma presença abre e fecha o universo de caminhos.
- Tarot continua sendo revelação, não atalho para o menu.
- Home, mundos e páginas públicas não foram reconstruídos.
- WORK13 permanece concluído e congelado; WORK14 não existe neste pacote.

## Auditoria executada

- V630: **315/315** verificações aprovadas.
  - Estrutural: 69/69
  - Entrada/runtime: 119/119
  - Menu/runtime: 47/47
  - Oito geometrias de iPhone: 80/80
- Regressões congeladas V626, V628 e V629: **591/591** aprovadas.
- Total desta auditoria: **906/906** verificações aprovadas.

As geometrias simuladas cobrem iPhone SE, 12/13 mini, 12/13/14, 14 Pro, 14 Pro Max, 15, 15 Pro e 15 Pro Max, incluindo orientação horizontal onde aplicável. Isso não substitui o ensaio tátil no aparelho publicado.

## Não alterado

- `index.html`
- `app-v208.js`
- `sw.js`
- mundos e páginas públicas
- SEO, textos, preços e conteúdo
- Memojis de Vídeos
- backend, SQL e Supabase

