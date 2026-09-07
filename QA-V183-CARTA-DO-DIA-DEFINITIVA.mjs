import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || '.');
const exists = file => fs.existsSync(path.join(root, file));
const read = file => exists(file) ? fs.readFileSync(path.join(root, file), 'utf8') : '';
const bytes = file => exists(file) ? fs.readFileSync(path.join(root, file)) : Buffer.alloc(0);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, pattern) => (value.match(pattern) || []).length;
const checks = [];
const check = (name, condition, detail = '') => checks.push({ name, pass: Boolean(condition), ...(detail ? { detail: String(detail) } : {}) });
const syntax = file => {
  try { execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'ignore' }); return true; }
  catch { return false; }
};
const freshImport = file => import(`${pathToFileURL(path.join(root, file)).href}?qa=${Date.now()}-${Math.random()}`);

const packageFiles = [
  'index.html',
  'app.js',
  'page-loader-v1.js',
  'sw.js',
  'daily-policy.js',
  'daily-meaning-runtime.js',
  'ritual-engine.js',
  'carta-do-dia.html',
  'CARTA-DO-DIA-DEFINITIVA-V183.json',
  'QA-V183-CARTA-DO-DIA-DEFINITIVA.mjs',
  '00-LEIA-PRIMEIRO-V183-CARTA-DO-DIA-DEFINITIVA.txt',
  'ARQUIVOS-V183-SHA256.txt'
];
packageFiles.forEach(file => check(`arquivo:${file}`, exists(file)));

for (const file of ['app.js','page-loader-v1.js','sw.js','daily-policy.js','daily-meaning-runtime.js','ritual-engine.js','QA-V183-CARTA-DO-DIA-DEFINITIVA.mjs']) {
  check(`sintaxe:${file}`, exists(file) && syntax(file));
}

const index = read('index.html');
const app = read('app.js');
const loader = read('page-loader-v1.js');
const worker = read('sw.js');
const policySource = read('daily-policy.js');
const meaningSource = read('daily-meaning-runtime.js');
const ritualSource = read('ritual-engine.js');
const dailyPage = read('carta-do-dia.html');
let contract = {};
try { contract = JSON.parse(read('CARTA-DO-DIA-DEFINITIVA-V183.json')); check('contrato:json-válido', true); }
catch { check('contrato:json-válido', false); }

check('ativação:app-v183', /app\.js\?v=183/.test(index));
check('ativação:sw-v183', /sw\.js\?v=183/.test(index));
check('ativação:chave-recarga-v183', count(index, /divina\.sw\.reload\.v183/g) === 2);
check('ativação:loader-v183', /page-loader-v1\.js\?v=183/.test(app));
check('ativação:ritual-v183-duas-rotas', count(loader, /ritual-engine\.js\?v=183/g) === 2);
check('ativação:auth-passado-ao-loader', /createPageLoader\(\{ config: CONFIG, go, authClient \}\)/.test(app));
check('ativação:auth-passado-ao-ritual', /new DailyRitual\(\$\('#dailyCard'\), remember, \{ authClient \}\)/.test(loader));
check('ativação:auth-existe-antes-do-loader', app.indexOf('const authClient =') < app.indexOf('createPageLoader('));
check('ativação:lead-mesmo-aparelho', /permanece a mesma em qualquer aparelho/.test(index));

check('política:fuso-oficial', /DAILY_TIME_ZONE = 'America\/Sao_Paulo'/.test(policySource));
check('política:78-cartas', /DAILY_CARD_COUNT = 78/.test(policySource));
check('política:versão-v183', /DAILY_SELECTION_VERSION = 'deterministic-v183'/.test(policySource));
check('política:sem-aleatoriedade', !/getRandomValues|Math\.random|secureCardIndex/.test(policySource));
check('política:intenção-fora-da-seleção', !/dailyCardIndex\([^)]*intention/.test(policySource));
check('política:identificador-reduzido', /stableDailyDigest\(`divina-bruxa:\$\{raw\}:v183`\)/.test(policySource));
check('política:identificador-bruto-não-gravado', !/identityRaw|accountIdentifier:|userId: identifier/.test(policySource));
check('política:valida-adulteração', /dailyCardIndex\(value\.date, \{ scope: value\.identityScope, digest: value\.identityDigest \}\) !== value\.id/.test(policySource));
check('política:limite-intenção-120', /DAILY_MAX_INTENTION_LENGTH = 120/.test(policySource));
check('política:limite-de-Brasília', /nextBrasiliaBoundary/.test(policySource));

