# Diagnóstico V577 — Orbe Suprema 2.0 — Macroetapa 2

## Causa

O Tarot Livre já recebia a Orbe física em um host funcional. Em parte das outras
realidades, o destino era apenas uma presença visual, enquanto a Orbe física
permanecia numa camada global sobre esse ponto. O resultado mantinha um só `#orb`
no DOM, mas quebrava a unidade conceitual: o pouso não pertencia realmente à página.

Quando um módulo funcional assumia a Orbe depois desse pouso provisório, a troca de
host também podia ocorrer sem percurso visível.

## Correção

- As 15 presenças universais agora também são hosts físicos da mesma Orbe V501.
- Durante o pouso, fallback e projeção ficam ocultos; somente o `#orb` vivo aparece.
- Home e Tarot continuam com seus hosts próprios.
- Tarot, Carta do Dia, Biblioteca, Escola, Whit e Diário são preparados antes do
  commit da rota porque a Orbe executa ações próprias nesses mundos.
- Uma reivindicação funcional tardia parte da posição física atual e desliza até
  o novo host; não existe teleporte.
- O host semântico deixa temporariamente de ser foco enquanto contém a Orbe, evitando
  dois controles acessíveis sobre o mesmo corpo; seus atributos são restaurados na saída.
- O Service Worker V577 trata todo o núcleo universal como geração atômica.

## Travas preservadas

- Tarot Livre V576 congelado byte a byte.
- Nenhum redesenho de Orbe, menu, mini-Orbe, dock ou páginas.
- Nenhum novo efeito ou loop permanente.
- Uma única Orbe física; zero viajantes e zero cópias.
- Movimento reduzido, continuidade de viewport visual e recuperação de PWA mantidos.

## Evidência automática

`node qa-v577-orbe-suprema2-universal.mjs .`

Resultado: **PASS — 105/105**.

O navegador remoto não acessa o servidor local desta sessão. Por isso, a validação
visual final em iPhone físico permanece como gate da criadora após a instalação.
