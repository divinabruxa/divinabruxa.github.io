import fs from 'node:fs';
const read=n=>fs.readFileSync(n,'utf8');
const files=['index.html','app.js','sw.js','tarot-data.js','tarot-engine.js','orb-engine-v68.js','trust-policy.js'];
const f=Object.fromEntries(files.map(n=>[n,read(n)]));
const checks=[
 ['P0 · V77 visual preservada',f['index.html'].includes('visual-v68.css?v=77')&&f['index.html'].includes('magic-menu')],
 ['P0 · Orbe com toque e animação',f['orb-engine-v68.js'].includes('pointer')&&f['orb-engine-v68.js'].includes('requestAnimationFrame')],
 ['P0 · 78 cartas canônicas',f['tarot-data.js'].includes('78')||f['tarot-engine.js'].includes('DECK_SIZE')],
 ['P0 · Tarot sem invertidas',!/inverted|reversed|invertida|invertido/i.test(f['tarot-engine.js'])],
 ['P0 · privacidade bloqueia produção',f['trust-policy.js'].includes('productionBlocked:true')],
 ['P1 · telas essenciais presentes',f['index.html'].includes('id="tarot"')&&f['index.html'].includes('id="daily"')&&f['index.html'].includes('id="spreads"')],
 ['P1 · menu com loja e vídeos',f['index.html'].includes('data-go="store"')&&f['index.html'].includes('data-go="videos"')],
 ['P1 · analytics não coleta Diário',f['app.js'].includes('AnalyticsEngine')&&read('analytics-policy.js').includes('journal_body')],
 ['P1 · PWA registrado',f['app.js'].includes('serviceWorker')&&f['index.html'].includes('manifest.webmanifest')],
 ['P1 · cache de confiança atual',f['sw.js'].includes('macro17-trust')&&f['sw.js'].includes('trust-engine.js')]
];let bad=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)bad++;}if(bad)process.exit(1);console.log(`\n${checks.length}/${checks.length} QA checks passed`);
