/* DIVINA BRUXA 4.0 — EXECUTOR DE EVIDÊNCIAS V562
   Exit 0: PASS completo; exit 1: FAIL; exit 2: código PASS com etapa BLOCKED. */

import {spawnSync} from 'node:child_process';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const packagedRoot=dirname(fileURLToPath(import.meta.url));
const root=resolve(process.argv[2]||packagedRoot);
const suites=[
  {id:'loader',file:'qa-v562-loader-runtime.mjs',required:true},
  {id:'supreme',file:'qa-v562-supreme.mjs',required:true},
  {id:'service-worker',file:'qa-v562-service-worker-runtime.mjs',required:true},
  {id:'browser',file:'qa-v562-browser.mjs',required:false}
];
const evidence=[];

for(const suite of suites){
  const result=spawnSync(process.execPath,[resolve(root,suite.file),root],{
    cwd:root,
    env:process.env,
    encoding:'utf8',
    maxBuffer:16*1024*1024
  });
  const exitCode=Number.isInteger(result.status)?result.status:1;
  const state=exitCode===0?'PASS':exitCode===2&&!suite.required?'BLOCKED':'FAIL';
  evidence.push({
    id:suite.id,
    file:suite.file,
    required:suite.required,
    state,
    exitCode,
    stdout:String(result.stdout||'').trim().slice(0,4000),
    stderr:String(result.stderr||'').trim().slice(0,2000)
  });
}

const failed=evidence.filter(item=>item.state==='FAIL');
const blocked=evidence.filter(item=>item.state==='BLOCKED');
const state=failed.length?'FAIL':blocked.length?'BLOCKED':'PASS';
console.log(JSON.stringify({
  release:'V562',
  state,
  sourceGate:failed.some(item=>item.required)?'FAIL':'PASS',
  openP0:failed.filter(item=>item.required).length,
  openP1:0,
  ownerApproval:'BLOCKED',
  productionReady:false,
  evidence
},null,2));
process.exitCode=failed.length?1:blocked.length?2:0;
