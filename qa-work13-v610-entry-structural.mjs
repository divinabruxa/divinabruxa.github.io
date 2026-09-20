import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html, app, sw, js, css, orchestra] = await Promise.all([
  read('./index.html'), read('./app-v208.js'), read('./sw.js'),
  read('./cosmos-entry-intention-v610.js'), read('./cosmos-entry-intention-v610.css'),
  read('./cosmos-final-orchestra-v610.js')
]);
let checks = 0;
const ok = (condition, message) => { assert.ok(condition, message); checks += 1; };
const count = (source, pattern) => (source.match(pattern) || []).length;

ok(count(html, /id="orb"/g) === 1, 'uma Orbe física');
ok(count(html, /id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html, /id="cosmosEntryIntent"/g) === 1, 'uma intenção de entrada');
ok(count(html, /<span>Entrá<\/span>/g) === 1, 'texto exato Entrá');
ok(/<div class="orb-stage-ref">[\s\S]*id="orb"[\s\S]*id="cosmosEntryIntent"[\s\S]*<\/div>/.test(html), 'convite junto da Orbe');
ok(html.includes('aria-label="Entrar no universo"'), 'nome acessível');
ok(html.includes('aria-controls="divinaOrbitalMenuV502"'), 'controle do menu vivo');
ok(html.includes('name="divina-work13-correction" content="V610-ENTRADA"'), 'correção dentro do V610');
ok(html.includes('cosmos-entry-intention-v610.css?v=610-work13-entry'), 'estilo ligado');
ok(html.includes('app-v208.js?v=610-work13-entry'), 'aplicação ligada');
ok(html.includes("./sw.js?v=610-entry"), 'worker ligado');

ok(app.includes("createCosmosEntryIntentionV610"), 'controlador importado');
ok(app.includes('continuity:finalContinuity'), 'continuidade V598 reutilizada');
ok(app.includes('orbCore:supremeOrb'), 'Orbe Suprema reutilizada');
ok(app.includes('menuResolver:() => globalThis.divinaMenuV502'), 'menu V593 reutilizado');
ok(app.includes('window.orbe.entryIntention = cosmosEntryIntention'), 'entrada publicada');
ok(app.includes("invitation:'Entrá'"), 'contrato da aplicação');
ok(app.includes('work14:false'), 'nenhum WORK14');

ok(js.includes('COSMOS_ENTRY_INTENTION_CONTRACT_V610'), 'contrato dedicado');
ok(js.includes("invitation:'Entrá'"), 'convite único');
ok(js.includes('entryIntentions:1'), 'somente uma intenção');
ok(js.includes('reusesCanonicalOrb:true'), 'Orbe canônica');
ok(js.includes('reusesLivingMenuV593:true'), 'menu vivo preservado');
ok(js.includes("this.continuity?.callUniverse?.(source)"), 'abertura pela continuidade');
ok(js.includes("this.orbCore?.pulse?.('work13-entry-response'"), 'resposta imediata');
ok(js.includes("root.querySelectorAll('[data-v502-route]')"), 'destinos reais do V593');
ok(!/createElement|requestAnimationFrame|setInterval|setTimeout|MutationObserver/.test(js), 'sem DOM dinâmico ou loops');
ok(!/\.navigate\s*\(|\bgo\s*\(/.test(js), 'sem novo roteador');

const names = ['Tarot Livre','Carta do Dia','Tiragens','Biblioteca','Escola','Diário','Orbe IA','Consultas','Loja','Skins','Música','Vídeos','Premium','Conta','Notificações'];
for (const name of names) ok(js.includes(`:'${name}'`), `nome público: ${name}`);

ok(css.includes('background:transparent'), 'não é caixa');
ok(css.includes('border:0'), 'não é botão comum');
ok(css.includes('min-height:48px'), 'alvo de toque confortável');
ok(css.includes('.db502-portal__verb'), 'verbos explicativos ocultos');
ok(css.includes('.db502-menu__intention'), 'instrução do menu oculta');
ok(css.includes('@media(max-width:430px)'), 'iPhone retrato');
ok(css.includes('@media(max-height:620px) and (orientation:landscape)'), 'iPhone paisagem');
ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido');
ok(!/@keyframes|backdrop-filter|filter\s*:/.test(css), 'sem efeito pesado');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core, /^\s*'\.\//gm) === 43, '43 ativos centrais');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v610-entry'"), 'cache isolado da correção');
ok(sw.includes('DIVINA_WORK13_ENTRY_ACTIVE'), 'ativação comunicada');
ok(sw.includes('COSMOS_ENTRY_INTENTION_CONTRACT_V610'), 'worker valida contrato');
ok(sw.includes('cosmos-entry-intention-v610.css?v=610-work13-entry'), 'worker inclui estilo');

const hash = createHash('sha256').update(orchestra).digest('hex');
ok(hash === 'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0', 'orquestra V610 protegida byte a byte');

console.log(`PASS ${checks}/${checks} — estrutura da Entrada da Orbe V610`);
