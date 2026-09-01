import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const resultPath = path.join(root, 'HOMOLOGATION-RESULT-V8.27.json');
const allowed = new Set(['pending', 'pass', 'fail', 'blocked']);

function stop(message) {
  console.error(JSON.stringify({ suite: 'DIVINA-BRUXA-RELEASE-GATE-V8.27', status: 'INVALID', message }, null, 2));
  process.exit(2);
}

if (!fs.existsSync(resultPath)) stop('HOMOLOGATION-RESULT-V8.27.json não encontrado.');

let data;
try {
  data = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
} catch (error) {
  stop(`JSON inválido: ${error.message}`);
}

if (!Array.isArray(data.checks) || data.checks.length === 0) stop('Lista de testes vazia.');

const malformed = data.checks.filter((check) =>
  !check.id || !check.device || !check.area || !allowed.has(check.status)
);
if (malformed.length) stop(`Existem ${malformed.length} testes incompletos ou com status inválido.`);

const counts = data.checks.reduce((total, check) => {
  total[check.status] += 1;
  return total;
}, { pending: 0, pass: 0, fail: 0, blocked: 0 });

const criticalOpen = data.checks.filter((check) =>
  check.priority === 'P0' && check.status !== 'pass'
);
const everyCheckPassed = counts.pass === data.checks.length;
const ownerApproved = data.ownerApproval === true;
const releaseReady = everyCheckPassed && ownerApproved && criticalOpen.length === 0;

const report = {
  suite: 'DIVINA-BRUXA-RELEASE-GATE-V8.27',
  status: releaseReady ? 'APPROVED' : 'BLOCKED',
  productionReady: releaseReady,
  ownerApproval: ownerApproved,
  total: data.checks.length,
  counts,
  criticalOpen: criticalOpen.map(({ id, device, area, status }) => ({ id, device, area, status })),
  nextAction: releaseReady
    ? 'Avançar para a preparação final de produção.'
    : 'Concluir testes reais, registrar evidências e obter aprovação da proprietária.'
};

console.log(JSON.stringify(report, null, 2));

if (process.argv.includes('--enforce') && !releaseReady) process.exit(1);

