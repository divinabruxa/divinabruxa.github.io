import fs from 'node:fs';
import crypto from 'node:crypto';

const root = new URL('.', import.meta.url);
const lock = JSON.parse(fs.readFileSync(new URL('COFRE-VISUAL-DIVINA-BRUXA-V1.json', root), 'utf8'));
const failures = [];

for (const [file, expected] of Object.entries(lock.approved_assets_sha256)) {
  const path = new URL(file, root);
  if (!fs.existsSync(path)) {
    failures.push(`${file}: ausente`);
    continue;
  }
  const actual = crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
  if (actual !== expected) failures.push(`${file}: hash divergente`);
}

const index = fs.readFileSync(new URL('index.html', root), 'utf8');
const navigation = fs.readFileSync(new URL('navigation.js', root), 'utf8');
const required = [
  ['index.html', 'ORBE VIVA — MENU MÁGICO', index],
  ['index.html', 'id="orbCanvas"', index],
  ['navigation.js', 'pathsButton.dataset.go = \'skins\'', navigation],
  ['index.html', 'data-go="ai" class="dock-orb"', index]
];
for (const [file, needle, text] of required) {
  if (!text.includes(needle)) failures.push(`${file}: invariável ausente — ${needle}`);
}

if (failures.length) {
  console.error('FAIL — Cofre visual:', failures.join('; '));
  process.exitCode = 1;
} else {
  console.log('PASS — Cofre visual íntegro: ativos, Orbe, Menu e mini-Orbe preservados.');
}
