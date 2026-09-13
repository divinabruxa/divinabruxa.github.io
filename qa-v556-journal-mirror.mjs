import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
let passed=0;const failures=[];const check=(condition,label)=>condition?passed++:failures.push(label);

const required=['journal-policy.js','journal-engine.js','journal-world-v317.js','journal-world-v317.css','journal-mirror-supreme-v556.css','rhythm-v6.js','account-engine-v201.js','page-loader-v1.js','app-v208.js','index.html','manifest.webmanifest','pwa-world-v196.js','pwa-world-v324.js','sw.js'];
required.forEach(file=>check(fs.existsSync(path.join(root,file)),`arquivo:${file}`));

const policy=await import(pathToFileURL(path.join(root,'journal-policy.js')).href+`?qa=${Date.now()}`);
check(policy.JOURNAL_PAGE_SIZE===12,'diario:paginacao-12');
check(policy.JOURNAL_MAX_ENTRIES===2000&&policy.JOURNAL_MAX_REVISIONS===30,'diario:limites');
check(policy.JOURNAL_TYPES.some(type=>type.id==='library'),'diario:tipo-biblioteca-preservado');
const first=policy.createJournalEntry({id:'a',title:'Segredo',text:'conteudo privado sensivel',question:'pergunta privada',mood:'Ansiosa',tags:'amor, segredo',relationships:'pessoa privada',type:'library',cardId:18,createdAt:'2026-09-13T12:00:00Z',favorite:true});
const second=policy.createJournalEntry({id:'b',title:'Outra',text:'outro corpo privado',mood:'Em paz',tags:'amor',cardId:18,createdAt:'2026-09-12T12:00:00Z',reviewDate:'2026-09-13'});
check(first.private===true&&first.syncState==='local-only'&&first.orientation==='normal','diario:privado-local-direto');
check(first.type==='library'&&first.cardId===18,'diario:origem-biblioteca');
const normalized=policy.normalizeJournalEntries([first,second,first]);
check(normalized.length===2&&new Set(normalized.map(entry=>entry.id)).size===2,'diario:normalizacao-sem-duplicata');
const local=policy.localMirrorData(normalized,'2026-09-13');
check(local.total===2&&local.cardCounts[18]===2&&local.tagCounts.amor===2,'espelho:agregados-locais');
const publicData=policy.publicMirrorData(normalized);
check(publicData.total===2&&publicData.includesText===false,'privacidade:projecao-sem-texto');
check(!('moodCounts'in publicData)&&!('cardCounts'in publicData)&&!('tagCounts'in publicData),'privacidade:sem-humor-cartas-etiquetas-no-admin');
check(!JSON.stringify(publicData).includes('sensivel')&&!JSON.stringify(publicData).includes('segredo'),'privacidade:nenhum-corpo-na-projecao');
const revised=policy.appendJournalRevision(first,'nova percepcao');
check(revised.revisions.length===1&&revised.text===first.text,'diario:revisao-sem-apagar-original');
const selection=policy.createJournalAISelection(first,['A Lua']);
check(selection.consentScope==='single-entry'&&selection.excludes.includes('otherEntries'),'whit:uma-entrada-por-consentimento');
check(!JSON.stringify(selection).includes('pessoa privada')&&!('relationships'in selection),'whit:relacoes-excluidas');
const backup=policy.privateJournalExport(normalized);
check(backup.private===true&&backup.includesPrivateText===true&&backup.entries.length===2,'diario:backup-explicito');
check(policy.normalizeJournalBackup(backup)?.entries.length===2,'diario:backup-validado');
check(policy.mergeJournalEntries([first],[second]).length===2,'diario:mescla-sem-apagar');

const engine=read('journal-engine.js'),world=read('journal-world-v317.js'),rhythm=read('rhythm-v6.js'),css=read('journal-mirror-supreme-v556.css');
check(engine.includes('JOURNAL_PAGE_SIZE')&&engine.includes('this.limit += JOURNAL_PAGE_SIZE'),'fluidez:paginacao-funcional');
check(engine.includes('entries.slice(0, this.limit)')&&engine.includes('data-journal-more'),'fluidez:historico-limitado');
check(engine.includes('new Map(source.map')&&!engine.includes('new Map(this.all().map(item'),'fluidez:sem-leitura-quadratica-na-timeline');
check(engine.includes('cardAtlasStyle(card)')&&!engine.includes('cardImageMarkup'),'fluidez:atlas-sem-imagem-cheia');
check(engine.includes('journal-advanced')&&engine.includes('journal-filter-drawer'),'hierarquia:campos-e-filtros-recolhidos');
check(engine.includes('JOURNAL_DRAFT_KEY')&&engine.includes('scheduleDraft')&&engine.includes('flushDraft'),'diario:autosave-rascunho');
check(engine.includes('calendarJournalCounts')&&engine.includes("this.view === 'calendar'")&&engine.includes('renderCalendar'),'diario:calendario');
check(engine.includes('appendJournalRevision')&&engine.includes('linkedEntryIds'),'diario:revisoes-e-vinculos');
check(engine.includes('normalizeJournalBackup')&&engine.includes('mergeJournalEntries'),'diario:portabilidade-segura');
check(engine.includes("throw new Error('journal-save-failed')")&&engine.includes('return true;'),'diario:falha-de-gravacao-propagada');
check(engine.includes('sync só com consentimento')&&engine.includes('rascunhos nunca saem do aparelho'),'privacidade:copy-coerente-com-conta');
check(engine.includes("const smooth = () => 'auto'")&&!engine.includes("'smooth';"),'fluidez:rolagem-imediata');
check(engine.includes('destroy()')&&engine.includes('this.abort?.abort()'),'fluidez:eventos-descartaveis');

