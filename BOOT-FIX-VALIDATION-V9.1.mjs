import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const file = 'app-v9.1-fixed.js';
const source = fs.readFileSync(file, 'utf8');
const checks = [
  ['sintaxe-js', () => { execFileSync(process.execPath, ['--check', file], { stdio: 'ignore' }); return true; }],
  ['binding-opcional-user-login', () => source.includes("bindSubmit('#userLogin'")],
  ['binding-opcional-user-register', () => source.includes("bindSubmit('#userRegister'")],
  ['binding-opcional-admin', () => source.includes("bindSubmit('#adminLogin'")],
  ['toast-sem-null', () => source.includes("if(!el){console.info")],
  ['admin-sem-desbloqueio-local', () => !source.includes('divinaAdmin?.unlock')],
  ['pwa-com-erro-observavel', () => source.includes("falha ao registrar PWA")],
  ['install-button-opcional', () => source.includes('if(installButton)installButton.onclick')]
].map(([name, test]) => { try { return { name, pass: Boolean(test()) }; } catch { return { name, pass: false }; } });
const failed = checks.filter((check) => !check.pass);
console.log(JSON.stringify({ suite: 'DIVINA-BRUXA-BOOT-FIX-V9.1', status: failed.length ? 'FAIL' : 'PASS', total: checks.length, passed: checks.length - failed.length, failed }, null, 2));
process.exitCode = failed.length ? 1 : 0;

