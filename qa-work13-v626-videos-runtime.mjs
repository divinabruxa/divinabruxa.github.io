import assert from 'node:assert/strict';
import {VIDEOS_WORLD_CONTRACT_V626,VideosWorldV626} from './videos-world-v626.js';

class FakeCustomEvent extends Event{constructor(type,options={}){super(type);this.detail=options.detail;}}
class FakeNode extends EventTarget{
  constructor(tag='div'){super();this.tagName=tag.toUpperCase();this.dataset={};this.children=[];this.attributes=new Map();this.hidden=false;this.removed=false;this.textContent='';this.style={};this.focuses=0;this.pauses=0;this.loads=0;this.src='';this.poster='';}
  append(...nodes){this.children.push(...nodes.filter(Boolean));}
  replaceChildren(...nodes){this.children=[...nodes];}
  setAttribute(name,value){this.attributes.set(name,String(value));if(name.startsWith('data-'))this.dataset[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(value);}
  removeAttribute(name){this.attributes.delete(name);if(name.startsWith('data-'))delete this.dataset[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())];if(name==='src')this.src='';}
  getAttribute(name){return this.attributes.get(name)??null;}
  remove(){this.removed=true;}
  focus(){this.focuses+=1;}
  pause(){this.pauses+=1;this.paused=true;}
  load(){this.loads+=1;}
  querySelector(){return null;}
  querySelectorAll(){return [];}
}
class FakeLegacy extends FakeNode{
  constructor(){super('div');this.frames=[];this.media=[];}
  querySelectorAll(selector){if(selector==='iframe')return this.frames.filter(node=>!node.removed);if(selector==='video,audio')return this.media.filter(node=>!node.removed);if(selector==='iframe,video,audio')return[...this.frames,...this.media].filter(node=>!node.removed);return[];}
}
class FakeRoot extends FakeNode{constructor(){super('section');this.attrs=new Map();}setAttribute(name,value){super.setAttribute(name,value);this.attrs.set(name,String(value));}removeAttribute(name){super.removeAttribute(name);this.attrs.delete(name);}}
class FakeDocument extends EventTarget{
  constructor(){super();this.defaultView={CustomEvent:FakeCustomEvent};this.hidden=false;this.body={dataset:{screen:'videos'}};this.orb=new FakeNode('button');this.canvas=new FakeNode('canvas');}
  createElement(tag){const node=new FakeNode(tag);if(tag==='video'){node.paused=true;node.playsInline=false;node.controls=false;node.autoplay=false;node.preload='';}return node;}
  querySelectorAll(selector){if(selector==='#orb')return[this.orb];if(selector==='#orbCanvas')return[this.canvas];return[];}
  querySelector(){return null;}getElementById(){return null;}
}

const doc=new FakeDocument();globalThis.document=doc;globalThis.CustomEvent=FakeCustomEvent;
const legacy=new FakeLegacy(),root=new FakeRoot(),playerSlot=new FakeNode('div');playerSlot.hidden=true;
const tabMemoji=new FakeNode('button'),tabTarot=new FakeNode('button');tabMemoji.dataset.v626Channel='memoji';tabTarot.dataset.v626Channel='tarot';
const memojiPanel=new FakeNode('section');
const publicShell={querySelectorAll:selector=>selector==='[data-v626-channel]'?[tabMemoji,tabTarot]:[],querySelector:selector=>selector==='[data-v626-panel="memoji"]'?memojiPanel:null};
let unloads=0;const pulses=[];
const win={location:{href:'https://divinabruxa.com.br/#videos',hash:'#videos'},divinaMusicVideoSupremeV559:{unloadPlayer(){unloads+=1;}}};
const world=Object.create(VideosWorldV626.prototype);
Object.assign(world,{config:{supabaseUrl:'https://kyphdsamyygavmkzyezr.supabase.co',supabasePublishableKey:'sb_publishable_test',accountFunctionsBase:'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1'},documentTarget:doc,windowTarget:win,root,legacy,playerSlot,publicShell,orbCore:{pulse:(kind,detail)=>pulses.push({kind,detail})},route:'videos',channel:'memoji',items:[],adminItems:[],loaded:true,loading:false,adminLoaded:false,adminLoading:false,activeItem:null,activeVideo:null,activeTrigger:null,expiresAt:Date.now()+3600000,publicRequests:0,adminRequests:0,uploads:0,uploadedBytes:0,playerOpens:0,playerCloses:0,destroyed:false,abort:new AbortController(),uploadAbort:null});

let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks+=1;};
const contract=VIDEOS_WORLD_CONTRACT_V626;
ok(contract.version===626&&contract.work==='WORK13','release dentro do WORK13');
ok(contract.channels.join('|')==='memoji-native|de-frente-com-o-tarot-youtube','dois portais');
ok(contract.memojiUpload==='signed-resumable-tus'&&contract.iphoneDirectUpload,'upload do iPhone');
ok(contract.privateStorage&&contract.publicSignedPlayback,'cofre privado');
ok(contract.officialEpisodesAtRelease===0&&contract.inventedEpisodes===0,'verdade editorial');
ok(contract.playerLoadsAfterExplicitGesture&&!contract.autoplay&&contract.maximumActivePlayers===1,'silêncio até o gesto');
ok(contract.work14===false,'sem WORK14');

