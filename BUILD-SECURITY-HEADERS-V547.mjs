/* Reescrita idempotente V547: aplica CSP/referrer em todas as páginas HTML.
   Uso local de release. Não depende de rede e não altera conteúdo privado. */
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const policy="default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://kyphdsamyygavmkzyezr.supabase.co wss://kyphdsamyygavmkzyezr.supabase.co; frame-src https://open.spotify.com https://www.youtube.com https://www.youtube-nocookie.com; media-src 'self' blob: https:; worker-src 'self' blob:; manifest-src 'self'; form-action 'self' https://kyphdsamyygavmkzyezr.supabase.co; upgrade-insecure-requests";
const block=`<meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="referrer" content="strict-origin-when-cross-origin"><meta name="divina-security-release" content="V547">`;
const files=fs.readdirSync(root).filter(name=>name.endsWith('.html')).sort();
let changed=0;
for(const name of files){
  const file=path.join(root,name),before=fs.readFileSync(file,'utf8');
  let source=before
    .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi,'')
    .replace(/<meta name="referrer"[^>]*>/gi,'')
    .replace(/<meta name="divina-security-release"[^>]*>/gi,'')
    .replace(/manifest\.webmanifest\?v=\d+/g,'manifest.webmanifest?v=547');
  const charset=source.match(/<meta\s+charset=(?:"[^"]+"|'[^']+'|[^\s>]+)\s*>/i);
  if(!charset)throw new Error(`charset ausente: ${name}`);
  source=source.replace(charset[0],`${charset[0]}${block}`);
  if(source!==before){fs.writeFileSync(file,source);changed+=1;}
}
const covered=files.filter(name=>fs.readFileSync(path.join(root,name),'utf8').includes('name="divina-security-release" content="V547"')).length;
if(covered!==files.length)throw new Error(`cobertura incompleta: ${covered}/${files.length}`);
const manifestPath=path.join(root,'manifest.webmanifest');
const manifestBefore=fs.readFileSync(manifestPath,'utf8');
const manifestAfter=manifestBefore.replace(/\?v=\d+/g,'?v=547');
if(manifestAfter!==manifestBefore)fs.writeFileSync(manifestPath,manifestAfter);
console.log(JSON.stringify({release:'V547',html:files.length,covered,changed,cspMeta:true,referrerMeta:true,manifestVersion:547}));
