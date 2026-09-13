import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARDS } from './tarot-data.js';
import { internationalCardHrefV545 } from './international-card-content-v545.js';

const root=path.dirname(fileURLToPath(import.meta.url));
let passed=0;
const failures=[];
const check=(condition,label)=>condition?passed++:failures.push(label);
const exists=file=>fs.existsSync(path.join(root,file));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const ptHref=card=>card.arcanaCode==='major'?`carta-${card.canonicalId}.html`:`carta-${card.canonicalId.replace(/^\d+-/,'')}.html`;
const localTargets=html=>[...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match=>match[1].split(/[?#]/)[0]).filter(value=>value&&!/^(?:https?:|mailto:|tel:|data:|\/)/.test(value)&&value!=='.');

const coreFiles=['international-card-content-v545.js','international-parity-v545.css','international-parity-core-v545.js','international-library-v195.js','app-v208.js','index.html','pwa-world-v324.js','sw.js','sitemap.xml','sitemap-en.xml','sitemap-es.xml'];
coreFiles.forEach(file=>check(exists(file),`arquivo:${file}`));

check(CARDS.length===78,'catalogo-78');
check(CARDS.every(card=>card.orientation==='normal'),'78-diretas');
check(new Set(CARDS.map(card=>card.canonicalId)).size===78,'78-identidades');

for(const language of ['en','es'])for(const card of CARDS){
  const file=internationalCardHrefV545(card,language),html=read(file),pt=ptHref(card);
  check(exists(file),`${file}:existe`);
  check(html.length>9000,`${file}:profunda`);
  check(html.includes(`<html lang="${language}">`),`${file}:idioma`);
  check(html.includes(`rel="canonical" href="https://divinabruxa.com.br/${file}"`),`${file}:canonical`);
  check(html.includes(`hreflang="pt-BR" href="https://divinabruxa.com.br/${pt}"`),`${file}:pt`);
  check(html.includes(`hreflang="en" href="https://divinabruxa.com.br/${internationalCardHrefV545(card,'en')}"`),`${file}:en`);
  check(html.includes(`hreflang="es" href="https://divinabruxa.com.br/${internationalCardHrefV545(card,'es')}"`),`${file}:es`);
  check(html.includes('application/ld+json'),`${file}:schema`);
  check(html.includes(language==='es'?'Amor y relaciones':'Love and relationships'),`${file}:relacoes`);
  check(html.includes(language==='es'?'Trabajo y recursos':'Work and resources'),`${file}:trabalho`);
  check(html.includes(language==='es'?'Consejo y práctica':'Advice and practice'),`${file}:conselho`);
  check(html.includes(language==='es'?'al derecho':'upright'),`${file}:direta`);
  check(!/reversed card|carta invertida|orientación invertida/i.test(html),`${file}:sem-invertida`);
  for(const target of localTargets(html))check(exists(target)||target==='',`${file}:link:${target}`);
}

for(const card of CARDS){
  const file=ptHref(card),html=read(file);
  check(exists(file),`${file}:existe`);
  check(html.includes(`hreflang="en" href="https://divinabruxa.com.br/${internationalCardHrefV545(card,'en')}"`),`${file}:hreflang-en`);
  check(html.includes(`hreflang="es" href="https://divinabruxa.com.br/${internationalCardHrefV545(card,'es')}"`),`${file}:hreflang-es`);
}

const worlds={
  en:['tarot-spreads.html','music.html','face-to-face-with-tarot.html','mystic-store.html'],
  es:['tiradas-tarot.html','musica-tarot.html','de-frente-con-el-tarot.html','tienda-mistica.html']
};
for(const [language,files] of Object.entries(worlds))for(const file of files){
  const html=read(file);
  check(html.length>5400,`${file}:conteudo-real`);
  check(html.includes(`<html lang="${language}">`),`${file}:idioma`);
  check(html.includes('hreflang="pt-BR"')&&html.includes('hreflang="en"')&&html.includes('hreflang="es"'),`${file}:hreflang`);
  check(html.includes('application/ld+json'),`${file}:schema`);
  check(html.includes('international-parity-v545.css?v=545'),`${file}:css`);
  check(html.includes('pwa-world-v324.js?v=545'),`${file}:pwa`);
  for(const target of localTargets(html))check(exists(target)||target==='',`${file}:link:${target}`);
}

for(const file of ['english.html','free-tarot-reading.html','tarot-card-meanings.html','tarot-school.html','tarot-consultations.html','tarot-ethics.html','contact.html']){
  const html=read(file);for(const route of worlds.en)check(html.includes(route),`${file}:nav:${route}`);
}
for(const file of ['espanol.html','tarot-libre.html','significados-cartas-tarot.html','escuela-tarot.html','consultas-tarot.html','etica-tarot.html','contacto.html']){
  const html=read(file);for(const route of worlds.es)check(html.includes(route),`${file}:nav:${route}`);
}

const library=read('international-library-v195.js');
check(library.includes('internationalCardHrefV545'),'biblioteca-links-profundos');
check(library.includes('Read the full meaning'),'biblioteca-en');
check(library.includes('Leer significado completo'),'biblioteca-es');

for(const [language,sitemap] of [['en','sitemap-en.xml'],['es','sitemap-es.xml']]){
  const xml=read(sitemap);
  check((xml.match(/<url>/g)||[]).length===90,`${sitemap}:90-urls`);
  CARDS.forEach(card=>check(xml.includes(internationalCardHrefV545(card,language)),`${sitemap}:${card.canonicalId}`));
  worlds[language].forEach(file=>check(xml.includes(file),`${sitemap}:${file}`));
}

const app=read('app-v208.js'),index=read('index.html'),sw=read('sw.js'),pwa=read('pwa-world-v324.js'),core=read('international-parity-core-v545.js');
check(app.includes("release:'V545'"),'app-release');
check(app.includes("currentMacroStage:'11-of-14'"),'app-macro');
check(app.includes('createInternationalParityCoreV545'),'app-core');
check(app.includes('tarotFireRemoved:true'),'tarot-sem-fogo-preservado');
check(app.includes('canonicalTarotNormalOnly:true'),'tarot-direto-preservado');
check(app.includes("amazonStore:'v543'"),'loja-preservada');
check(index.includes('app-v208.js?v=545'),'index-app');
check(index.includes("__divinaSWBootstrap='v545-inline'"),'index-sw');
check(sw.includes('const VERSION=545'),'sw-versao');
check(sw.includes("name.startsWith('en-')"),'sw-fallback-en');
check(sw.includes("name.startsWith('es-')"),'sw-fallback-es');
check(pwa.includes('const VERSION=545'),'pwa-versao');
for(const token of ['pointermove','MutationObserver','setInterval(','requestAnimationFrame(','<canvas'])check(!core.includes(token),`core-sem:${token}`);
check(core.includes('oneCanonicalOrb:true'),'orbe-canonica');
check(core.includes('permanentAnimationLoops:0'),'sem-loops');
check(core.includes('privateContentReads:0'),'sem-leituras-privadas');
check(read('sitemap.xml').includes('sitemap-en.xml</loc><lastmod>2026-09-13'),'indice-en');
check(read('sitemap.xml').includes('sitemap-es.xml</loc><lastmod>2026-09-13'),'indice-es');

const total=passed+failures.length;
console.log(`V545 QA: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
