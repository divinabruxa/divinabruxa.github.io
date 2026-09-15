# V579 — Essência Suprema · Menu da Orbe

## Diagnóstico

O desenho aprovado já estava correto. O ruído vinha da coordenação interna:

- a navegação antiga e o Menu orbital ainda podiam disputar o mesmo botão e o mesmo estado;
- abrir durante um fechamento era recusado, em vez de inverter o movimento atual;
- fechar durante uma abertura podia interromper a passagem sem uma autoridade única;
- o fundo não possuía um único bloqueio semântico de foco e interação;
- o fechamento de uma rota podia esconder o Menu antes de a Orbe assumir a viagem.

## Lapidação realizada

- Uma única autoridade V579 governa botão, estado, foco, `aria-hidden`, `inert`, toque e destino.
- Estados únicos: `closed`, `opening`, `open`, `reversing`, `closing` e `navigating`.
- Abrir e fechar podem ser invertidos a partir do quadro atual.
- Intenções antigas são invalidadas por um único token de movimento.
- Fundo e controles externos ficam protegidos durante toda a passagem.
- O foco entra na Orbe e retorna ao controle de origem quando o Menu é fechado.
- A escolha de uma realidade inicia a viagem enquanto o Menu desaparece, sem devolver a Orbe à Home no intervalo.
- O `will-change` é usado somente durante a transição e liberado ao terminar.

## Proteções

- CSS do Menu preservado byte por byte.
- Dois anéis, 13 destinos, posições, ícones, rótulos, escalas e composição preservados byte por byte.
- Home V578 preservada por hash.
- Motor e jornada da Orbe preservados por hash.
- Tarot Livre e Carta do Dia preservados por hash.
- Nenhuma realidade, conteúdo, cobrança, autenticação ou função de produto foi alterada.

## Portão final

A estrutura e as reversões simuladas estão aprovadas. A sensação visual e tátil final deve ser confirmada no iPhone real depois da instalação antes da Macroetapa 3.
