import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packagedRoot=dirname(fileURLToPath(import.meta.url));
const root=resolve(process.argv[2]||packagedRoot);
const loaderPath=resolve(root,'page-loader-v1.js');
const qaPath=resolve(root,'qa-supreme-launch-v562.js');
const [{loadModuleAfterStylesV562},{summarizeQaEvidenceV562}]=await Promise.all([
  import(`${pathToFileURL(loaderPath).href}?qa-v562=${Date.now()}`),
  import(`${pathToFileURL(qaPath).href}?qa-v562=${Date.now()}`)
]);

const source=await readFile(loaderPath,'utf8');
const events=[];
const later=(label,value,delay)=>new Promise(resolveTimer=>setTimeout(()=>{
  events.push(label);
  resolveTimer(value);
},delay));
const expectedModule=Object.freeze({TarotLivreOrbOSV517:class TarotLivreOrbOSV517{}});
const selected=await loadModuleAfterStylesV562([
  later('style-a',{tagName:'LINK'},20),
  later('style-b',{tagName:'LINK'},5)
],later('module',expectedModule,10));

assert.equal(selected,expectedModule,'o último resultado deve ser o módulo, nunca um link CSS');
assert.deepEqual(events,['style-b','module','style-a'],'CSS e módulo devem iniciar em paralelo');
await assert.rejects(
  loadModuleAfterStylesV562([Promise.reject(new Error('style-failed'))],Promise.resolve(expectedModule)),
  /style-failed/,
  'falha de CSS precisa manter o carregamento atômico'
);
await assert.rejects(
  loadModuleAfterStylesV562([],Promise.resolve(null)),
  /module_load_invalid_v562/,
  'resultado sem módulo precisa falhar fechado'
);

const helperOccurrences=(source.match(/loadModuleAfterStylesV562\(/g)||[]).length;
assert.equal(helperOccurrences,14,'13 carregadores e a declaração do helper devem existir');
assert.equal(
  /const\s+\[[^\]]*\bmodule\b[^\]]*\]\s*=\s*await\s+Promise\.all/.test(source),
  false,
  'nenhum mundo pode selecionar o módulo por índice posicional'
);
for(const file of [
  'tarot-livre-orbe-os-v517.js','daily-world-v509.js','library-world-v302.js',
  'school-world-v306.js','spreads-world-v305.js','media-commerce-world-v320.js'
]){
  const escaped=file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  assert.match(source,new RegExp(`loadModuleAfterStylesV562\\([\\s\\S]{0,420}import\\(['\"]\\./${escaped}`),`${file} deve usar o contrato V562`);
}

assert.deepEqual(
  summarizeQaEvidenceV562([{state:'PASS'},{state:'BLOCKED'},{state:'NOT RUN'}]),
  {PASS:1,FAIL:0,BLOCKED:1,'NOT RUN':1,gate:'BLOCKED',total:3},
  'BLOCKED deve prevalecer sobre NOT RUN'
);
assert.equal(summarizeQaEvidenceV562([{state:'PASS'},{state:'FAIL'}]).gate,'FAIL','FAIL deve prevalecer no gate');

console.log(JSON.stringify({
  ok:true,
  release:'V562',
  moduleSelection:'last-result-explicit',
  loadersCovered:13,
  affectedWorldsFixed:['tarot','daily','library','school','spreads','store'],
  positionalModuleDestructuring:0,
  evidenceClassifier:true
},null,2));
