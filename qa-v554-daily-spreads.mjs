import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
let passed=0;const failures=[];const check=(condition,label)=>condition?passed++:failures.push(label);

const files=['daily-world-v509.js','daily-policy-v303.js','daily-world-v509.css','daily-spreads-supreme-v554.css','spreads-policy.js','spreads-engine.js','spreads-world-v305.js','spreads-supreme-v331.js','page-loader-v1.js','app-v208.js','index.html','manifest.webmanifest','pwa-world-v196.js','pwa-world-v324.js','sw.js'];
files.forEach(file=>check(fs.existsSync(path.join(root,file)),`arquivo:${file}`));

const policy=await import(pathToFileURL(path.join(root,'spreads-policy.js')).href+`?qa=${Date.now()}`);
check(policy.SPREAD_RELEASE==='V554','tiragens:release');
check(policy.SPREADS.length===15,'tiragens:15-metodos');
const free=policy.SPREADS.filter(item=>!item.premium),premium=policy.SPREADS.filter(item=>item.premium);
check(free.length===4,'tiragens:4-gratis');
check(premium.length===11,'tiragens:11-premium');
check(free.map(item=>item.id).join(',')==='direct-question,past-present-tendency,situation-challenge-advice,love-relationships','tiragens:catalogo-gratis');
check(policy.spreadsForFilter('free').length===4&&policy.spreadsForFilter('premium').length===11,'tiragens:filtros-acesso');
check(policy.CELTIC_CROSS_POSITIONS.length===10,'tiragens:cruz-celta-10');
check(policy.ROYAL_TABLE_COUNT===78&&policy.ROYAL_TABLE_COLUMNS===13&&policy.ROYAL_TABLE_ROWS===6,'tiragens:mesa-real-13x6');
check(policy.SPREADS.every(item=>item.positions.length>0),'tiragens:posicoes-reais');
for(const target of policy.SPREADS){
  const count=target.custom?5:target.positions.length;
  const session={spreadId:target.id,cardIds:Array.from({length:count},(_,i)=>i),orientation:'normal',revealed:0,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  check(Boolean(policy.normalizeSpreadSession(session)),`sessao:${target.id}:valida`);
  if(target.premium)check(policy.normalizeSpreadSession(session,{allowPremium:false})===null,`sessao:${target.id}:premium-fechado`);
}

const daily=await import(pathToFileURL(path.join(root,'daily-policy-v303.js')).href+`?qa=${Date.now()}`);
const fixed=new Date('2026-09-13T15:00:00.000Z');
const identity={scope:'device',digest:'1234abcd'};
const one=daily.createDailyRecord('  meu   caminho  ',fixed,identity);
const two=daily.createDailyRecord('outra pergunta',fixed,identity);
check(one.date==='2026-09-13'&&daily.DAILY_TIME_ZONE==='America/Sao_Paulo','diaria:brasilia');
check(one.id===two.id,'diaria:mesma-carta-no-dia');
check(one.orientation==='normal'&&one.reversed===false,'diaria:sempre-direta');
check(one.intention==='meu caminho'&&daily.isDailyRecord(one,one.date),'diaria:intencao-e-registro');
const account=daily.createAccountDailyRecord({local_date:'2026-09-13',card_id:77,revealed_at:fixed.toISOString()},'presença');
check(account.id===77&&account.selectionVersion===daily.DAILY_ACCOUNT_SELECTION_VERSION,'diaria:autoridade-conta');

const engine=read('spreads-engine.js'),dailyWorld=read('daily-world-v509.js'),css=read('daily-spreads-supreme-v554.css');
check(engine.includes('billingSnapshot()')&&engine.includes("premium_lifetime")&&engine.includes('target?.premium && !this.premium'),'premium:autoridade-servidor-fail-closed');
check(engine.includes('restoreLocalSession')&&engine.includes('renderPremium(target)'),'premium:restauracao-protegida');
check(engine.includes('cardAtlasStyle(card)')&&engine.includes('spread-position-atlas'),'fluidez:atlas-na-grade');
check(engine.includes('gridFullImageRequests')===false,'fluidez:contrato-no-app');
check(engine.includes('syncSpreadsOrb')&&engine.includes("mode:'spreads'")&&!engine.includes('spread-orb-aura'),'orbe:canonica-sem-duplicata');
check(dailyWorld.includes('animateFor(duration = 240)')&&dailyWorld.includes('animationUntil'),'diaria:magia-sob-demanda');
check(/setActive\(value\)[\s\S]{0,420}this\.paint\(performance\.now\(\)\)/.test(dailyWorld),'diaria:repouso-sem-loop');
check(dailyWorld.includes('interactionBurstMaxMs:320')&&dailyWorld.includes('permanentAnimationLoops:0'),'diaria:orcamento-auditavel');
check(!/animation\s*:[^;{}]*infinite/i.test(css),'visual:sem-loop-infinito');
check(css.includes('backdrop-filter:none!important')&&css.includes('prefers-reduced-motion:reduce'),'visual:leve-e-acessivel');
check(css.includes('min-height:44px')&&css.includes('border-radius:999px'),'iphone:toque-e-formas-redondas');

const app=read('app-v208.js'),loader=read('page-loader-v1.js'),index=read('index.html'),sw=read('sw.js'),manifest=read('manifest.webmanifest');
check(app.startsWith('/* DIVINA BRUXA 4.0 — FLUIDEZ SUPREMA · MACROETAPA 6/14 · V554'),'release:app');
check(app.includes("release:'V554'")&&app.includes("currentMacroStage:'6-of-14'"),'release:macroetapa');
check(app.includes('window.divinaDailySpreadsReleaseV554'),'release:contrato');
check((loader.match(/daily-spreads-supreme-v554\.css\?v=554/g)||[]).length===4,'release:loader-css');
check(index.includes('daily-spreads-supreme-v554.css?v=554')&&index.includes('app-v208.js?v=554'),'release:index');
check(index.includes('sw.js?v=554')&&index.includes('manifest.webmanifest?v=554'),'release:index-cache');
check(sw.includes('const VERSION=554')&&sw.includes('divina-bruxa-v554-shell')&&sw.includes("'./daily-spreads-supreme-v554.css'"),'release:sw-atomico');
check(manifest.includes('?v=554'),'release:manifest');
check(sw.includes("'./spreads-engine.js'")&&sw.includes("'./daily-policy-v303.js'"),'offline:diaria-e-tiragens-gratis');
check(fs.readdirSync(root).filter(file=>file.endsWith('.html')).length===321,'regressao:conteudo-real');

const total=passed+failures.length;
console.log(`V554 Carta do Dia e Tiragens: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
