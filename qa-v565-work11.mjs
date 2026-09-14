/* DIVINA BRUXA 4.0 — WORK11 V565 · QA DO PRIMEIRO MOTOR
   Uso: node qa-v565-work11.mjs /delta/v565 /base/v563 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const packagedRoot=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(process.argv[2]||packagedRoot);
const baseline=process.argv[3]?path.resolve(process.argv[3]):null;
const failures=[];
let passed=0;
const check=(condition,id,detail='')=>condition?passed++:failures.push({id,detail});
const read=file=>fs.readFileSync(path.join(root,file));
const text=file=>read(file).toString('utf8');
const sha=file=>crypto.createHash('sha256').update(read(file)).digest('hex');

const manifest=JSON.parse(text('MANIFESTO-V565-WORK11-MOTOR-1.json'));
const entries=fs.readdirSync(root,{withFileTypes:true});
const actual=entries.filter(entry=>entry.isFile()).map(entry=>entry.name).sort();
const listed=[...manifest.files].sort();

check(entries.every(entry=>entry.isFile()),'package:flat');
check(JSON.stringify(actual)===JSON.stringify(listed),'manifest:exact-files');
check(manifest.release==='V565'&&manifest.work==='WORK11','manifest:release-work');
check(manifest.plan==='Divina Bruxa 4.0'&&manifest.new_plan===false,'manifest:no-5.0');
check(manifest.incremental===true&&manifest.flat===true,'manifest:incremental-flat');
check(manifest.content_frozen===true,'manifest:content-frozen');
check(manifest.replacements.length===3,'manifest:replacement-count');
check(manifest.new_files.includes('orb-persistent-journey-v565.js'),'manifest:new-motor');
check(new Set(manifest.files).size===manifest.files.length,'manifest:unique');
check(manifest.files.every(file=>!file.includes('/')&&!file.includes('\\')),'manifest:no-paths');

const hashLines=text('HASHES-SHA256-V565.txt').trim().split(/\r?\n/).filter(Boolean);
const hashes=new Map(hashLines.map(line=>{
  const match=line.match(/^([a-f0-9]{64})  (.+)$/);
  return match?[match[2],match[1]]:[line,'INVALID'];
}));
const hashTargets=manifest.files.filter(file=>file!=='HASHES-SHA256-V565.txt');
check(hashes.size===hashTargets.length,'hash:count');
for(const file of hashTargets)check(hashes.get(file)===sha(file),'hash:'+file);

if(baseline){
  for(const file of manifest.replacements){
    check(fs.existsSync(path.join(baseline,file)),'baseline:replacement-exists:'+file);
    if(fs.existsSync(path.join(baseline,file)))check(!read(file).equals(fs.readFileSync(path.join(baseline,file))),'baseline:changed:'+file);
  }
  for(const file of manifest.new_files)check(!fs.existsSync(path.join(baseline,file)),'baseline:new:'+file);
}

const motor=text('orb-persistent-journey-v565.js');
check(/class OrbPersistentJourneyV565/.test(motor),'motor:class');
check(/layerCreations:1/.test(motor)&&/perRouteRecreation:false/.test(motor),'motor:persistent-layer');
check(/singleVisualTraveler:true/.test(motor),'motor:single-traveler');
check(/snapshotCadence:'one-per-navigation'/.test(motor),'motor:single-snapshot');
check(/renderer\?\.suspend/.test(motor)&&/renderer\?\.resume/.test(motor),'motor:heavy-renderer-pause');
check(/data-orb-global-flight/.test(motor)&&/animation-play-state:paused/.test(motor),'motor:css-effects-pause');
check(/cubic-bezier\(\.22,\.78,\.18,1\)/.test(motor),'motor:ios-flight-curve');
check(/cubic-bezier\(\.2,\.82,\.16,1\)/.test(motor),'motor:ios-arrival-curve');
check(!/setInterval\s*\(/.test(motor),'motor:no-interval');
check(!/fetch\s*\(|localStorage|sessionStorage|indexedDB|\.value\b/.test(motor),'motor:no-data-read');
check(!/innerHTML\s*[+]/.test(motor),'motor:no-route-rebuild');

const app=text('app-v208.js');
check(/createOrbPersistentJourneyV565/.test(app),'app:imports-motor');
check(/setJourneyEngine\?\.\(orbIOSJourney\)/.test(app),'app:motor-authority');
check(!/createOrbIOSJourneyCoreV525/.test(app),'app:old-journey-not-instantiated');
check(/sw\.js\?v=565/.test(app),'app:sw-epoch');

const index=text('index.html');
check(/app-v208\.js\?v=565/.test(index),'index:app-epoch');
check(/sw\.js\?v=565/.test(index)&&/divina\.sw\.reload\.v565/.test(index),'index:sw-epoch');

const sw=text('sw.js');
check(/const VERSION=565;/.test(sw),'sw:version');
check(/divina-bruxa-v565-shell/.test(sw),'sw:cache');
check(/orb-persistent-journey-v565\.js/.test(sw),'sw:motor-atomic');
check(/app-v208\\\.js\\\?v=565/.test(sw),'sw:shell-validation');
check(/if\(response&&!response\.ok\)return response/.test(sw),'sw:404-preserved');

const install=text('00-INSTALE-V565-WORK11-MOTOR-1.txt');
check(/não avance/i.test(install)&&/iPhone/i.test(install),'instructions:test-gate');
check(/não apague/i.test(install)&&/raiz/i.test(install),'instructions:root-preserve');

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V565',work:'WORK11',state:failures.length?'FAIL':'PASS',
  files:actual.length,replacements:manifest.replacements.length,newFiles:manifest.new_files.length,
  baselineCompared:Boolean(baseline),passed,failed:failures.length,total,failures
},null,2));
process.exitCode=failures.length?1:0;

