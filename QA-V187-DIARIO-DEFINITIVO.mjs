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
const check = (name, pass, detail = '') => checks.push({ name, pass:Boolean(pass), ...(detail ? { detail:String(detail) } : {}) });
const syntax = file => { try { execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio:'ignore' }); return true; } catch { return false; } };
const freshImport = file => import(`${pathToFileURL(path.join(root, file)).href}?qa=${Date.now()}-${Math.random()}`);

const packageFiles = [
  'index.html','app.js','page-loader-v1.js','sw.js','school-policy.js','school-engine.js','ai-engine.js','escola-do-tarot.html','sitemap.xml',
  'journal-policy.js','journal-engine.js','diario-de-tarot.html','busca-v165.js',
  'escola-definitiva-v186.css','diario-definitivo-v187.css','DIARIO-DEFINITIVO-V187.json','QA-V187-DIARIO-DEFINITIVO.mjs',
  '00-LEIA-PRIMEIRO-V187-CUMULATIVA.txt','ARQUIVOS-V187-SHA256.txt'
];
packageFiles.forEach(file => check(`arquivo:${file}`, exists(file)));
for (const file of ['app.js','page-loader-v1.js','sw.js','school-policy.js','school-engine.js','ai-engine.js','journal-policy.js','journal-engine.js','busca-v165.js','QA-V187-DIARIO-DEFINITIVO.mjs']) {
  check(`sintaxe:${file}`, exists(file) && syntax(file));
}

const index = read('index.html');
const app = read('app.js');
const loader = read('page-loader-v1.js');
const worker = read('sw.js');
const journalPolicySource = read('journal-policy.js');
const journalEngineSource = read('journal-engine.js');
const aiSource = read('ai-engine.js');
const diaryCss = read('diario-definitivo-v187.css');
const diaryPage = read('diario-de-tarot.html');
const search = read('busca-v165.js');
const schoolPolicySource = read('school-policy.js');
const schoolEngineSource = read('school-engine.js');
const schoolCss = read('escola-definitiva-v186.css');
const schoolPage = read('escola-do-tarot.html');
const sitemap = read('sitemap.xml');
const tarotEngine = read('tarot-engine.js');
const editorial = read('tarot-editorial-policy.js');
const ritual = read('ritual-engine.js');
const consultationPolicy = read('consultation-policy.js');
const consultationEngine = read('consultation-engine.js');
let contract = {};
try { contract = JSON.parse(read('DIARIO-DEFINITIVO-V187.json')); check('contrato:json-válido', true); }
catch { check('contrato:json-válido', false); }

check('ativação:app-v187', /app\.js\?v=187/.test(index));
check('ativação:loader-v187', /page-loader-v1\.js\?v=187/.test(app));
check('ativação:diário-v187', /journal-engine\.js\?v=187/.test(loader));
check('ativação:política-v187', /journal-policy\.js\?v=187/.test(journalEngineSource));
check('ativação:IA-v187', /ai-engine\.js\?v=187/.test(loader));
check('ativação:IA-política-v187', /journal-policy\.js\?v=187/.test(aiSource));
check('ativação:estilo-v187', /diario-definitivo-v187\.css\?v=187/.test(index));
check('ativação:escola-v186', /school-engine\.js\?v=186/.test(loader) && /escola-definitiva-v186\.css\?v=186/.test(index));
check('ativação:sw-v57', /divina-bruxa-v57-journal-v187/.test(worker));
check('menu:sem-botão-novo', count(index, /data-go="journal"/g) === 2, count(index, /data-go="journal"/g));
check('home:diário-definitivo', /DIÁRIO E ESPELHO CELESTIAL DEFINITIVO/.test(index));
check('home:privacidade-tríplice', /sem acesso automático da IA, do Admin ou do analytics/.test(index));

