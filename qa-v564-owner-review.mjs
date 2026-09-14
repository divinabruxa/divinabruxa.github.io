/* DIVINA BRUXA 4.0 — V564 · validação do pacote de revisão final
   Uso: node qa-v564-owner-review.mjs /delta/v564 /base/v563 */

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

const manifest=JSON.parse(text('MANIFESTO-V564-REVISAO-FINAL.json'));
const decision=JSON.parse(text('DECISAO-V564-OWNER-REVIEW.json'));
const evidence=JSON.parse(text('EVIDENCIA-V564-REVISAO-FINAL.json'));
const entries=fs.readdirSync(root,{withFileTypes:true});
const actual=entries.filter(entry=>entry.isFile()).map(entry=>entry.name).sort();
const listed=[...manifest.files].sort();

check(entries.every(entry=>entry.isFile()),'package:flat');
check(JSON.stringify(actual)===JSON.stringify(listed),'manifest:exact-files');
check(manifest.release==='V564'&&manifest.requires==='V563','manifest:release-chain');
check(manifest.incremental===true&&manifest.flat===true,'manifest:incremental-flat');
check(manifest.replacements.length===0,'manifest:no-replacements');
check(manifest.new_files.length===manifest.files.length,'manifest:all-new');
check(new Set(manifest.files).size===manifest.files.length,'manifest:unique');
check(manifest.files.every(file=>!file.includes('/')&&!file.includes('\\')),'manifest:no-paths');

const hashLines=text('HASHES-SHA256-V564.txt').trim().split(/\r?\n/).filter(Boolean);
const hashes=new Map(hashLines.map(line=>{
  const match=line.match(/^([a-f0-9]{64})  (.+)$/);
  return match?[match[2],match[1]]:[line,'INVALID'];
}));
const hashTargets=manifest.files.filter(file=>file!=='HASHES-SHA256-V564.txt');
check(hashes.size===hashTargets.length,'hash:count');
for(const file of hashTargets)check(hashes.get(file)===sha(file),'hash:'+file);

if(baseline){
  for(const file of manifest.new_files)check(!fs.existsSync(path.join(baseline,file)),'baseline:new:'+file);
}

check(decision.technical_state==='PASS','decision:technical-pass');
check(decision.ready_for_owner_review===true,'decision:ready-for-owner-review');
check(decision.owner_review_state==='BLOCKED'&&decision.launch_gate==='BLOCKED','decision:launch-blocked');
check(Object.values(decision.authority_flags).every(value=>value===false),'decision:authority-closed');
check(decision.owner_decision===null,'decision:not-forged');
check(evidence.public_installation.qa_v563_post_install.passed===21,'evidence:v563-post-install');
check(evidence.public_installation.qa_v563_service_worker.passed===39,'evidence:v563-sw');
check(evidence.routes.length===13&&evidence.routes.every(route=>route.state==='PASS'),'evidence:routes-13');
check(evidence.database.public_tables===evidence.database.rls_enabled,'evidence:rls-all');
check(evidence.database.anon_writable===0,'evidence:anon-write-zero');
check(evidence.owner_and_continuity.active_owners===0,'evidence:no-owner');
check(evidence.owner_and_continuity.verified_restores===0,'evidence:no-restore');

const sql=text('STAGING-OWNER-REVIEW-V564.sql');
const executableSql=sql.replace(/--.*$/gm,'').replace(/'(?:''|[^'])*'/g,"''");
check(/set local transaction read only;/i.test(executableSql),'sql:read-only');
check(/rollback;/i.test(executableSql),'sql:rollback');
check(!/^\s*(?:insert|update|delete|create|alter|drop|truncate|grant|revoke|do|call)\b/im.test(executableSql),'sql:no-mutation');

const report=text('RELATORIO-V564-REVISAO-FINAL.md');
check(/READY FOR OWNER REVIEW \/ LAUNCH BLOCKED/.test(report),'report:honest-state');
check(/471/.test(report)&&/MFA\/AAL2/.test(report),'report:owner-gates');
check(/Nenhuma mudança em produção/.test(report),'report:no-production');

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V564',
  state:failures.length?'FAIL':'PASS',
  files:actual.length,
  replacements:manifest.replacements.length,
  newFiles:manifest.new_files.length,
  baselineCompared:Boolean(baseline),
  passed,
  failed:failures.length,
  total,
  launchGate:decision.launch_gate,
  failures
},null,2));
process.exitCode=failures.length?1:0;

