# QA V541 — Experiências, Conteúdo e Conversão

## Resultado

- Suíte V541: **239/239 aprovada**
- Falhas: **0**
- Sintaxe dos módulos alterados: aprovada
- JSON-LD das páginas de Consultas: válido
- Navegador físico: não disponível neste ambiente; os testes físicos abaixo não foram simulados nem contados como aprovados

## Escopo validado

- Quatro serviços e preços canônicos: R$500, R$500, R$300 e R$150.
- Nome oficial “Leitura de Pensamentos” e e-mail como único canal.
- Ausência dos preços antigos em PT-BR, inglês e espanhol.
- Dados estruturados sem disponibilidade comercial falsa.
- Loja com 21 escolhas, quatro coleções, código `orbedasrealid-20`, aviso de afiliado e zero checkout interno.
- Dois álbuns oficiais: Sobre as Estrelas e Z.
- Player do Spotify ausente do carregamento inicial e criado somente após ação consciente.
- Nenhum autoplay ou permissão de autoplay.
- Vídeos alimentados somente por episódios publicados; zero episódio inventado.
- Busca local e compartilhamento adicionados apenas quando houver episódios reais.
- Nenhuma leitura de telefone, pergunta, Diário, formulário ou storage pela camada V541.
- Nenhum conteúdo de busca enviado para analytics.
- Nenhum novo canvas, `pointermove`, `MutationObserver`, loop permanente ou blur pesado.
- Conteúdo diferido, alvos mínimos de 44 px, movimento reduzido e uma coluna no celular.
- Cache PWA V541 inclui os dois módulos novos e as dependências alteradas.
- Regressões essenciais preservadas: Orbe V501 única, Whit Local V540, 78 cartas diretas,
  Escola 17 módulos/124 aulas e Tarot Livre sem fogo.
- Travas preservadas: STAGING, produção desligada, billing real desligado e Sol desligado.

## Testes físicos ainda necessários

1. Percorrer Consultas → Loja → Música → Vídeos em iPhone/Safari e Android/Chrome.
2. Abrir Música com rede lenta e confirmar que o Spotify não carrega antes do toque.
3. Escolher cada serviço e verificar foco, rolagem, teclado e formulário de consulta.
4. Filtrar as quatro coleções da Loja e abrir links Amazon em nova aba.
5. Publicar um episódio de teste no STAGING e validar busca, compartilhamento e capa responsiva.
6. Usar VoiceOver/TalkBack e preferência de movimento reduzido nos quatro mundos.

Testes físicos não são contabilizados como aprovados pela suíte automatizada.
