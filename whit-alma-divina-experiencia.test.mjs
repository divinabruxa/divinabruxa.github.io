import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {dirname,resolve,relative} from 'node:path';
import vm from 'node:vm';
import {arbitrioForCard,arbitrioConversation,arbitrioCapacity,arbitrioHash} from './arbitrio-engine-v360.js';
import {arbitrioForCard as bridge} from './arbitrio-engine-v370.js';
const root=dirname(new URL(import.meta.url).pathname);
const app=await readFile(new URL('app.js',import.meta.url),'utf8');
const retired=/^(?:arbitrio-engine-|love-engine-|mind-engine-|spirit-engine-|matter-engine-|tarot-(?:story|soul|life|orbe-realities)-engine-|whit-(?:tarot-|superior-tarot-engine|divine-soul-engine))/;
async function graph(name,seen=new Set()){
  if(seen.has(name))return seen;seen.add(name);
  const source=await readFile(resolve(root,name),'utf8');
  const imports=[...source.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)].map(m=>m[1]);
  for(const path of imports)await graph(relative(root,resolve(dirname(resolve(root,name)),path.split(/[?#]/)[0])),seen);
  return seen;
}
test('o grafo ativo da aplicação não importa nenhum motor antigo',async()=>{const files=await graph('app.js');assert.ok(files.has('whit-alma-divina-core-v1.js'));assert.deepEqual([...files].filter(n=>retired.test(n)),[]);});
test('o cache inicial não inclui os 23 módulos aposentados',async()=>{const sw=await readFile(new URL('sw.js',import.meta.url),'utf8');const files=[...sw.slice(0,sw.indexOf('self.addEventListener')).matchAll(/['"]\.\/([^'"]+)['"]/g)].map(m=>m[1]);assert.deepEqual(files.filter(n=>retired.test(n)),[]);assert.ok(files.includes('whit-world-v401.js'));assert.ok(files.includes('whit-alma-divina-experiencia-v1.css'));});
test('geradores de Arbítrio foram desativados; utilidade de hash continua disponível',()=>{assert.throws(()=>arbitrioForCard(),/aposentado/);assert.throws(()=>arbitrioConversation(),/aposentado/);assert.throws(()=>bridge(),/aposentado/);assert.equal(arbitrioCapacity().active,false);assert.equal(typeof arbitrioHash('exemplo'),'number');});
test('as duas fontes de Arbítrio não conservam bancos de histórias ou motor do Amor',async()=>{for(const file of ['arbitrio-engine-v360.js','arbitrio-engine-v370.js']){const source=await readFile(new URL(file,import.meta.url),'utf8');assert.ok(source.length<1500);assert.doesNotMatch(source,/love-engine|infuseLove|const\s+(?:OPENINGS|STORIES|SCENES)/);}});
test('o acesso contextual à Whit não muda as cinco intenções do menu',async()=>{const html=await readFile(new URL('index.html',import.meta.url),'utf8');assert.match(html,/data-route-link="whit" class="whit-tarot-entry"/);assert.match(app,/tarot:\['tarot', 'carta-do-dia', 'tiragens', 'biblioteca'\]/);assert.match(app,/inner:\['diario', 'whit'\]/);});
// Modelo mínimo de DOM para exercitar agrupamento e clique. Não simula navegador ou layout.
class Element{
  constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.events={};this.hidden=false;this.textContent='';}
  append(...items){this.children.push(...items);}
  replaceChildren(...items){this.children=[...items];}
  setAttribute(key,value){this.attrs[key]=value;}
  addEventListener(key,fn){this.events[key]=fn;}
  querySelectorAll(tag){return this.children.flatMap(c=>[...(c.tag===tag?[c]:[]),...c.querySelectorAll(tag)]);}
}
function renderer(){
  const start=app.indexOf('const depthRenderState = new WeakMap();'),end=app.indexOf('function pulseOrb()',start);
  assert.ok(start>=0&&end>start);const notices=[];
  const context=vm.createContext({document:{createElement:tag=>new Element(tag)},announce:text=>notices.push(text)});
  vm.runInContext(app.slice(start,end),context);
  return {render:context.renderLivingDepth,notices};
}
const reading=()=>({depthOptions:[{key:'complete',label:'Ler a história completa'},{key:'love',label:'Explorar os vínculos'},{key:'celtic-knot',label:'O nó central'}],depthResponses:{complete:'História inteira',love:'Reflexão de vínculos','celtic-knot':'Capítulo central'}});
test('o primeiro controle é a história completa, com grupos recolhidos para dimensões e capítulos',()=>{const r=renderer(),choices=new Element('div'),response=new Element('p');r.render(choices,response,reading());assert.equal(choices.children[0].tag,'button');assert.equal(choices.children[1].tag,'details');assert.equal(choices.children[1].children[0].textContent,'Dimensões da reflexão');assert.equal(choices.children[2].children[0].textContent,'Capítulos da tiragem');});
test('o clique abre o conteúdo correto e marca só o botão escolhido',()=>{const r=renderer(),choices=new Element('div'),response=new Element('p');response.id='resposta';r.render(choices,response,reading());const buttons=choices.querySelectorAll('button');buttons[2].events.click();assert.equal(response.textContent,'Capítulo central');assert.equal(response.hidden,false);assert.equal(buttons[2].attrs['aria-pressed'],'true');assert.equal(buttons[0].attrs['aria-pressed'],'false');assert.equal(buttons[2].attrs['aria-controls'],'resposta');});
test('re-renderizar a mesma leitura conserva os elementos e o aprofundamento aberto',()=>{const r=renderer(),choices=new Element('div'),response=new Element('p'),creation=reading();r.render(choices,response,creation);const button=choices.children[0];button.events.click();r.render(choices,response,creation);assert.equal(choices.children[0],button);assert.equal(response.textContent,'História inteira');assert.equal(response.hidden,false);});
test('quando o texto muda, o renderer substitui os controles e fecha a resposta anterior',()=>{const r=renderer(),choices=new Element('div'),response=new Element('p'),creation=reading();r.render(choices,response,creation);choices.children[0].events.click();creation.depthResponses.complete='Outra história';r.render(choices,response,creation);assert.equal(response.hidden,true);assert.equal(response.textContent,'');choices.children[0].events.click();assert.equal(response.textContent,'Outra história');});
test('uma leitura sem aprofundamento não deixa botões vazios',()=>{const r=renderer(),choices=new Element('div'),response=new Element('p');r.render(choices,response,{depthOptions:[{key:'inexistente',label:'Não usar'}],depthResponses:{}});assert.equal(choices.hidden,true);assert.equal(choices.children.length,0);});
test('o CSS local define tamanho de toque, coluna móvel e quebra de texto',async()=>{const css=await readFile(new URL('whit-alma-divina-experiencia-v1.css',import.meta.url),'utf8');assert.match(css,/min-height:44px/);assert.match(css,/max-width:600px/);assert.match(css,/grid-template-columns:1fr/);assert.match(css,/overflow-wrap:anywhere/);assert.doesNotMatch(css,/\.orb|\.journey|#home/);});
