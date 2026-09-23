# V626 · ativação dos Memojis

Este pacote continua o V625. Os arquivos do site podem ser sobrepostos normalmente; o cofre de vídeo precisa ser ativado no mesmo Supabase STAGING já usado pela Conta e pelo Admin.

## 1. Banco e Storage

Crie uma migration pelo Supabase CLI e copie para ela todo o conteúdo de `SUPABASE-SETUP-V626-MEMOJIS.sql`:

```sh
supabase migration new v626_memoji_videos
supabase db push
```

O SQL cria uma tabela sem acesso direto para `anon` ou `authenticated`, mantém RLS obrigatório e cria o bucket privado `memoji-videos-v626`.

## 2. Edge Function

Crie a função e use `memoji-videos-v626-edge.ts` como `supabase/functions/memoji-videos-v626/index.ts`:

```sh
supabase functions new memoji-videos-v626
supabase functions deploy memoji-videos-v626 --no-verify-jwt
```

`--no-verify-jwt` é necessário porque o GET público entrega somente registros publicados e URLs de leitura temporárias. As ações do Admin fazem sua própria validação completa usando os cookies seguros já existentes: proprietária, e-mail confirmado, MFA AAL2, sessão ativa, códigos de recuperação e rate limit.

O runtime do Supabase injeta `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`. A chave de serviço nunca deve entrar nos arquivos do site.

Se o domínio de instalação não for um dos domínios oficiais já previstos, configure a mesma lista usada pelo Admin existente:

```sh
supabase secrets set ADMIN_ALLOWED_ORIGINS="https://seu-dominio.example"
```

## 3. Conferência

1. Entre na Conta proprietária e conclua o MFA.
2. Abra Admin → Publicar Memoji.
3. Envie um vídeo curto como rascunho; ele não pode aparecer no site.
4. Publique-o e abra Vídeos → Memojis.
5. Confirme que o vídeo só carrega depois do toque, não inicia sozinho e para ao fechar ou mudar de mundo.
6. Abra Admin → Adicionar De Frente com o Tarot para continuar usando somente links oficiais do YouTube.

O envio usa TUS em blocos de 6 MB, apropriado para arquivos maiores e conexões móveis instáveis. O bucket permanece privado; o público recebe URLs assinadas de uma hora, nunca os caminhos internos.
