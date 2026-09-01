import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('./media-catalog-v9.js',import.meta.url),'utf8');
const checks=[
  ['media statuses defined',source.includes("'draft'")&&source.includes("'published'")],
  ['music types defined',source.includes("'album'")&&source.includes("'single'")],
  ['video series exists',source.includes('de-frente-com-o-tarot')],
  ['music catalog exists',source.includes('music:Object.freeze')],
  ['platforms are explicit',source.includes("platforms:['Spotify','YouTube Music']")],
  ['slug is SEO-safe',source.includes("^[a-z0-9]+(?:-[a-z0-9]+)*$")],
  ['draft cannot publish directly',source.includes("entry.status==='review'")],
  ['no automatic external publishing',!source.includes('fetch(')&&!source.includes('window.open(')]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-MEDIA-CATALOG-V9.11',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
