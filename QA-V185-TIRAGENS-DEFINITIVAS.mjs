import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || '.');
const exists = file => fs.existsSync(path.join(root, file));
const read = file => exists(file) ? fs.readFileSync(path.join(root, file), 'utf8') : '';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, pattern) => (value.match(pattern) || []).length;
const checks = [];
const check = (name, pass, detail = '') => checks.push({ name, pass: Boolean(pass), ...(detail ? { detail: String(detail) } : {}) });
const syntax = file => { try { execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'ignore' }); return true; } catch { return false; } };
const freshImport = file => import(`${pathToFileURL(path.join(root, file)).href}?qa=${Date.now()}-${Math.random()}`);

const packageFiles = ['index.html','app.js','page-loader-v1.js','sw.js','spreads-policy.js','spread-synthesis.js','spreads-engine.js','tiragens-de-tarot.html','tiragens-definitivas-v185.css','TIRAGENS-DEFINITIVAS-V185.json','QA-V185-TIRAGENS-DEFINITIVAS.mjs','00-LEIA-PRIMEIRO-V185-TIRAGENS-DEFINITIVAS.txt','ARQUIVOS-V185-SHA256.txt'];
packageFiles.forEach(file => check(`arquivo:${file}`, exists(file)));
for (const file of ['app.js','page-loader-v1.js','sw.js','spreads-policy.js','spread-synthesis.js','spreads-engine.js','QA-V185-TIRAGENS-DEFINITIVAS.mjs']) check(`sintaxe:${file}`, exists(file) && syntax(file));

const index = read('index.html');
const app = read('app.js');
const loader = read('page-loader-v1.js');
const worker = read('sw.js');
const engine = read('spreads-engine.js');
const policySource = read('spreads-policy.js');
const synthesisSource = read('spread-synthesis.js');
const css = read('tiragens-definitivas-v185.css');
const publicPage = read('tiragens-de-tarot.html');
const tarotEngine = read('tarot-engine.js');
const editorial = read('tarot-editorial-policy.js');
const ritual = read('ritual-engine.js');
const libraryPolicy = read('card-library-policy.js');
const consultationPolicy = read('consultation-policy.js');
const consultationEngine = read('consultation-engine.js');
let contract = {};
try { contract = JSON.parse(read('TIRAGENS-DEFINITIVAS-V185.json')); check('contrato:json-válido', true); } catch { check('contrato:json-válido', false); }

check('ativação:app-v185', /app\.js\?v=185/.test(index));
check('ativação:loader-v185', /page-loader-v1\.js\?v=185/.test(app));
check('ativação:motor-v185', /spreads-engine\.js\?v=185/.test(loader));
check('ativação:política-v185', /spreads-policy\.js\?v=185/.test(engine));
check('ativação:síntese-v185', /spread-synthesis\.js\?v=185/.test(engine));
check('ativação:css-v185', /tiragens-definitivas-v185\.css\?v=185/.test(index));
check('ativação:seção-definitiva', /TIRAGENS DEFINITIVAS/.test(index));
check('ativação:15-métodos', /<b>15<\/b><small>métodos guiados/.test(index));
check('ativação:sw-v55', /divina-bruxa-v55-spreads-v185/.test(worker));