for (const marker of [
  "JOURNAL_STORAGE_KEY = 'journal'", "JOURNAL_SCHEMA_VERSION = '7.0.0'", "JOURNAL_BACKUP_KIND = 'private-journal-portability-copy'",
  'JOURNAL_MAX_ENTRIES = 2000', 'JOURNAL_MAX_REVISIONS = 30', 'normalizeJournalText', 'appendJournalRevision', 'localMirrorData',
  'privateJournalExport', 'normalizeJournalBackup', 'mergeJournalEntries', 'createJournalAISelection', 'normalizeJournalAISelection'
]) check(`diário:política:${marker}`, journalPolicySource.includes(marker));
check('diário:busca-sem-acento', /normalize\('NFD'\)/.test(journalPolicySource) && /\[\\u0300-\\u036f\]/.test(journalPolicySource));
check('diário:78-diretas', /id >= 0 && id < 78/.test(journalPolicySource) && /orientation: 'normal'/.test(journalPolicySource));
check('diário:privado-local', /private: true/.test(journalPolicySource) && /syncState: 'local-only'/.test(journalPolicySource));
check('diário:limites-de-texto', /text\(input\.text, 16000\)/.test(journalPolicySource) && /text\(value\?\.text, 3000\)/.test(journalPolicySource));
check('diário:vínculos-sem-auto', /linkedEntryIds: entry\.linkedEntryIds\.filter/.test(journalPolicySource));
check('diário:revisões-separadas', /revisions: \[\.\.\.\(entry\?\.revisions \|\| \[\]\), revision\]/.test(journalPolicySource));
check('diário:IA-escopo-único', /consentScope: 'single-entry'/.test(journalPolicySource));
for (const excluded of ['otherEntries','draft','relationships','revisions','mood','favorites']) check(`diário:IA-exclui-${excluded}`, journalPolicySource.includes(`'${excluded}'`));

