# Gate 1 — Fundação limpa

## Entrega esperada

Uma experiência navegável fora do `main`, sem conteúdo falso e sem carregar o
runtime antigo. O objetivo do Gate 1 é provar a espinha dorsal antes de migrar
todos os mundos.

## Escopo

- Uma Home preservada conceitualmente, com porta de entrada responsiva.
- Uma única Orbe viva.
- Pentagrama/menu nascido da Orbe, sem lista permanente em volta dela.
- Retorno pela mesma Orbe em qualquer mundo.
- Um registro único de mundos e rotas.
- Uma física única para entrada, repouso, foco, viagem e retorno.
- Estados de carregamento, vazio, erro e indisponibilidade.
- Respeito a `prefers-reduced-motion`.
- Safe areas e gesto/toque pensados primeiro para iPhone.
- Um mundo-piloto real, com ida e volta comprovadas.

## Critérios de passagem

1. A pessoa toca a Orbe e recebe resposta imediata.
2. O pentagrama é compreensível sem explicação técnica.
3. O menu não cria uma segunda Orbe.
4. A troca de mundo não pisca nem perde o estado de navegação.
5. Voltar funciona por gesto, histórico e Orbe.
6. Teclado e leitor de tela chegam aos mesmos destinos.
7. Nenhum erro no console no fluxo-piloto.
8. Nenhum ativo pesado bloqueia a primeira interação.
9. Repetir ida e volta vinte vezes não degrada movimento nem memória.
10. O `main` continua intacto durante toda a prova.

## O que o Gate 1 não fará

- Não publicará a 3.0 no domínio principal.
- Não excluirá o legado.
- Não copiará todos os mundos antes de provar a arquitetura.
- Não inventará integrações, preços ou conteúdo.
- Não transformará o pentagrama em painel administrativo.
