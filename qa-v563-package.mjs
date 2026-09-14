import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const packagedRoot=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(process.argv[2]||packagedRoot);
const baseline=process.argv[3]?path.resolve(process.argv[3]):null;
const manifestName='MANIFESTO-V563-CORRECAO-404-PWA.json';
const hashName='HASHES-SHA256-V563.txt';
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
check(manifest.release==='V563','manifest:release');
check(manifest.requires==='V562','manifest:requires');
check(manifest.flat===true&&manifest.incremental===true,'manifest:incremental-flat');
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

const replacements=new Set(manifest.replacements);
const newFiles=new Set(manifest.new_files);
check(manifest.files.every(file=>file===hashName||replacements.has(file)||newFiles.has(file)),'manifest:classified');
check([...replacements].every(file=>manifest.files.includes(file)),'manifest:replacements-listed');
check([...newFiles].every(file=>manifest.files.includes(file)),'manifest:new-listed');

if(baseline){
  for(const file of manifest.replacements){
    const previous=path.join(baseline,file);
    check(fs.existsSync(previous),'baseline:replacement-exists:'+file);
    if(fs.existsSync(previous))check(!read(file).equals(fs.readFileSync(previous)),'baseline:replacement-changed:'+file);
  }
  for(const file of manifest.new_files)check(!fs.existsSync(path.join(baseline,file)),'baseline:new-absent:'+file);
}

const install=read('00-INSTALE-V563-CORRECAO-404-PWA.txt').toString('utf8');
check(/SOMENTE STAGING/i.test(install)&&/não publica produção/i.test(install),'instructions:authority');
check(/V562/.test(install)&&/raiz/.test(install),'instructions:base-root');

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V563',
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
