# WORK13 · V626 · Vídeos · Cinema da Orbe

## Resultado

O mundo Vídeos agora tem duas salas nítidas e independentes:

- **Memojis** é a entrada principal e usa vídeo nativo hospedado no Storage privado da Divina Bruxa.
- **De Frente com o Tarot** preserva integralmente o catálogo e o player do V559, recebendo apenas URLs oficiais do YouTube.

Nenhum episódio, título, convidado ou data foi criado para preencher o vazio editorial. A entrega continua com **zero episódios oficiais publicados** do programa.

## Publicação de Memojis

O Admin ganhou duas ações explícitas: `PUBLICAR MEMOJI` e `ADICIONAR DE FRENTE COM O TAROT`.

O editor de Memojis permite:

- escolher MP4, MOV, WebM ou M4V direto do iPhone;
- adicionar capa JPG, PNG, WebP ou AVIF;
- definir título, categoria, descrição e descrição acessível;
- salvar como rascunho, revisão, agendado, publicado ou arquivado;
- editar, publicar, ordenar, ocultar e mostrar novamente;
- cancelar o envio e acompanhar o progresso.

Arquivos são enviados diretamente ao Supabase Storage pelo protocolo TUS, em blocos de 6 MB e com retomada após instabilidade. A Edge Function somente autoriza e assina o caminho; ela não recebe o corpo pesado do vídeo.

## Segurança

- Bucket privado `memoji-videos-v626`.
- Tabela com RLS obrigatório e sem acesso de `anon` ou `authenticated` pela Data API.
- Leitura e escrita da tabela somente pela Edge Function com `service_role` server-side.
- Admin revalida proprietária ativa, e-mail confirmado, MFA AAL2, sessão não revogada, códigos de recuperação, origem e rate limit.
- Caminhos de Storage precisam pertencer ao UUID da proprietária e são conferidos depois do upload.
- O público recebe apenas campos permitidos e URLs assinadas com duração de uma hora.
- Nenhuma chave de serviço está no navegador.

## Reprodução e continuidade

- O `<video>` só é criado após toque explícito.
- `autoplay` permanece desligado; o código não chama `play()`.
- Ao abrir um Memoji, o player V559 anterior é encerrado.
- Ao fechar, trocar de sala ou sair do mundo, a fonte do vídeo é removida.
- No máximo um player pode permanecer ativo.
- Uma Orbe, um canvas e nenhum renderer novo.
- A interface recua quando a obra está em foco.
- O V625 Música permanece preservado.

## QA executado

| Suite | Resultado | Asserções |
|---|---:|---:|
| V626 estrutural | PASS | 71/71 |
| V626 backend e segurança | PASS | 42/42 |
| V626 iPhone, 8 geometrias | PASS | 60/60 |
| V626 runtime determinístico | PASS | 38/38 |
| V625 Música iPhone | PASS | 51/51 |
| V625 Música runtime | PASS | 45/45 |
| V625 Música estrutural | PASS | 62/62 |
| Boot herdado V625 | PASS | 40/40 |
| **Total** | **PASS** | **409/409** |

Também passaram a verificação sintática de `app-v208.js`, `sw.js`, `videos-world-v626.js` e da Edge Function TypeScript usando o parser TypeScript do Node.

## Limite consciente desta entrega

Nenhuma mutação foi feita no Supabase de produção. A implantação real exige aplicar o SQL e publicar a função conforme `ATIVACAO-V626-MEMOJIS.md`. O teste final de upload em um iPhone físico e de publicação ponta a ponta deve ocorrer depois dessa ativação no STAGING.

## Próximo mundo

Skins, ainda dentro do WORK13. Nenhum WORK14 foi criado.