check('ritual:cinco-estados', ['Ready','Intention','Revealing','Revealed','Error'].every(state => ritualSource.includes(`'${state}'`)));
check('ritual:estado-exposto', /root\.dataset\.dailyState = state/.test(ritualSource));
check('ritual:aria-busy', /setAttribute\('aria-busy', 'true'\)/.test(ritualSource) && /removeAttribute\('aria-busy'\)/.test(ritualSource));
check('ritual:etapas-anunciadas', ['Etapa 1 de 3','Etapa 2 de 3','Etapa 3 de 3'].every(text => ritualSource.includes(text)));
check('ritual:label-visível', /<label for="dailyIntention">Sua intenção opcional<\/label>/.test(ritualSource));
check('ritual:status-ao-vivo', /role="status" aria-live="polite"/.test(ritualSource));
check('ritual:orientação-no-alt', /alt: `\$\{card\.name\}, direta`/.test(ritualSource));
check('ritual:sempre-direta', /card\.orientation !== 'normal'/.test(ritualSource) && /SUA CARTA DO DIA · DIRETA/.test(ritualSource));
check('ritual:sem-vibração-web', !/navigator\??\.vibrate|\.vibrate\?\./.test(ritualSource));
check('ritual:offline-não-bloqueia', !/navigator\.onLine === false[\s\S]{0,260}(?:return|espera pela conexão)/.test(ritualSource));
check('ritual:offline-declarado', /O ritual funciona também offline/.test(ritualSource));
check('ritual:chave-prefixada-corrigida', /event\.key\?\.endsWith\(DAILY_STORAGE_EVENT_SUFFIX\)/.test(ritualSource));
check('ritual:memória-da-aba', /this\.memoryRecord/.test(ritualSource));
check('ritual:gravação-protegida', /try \{ store\.set\(DAILY_STORAGE_KEY, record\); persisted = true; \} catch \{ persisted = false; \}/.test(ritualSource));
check('ritual:aviso-de-persistência', /continua nesta aba/.test(ritualSource));
check('ritual:concorrência-bloqueada', /if \(this\.drawing\) return null/.test(ritualSource));
check('ritual:registro-existente-primeiro', ritualSource.indexOf('const existing = this.readRecord()') < ritualSource.indexOf('createDailyRecord(intention'));
check('ritual:registro-concorrente-primeiro', /const concurrent = this\.readRecord\(record\.date\)/.test(ritualSource) && /this\.data = concurrent \|\| record/.test(ritualSource));
check('ritual:virada-automática', /nextBrasiliaBoundary\(\)/.test(ritualSource) && /this\.refreshCycle\(\)/.test(ritualSource));
check('ritual:visibilidade-atualiza', /visibilityState === 'visible'/.test(ritualSource));
check('ritual:limpeza-de-eventos', /destroy\(\)/.test(ritualSource) && /removeEventListener\?\.\('storage'/.test(ritualSource));
check('ritual:intenção-privada', /Esta intenção permanece somente neste dispositivo/.test(ritualSource));
check('ritual:intenção-escapada', /Sua intenção privada · \$\{safe\(this\.data\.intention\)\}/.test(ritualSource));
check('ritual:legado-preservado', /foi preservada neste aparelho até o fim do ciclo atual/.test(ritualSource));
check('ritual:conta-estável', /seleção desta conta permanece estável em outros aparelhos conectados/.test(ritualSource));
check('ritual:coletivo-estável', /seleção coletiva pela data permanece igual em qualquer aparelho/.test(ritualSource));

for (const title of ['ENERGIA DO DIA','ESSÊNCIA','LUZ','TENSÃO','AMOR','RELACIONAMENTOS','CARREIRA','DINHEIRO','ESPIRITUALIDADE','CONSELHO','SÍMBOLOS','PERGUNTA PARA O DIA','AÇÃO POSSÍVEL','LEITURA RESPONSÁVEL']) {
  check(`conteúdo:seção:${title}`, ritualSource.includes(title));
}
check('conteúdo:resolve-id-canônico-e-slug', /\[card\.canonicalId, String\(card\.canonicalId \|\| ''\)\.replace\(\/\^\\d\{2\}-\//.test(meaningSource));
check('conteúdo:fonte-v183', /tarot-meanings\.js\?v=183/.test(meaningSource));
check('conteúdo:energia-diária', /dailyEnergy: deep\.dailyEnergy/.test(meaningSource));
check('conteúdo:aviso-responsável', /responsibleNotice: deep\.responsibleNotice/.test(meaningSource));
check('conteúdo:fallback-responsável', /nunca como diagnóstico, garantia/.test(meaningSource));
check('conteúdo:diário-recebe-ação', /Ação possível: \$\{meaning\.action\}/.test(ritualSource));
check('conteúdo:diário-sempre-direta', /type: 'daily', orientation: 'normal'/.test(ritualSource));
check('conteúdo:confirmação-do-diário', /Guardada no Diário/.test(ritualSource));

check('página:doctype', /^<!doctype html>/i.test(dailyPage));
check('página:idioma', /<html lang="pt-BR">/.test(dailyPage));
check('página:viewport', /name="viewport"/.test(dailyPage));
check('página:canonical', /https:\/\/divinabruxa\.com\.br\/carta-do-dia\.html/.test(dailyPage));
check('página:robots', /index,follow,max-image-preview:large/.test(dailyPage));
check('página:um-h1', count(dailyPage, /<h1\b/g) === 1);
check('página:data-revisada', /"dateModified": "2026-09-07"/.test(dailyPage));
check('página:mesma-em-aparelhos', /A mesma carta em qualquer aparelho/.test(dailyPage));
check('página:intenção-privada', /intenção continua privada neste aparelho/.test(dailyPage));
check('página:método-transparente', /seleção é calculada localmente a partir da data de Brasília/.test(dailyPage));
check('página:não-prova-destino', /não é apresentado como prova de destino/.test(dailyPage));
check('página:sempre-direta', /A carta é sempre direta/.test(dailyPage));
check('página:abre-aplicativo', count(dailyPage, /href="\.\/#daily"/g) >= 2);
check('página:imagem-reservada', /carta-dia-santuario-lunar-v1\.webp" width="864" height="1821"/.test(dailyPage));
check('página:limite-responsável', /não prevê um destino fixo/.test(dailyPage) && /saúde, segurança, direito ou finanças/.test(dailyPage));
const dailyJsonLd = dailyPage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '';
try { JSON.parse(dailyJsonLd); check('página:jsonld-válido', true); } catch { check('página:jsonld-válido', false); }

check('offline:cache-v53', /divina-bruxa-v53-daily-v183/.test(worker));
const core = worker.match(/const CORE=\[([\s\S]*?)\];/)?.[1] || '';
for (const file of contract.offline?.coreAssets || []) check(`offline:núcleo:${file}`, core.includes(`'./${file}'`));
check('offline:instalação-atômica', /Promise\.allSettled\(CORE\.map/.test(worker) && /if\(coreFailures\.length\)throw/.test(worker));
check('offline:assume-controle', /self\.skipWaiting\(\)/.test(worker) && /self\.clients\.claim\(\)/.test(worker));
check('offline:fallback-de-navegação', /caches\.match\('\.\/offline\.html'\)/.test(worker));
check('offline:não-baixa-78-artes', !/\.\/card-00\.webp/.test(core));

check('contrato:versão', contract.schemaVersion === '183.0.0');
check('contrato:macroetapa-5', contract.macroStage === 5);
check('contrato:fuso', contract.dailyCycle?.timeZone === 'America/Sao_Paulo');
check('contrato:uma-carta', contract.dailyCycle?.cardsPerCycle === 1);
check('contrato:78-cartas', contract.dailyCycle?.catalogCards === 78);
check('contrato:direta', contract.dailyCycle?.orientation === 'upright-only');
check('contrato:mesmo-ciclo', contract.dailyCycle?.sameCycleSameCard === true);
check('contrato:78-dias', contract.dailyCycle?.fullDeckRotationDays === 78);
check('contrato:legado', contract.dailyCycle?.legacySameDayRecordPreserved === true);
check('contrato:não-destino', contract.dailyCycle?.selectionClaimedAsProofOfFate === false);
check('contrato:intenção-local', contract.privacy?.intentionStoredLocallyOnly === true);
check('contrato:intenção-não-escolhe', contract.privacy?.intentionAffectsCardSelection === false);
check('contrato:sem-id-bruto', contract.privacy?.rawAccountIdentifierStoredWithReading === false);
check('contrato:78-profundas', contract.content?.cardsWithDeepContent === 78);
check('contrato:14-seções', contract.content?.sections?.length === 14);
check('contrato:menores-profundos', contract.content?.minorArcanaUseReducedFallback === false);
check('contrato:offline-novo-ritual', contract.offline?.newRitualAllowed === true);
check('contrato:cinco-estados', contract.interactionStates?.join(',') === 'Ready,Intention,Revealing,Revealed,Error');
check('contrato:visual-preservado', contract.visualSafeguards?.homeCompositionChanged === false && contract.visualSafeguards?.orbArtworkChanged === false && contract.visualSafeguards?.dailySanctuaryArtworkChanged === false);
check('contrato:12-arquivos', contract.installation?.filesInPackage === 12);
check('contrato:8-substituir', contract.installation?.replace?.length === 8);
check('contrato:4-adicionar', contract.installation?.add?.length === 4);
check('contrato:não-apagar', contract.installation?.deleteOtherFiles === false);
check('contrato:tarot-protegido', contract.protectedAreas?.tarotLivreFunctionalCodeChanged === false && contract.protectedAreas?.tarotLivreCards === 78 && contract.protectedAreas?.tarotLivreRepeats === false);
check('contrato:preços', contract.protectedAreas?.consultationPricesBrl?.join(',') === '250,150,100,50');
check('contrato:cobrança-desligada', contract.protectedAreas?.realBillingEnabled === false);
check('contrato:próxima-macroetapa', contract.nextMacroStage === 6 && /Biblioteca universal/.test(contract.nextObjective || ''));

const dailyPolicy = exists('daily-policy.js') ? await freshImport('daily-policy.js') : null;
if (dailyPolicy) {
  check('tempo:antes-da-meia-noite', dailyPolicy.brasiliaDate(new Date('2026-09-08T02:59:59.000Z')) === '2026-09-07');
  check('tempo:depois-da-meia-noite', dailyPolicy.brasiliaDate(new Date('2026-09-08T03:00:00.000Z')) === '2026-09-08');
  const boundary = dailyPolicy.nextBrasiliaBoundary(new Date('2026-09-07T20:00:00.000Z'));
  check('tempo:próxima-meia-noite', Math.abs(boundary.getTime() - Date.parse('2026-09-08T03:00:00.000Z')) <= 1000, boundary.toISOString());
  const nextBoundary = dailyPolicy.nextBrasiliaBoundary(new Date('2026-09-08T03:00:00.000Z'));
  check('tempo:novo-ciclo-seguinte', Math.abs(nextBoundary.getTime() - Date.parse('2026-09-09T03:00:00.000Z')) <= 1000, nextBoundary.toISOString());

  const collective = dailyPolicy.collectiveDailyIdentity();
  check('seleção:identidade-coletiva', collective.scope === 'collective' && /^[a-f0-9]{8}$/.test(collective.digest));
  const first = dailyPolicy.createDailyRecord('  minha   intenção  ', new Date('2026-09-07T12:00:00.000Z'), collective);
  const second = dailyPolicy.createDailyRecord('outra intenção', new Date('2026-09-07T23:59:00.000Z'), collective);
  check('seleção:mesmo-dia-mesma-carta', first.id === second.id);
  check('seleção:intenção-não-muda-carta', first.intention !== second.intention && first.id === second.id);
  check('seleção:normaliza-intenção', first.intention === 'minha intenção');
  check('seleção:registro-direto', first.orientation === 'normal' && first.reversed === false);
  check('seleção:registro-v183', first.schemaVersion === '10.0.0' && first.selectionVersion === 'deterministic-v183');
  check('seleção:registro-válido', dailyPolicy.isDailyRecord(first, '2026-09-07'));
  check('seleção:outro-dia-inválido', !dailyPolicy.isDailyRecord(first, '2026-09-08'));
  check('seleção:invertida-rejeitada', !dailyPolicy.isDailyRecord({ ...first, reversed: true }, first.date));
  check('seleção:orientação-reversa-rejeitada', !dailyPolicy.isDailyRecord({ ...first, orientation: 'reversed' }, first.date));
  check('seleção:fuso-adulterado-rejeitado', !dailyPolicy.isDailyRecord({ ...first, timeZone: 'UTC' }, first.date));
  check('seleção:id-adulterado-rejeitado', !dailyPolicy.isDailyRecord({ ...first, id: (first.id + 1) % 78 }, first.date));
  const legacy = { date: '2026-09-07', id: 17, reversed: false, intention: '', revealedAt: '2026-09-07T12:00:00.000Z', timeZone: 'America/Sao_Paulo', schemaVersion: '5.0.1' };
  check('seleção:legado-do-dia-aceito', dailyPolicy.isDailyRecord(legacy, legacy.date));
  check('seleção:intenção-limitada', dailyPolicy.normalizeDailyIntention('x'.repeat(300)).length === 120);
  check('seleção:espaços-normalizados', dailyPolicy.normalizeDailyIntention(' a\n\t b   c ') === 'a b c');

  const disabledIdentity = await dailyPolicy.resolveDailyIdentity({ enabled: false });
  const accountA = await dailyPolicy.resolveDailyIdentity({ enabled: true, account: async () => ({ ok: true, body: { user: { id: 'conta-segura-123' } } }) });
  const accountB = await dailyPolicy.resolveDailyIdentity({ enabled: true, account: async () => ({ ok: true, body: { id: 'conta-segura-123' } }) });
  const accountFailure = await dailyPolicy.resolveDailyIdentity({ enabled: true, account: async () => { throw new Error('offline'); } });
  check('seleção:sem-conta-é-coletiva', disabledIdentity.scope === 'collective');
  check('seleção:mesma-conta-mesmo-digest', accountA.scope === 'account' && accountA.digest === accountB.digest);
  check('seleção:falha-segura-é-coletiva', accountFailure.scope === 'collective');
  const accountRecordA = dailyPolicy.createDailyRecord('primeira', new Date('2026-09-07T13:00:00.000Z'), accountA);
  const accountRecordB = dailyPolicy.createDailyRecord('segunda', new Date('2026-09-07T18:00:00.000Z'), accountB);
  check('seleção:conta-entre-aparelhos', accountRecordA.id === accountRecordB.id);
  check('seleção:não-grava-id-bruto', !JSON.stringify(accountRecordA).includes('conta-segura-123'));

  let rotationPass = true;
  const distribution = new Map();
  for (let cycle = 0; cycle < 10; cycle += 1) {
    const cards = [];
    for (let offset = 0; offset < 78; offset += 1) {
      const date = new Date(Date.UTC(2030, 0, 1 + cycle * 78 + offset, 15)).toISOString().slice(0, 10);
      const id = dailyPolicy.dailyCardIndex(date, collective);
      cards.push(id);
      distribution.set(id, (distribution.get(id) || 0) + 1);
    }
    if (new Set(cards).size !== 78 || cards.some(id => id < 0 || id >= 78)) rotationPass = false;
  }
  check('seleção:dez-ciclos-completos', rotationPass);
  check('seleção:distribuição-equilibrada', distribution.size === 78 && [...distribution.values()].every(total => total === 10));
  check('seleção:dias-consecutivos-distintos', first.id !== dailyPolicy.createDailyRecord('', new Date('2026-09-08T12:00:00.000Z'), collective).id);
  for (const invalid of ['2026-02-31','2026-13-01','2026-00-10','não-é-data']) {
    let rejected = false;
    try { dailyPolicy.dailyCardIndex(invalid, collective); } catch { rejected = true; }
    check(`seleção:data-inválida:${invalid}`, rejected);
  }
}

const fullProject = exists('tarot-data.js') && exists('tarot-meanings.js') && exists('tarot-session.js') && exists('consultation-policy.js');
if (fullProject) {
  const [{ CARDS, REQUIRED_ORIENTATION }, { dailyMeaning }, sessionModule, consultationModule] = await Promise.all([
    freshImport('tarot-data.js'),
    freshImport('daily-meaning-runtime.js'),
    freshImport('tarot-session.js'),
    freshImport('consultation-policy.js')
  ]);
  check('catálogo:78-cartas', CARDS.length === 78);
  check('catálogo:78-identidades', new Set(CARDS.map(card => card.canonicalId)).size === 78);
  check('catálogo:todas-diretas', REQUIRED_ORIENTATION === 'normal' && CARDS.every(card => card.orientation === 'normal'));
  const requiredText = ['dailyEnergy','essence','light','tension','love','relationships','career','money','spirituality','advice','reflectionQuestion','action','responsibleNotice'];
  let deepPass = true;
  let symbolPass = true;
  let keywordPass = true;
  let allNormal = true;
  const essences = new Set();
  const actions = new Set();
  for (const card of CARDS) {
    const meaning = dailyMeaning(card);
    if (!requiredText.every(field => typeof meaning[field] === 'string' && meaning[field].trim().length > 40)) deepPass = false;
    if (!Array.isArray(meaning.symbols) || meaning.symbols.length < 3) symbolPass = false;
    if (!Array.isArray(meaning.keywords) || meaning.keywords.length < 3) keywordPass = false;
    if (card.orientation !== 'normal') allNormal = false;
    essences.add(meaning.essence);
    actions.add(meaning.action);
  }
  check('conteúdo:78-cartas-profundas', deepPass);
  check('conteúdo:78-cartas-com-símbolos', symbolPass);
  check('conteúdo:78-cartas-com-palavras-chave', keywordPass);
  check('conteúdo:78-cartas-diretas', allNormal);
  check('conteúdo:78-essências-próprias', essences.size === 78, essences.size);
  check('conteúdo:78-ações-próprias', actions.size === 78, actions.size);
  const minorDeep = CARDS.slice(22).every(card => dailyMeaning(card).symbols.length >= 3 && dailyMeaning(card).dailyEnergy.length > 40);
  check('conteúdo:56-menores-sem-fallback-reduzido', minorDeep);
  const words = read('tarot-meanings.js').split(/\s+/).filter(Boolean).length;
  check('conteúdo:base-substancial', words > 60000, words);

  let tarotState = sessionModule.createTarotState({ sessionId: 'qa-v183-protected' });
  const tarotCards = [];
  while (!tarotState.completed) { const result = sessionModule.drawNextCard(tarotState); tarotCards.push(result.cardId); tarotState = result.state; }
  check('proteção:tarot-78-sem-repetição', tarotCards.length === 78 && new Set(tarotCards).size === 78);
  const tarotEngine = read('tarot-engine.js');
  check('proteção:tarot-orbe-única', count(tarotEngine, /this\.draw\(\)/g) === 1 && /this\.orb\.addEventListener\('click', \(\) => this\.draw\(\)\)/.test(tarotEngine));
  check('proteção:tarot-sem-significados', !/(meaning-engine|tarot-meanings)/.test(tarotEngine));
  check('proteção:tarot-sem-vibração', !/navigator\??\.vibrate|\.vibrate\?\./.test(tarotEngine));
  check('proteção:tarot-13x6', /Math\.floor\(index \/ 6\) \+ 1/.test(tarotEngine) && /\(index % 6\) \+ 1/.test(tarotEngine));
  const v182Hashes = Object.fromEntries(read('ARQUIVOS-V182-SHA256.txt').trim().split(/\r?\n/).map(line => {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    return match ? [match[2], match[1]] : ['', ''];
  }));
  for (const file of ['tarot-session.js','tarot-continuity.js','tarot-editorial-policy.js','tarot-engine.js']) {
    check(`proteção:v182-idêntico:${file}`, v182Hashes[file] && sha(bytes(file)) === v182Hashes[file]);
  }

  const consultationPolicy = consultationModule.CONSULTATION_POLICY;
  check('proteção:consultas-quatro-serviços', consultationPolicy.services.length === 4);
  check('proteção:consultas-preços', consultationPolicy.services.map(service => service.price).join(',') === '250,150,100,50');
  check('proteção:consultas-email', consultationPolicy.channels.join(',') === 'email' && /name="email"[^>]+required/.test(read('consultation-engine.js')));
  check('proteção:consultas-sem-cobrança', consultationPolicy.realBilling === false);

  check('integração:imagem-do-santuário', exists('carta-dia-santuario-lunar-v1.webp') && bytes('carta-dia-santuario-lunar-v1.webp').length > 10000);
  check('integração:busca-130', count(read('busca-v165.js'), /^  \['/gm) + 78 === 130);
  check('integração:sitemap-131', count(read('sitemap.xml'), /<url>/g) === 131);
  check('integração:sitemap-78-imagens', count(read('sitemap.xml'), /<image:image>/g) === 78);
  check('integração:carta-no-sitemap', count(read('sitemap.xml'), /<loc>https:\/\/divinabruxa\.com\.br\/carta-do-dia\.html<\/loc>/g) === 1);
  check('integração:carta-na-busca', count(read('busca-v165.js'), /carta-do-dia\.html/g) === 1);
  check('integração:carta-no-menu', /daily: 'Carta do Dia'/.test(read('menu-completo-v177.js')));
  check('integração:verdade-editorial', exists('politica-editorial.html') && exists('fontes-e-referencias.html'));

  const importTargets = [...`${app}\n${loader}\n${ritualSource}\n${meaningSource}`.matchAll(/(?:from\s+|import\()['"]\.\/([^?'"]+)/g)].map(match => match[1]);
  check('integração:imports-locais-presentes', importTargets.every(file => exists(file)), importTargets.filter(file => !exists(file)).join(','));
  for (const file of contract.offline?.coreAssets || []) check(`integração:offline-existe:${file}`, exists(file));
}

const hashText = read('ARQUIVOS-V183-SHA256.txt').trim();
const hashLines = hashText ? hashText.split(/\r?\n/) : [];
check('pacote:11-hashes', hashLines.length === 11, hashLines.length);
for (const line of hashLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  check(`hash:formato:${line.slice(-36)}`, match);
  if (match) check(`hash:arquivo:${match[2]}`, exists(match[2]) && sha(bytes(match[2])) === match[1]);
}

const failed = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  suite: 'DIVINA-BRUXA-V183-CARTA-DO-DIA-DEFINITIVA',
  status: failed.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'release-package',
  root,
  total: checks.length,
  passed: checks.length - failed.length,
  failed
}, null, 2));
if (failed.length) process.exit(1);