check('política:versão-3', /SPREAD_SCHEMA_VERSION = 3/.test(policySource));
check('política:cinco-filtros', count(policySource, /Object\.freeze\(\{ id: '(?:all|quick|themes|deep|author)'/g) === 5);
check('política:mesa-personalizada-1a12', /Math\.max\(1, Math\.min\(12/.test(policySource));
check('política:somente-direta', /value\?\.orientation !== 'normal'/.test(policySource));
check('política:sem-repetição', /new Set\(ids\)\.size !== ids\.length/.test(policySource));
check('política:ids-0a77', /id >= 0 && id < 78/.test(policySource));
check('política:premium-bloqueado-na-sessão', /target\.premium/.test(policySource));
check('política:pergunta-600', /value\.question\.slice\(0, 600\)/.test(policySource));

check('motor:aleatório-sem-viés', /const ceiling = Math\.floor\(0x100000000 \/ max\) \* max/.test(engine) && /while \(value\[0\] >= ceiling\)/.test(engine));
check('motor:fallback-aleatório', /Math\.floor\(Math\.random\(\) \* max\)/.test(engine));
check('motor:embaralha-78', /CARDS\.map\(card => card\.id\)/.test(engine));
check('motor:cinco-filtros-renderizados', /SPREAD_FILTERS\.map/.test(engine));
check('motor:faixa-retomada', /spread-resume-banner/.test(engine) && /data-spread="\$\{safe\(this\.session\.spreadId\)\}"/.test(engine));
check('motor:pergunta-privada', /Opcional e privada: fica somente neste aparelho/.test(engine));
check('motor:pergunta-não-vai-à-IA', /não envia sua pergunta automaticamente para a IA/.test(engine));
check('motor:revela-pela-orbe', /data-reveal-card/.test(engine) && /TOQUE PARA REVELAR/.test(engine));
check('motor:uma-posição-por-toque', /this\.session\.revealed \+= 1/.test(engine));
check('motor:orientação-direta', /orientation: 'normal'/.test(engine) && /DIRETA/.test(engine));
check('motor:seis-camadas-posição', ['Essência','Luz','Ponto de atenção','Conselho prático','Leitura responsável'].every(label => engine.includes(label)) && /contextualMeaning/.test(engine));
check('motor:link-biblioteca', /Abrir as 15 camadas desta carta na Biblioteca/.test(engine) && /cardPageHref\(card\)/.test(engine));
check('motor:síntese-contextual', /synthesizeSpread\(items, \{ question: this\.session\.question, tone: target\?\.tone \}\)/.test(engine));
for (const label of ['Escala','Padrões','Movimento','Ponte entre posições','Integração','LEITURA RESPONSÁVEL']) check(`motor:síntese:${label}`, engine.includes(label));
for (const metric of ['majorCount','courtCount','dominantElement','dominantSuit']) check(`motor:métrica:${metric}`, engine.includes(`synthesis.${metric}`));
check('motor:diário-profundo', /synthesis\.movement/.test(engine) && /synthesis\.bridge/.test(engine) && /synthesis\.action/.test(engine));
check('motor:consentimento-IA', /consentScope: 'single-spread'/.test(engine) && /Somente esta tiragem foi preparada/.test(engine));
check('motor:Mesa-Real-bloqueada', /permanece bloqueado até a validação segura da assinatura/.test(engine));
check('motor:consulta-separada', /Não é a consulta profissional/.test(engine));
check('motor:histórico-20', /slice\(0, 20\)/.test(engine));
check('motor:reabrir-histórico', /Reabrir leitura completa/.test(engine) && /Síntese preservada/.test(engine));
check('motor:favoritos', /data-favorite-history/.test(engine));
check('motor:etiquetas', /data-history-tags/.test(engine));
check('motor:exclusão-individual', /data-delete-history/.test(engine) && /data-confirm-delete/.test(engine));
check('motor:confirmação-exclusão', /Excluir esta tiragem somente deste aparelho/.test(engine));
check('motor:sem-vibração', !/navigator\??\.vibrate|\.vibrate\?\./.test(engine));

for (const layer of ['opening','pattern','movement','bridge','integration','action','responsibleNotice']) check(`síntese:campo:${layer}`, synthesisSource.includes(layer));
check('síntese:maiores', /majorCount/.test(synthesisSource));
check('síntese:corte', /courtCount/.test(synthesisSource));
check('síntese:número-repetido', /repeatedNumber/.test(synthesisSource));
check('síntese:não-é-sentença', /sem tratar a última carta como sentença/.test(synthesisSource));
check('síntese:ação-observável', /ação pequena, observável e possível/.test(synthesisSource));
for (const tone of ['love','money','career','spirituality']) check(`síntese:limite:${tone}`, synthesisSource.includes(`tone === '${tone}'`));
check('síntese:sem-destino', /não determina destino/.test(synthesisSource));

for (const marker of ['spread-filters','spread-resume-banner','spread-library-link','spread-synthesis-metrics','spread-history-details','spread-history-delete']) check(`css:${marker}`, css.includes(`.${marker}`));
check('css:toques-44', count(css, /min-height:44px/g) >= 3);
check('css:mobile', /@media\(max-width:760px\)/.test(css));
check('css:movimento-reduzido', /prefers-reduced-motion:reduce/.test(css));

check('página:doctype', /^<!doctype html>/i.test(publicPage));
check('página:pt-BR', /<html lang="pt-BR">/.test(publicPage));
check('página:canonical', /https:\/\/divinabruxa\.com\.br\/tiragens-de-tarot\.html/.test(publicPage));
check('página:data-v185', /"dateModified": "2026-09-07"/.test(publicPage));
check('página:15-tiragens', count(publicPage, /<li><span aria-hidden="true">/g) === 15);
check('página:Cruz-Celta-10', /10 posições[\s\S]{0,180}<h3>Cruz Celta<\/h3>/.test(publicPage));
check('página:Mesa-Real-78', /78 posições[\s\S]{0,180}<h3>Mesa Real<\/h3>/.test(publicPage));
check('página:síntese-ampliada', /síntese reúne escala, naipes, elementos, cartas da corte, movimento/.test(publicPage));
check('página:histórico-reabre', /podem ser reabertas no histórico local/.test(publicPage));
check('página:limite-responsável', /não comprova pensamentos secretos, intenções alheias ou acontecimentos inevitáveis/.test(publicPage));

const core = worker.match(/const CORE=\[([\s\S]*?)\];/)?.[1] || '';
for (const file of ['spreads-engine.js','spreads-policy.js','spread-synthesis.js','tiragens-definitivas-v185.css','ai-policy.js','journal-policy.js','tiragens-de-tarot.html','tarot-data.js','tarot-meanings.js']) check(`offline:núcleo:${file}`, core.includes(`'./${file}'`));
check('offline:instalação-atômica', /Promise\.allSettled\(CORE\.map/.test(worker) && /if\(coreFailures\.length\)throw/.test(worker));
check('offline:não-pré-carrega-78-artes', !/\.\/card-00\.webp/.test(core));

await freshImport('tarot-meanings.js');
const [spreadPolicy, { synthesizeSpread }, { CARDS }, tarotSession, dailyPolicy, library] = await Promise.all([
  freshImport('spreads-policy.js'), freshImport('spread-synthesis.js'), freshImport('tarot-data.js'), freshImport('tarot-session.js'), freshImport('daily-policy.js'), freshImport('card-library-policy.js')
]);
check('dados:15-métodos', spreadPolicy.SPREADS.length === 15, spreadPolicy.SPREADS.length);
const expectedFilters = { all: 15, quick: 5, themes: 5, deep: 3, author: 2 };
for (const [id, amount] of Object.entries(expectedFilters)) check(`dados:filtro-${id}-${amount}`, spreadPolicy.spreadsForFilter(id).length === amount);
check('dados:uma-carta-1', spreadPolicy.spreadById('direct-question').positions.length === 1);
check('dados:Cruz-Celta-10', spreadPolicy.spreadById('celtic-cross').positions.length === 10);
check('dados:Árvore-10', spreadPolicy.spreadById('tree-of-life').positions.length === 10);
check('dados:Mandala-12', spreadPolicy.spreadById('astrological-mandala').positions.length === 12);
check('dados:Mesa-Real-78', spreadPolicy.spreadById('royal-table').positions.length === 78);
check('dados:Mesa-Real-Premium', spreadPolicy.spreadById('royal-table').premium === true);
for (const amount of [1,5,12]) check(`dados:personalizada-${amount}`, spreadPolicy.positionsForSpread(spreadPolicy.spreadById('custom-table'), amount).length === amount);
check('dados:personalizada-limite-inferior', spreadPolicy.positionsForSpread(spreadPolicy.spreadById('custom-table'), -2).length === 1);
check('dados:personalizada-limite-superior', spreadPolicy.positionsForSpread(spreadPolicy.spreadById('custom-table'), 99).length === 12);

for (const target of spreadPolicy.SPREADS.filter(item => !item.premium)) {
  const positions = spreadPolicy.positionsForSpread(target, target.custom ? 5 : undefined);
  const state = spreadPolicy.normalizeSpreadSession({ spreadId: target.id, cardIds: positions.map((_, index) => index), positions, revealed: positions.length, activeIndex: positions.length - 1, question: 'Como agir?', orientation: 'normal', createdAt: '2026-09-07T00:00:00.000Z', updatedAt: '2026-09-07T00:00:00.000Z', revision: 2 });
  check(`sessão:${target.id}:válida`, Boolean(state));
  check(`sessão:${target.id}:migra-v3`, state?.revision === 3);
  check(`sessão:${target.id}:sem-repetição`, new Set(state?.cardIds || []).size === positions.length);
  const items = positions.map((position, index) => ({ position, card: CARDS[index] }));
  const result = synthesizeSpread(items, { question: state.question, tone: target.tone });
  check(`síntese:${target.id}:sete-camadas`, ['opening','pattern','movement','bridge','integration','action','responsibleNotice'].every(key => typeof result[key] === 'string' && result[key].length > 30));
}
check('sessão:rejeita-invertida', !spreadPolicy.normalizeSpreadSession({ spreadId: 'direct-question', cardIds: [0], orientation: 'reversed' }));
check('sessão:rejeita-duplicada', !spreadPolicy.normalizeSpreadSession({ spreadId: 'past-present-tendency', cardIds: [1,1,2], orientation: 'normal' }));
check('sessão:rejeita-premium-sem-direito', !spreadPolicy.normalizeSpreadSession({ spreadId: 'royal-table', cardIds: Array.from({length:78},(_,i)=>i), orientation: 'normal' }));

check('tarot:78-catálogo', CARDS.length === 78);
check('tarot:todas-diretas', CARDS.every(card => card.orientation === 'normal'));
let tarotState = tarotSession.createTarotState({ randomInt: max => max - 1, now: () => 1, sessionId: 'qa-v185' });
const draws = [];
for (let index = 0; index < 78; index += 1) { const draw = tarotSession.drawNextCard(tarotState, { now: () => index + 2 }); tarotState = draw.state; draws.push(draw.cardId); }
check('tarot:78-reveladas', draws.length === 78);
check('tarot:sem-repetição', new Set(draws).size === 78);
check('tarot:Mesa-13x6', /aria-rowcount="13" aria-colcount="6"/.test(index) && /Math\.floor\(index \/ 6\)/.test(tarotEngine));
check('tarot:sem-significados', /automaticMeanings: false/.test(editorial) && !/meaning-engine|tarot-meanings/.test(tarotEngine));
check('tarot:sem-vibração', !/navigator\??\.vibrate|\.vibrate\?\./.test(tarotEngine));

check('diária:Brasília', dailyPolicy.DAILY_TIME_ZONE === 'America/Sao_Paulo');
check('diária:uma-de-78', dailyPolicy.DAILY_CARD_COUNT === 78 && dailyPolicy.createDailyRecord('', new Date('2026-09-07T12:00:00Z')).orientation === 'normal');
check('diária:14-seções', ['ENERGIA DO DIA','ESSÊNCIA','LUZ','TENSÃO','AMOR','RELACIONAMENTOS','CARREIRA','DINHEIRO','ESPIRITUALIDADE','CONSELHO','SÍMBOLOS','PERGUNTA PARA O DIA','AÇÃO POSSÍVEL','LEITURA RESPONSÁVEL'].every(title => ritual.includes(title)));
check('biblioteca:busca-sem-acento', /normalize\('NFD'\)/.test(libraryPolicy));
check('biblioteca:três-idiomas', ['ptBR','en','es'].every(key => libraryPolicy.includes(`card.names?.${key}`)));
check('biblioteca:comparação-privada', /LIBRARY_COMPARE_LIMIT = 2/.test(libraryPolicy) && !/localStorage|sessionStorage/.test(read('card-library-engine.js')));
for (const price of [25000,15000,10000,5000]) check(`consultas:preço-${price}`, consultationPolicy.includes(`priceCents:${price}`));
check('consultas:e-mail-obrigatório', /name="email" type="email"[\s\S]{0,80}required/.test(consultationEngine));
check('consultas:sem-cobrança', /Nenhuma cobrança automática foi realizada/.test(consultationEngine));

check('contrato:versão', contract.schemaVersion === '185.0.0');
check('contrato:macroetapa-7', contract.macroStage === 7);
check('contrato:15', contract.catalog?.methods === 15);
check('contrato:14-sem-billing', contract.catalog?.availableWithoutBilling === 14);
check('contrato:diretas', contract.reading?.orientation === 'upright-only');
check('contrato:revelação-Orbe', contract.reading?.revealOnlyByOrb === true);
check('contrato:síntese-7', contract.synthesis?.layers?.length === 7);
check('contrato:retomada', contract.continuity?.activeSessionResume === true && contract.continuity?.completedReadingCanReopen === true);
check('contrato:premium-bloqueado', contract.premiumBoundary?.royalTableRemainsLocked === true && contract.premiumBoundary?.automaticBillingActivated === false);
check('contrato:visual-preservado', Object.entries(contract.visualSafeguards || {}).every(([key,value]) => key === 'homeCompositionChanged' || key.endsWith('Changed') ? value === false : true));
check('contrato:13-arquivos', contract.installation?.filesInPackage === 13 && packageFiles.length === 13);
check('contrato:8-substituir', contract.installation?.replace?.length === 8);
check('contrato:5-adicionar', contract.installation?.add?.length === 5);

const manifest = read('ARQUIVOS-V185-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
if (manifest.length) {
  check('hash:12-entradas', manifest.length === 12, manifest.length);
  for (const line of manifest) {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    check(`hash:formato:${line.slice(-32)}`, Boolean(match));
    if (match) check(`hash:arquivo:${match[2]}`, exists(match[2]) && sha(fs.readFileSync(path.join(root, match[2]))) === match[1]);
  }
} else check('hash:manifesto-presente', false);

const failed = checks.filter(item => !item.pass);
console.log(JSON.stringify({ suite: 'DIVINA-BRUXA-V185-TIRAGENS-DEFINITIVAS', status: failed.length ? 'FAIL' : 'PASS', root, total: checks.length, passed: checks.length - failed.length, failed }, null, 2));
if (failed.length) process.exitCode = 1;
