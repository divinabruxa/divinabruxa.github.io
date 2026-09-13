# Laboratório V546 — dispositivos, fluidez e recuperação

Esta matriz não transforma teste físico pendente em aprovação automática. Ela define exatamente o que observar na V546 e será incorporada à revisão final da V548.

## Orçamentos

| Sinal | Meta | Fallback aceitável | Falha |
|---|---:|---:|---:|
| Resposta visual ao toque | até 100 ms | indicação imediata e conteúdo concluído depois | toque sem resposta ou toque duplicado |
| LCP | até 2,5 s | registrar ambiente e investigar | acima de 4 s |
| INP | até 200 ms | simplificação automática em aparelho limitado | acima de 500 ms |
| CLS | até 0,1 | correção antes da V548 | acima de 0,25 |
| Movimento | 60 fps | 30 fps estáveis; 20 fps com movimento reduzido | engasgos persistentes |

## Matriz física pendente

| Ambiente | Rede | Teste principal | Estado nesta entrega |
|---|---|---|---|
| iPhone Safari atual | Wi‑Fi | Home, Orbe, menu, Tarot, retorno por gesto | pendente de aparelho real |
| iPhone instalado na Home | Wi‑Fi | abrir, fechar, retomar e atualizar V545 → V546 | pendente de aparelho real |
| iPhone instalado na Home | offline | Tarot preparado, Diário local, Biblioteca e Whit Local | pendente de aparelho real |
| iPhone com modo de pouca energia | Wi‑Fi | fallback visual sem bloqueio | pendente de aparelho real |
| iPhone com movimento reduzido | Wi‑Fi | ausência de efeitos desnecessários | pendente de aparelho real |
| Android Chrome | 4G/Wi‑Fi | instalação, navegação e recuperação | pendente de aparelho real |
| Android limitado | 3G/Save‑Data | perfil constrained e rotas lazy | pendente de aparelho real |
| iPad em retrato/paisagem | Wi‑Fi | safe areas, teclado, menu e Diário | pendente de aparelho real |
| Desktop 1280/1920 | Wi‑Fi | LCP, CLS, atalhos e atualização | pendente de aparelho real |

## Roteiro de atualização segura

1. Com a V545 aberta, instalar a V546 no repositório e aguardar o deployment.
2. Fechar o PWA completamente e reabrir.
3. Confirmar que Home, Orbe e menu respondem antes de qualquer mundo pesado.
4. Abrir `instalar-app.html` e tocar em **Verificar núcleo**.
5. Se a resposta não indicar integridade, manter a conexão e tocar em **Reparar núcleo**.
6. Fechar e reabrir; verificar novamente.
7. Confirmar que Diário, Conta e direitos não foram apagados.

## Roteiro offline verdadeiro

1. Online, abrir `instalar-app.html` e tocar em **Preparar agora**.
2. Esperar a confirmação completa antes de desligar a conexão.
3. Fechar o PWA, ativar modo avião e reabrir.
4. Testar Tarot Livre, uma Carta do Dia já revelada, Biblioteca, Diário local, Whit Local e skin atual.
5. Confirmar que Conta, billing, Admin, Whit online e envio de Consulta informam que precisam de conexão.
6. Reconectar e confirmar recuperação sem recarregamentos repetidos.

## Critério de passagem para V548

- Zero travamento P0.
- Nenhum toque duplicado.
- Nenhum fogo no Tarot Livre.
- Nenhuma segunda Orbe física.
- Nenhum dado de autoridade servido do cache.
- Métricas reais anotadas por dispositivo; testes físicos nunca serão inventados.

