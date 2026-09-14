/* DIVINA BRUXA 4.0 — VALIDAÇÃO DO DELTA PLANO V562
   Uso: node qa-v562-package.mjs /delta/v562 /base/v561 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const packagedRoot=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(process.argv[2]||packagedRoot);
const baseline=process.argv[3]?path.resolve(process.argv[3]):null;
const manifestName='MANIFESTO-V562-QA-SUPREMO.json';
const hashName='HASHES-SHA256-V562.txt';
const failures=[];
let passed=0;
const check=(condition,id,detail='')=>condition?passed++:failures.push({id,detail});
const read=file=>fs.readFileSync(path.join(root,file));
const sha=file=>crypto.createHash('sha256').update(read(file)).digest('hex');

const entries=fs.readdirSync(root,{withFileTypes:true});
check(entries.every(entry=>entry.isFile()),'flat:no-directories');
const actual=entries.filter(entry=>entry.isFile()).map(entry=>entry.name).sort();
const manifest=JSON.parse(read(manifestName).toString('utf8'));
const listed=[...manifest.files].sort();
check(manifest.release==='V562','manifest:release');
check(manifest.requires==='V561','manifest:requires');
check(manifest.plan==='4.0-fluidity-supreme','manifest:plan');
check(manifest.macro_stage==='14/14','manifest:macro');
check(manifest.flat===true,'manifest:flat');
check(manifest.file_count===manifest.files.length,'manifest:file-count');
check(new Set(manifest.files).size===manifest.files.length,'manifest:unique');
check(manifest.files.every(file=>!file.includes('/')&&!file.includes('\\')),'manifest:no-paths');
check(JSON.stringify(actual)===JSON.stringify(listed),'manifest:exact-directory','actual='+actual.length+'; listed='+listed.length);

const hashLines=read(hashName).toString('utf8').trim().split(/\r?\n/).filter(Boolean);
const hashes=new Map(hashLines.map(line=>{
  const match=line.match(/^([a-f0-9]{64})  (.+)$/);
  return match?[match[2],match[1]]:[line,'INVALID'];
}));
const hashTargets=manifest.files.filter(file=>file!==hashName);
check(hashes.size===hashTargets.length,'hash:count',hashes.size+'/'+hashTargets.length);
for(const file of hashTargets){
  check(hashes.has(file),'hash:entry:'+file);
  if(hashes.has(file))check(hashes.get(file)===sha(file),'hash:value:'+file);
}

const replacementSet=new Set(manifest.replacements);
const newSet=new Set(manifest.new_files);
check(manifest.files.every(file=>file===hashName||replacementSet.has(file)||newSet.has(file)),'manifest:classified');
check([...replacementSet].every(file=>manifest.files.includes(file)),'manifest:replacements-listed');
check([...newSet].every(file=>manifest.files.includes(file)),'manifest:new-listed');

if(baseline){
  for(const file of manifest.replacements){
    const previous=path.join(baseline,file);
    check(fs.existsSync(previous),'baseline:replacement-exists:'+file);
    if(fs.existsSync(previous))check(!read(file).equals(fs.readFileSync(previous)),'baseline:replacement-changed:'+file);
  }
  for(const file of manifest.new_files){
    check(!fs.existsSync(path.join(baseline,file)),'baseline:new-absent:'+file);
  }
}

const sql=read('STAGING-QA-SUPREMO-V562.sql').toString('utf8');
const executableSql=sql.replace(/--.*$/gm,'').replace(/'(?:''|[^'])*'/g,"''");
check(/set local transaction read only;/i.test(executableSql),'sql:read-only');
check(!/^\s*(?:insert|update|delete|create|alter|drop|truncate|grant|revoke|do|call)\b/im.test(executableSql),'sql:no-mutation');
const install=read('00-INSTALE-V562-QA-SUPREMO.txt').toString('utf8');
check(/SOMENTE STAGING/i.test(install)&&/NÃO PUBLICA PRODUÇÃO/i.test(install),'instructions:staging-only');
check(/V561/.test(install)&&/raiz/.test(install),'instructions:base-and-root');

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V562',
  state:failures.length?'FAIL':'PASS',
  flat:true,
  files:actual.length,
  hashes:hashes.size,
  baselineCompared:Boolean(baseline),
  passed,
  failed:failures.length,
  total,
  failures
},null,2));
process.exitCode=failures.length?1:0;
