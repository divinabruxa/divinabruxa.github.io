# QA — MACROETAPA 0 — COFRE VISUAL

## Resultado esperado

Registrar a versão visual aprovada da Divina Bruxa antes de mexer nas páginas. Esta macroetapa não altera interface, imagens, cartas, Orbe ou Menu.

## Checklist automatizável

- [x] Orbe principal presente: `divina-orb-v68.png`.
- [x] Mini-Orbe presente: `divina-mini-orb-hd-v72.jpeg`.
- [x] Menu orbital presente: `menu-ring-v8.css`.
- [x] Título de marca presente: `Divina Bruxa — Orbe das Realidades`.
- [x] Título do menu presente: `ORBE VIVA — MENU MÁGICO`.
- [x] Orbe principal continua com `orbCanvas`.
- [x] Duplo toque continua documentado no `aria-label` da Orbe.
- [x] Menu inferior continua apontando a mini-Orbe para `ai`.
- [x] Arquivo do cofre registra hashes SHA-256 dos ativos congelados.
- [x] As 15 telas atuais foram inventariadas.

## Checklist visual manual

### iPhone compacto e atual

- [ ] Home sem corte de título, Orbe ou dock.
- [ ] Menu centralizado entre cabeçalho e dock.
- [ ] Título do Menu visível e sem sobreposição ao cabeçalho.
- [ ] Oito ícones orbitais nítidos.
- [ ] Fileira superior legível e sem borrado.
- [ ] Mini-Orbe central sem perda de qualidade.

### Desktop

- [ ] Orbe continua protagonista.
- [ ] Menu mantém círculo e espaçamento aprovados.
- [ ] Nenhum elemento encosta na Orbe.
- [ ] Nenhum texto sai do viewport.

### Interação

- [ ] Abrir Menu não apresenta quadro vazio.
- [ ] Fechar Menu não troca a imagem da Orbe.
- [ ] Abrir e fechar rapidamente é reversível.
- [ ] Duplo toque abre Tarot Livre.
- [ ] Toque na mini-Orbe abre Orbe IA.
- [ ] Arrastar não desloca a página.

## Critérios de bloqueio

Bloquear a próxima macroetapa se houver:

- alteração inesperada nos hashes dos ativos congelados;
- ícone borrado, cortado ou sobreposto;
- troca visível de imagem durante transição;
- deslocamento da Orbe ou do Menu;
- quebra de navegação;
- regressão das 78 artes autorais.

## Evidências desta macroetapa

- `COFRE-VISUAL-DIVINA-BRUXA-V1.json`: contrato de invariantes e hashes.
- Este arquivo: checklist de regressão e aprovação.

## Próxima etapa

**Macroetapa 1 — Design System Cósmico + Ícones**, sem alterar a Orbe, o Menu Mágico ou as artes das cartas.
