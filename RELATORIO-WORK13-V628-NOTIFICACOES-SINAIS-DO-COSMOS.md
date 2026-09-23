# WORK13 · V628 · Notificações · Sinais do Cosmos

## Resultado

A realidade Notificações foi renovada como um espaço de escolha e silêncio. Ela não solicita permissão ao entrar: primeiro apresenta os compromissos e só abre as configurações após ação explícita.

## Contratos preservados

- V627 · Skins · Ateliê dos Universos permanece preferencial na rota `skins`.
- Uma Orbe e um canvas; a V628 não cria renderizador, canvas ou loop.
- Tarot, Carta do Dia, Tiragens, Escola, Diário, Whit, Consultas, Loja, Premium, Conta, Música e Vídeos/Memojis não são reescritos.
- Nenhum WORK14 foi aberto.

## Segurança e privacidade

- Preferências ficam somente no aparelho até existir sincronização autenticada segura.
- Não há leitura ou segmentação por Diário, pergunta, tiragem, cartas, conversa com Whit ou notas privadas.
- A Carta do Dia usa texto neutro e nunca revela a carta.
- Deep links são limitados a uma lista interna conhecida.
- Marketing tem escolha própria e começa desligado.

## Estado operacional

- Provedor push: desligado.
- Envio automático: desligado.
- Agendamento automático: desligado.
- Teste: somente local e após permissão explícita.
- Backend/Supabase: sem alteração nesta versão.

## Validação

Foram executadas validações estruturais, de máquina de estados, rotas permitidas e oito geometrias de iPhone. Os resultados exatos são registrados no fechamento do pacote e no manifesto.