check(world.includes("mode:'journal'")&&world.includes('data-journal-orb-host'),'orbe:canonica-no-diario');
check(world.includes('duplicateOrb:false')&&world.includes('canonicalOrb:true'),'orbe:sem-duplicata');
check(world.includes('data-jwv-write')&&world.includes('data-jwv-mirror')&&world.includes('data-jwv-calendar'),'navegacao:tres-passagens-claras');
check(world.includes("behavior:'auto'")&&!world.includes("'smooth'"),'fluidez:mundo-sem-espera-de-scroll');
check(world.includes('privateBodyIncluded:false')&&world.includes('analyticsTextIncluded:false'),'privacidade:evento-agregado');
check(world.includes('renderedEntriesPerPage:12')&&world.includes('timelineFullImageRequests:0'),'fluidez:contrato-auditavel');
check(!world.includes('MutationObserver')&&!world.includes('setInterval'),'fluidez:sem-observadores-ou-relogios');

check(rhythm.includes('automaticCheckIn:false')&&!/constructor\([^)]*\)\{[^}]*checkIn\(/.test(rhythm),'ritmo:presenca-explicita');
check(rhythm.includes('streakFor')&&rhythm.includes('cursor.setDate(cursor.getDate()-1)'),'ritmo:sequencia-real');
check(rhythm.includes('Suas memórias do Diário não serão apagadas'),'ritmo:reset-transparente');
check(!rhythm.includes('setInterval')&&!rhythm.includes('requestAnimationFrame'),'ritmo:zero-loop');

check(!/animation\s*:[^;{}]*infinite/i.test(css),'visual:sem-loop-infinito');
check(css.includes('backdrop-filter:none!important')&&css.includes('animation:none!important'),'visual:sem-blur-e-motor-pesado');
check(css.includes('content-visibility:auto')&&css.includes('contain-intrinsic-size'),'visual:pintura-diferida');
check(css.includes('@media(max-width:430px)')&&css.includes('min-height:48px'),'iphone:layout-e-toque');
check(css.includes('prefers-reduced-motion:reduce'),'acessibilidade:movimento-reduzido');

const app=read('app-v208.js'),account=read('account-engine-v201.js'),loader=read('page-loader-v1.js'),index=read('index.html'),sw=read('sw.js'),pwa=read('pwa-world-v324.js'),manifest=read('manifest.webmanifest');
check(app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 8/14 · V556'),'release:app-v556');
check(app.includes('window.divinaJournalMirrorReleaseV556')&&app.includes("currentMacroStage:'8-of-14'"),'release:contrato-v556');
check(loader.includes('journal-mirror-supreme-v556.css?v=556')&&loader.includes("import('./journal-world-v317.js?v=556')"),'release:loader');
check(loader.includes('divinaJournalWorldV317')&&loader.includes('orbCore:globalThis.divinaOrbSupremeV501'),'integracao:mundo-e-orbe');
check(account.includes("journal-policy.js?v=556")&&account.includes('Desligado por padrão')&&account.includes('Rascunhos nunca saem deste aparelho'),'conta:sync-privado-opt-in');
check(account.includes("if (key === JOURNAL_STORAGE_KEY && !this.journalEnabled) return"),'conta:sem-sync-antes-de-consentimento');
check(index.includes('journal-mirror-supreme-v556.css?v=556')&&index.includes('app-v208.js?v=556'),'release:index');
check(index.includes('sw.js?v=556')&&index.includes('manifest.webmanifest?v=556'),'release:cache');
check(sw.includes('const VERSION=556')&&sw.includes('divina-bruxa-v556-shell')&&sw.includes("'./journal-mirror-supreme-v556.css'"),'release:sw-atomico');
check(sw.includes("'./journal-engine.js'")&&sw.includes("'./journal-policy.js'")&&sw.includes("'./rhythm-v6.js'"),'offline:diario-completo');
check(pwa.includes('const VERSION=556')&&manifest.includes('?v=556'),'release:pwa-manifest');
check(fs.readdirSync(root).filter(file=>file.endsWith('.html')).length===321,'regressao:321-paginas-reais');

const total=passed+failures.length;
console.log(`V556 Diário + Espelho: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
