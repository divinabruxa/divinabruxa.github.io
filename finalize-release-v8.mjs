import crypto from 'node:crypto';
import fs from 'node:fs';

const checksumFile = 'FINAL-FILE-CHECKSUMS-V8.30.txt';
const extensions = new Set(['.css', '.js', '.mjs', '.json', '.txt']);
const files = fs.readdirSync('.')
  .filter((file) => fs.statSync(file).isFile())
  .filter((file) => extensions.has(file.slice(file.lastIndexOf('.'))))
  .filter((file) => file !== checksumFile)
  .sort((a, b) => a.localeCompare(b));

const lines = files.map((file) => {
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  return `${hash}  ${file}`;
});

const header = [
  'DIVINA BRUXA — CHECKSUMS SHA-256 V8.30',
  `ARQUIVOS VERIFICADOS: ${files.length}`,
  'FORMATO: SHA-256  NOME-DO-ARQUIVO',
  ''
];
fs.writeFileSync(checksumFile, [...header, ...lines, ''].join('\n'), 'utf8');
console.log(JSON.stringify({ suite: 'DIVINA-BRUXA-CHECKSUMS-V8.30', status: 'CREATED', files: files.length, output: checksumFile }, null, 2));

