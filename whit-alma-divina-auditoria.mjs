// Macroetapa 1: ferramenta de diagnóstico. Não importar este arquivo no navegador.
// Uso: node whit-alma-divina-auditoria.mjs CAMINHO_DO_REPOSITORIO DIRETORIO_DE_SAIDA
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, relative, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = resolve(process.argv[2] || '.');
const out = resolve(process.argv[3] || './whit-diagnostico');
const entry = 'whit-divine-soul-engine-v408.js';
const files = new Map();
const missing = new Set();
// Varredura estática de imports/exports ESM locais. Não rastreia imports dinâmicos.
const imports = /(?:import|export)\s+(?:[^;]*?\s+from\s+)?['"]([^'"]+)['"]/g;
async function visit(name) {
  if (files.has(name) || missing.has(name)) return;
  let bytes;
  try { bytes = await readFile(resolve(root, name)); }
  catch (error) { if (error.code === 'ENOENT') { missing.add(name); return; } throw error; }
  const text = bytes.toString('utf8');
  const deps = [...text.matchAll(imports)].map(m => m[1]).filter(s => s.startsWith('.'))
    .map(s => relative(root, resolve(dirname(resolve(root, name)), s.split(/[?#]/)[0])));
  if (deps.some(d => d.startsWith('..') || isAbsolute(d))) throw new Error('Import fora do repositório.');
  files.set(name, { path:name, sha256:createHash('sha256').update(bytes).digest('hex'), bytes:bytes.length, imports:[...new Set(deps)] });
  for (const dep of deps) await visit(dep);
}
for (const name of ['app.js', entry, 'index.html', 'sw.js', 'spread-state-v310.js', 'lib/daily-card.js', 'carta-do-dia.html', 'tarot-livre.html', 'tiragens-de-tarot.html']) await visit(name);
let commit = null;
try { commit = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding:'utf8' }).trim(); } catch {}
await mkdir(out, { recursive:true });
const manifest = { schemaVersion:1, commit, entry, limitation:'Imports ESM estáticos locais; não comprova execução no navegador ou publicação.', missing:[...missing], files:[...files.values()].sort((a,b) => a.path.localeCompare(b.path)) };
await writeFile(resolve(out, 'WHIT-ALMA-DIVINA-MANIFESTO-BASE.json'), JSON.stringify(manifest,null,2)+'\n');
if (missing.size) throw new Error(`Dependências ausentes: ${[...missing].join(', ')}`);
const { CARDS } = await import(pathToFileURL(resolve(root, 'data/cards.js')));
const { SPREADS } = await import(pathToFileURL(resolve(root, 'spread-state-v310.js')));
const { whitTarotReading } = await import(pathToFileURL(resolve(root, entry)));
const { dailyCardIndex } = await import(pathToFileURL(resolve(root, 'lib/daily-card.js')));
const select = names => names.map(name => { const card=CARDS.find(c => c.name===name); if(!card) throw new Error(`Carta ausente: ${name}`); return card; });
const trio = select(['A Estrela','A Torre','O Sol']);
const cases = [
  { name:'carta-do-dia', cards:[CARDS[dailyCardIndex('2026-10-10',CARDS.length)]], positions:['2026-10-10'], scope:'carta-do-dia' },
  { name:'tarot-livre-carta-atual', cards:[trio[0]], positions:['posição-1'], scope:'tarot-livre' },
  { name:'tres-tempos-amor', cards:trio, positions:SPREADS['tres-tempos'].positions, question:'Como posso cuidar dos meus vínculos?', scope:'tiragem-tres-tempos' },
  { name:'tres-tempos-trabalho', cards:trio, positions:SPREADS['tres-tempos'].positions, question:'Como posso mudar minha situação no trabalho?', scope:'tiragem-tres-tempos' },
  { name:'tres-tempos-posicoes-trocadas', cards:trio, positions:[...SPREADS['tres-tempos'].positions].reverse(), question:'Como posso cuidar dos meus vínculos?', scope:'tiragem-tres-tempos' },
  { name:'tres-tempos-carta-trocada', cards:[trio[0],CARDS[14],trio[2]], positions:SPREADS['tres-tempos'].positions, question:'Como posso cuidar dos meus vínculos?', scope:'tiragem-tres-tempos' },
  { name:'cruz-celta', cards:CARDS.slice(0,10), positions:SPREADS['cruz-celta'].positions, question:'Como atravessar uma mudança?', scope:'tiragem-cruz-celta' },
  { name:'mesa-real', cards:CARDS, positions:SPREADS['mesa-real'].positions, question:'Quais temas merecem minha atenção?', scope:'tiragem-mesa-real' }
];
const examples = cases.map(({name,...options}) => {
  const input = {...options,seed:'whit-alma-divina-baseline-2026-10-10'};
  const reading = whitTarotReading(input);
  const repeated = whitTarotReading(input);
  return { name, input:{...input,cards:input.cards.map(c=>({id:c.id,canonicalId:c.canonicalId,name:c.name}))}, stable:JSON.stringify(reading)===JSON.stringify(repeated), reading };
});
const comparisons = { questionChanges:examples[2].reading.essence!==examples[3].reading.essence, positionChanges:examples[2].reading.essence!==examples[4].reading.essence, cardChanges:examples[2].reading.essence!==examples[5].reading.essence };
await writeFile(resolve(out,'WHIT-ALMA-DIVINA-LEITURAS-ANTES.json'), JSON.stringify({commit,comparisons,examples},null,2)+'\n');
console.log(JSON.stringify({commit,files:files.size,missing:[...missing],examples:examples.length,stable:examples.every(e=>e.stable),comparisons},null,2));
