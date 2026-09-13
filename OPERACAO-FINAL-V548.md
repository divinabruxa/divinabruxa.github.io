# Operação final — Divina Bruxa 3.0 · V548

O código do Plano 3.0 termina nesta macroetapa. O selo final continua bloqueado até a proprietária produzir as evidências que só existem fora do código.

## 1. Ativar a proprietária real

1. Crie a conta usando o e-mail oficial já permitido pelo servidor.
2. Confirme o e-mail pelo link do Supabase Auth.
3. Abra **ADMIN** e entre com essa conta.
4. Cadastre o TOTP em um aplicativo autenticador.
5. Guarde os 10 recovery codes fora do telefone e confirme a guarda.

Senha sozinha nunca abre o painel. A autorização está no servidor, não em JavaScript.

## 2. Executar a matriz física

1. Abra `laboratorio-fisico-v547.html` em cada um dos 9 perfis.
2. Execute os casos aplicáveis; nenhum começa aprovado.
3. Marque PASSOU, FALHOU ou BLOQUEADO pelo que realmente observou.
4. Exporte o JSON sanitizado em cada aparelho/perfil.
5. Corrija qualquer FALHOU antes da assinatura. BLOQUEADO e pendente não equivalem a PASSOU.

Os 9 perfis totalizam 471 avaliações aplicáveis. A Central V548 aceita os exports juntos e recusa conflitos.

## 3. Conectar continuidade

O STAGING possui política e registro, mas não possui scheduler externo nem restore real verificado. Conecte uma rotina autorizada de exportação criptografada, registre cada execução em `private.backup_runs` por backend de serviço e execute uma restauração isolada. Objetos do Storage exigem tratamento separado do banco.

Não altere `scheduler_state` nem `restore_state` apenas para liberar a tela. Esses estados precisam representar execução observada.

## 4. Assinar no ADMIN

1. Abra **ADMIN → CONCLUSÃO 14/14**.
2. Selecione até 9 JSONs exportados pela matriz física.
3. Confira as contagens exibidas.
4. Digite um novo código MFA no campo de step-up.
5. Registre a revisão no STAGING.

A matriz bruta não é enviada. O servidor recebe: perfis completos, PASS, FAIL, BLOQUEADO, PENDENTE e SHA-256.

## 5. Frase final

Somente quando a Central mostrar simultaneamente:

- construção técnica concluída;
- sessão owner segura;
- 9/9 perfis e 471/471 passes;
- backup automático conectado com execução;
- restauração real verificada;

ela exibirá **PRONTA PARA ADMINISTRAR**. Nesse ponto, a frase correta será: **“A Divina Bruxa está pronta, agora é só administrar.”**

Produção, DNS, cobrança real e publicação em lojas continuam projetos de ativação externa e exigem autorização própria; não foram fingidos por este pacote.