const trigger=new FakeNode('button');
const item={id:'11111111-1111-4111-8111-111111111111',title:'A Orbe desperta',description:'Apresentação.',categoryLabel:'Orbe',accessibilityText:'Memoji falando.',videoUrl:'https://kyphdsamyygavmkzyezr.storage.supabase.co/storage/v1/object/sign/memoji/video.mp4?token=x',posterUrl:'https://kyphdsamyygavmkzyezr.storage.supabase.co/storage/v1/object/sign/memoji/poster.webp?token=x'};
ok(world.openPlayer(item,trigger)===true,'player abre por método explícito');
ok(world.activeVideo?.tagName==='VIDEO'&&world.playerSlot.hidden===false,'vídeo nativo montado');
ok(world.activeVideo.autoplay===false&&world.activeVideo.paused===true,'autoplay desligado');
ok(world.activeVideo.controls===true&&world.activeVideo.playsInline===true&&world.activeVideo.preload==='metadata','controles inline');
ok(world.activeVideo.src===item.videoUrl&&world.activeVideo.poster===item.posterUrl,'mídia assinada aplicada');
ok(root.dataset.v626Player==='active'&&root.dataset.v626PlayerId===item.id,'foco da obra explícito');
ok(pulses.length===1&&pulses[0].kind==='video-memoji','Orbe existente responde');
ok(world.activePlayers()===1,'um player ativo');
ok(unloads===1,'motor V559 encerrado antes do Memoji');

const native=world.activeVideo;
ok(world.closePlayer('test')===true,'fechamento explícito');
ok(native.pauses===1&&native.loads===1&&native.src==='','fonte removida e mídia pausada');
ok(playerSlot.hidden&&playerSlot.children.length===0,'slot desmontado');
ok(trigger.focuses===1,'foco devolvido ao acionador');
ok(world.activePlayers()===0&&root.dataset.v626Player===undefined,'nenhum player restante');

legacy.frames.push(new FakeNode('iframe'));legacy.media.push(new FakeNode('audio'));
world.selectChannel('tarot');
ok(world.channel==='tarot'&&legacy.hidden===false&&memojiPanel.hidden===true,'portal Tarot revelado');
world.selectChannel('memoji');
ok(world.channel==='memoji'&&legacy.hidden===true&&memojiPanel.hidden===false,'portal Memoji restaurado');
ok(legacy.frames.every(node=>node.removed)&&legacy.media[0].pauses===1,'iframe removido e áudio pausado');
ok(unloads>=2,'motor legado recebe parada');

let requestOptions=[];
globalThis.fetch=async(url,options)=>{requestOptions.push({url:String(url),options});return new Response(JSON.stringify({ok:true,items:[]}),{status:200,headers:{'content-type':'application/json'}});};
await world.api({scope:'public'});await world.api({scope:'admin'});
ok(requestOptions[0].options.credentials==='omit','feed público não envia cookies');
ok(requestOptions[1].options.credentials==='include','Admin envia cookies HttpOnly');
ok(requestOptions.every(call=>call.options.headers['x-divina-admin-request']==='v626'),'guard V626 em toda chamada');
ok(requestOptions.every(call=>call.options.headers.apikey==='sb_publishable_test'),'somente chave publicável no navegador');

requestOptions=[];world.uploadAbort=new AbortController();
const file=new Blob(['memoji'],{type:'video/mp4'});Object.defineProperty(file,'name',{value:'memoji.mp4'});
globalThis.fetch=async(url,options)=>{requestOptions.push({url:String(url),options});if(options.method==='POST')return new Response(null,{status:201,headers:{location:'/storage/v1/upload/resumable/session-1','upload-offset':'0'}});if(options.method==='PATCH')return new Response(null,{status:204,headers:{'upload-offset':String(file.size)}});return new Response(null,{status:204,headers:{'upload-offset':'0'}});};
const progress=[];
await world.uploadTus(file,{bucket:'memoji-videos-v626',path:'owner/folder/video.mp4',token:'signed-token',endpoint:'https://kyphdsamyygavmkzyezr.storage.supabase.co/storage/v1/upload/resumable'},value=>progress.push(value));
ok(requestOptions[0].options.method==='POST'&&requestOptions[0].options.headers['Tus-Resumable']==='1.0.0','sessão TUS criada');
ok(requestOptions[0].options.headers['Upload-Metadata'].includes('bucketName'),'metadados do bucket enviados');
ok(requestOptions[1].options.method==='PATCH'&&requestOptions[1].options.headers['Content-Type']==='application/offset+octet-stream','bloco TUS enviado');
ok(requestOptions.every(call=>call.options.headers['x-signature']==='signed-token'),'token assinado em cada etapa');
ok(progress.at(-1)===100&&world.uploads===1&&world.uploadedBytes===file.size,'progresso e contagem concluídos');

doc.body.dataset.screen='home';
world.syncRoute(new FakeCustomEvent('divina:route-ready',{detail:{id:'home'}}),'test-route');
ok(world.route==='home'&&!world.isVideoRoute(),'repouso fora de Vídeos');
const audit=world.audit();
ok(audit.oneCanonicalOrb&&audit.oneCanonicalCanvas&&audit.duplicateOrbs===0,'uma Orbe e um canvas');
ok(audit.singlePlayer&&!audit.autoplay&&audit.inventedEpisodes===0,'auditoria final');
ok(world.status().privateContentReads===0&&world.status().work14===false,'sem leitura privada ou WORK14');

console.log(`PASS ${checks}/${checks} — runtime do Cinema da Orbe V626`);