for (const marker of [
  'flushDraft','data-journal-link-select','data-journal-import','data-journal-clear','data-journal-file','renderPortability','readBackup',
  'data-import-merge','data-import-replace','data-clear-confirmation','data-open-linked','data-revise-entry','data-revision-form','data-export-entry',
  'normalizeJournalText','appendJournalRevision','createJournalAISelection','Disponível offline','padrões, não sentenças'
]) check(`diário:motor:${marker}`, journalEngineSource.toLocaleLowerCase('pt-BR').includes(marker.toLocaleLowerCase('pt-BR')));
check('diário:motor:autosave-350ms', /setTimeout\(\(\) => this\.flushDraft\(\), 350\)/.test(journalEngineSource));
check('diário:motor:salva-ao-sair', /addEventListener\('pagehide', \(\) => this\.flushDraft\(\)\)/.test(journalEngineSource));
check('diário:motor:falha-não-silenciosa', /armazenamento do aparelho está cheio ou indisponível/i.test(journalEngineSource));
check('diário:motor:busca-todos-termos', /queryTerms\.every\(term => searchable\.includes\(term\)\)/.test(journalEngineSource));
check('diário:motor:busca-revisões', /entry\.revisions\.map\(revision => revision\.text\)/.test(journalEngineSource));
check('diário:motor:busca-vínculos', /linkedTitles/.test(journalEngineSource));
check('diário:motor:importa-5MB', /file\.size > 5_000_000/.test(journalEngineSource));
check('diário:motor:mescla-padrão-seguro', /Mesclar sem apagar/.test(journalEngineSource));
check('diário:motor:substituição-explícita', /Substituir o Diário/.test(journalEngineSource));
check('diário:motor:exclusão-total-confirmada', /Entendo que todo o Diário local será apagado/.test(journalEngineSource));
check('diário:motor:cópia-informa-privacidade', /A cópia JSON contém conteúdo privado/.test(journalEngineSource));
check('diário:motor:sem-paywall-local', !/data-premium-export|Exportação Celestial permanece protegida/.test(journalEngineSource));
check('diário:motor:sem-rede', !/\bfetch\s*\(|XMLHttpRequest|sendBeacon\s*\(/.test(journalEngineSource));
check('diário:motor:sem-vibração', !/navigator\??\.vibrate|\.vibrate\?\./.test(journalEngineSource));
check('diário:motor:IA-primeira-confirmação', /data-ai-confirm/.test(journalEngineSource) && /Preparar somente esta entrada/.test(journalEngineSource));
check('diário:IA-segunda-confirmação', /id="aiConsent"/.test(aiSource) && /if \(!this\.consent\.checked\)/.test(aiSource));
check('diário:IA-normaliza-seleção', /normalizeJournalAISelection\(store\.get\(JOURNAL_AI_SELECTION_KEY\)\)/.test(aiSource));
check('diário:IA-explica-exclusões', /Outras memórias, rascunho, humor, relações e revisões ficaram de fora/.test(aiSource));

for (const marker of ['journal-vault-status','journal-vault-panel','journal-vault-danger','journal-vault-note','journal-memory-links','journal-revisions','journal-inline-revision','journal-review-date']) {
  check(`diário:css:${marker}`, diaryCss.includes(`.${marker}`));
}
check('diário:css:toques-44', count(diaryCss, /min-height: 44px/g) >= 3);
check('diário:css:foco-visível', /:focus-visible/.test(diaryCss));
check('diário:css:mobile-760', /@media \(max-width: 760px\)/.test(diaryCss));
check('diário:css:mobile-520', /@media \(max-width: 520px\)/.test(diaryCss));
check('diário:css:movimento-reduzido', /prefers-reduced-motion: reduce/.test(diaryCss));
check('diário:css:arquivo-enxuto', Buffer.byteLength(diaryCss) < 18000, Buffer.byteLength(diaryCss));
check('diário:css:chaves-equilibradas', count(diaryCss, /\{/g) === count(diaryCss, /\}/g));

check('página-diário:doctype', /^<!doctype html>/i.test(diaryPage));
check('página-diário:pt-BR', /<html lang="pt-BR">/.test(diaryPage));
check('página-diário:canonical', /https:\/\/divinabruxa\.com\.br\/diario-de-tarot\.html/.test(diaryPage));
check('página-diário:título-privado', /Diário de Tarot privado: registre e revise/.test(diaryPage));
check('página-diário:app-primeiro', diaryPage.indexOf('Abrir o Diário privado') < diaryPage.indexOf('Criar uma ficha'));
check('página-diário:autosave', /Autosave e restauração/.test(diaryPage));
check('página-diário:relações-revisões', /Relações e revisões/.test(diaryPage));
check('página-diário:admin-IA', /Admin, analytics e Orbe IA não leem o Diário/.test(diaryPage));
check('página-diário:sync-honesto', /não promete sincronização que ainda não existe/.test(diaryPage));
check('página-diário:sem-diagnóstico', /não produzem diagnósticos/.test(diaryPage));
check('página-diário:cartas-diretas', /Cartas diretas/.test(diaryPage));
check('página-diário:data-v187', /"dateModified": "2026-09-07"/.test(diaryPage));
check('página-diário:sitemap', /<loc>https:\/\/divinabruxa\.com\.br\/diario-de-tarot\.html<\/loc>\s*<lastmod>2026-09-07<\/lastmod>/.test(sitemap));
check('busca:diário-definitivo', /autosave local, busca sem acento, filtros, calendário, linha do tempo/.test(search));
for (const term of ['relações entre memórias','revisões separadas','cópia JSON','backup','restauração','offline']) check(`busca:termo:${term}`, search.includes(term));

const core = worker.match(/const CORE=\[([\s\S]*?)\];/)?.[1] || '';
const warm = worker.match(/const WARM=\[([\s\S]*?)\];/)?.[1] || '';
for (const file of ['journal-engine.js','journal-policy.js','rhythm-v6.js','diario-definitivo-v187.css','school-engine.js','school-policy.js','escola-definitiva-v186.css']) {
  check(`offline:núcleo:${file}`, core.includes(`'./${file}'`));
}
for (const file of ['diario-de-tarot.html','diario-tarot-v173.css','diario-tarot-v173.js','diario-espelho-celestial-v1.webp']) {
  check(`offline:aquecido:${file}`, warm.includes(`'./${file}'`));
}
check('offline:instalação-atômica', /Promise\.allSettled\(CORE\.map/.test(worker) && /if\(coreFailures\.length\)throw/.test(worker));
check('offline:IA-não-prometida', !core.includes("'./ai-engine.js'"));
check('offline:não-pré-carrega-78-artes', !/\.\/card-00\.webp/.test(core));
check('offline:rotas-sensíveis-rede', /\(ai\|auth\|account\|admin\|entitlements\|billing\|payments\|consultations\)/.test(worker));

globalThis.document = globalThis.document || { addEventListener() {} };
globalThis.HTMLImageElement = globalThis.HTMLImageElement || class HTMLImageElement {};

const journal = await freshImport('journal-policy.js');
check('dados-diário:esquema-v187', journal.JOURNAL_SCHEMA_VERSION === '7.0.0');
check('dados-diário:quatro-tipos', journal.JOURNAL_TYPES.length === 4);
check('dados-diário:sete-humores', journal.JOURNAL_MOODS.length === 7);
check('dados-diário:cinco-períodos', journal.JOURNAL_PERIODS.length === 5);
check('dados-diário:normaliza-acentos', journal.normalizeJournalText('Água, Ação & Ética') === 'agua acao etica');

const baseEntries = [
  journal.createJournalEntry({ id:'memory-a', title:'A Lua e a Ação', text:'Água, intuição e escolha.', mood:'Curiosa', tags:'lua, água', relationships:'trabalho', collection:'Ciclo', cardId:18, linkedEntryIds:['memory-b'], reviewDate:'2026-09-01', createdAt:'2026-09-01T12:00:00Z', updatedAt:'2026-09-06T12:00:00Z' }),
  journal.createJournalEntry({ id:'memory-b', title:'O Sol', text:'Clareza no caminho.', mood:'Confiante', tags:'sol', cardId:19, favorite:true, createdAt:'2026-09-02T12:00:00Z', updatedAt:'2026-09-02T12:00:00Z' })
];
check('dados-diário:orientação-direta', baseEntries.every(entry => entry.orientation === 'normal'));
check('dados-diário:privacidade-local', baseEntries.every(entry => entry.private && entry.syncState === 'local-only'));
check('dados-diário:humor-inválido-normalizado', journal.createJournalEntry({ text:'x', mood:'diagnóstico' }).mood === 'Reflexiva');
check('dados-diário:carta-inválida-removida', journal.createJournalEntry({ text:'x', cardId:78 }).cardId === null);
check('dados-diário:cartas-secundárias-filtradas', journal.createJournalEntry({ text:'x', cardIds:[0,0,77,78,-1,'2'] }).cardIds.join(',') === '0,77,2');
const normalizedEntries = journal.normalizeJournalEntries([...baseEntries, { ...baseEntries[0] }, { id:'empty', title:'vazio' }]);
check('dados-diário:deduplica-IDs', normalizedEntries.length === 2);
check('dados-diário:vínculo-válido', normalizedEntries.find(entry => entry.id === 'memory-a')?.linkedEntryIds[0] === 'memory-b');
check('dados-diário:remove-vínculo-inexistente', journal.normalizeJournalEntries([{ ...baseEntries[0], linkedEntryIds:['ghost','memory-a'] }])[0].linkedEntryIds.length === 0);

let revised = journal.appendJournalRevision(baseEntries[0], 'Voltei e percebi outro detalhe.', '2026-09-07T12:00:00Z');
check('dados-diário:revisão-acrescentada', revised.revisions.length === 1 && revised.revisions[0].text.includes('outro detalhe'));
check('dados-diário:original-preservado', revised.text === baseEntries[0].text);
for (let indexRevision = 0; indexRevision < 35; indexRevision += 1) revised = journal.appendJournalRevision(revised, `Revisão ${indexRevision}`, `2026-09-${String((indexRevision % 7) + 1).padStart(2,'0')}T12:00:00Z`);
check('dados-diário:limite-30-revisões', revised.revisions.length === 30, revised.revisions.length);

const mirror = journal.localMirrorData(normalizedEntries, '2026-09-07');
check('espelho:duas-memórias', mirror.total === 2);
check('espelho:uma-favorita', mirror.favorites === 1);
check('espelho:uma-revisão-pendente', mirror.reviewsDue === 1);
check('espelho:um-vínculo', mirror.linked === 1);
check('espelho:duas-cartas', mirror.cardCounts[18] === 1 && mirror.cardCounts[19] === 1);
check('espelho:tags-locais', mirror.tagCounts.lua === 1 && mirror.tagCounts.sol === 1);
check('espelho:objeto-congelado', Object.isFrozen(mirror) && Object.isFrozen(mirror.tagCounts));

const exported = journal.privateJournalExport(normalizedEntries);
const restored = journal.normalizeJournalBackup(JSON.parse(JSON.stringify(exported)));
check('backup:tipo-privado', exported.kind === 'private-journal-portability-copy' && exported.private === true && exported.includesPrivateText === true);
check('backup:local-direto', exported.syncState === 'local-only' && exported.orientation === 'normal');
check('backup:restaura-duas', restored?.entries.length === 2);
check('backup:rejeita-formato-estranho', journal.normalizeJournalBackup({ kind:'other', entries:[] }) === null);
check('backup:rejeita-sem-lista', journal.normalizeJournalBackup({ kind:'private-journal-portability-copy' }) === null);
const merged = journal.mergeJournalEntries(
  [{ ...baseEntries[0], text:'versão atual', updatedAt:'2026-09-07T12:00:00Z' }],
  [{ ...baseEntries[0], text:'versão antiga', updatedAt:'2026-09-01T12:00:00Z' }, baseEntries[1]]
);
check('backup:mescla-sem-apagar', merged.length === 2);
check('backup:preserva-mais-recente', merged.find(entry => entry.id === 'memory-a')?.text === 'versão atual');
check('backup:incorpora-importada', merged.some(entry => entry.id === 'memory-b'));

const aiSelection = journal.createJournalAISelection({ ...baseEntries[0], revisions:[{ text:'segredo' }], relationships:'nome privado', mood:'Ansiosa' }, ['A Lua']);
check('IA-diário:seleção-válida', aiSelection?.consentScope === 'single-entry');
check('IA-diário:direta', aiSelection?.orientation === 'normal');
check('IA-diário:uma-carta', aiSelection?.cards[0] === 'A Lua');
for (const privateKey of ['relationships','revisions','mood','favorite','linkedEntryIds']) check(`IA-diário:payload-sem-${privateKey}`, !Object.hasOwn(aiSelection || {}, privateKey));
check('IA-diário:exclusões-declaradas', ['otherEntries','draft','relationships','revisions','mood','favorites'].every(item => aiSelection?.excludes.includes(item)));
check('IA-diário:normalização-válida', journal.normalizeJournalAISelection(JSON.parse(JSON.stringify(aiSelection)))?.id === 'memory-a');
check('IA-diário:rejeita-escopo-total', journal.normalizeJournalAISelection({ ...aiSelection, consentScope:'all-journal' }) === null);

const { JournalEngine } = await freshImport('journal-engine.js');
const journalEngine = Object.create(JournalEngine.prototype);
journalEngine.filters = { query:'acao agua', mood:'', type:'', date:'', card:'', theme:'', favorites:false };
check('motor-filtro:acentos-e-termos', journalEngine.filtered(normalizedEntries).map(entry => entry.id).join(',') === 'memory-a');
journalEngine.filters = { query:'', mood:'Confiante', type:'', date:'', card:'', theme:'', favorites:false };
check('motor-filtro:humor', journalEngine.filtered(normalizedEntries).map(entry => entry.id).join(',') === 'memory-b');
journalEngine.filters = { query:'', mood:'', type:'', date:'2026-09-01', card:'', theme:'', favorites:false };
check('motor-filtro:data', journalEngine.filtered(normalizedEntries).map(entry => entry.id).join(',') === 'memory-a');
journalEngine.filters = { query:'', mood:'', type:'', date:'', card:'18', theme:'', favorites:false };
check('motor-filtro:carta', journalEngine.filtered(normalizedEntries).map(entry => entry.id).join(',') === 'memory-a');
journalEngine.filters = { query:'', mood:'', type:'', date:'', card:'', theme:'trabalho', favorites:false };
check('motor-filtro:relações', journalEngine.filtered(normalizedEntries).map(entry => entry.id).join(',') === 'memory-a');
journalEngine.filters = { query:'', mood:'', type:'', date:'', card:'', theme:'', favorites:true };
check('motor-filtro:favoritas', journalEngine.filtered(normalizedEntries).map(entry => entry.id).join(',') === 'memory-b');
journalEngine.filters = { query:'sol', mood:'', type:'', date:'', card:'', theme:'', favorites:false };
check('motor-filtro:título-vinculado', journalEngine.filtered(normalizedEntries).some(entry => entry.id === 'memory-a'));
journalEngine.pendingDelete = '';
journalEngine.pendingAI = '';
journalEngine.pendingRevision = '';
journalEngine.all = () => normalizedEntries;
const memoryMarkup = journalEngine.entryMarkup(normalizedEntries.find(entry => entry.id === 'memory-a'));
check('motor-marcação:vínculo', /data-open-linked="memory-b"/.test(memoryMarkup));
check('motor-marcação:revisão-planejada', /journal-review-date is-due/.test(memoryMarkup));
check('motor-marcação:cinco-ações-centrais', ['data-favorite-entry','data-edit-entry','data-revise-entry','data-export-entry','data-delete-entry'].every(marker => memoryMarkup.includes(marker)));
journalEngine.pendingRevision = 'memory-a';
check('motor-marcação:formulário-revisão', /data-revision-form/.test(journalEngine.entryMarkup(normalizedEntries.find(entry => entry.id === 'memory-a'))));
journalEngine.pendingAI = 'memory-a';
check('motor-marcação:confirmação-IA', /Preparar somente esta entrada/.test(journalEngine.entryMarkup(normalizedEntries.find(entry => entry.id === 'memory-a'))));

const school = await freshImport('school-policy.js');
check('escola:17-módulos', school.SCHOOL_MODULES.length === 17);
check('escola:124-aulas', school.SCHOOL_LESSON_TOTAL === 124);
check('escola:78-cartas', school.SCHOOL_CARD_TOTAL === 78);
check('escola:46-teorias', school.SCHOOL_THEORY_TOTAL === 46);
check('escola:cinco-filtros', school.SCHOOL_FILTERS.length === 5);
check('escola:busca-sem-acento', school.normalizeSchoolText('Água, Ação & Ética') === 'agua acao etica');
check('escola:backup-privado', /private-school-progress-copy/.test(schoolPolicySource));
check('escola:IA-uma-aula', /single-school-lesson/.test(schoolPolicySource));
check('escola:IA-sem-notas', ['notes','progress','favorites','history'].every(item => schoolPolicySource.includes(`'${item}'`)));
check('escola:CSS-v186', ['school-filter-bar','school-note','school-ai-confirm','school-portability'].every(marker => schoolCss.includes(`.${marker}`)));
check('escola:página-124', /124 aulas para aprender o Tarot/.test(schoolPage));
check('escola:página-sync-honesto', /sincronização automática entre aparelhos ainda depende/.test(schoolPage));
check('escola:sitemap', /<loc>https:\/\/divinabruxa\.com\.br\/escola-do-tarot\.html<\/loc>\s*<lastmod>2026-09-07<\/lastmod>/.test(sitemap));

const { SchoolEngine } = await freshImport('school-engine.js');
const schoolEngine = Object.create(SchoolEngine.prototype);
schoolEngine.state = school.defaultSchoolState();
schoolEngine.activeModule = 'fundamentals';
schoolEngine.query = '';
schoolEngine.filter = 'all';
schoolEngine.pendingAI = null;
const uniqueLessons = schoolEngine.allUniqueLessons();
check('escola:124-únicas', uniqueLessons.length === 124, uniqueLessons.length);
check('escola:IDs-únicos', new Set(uniqueLessons.map(item => item.lesson.id)).size === 124);
check('escola:78-diretas', uniqueLessons.filter(item => item.lesson.card).every(item => item.lesson.card.orientation === 'normal'));
for (const { lesson, module } of uniqueLessons.filter(item => item.lesson.card)) {
  const markup = schoolEngine.lessonMarkup(lesson, module, 0);
  check(`escola-carta:${lesson.id}:direta`, /· DIRETA/.test(markup));
  check(`escola-carta:${lesson.id}:quiz`, count(markup, /data-quiz=/g) === 4);
  check(`escola-carta:${lesson.id}:profunda`, ['Luz','Tensão','Símbolos','Conselho','Pergunta de reflexão','Ação possível'].every(layer => markup.includes(`<h5>${layer}</h5>`)));
  check(`escola-carta:${lesson.id}:caderno`, markup.includes(`data-school-note="${lesson.id}"`));
}
for (const { lesson, module } of uniqueLessons.filter(item => !item.lesson.card)) {
  const markup = schoolEngine.lessonMarkup(lesson, module, 0);
  check(`escola-teoria:${lesson.id}:prática`, /PRÁTICA DO CÉU/.test(markup));
  check(`escola-teoria:${lesson.id}:caderno`, markup.includes(`data-school-note="${lesson.id}"`));
  check(`escola-teoria:${lesson.id}:progresso`, markup.includes(`data-complete="${lesson.id}"`));
}
for (const [query, expected] of [['A Lua','A Lua'],['The Moon','A Lua'],['La Luna','A Lua'],['agua','A Sacerdotisa'],['etica','Consentimento e privacidade']]) {
  check(`escola-busca:${query}`, schoolEngine.globalResults(query).some(entry => entry.lesson.title === expected));
}

await freshImport('tarot-meanings.js');
const [{ CARDS }, tarotSession, dailyPolicy, cardLibrary, spreadPolicy] = await Promise.all([
  freshImport('tarot-data.js'), freshImport('tarot-session.js'), freshImport('daily-policy.js'), freshImport('card-library-policy.js'), freshImport('spreads-policy.js')
]);
check('regressão:catálogo-78', CARDS.length === 78);
for (const card of CARDS) {
  check(`regressão:carta-${card.id}:ID`, Number.isInteger(card.id) && card.id >= 0 && card.id < 78);
  check(`regressão:carta-${card.id}:direta`, card.orientation === 'normal');
}
let tarotState = tarotSession.createTarotState({ randomInt:max => max - 1, now:() => 1, sessionId:'qa-v187' });
const draws = [];
for (let drawIndex = 0; drawIndex < 78; drawIndex += 1) {
  const draw = tarotSession.drawNextCard(tarotState, { now:() => drawIndex + 2 });
  tarotState = draw.state;
  draws.push(draw.cardId);
}
check('regressão:tarot-78-reveladas', draws.length === 78);
check('regressão:tarot-sem-repetição', new Set(draws).size === 78);
check('regressão:tarot-Mesa-13x6', /aria-rowcount="13" aria-colcount="6"/.test(index) && /Math\.floor\(index \/ 6\)/.test(tarotEngine));
check('regressão:tarot-sem-significados', /automaticMeanings: false/.test(editorial) && !/meaning-engine|tarot-meanings/.test(tarotEngine));
check('regressão:tarot-sem-vibração', !/navigator\??\.vibrate|\.vibrate\?\./.test(tarotEngine));
check('regressão:diária-Brasília', dailyPolicy.DAILY_TIME_ZONE === 'America/Sao_Paulo');
check('regressão:diária-uma-de-78', dailyPolicy.DAILY_CARD_COUNT === 78 && dailyPolicy.createDailyRecord('', new Date('2026-09-07T12:00:00Z')).orientation === 'normal');
check('regressão:diária-14-seções', ['ENERGIA DO DIA','ESSÊNCIA','LUZ','TENSÃO','AMOR','RELACIONAMENTOS','CARREIRA','DINHEIRO','ESPIRITUALIDADE','CONSELHO','SÍMBOLOS','PERGUNTA PARA O DIA','AÇÃO POSSÍVEL','LEITURA RESPONSÁVEL'].every(title => ritual.includes(title)));
check('regressão:biblioteca-comparação-2', cardLibrary.LIBRARY_COMPARE_LIMIT === 2);
check('regressão:15-tiragens', spreadPolicy.SPREADS.length === 15);
check('regressão:14-tiragens-livres', spreadPolicy.SPREADS.filter(item => !item.premium).length === 14);
for (const price of [25000,15000,10000,5000]) check(`regressão:consulta-preço-${price}`, consultationPolicy.includes(`priceCents:${price}`));
check('regressão:consulta-email', /name="email" type="email"[\s\S]{0,80}required/.test(consultationEngine));
check('regressão:consulta-sem-cobrança', /Nenhuma cobrança automática foi realizada/.test(consultationEngine));
check('regressão:menu-biblioteca', /href="cartas-do-tarot\.html">Significados das 78 cartas/.test(index));

check('contrato:versão-187', contract.version === '187');
check('contrato:macroetapa-9', contract.macroetapa === 9);
check('contrato:cumulativa-v186', contract.includes_previous_unpublished_release?.version === 'V186');
check('contrato:escola-17-124', contract.includes_previous_unpublished_release?.modules === 17 && contract.includes_previous_unpublished_release?.lessons === 124);
check('contrato:diário-local', contract.diary?.storage === 'local-only');
check('contrato:busca-sem-acento', contract.diary?.accent_insensitive_search === true);
check('contrato:revisão-preserva-original', contract.diary?.relationships?.original_entry_remains_visible === true);
check('contrato:backup-mescla', contract.diary?.portability?.merge_without_deletion === true);
check('contrato:offline', Object.values(contract.diary?.offline || {}).every(Boolean));
check('contrato:admin-sem-corpo', contract.privacy?.admin_can_read_body === false);
check('contrato:analytics-sem-corpo', contract.privacy?.analytics_can_read_body === false);
check('contrato:IA-sem-automático', contract.privacy?.automatic_ai_access === false && contract.privacy?.ai_double_consent === true);
check('contrato:sync-honesto', contract.privacy?.automatic_sync === false && contract.privacy?.server_storage_claimed === false);
check('contrato:Tarot-inviolável', contract.unchanged_invariants?.tarot_cards === 78 && contract.unchanged_invariants?.reversed_cards === 0 && contract.unchanged_invariants?.free_tarot_repetition === false);
check('contrato:menu-sem-novo', contract.unchanged_invariants?.new_diary_menu_button === false);
check('contrato:19-arquivos', contract.installation?.package_files === 19 && packageFiles.length === 19);
check('contrato:13-substituir', contract.installation?.replace_files === 13);
check('contrato:6-adicionar', contract.installation?.add_files === 6);

const htmlFiles = fs.readdirSync(root).filter(file => file.endsWith('.html'));
for (const file of htmlFiles) {
  const source = read(file);
  const broken = [];
  for (const match of source.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    let target = match[1].trim();
    if (!target || target.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:|blob:)/i.test(target) || target.includes('${')) continue;
    target = target.split('#')[0].split('?')[0];
    if (!target) continue;
    try { target = decodeURIComponent(target); } catch {}
    let local = path.resolve(path.dirname(path.join(root, file)), target);
    if (!local.startsWith(root)) { broken.push(match[1]); continue; }
    if (target.endsWith('/')) local = path.join(local, 'index.html');
    if (!fs.existsSync(local)) broken.push(match[1]);
  }
  check(`links:${file}`, broken.length === 0, broken.slice(0, 5).join(', '));
  for (const [jsonIndex, match] of [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].entries()) {
    try { JSON.parse(match[1]); check(`jsonld:${file}:${jsonIndex + 1}`, true); }
    catch { check(`jsonld:${file}:${jsonIndex + 1}`, false); }
  }
}
check('portal:mais-de-130-páginas', htmlFiles.length >= 130, htmlFiles.length);

const manifest = read('ARQUIVOS-V187-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
check('hash:18-entradas', manifest.length === 18, manifest.length);
for (const line of manifest) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  check(`hash:formato:${line.slice(-40)}`, Boolean(match));
  if (match) check(`hash:arquivo:${match[2]}`, exists(match[2]) && sha(fs.readFileSync(path.join(root, match[2]))) === match[1]);
}

const failed = checks.filter(item => !item.pass);
console.log(JSON.stringify({ suite:'DIVINA-BRUXA-V187-CUMULATIVA-ESCOLA-DIARIO', status:failed.length ? 'FAIL' : 'PASS', root, total:checks.length, passed:checks.length - failed.length, failed }, null, 2));
if (failed.length) process.exitCode = 1;
