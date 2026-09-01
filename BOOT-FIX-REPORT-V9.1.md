# Divina Bruxa — Correção do Boot P0 V9.1

## Falha original

O `app.js` atribuía `onsubmit` diretamente a `#userRegister`, mas o
`index.html` atual não contém esse formulário. O navegador interrompia o
restante da inicialização com `TypeError: Cannot set properties of null`.

## Correções aplicadas

- Bindings de login, cadastro e admin agora são opcionais.
- O toast não quebra se a área visual ainda não estiver montada.
- O botão de instalação do PWA é tratado como opcional.
- Falha de registro do service worker passa a ser observável no console.
- O desbloqueio administrativo local foi removido; admin exige backend seguro.
- Campos opcionais do cadastro não geram novo erro de `null`.

## Limites

- Este arquivo é uma substituição segura do `app.js`; não ativa Auth, banco ou
  pagamentos reais.
- O PWA ainda usa a política de cache existente até a Macroetapa 2/3.
- A validação em aparelhos reais continua obrigatória.

## Validação

Execute `node BOOT-FIX-VALIDATION-V9.1.mjs`. O resultado esperado é 8/8 PASS.

