# ORBE DAS REALIDADES — ETAPA 1: IA REAL

## Estrutura
- `site/index.html` — front-end atual, preservando os 78 espaços de cartas.
- `worker/src/index.js` — backend seguro para OpenAI.
- `worker/wrangler.jsonc` — configuração do Cloudflare Worker.
- `worker/package.json` — comandos de deploy.

## Segurança
NUNCA coloque a chave da OpenAI dentro do `index.html` ou em um repositório público.
A chave deve ser salva como Secret no Cloudflare Worker.

## Modelos configurados
- Persona / chat contínuo: `gpt-5.6-luna`
- Análise profunda de Tarot: `gpt-5.6-terra`

## Deploy do backend
1. Crie uma conta Cloudflare.
2. No computador, dentro da pasta `worker`, execute:
   `npm install`
3. Faça login:
   `npx wrangler login`
4. Cadastre a chave OpenAI com segurança:
   `npx wrangler secret put OPENAI_API_KEY`
5. Publique:
   `npm run deploy`
6. O Cloudflare fornecerá uma URL parecida com:
   `https://orbe-das-realidades-ai.<seu-subdominio>.workers.dev`

## Ligar o site ao backend
Abra uma vez o site com:
`https://divinabruxa.com.br/?api=https://SEU-WORKER.workers.dev`

O site salvará essa URL no navegador sem salvar a chave.

## Próxima evolução
Depois que o backend estiver no ar, conectar os botões de:
- Canalização / Persona IA -> `/api/persona`
- Análise Profunda -> `/api/tarot`

A arquitetura do Worker já está pronta para os dois endpoints.
