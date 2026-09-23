import assert from 'node:assert/strict';
import {MUSICA_WORLD_CONTRACT_V625,createMusicaWorldV625} from './musica-world-v625.js';

class FakeCustomEvent extends Event {
  constructor(type,options={}){super(type);this.detail=options.detail;}
}
class FakeClassList {
  constructor(...values){this.values=new Set(values)}
  contains(value){return this.values.has(value)}
}
class FakeNode extends EventTarget {
  constructor({id='',tag='div',classes=[],dataset={}}={}){
    super();this.id=id;this.tagName=tag.toUpperCase();this.dataset={...dataset};
    this.classList=new FakeClassList(...classes);this.children=[];this.parentNode=null;
    this.textContent='';this.href='';this.rel='';this.removed=false;this.frames=0;
    this.activeRelease=false;
  }
  append(...nodes){nodes.filter(Boolean).forEach(node=>{node.parentNode=this;this.children.push(node)})}
  remove(){this.removed=true}
  querySelector(selector){
    if(String(selector).includes('h2'))return this.children.find(child=>child.tagName==='H2')||null;
    if(selector==='.mv559-release-card.is-active')return this.activeRelease?{}:null;
    return null;
  }
  querySelectorAll(selector){return selector==='iframe'?Array.from({length:this.frames},()=>({})):[]}
}
class FakeTarget {
  constructor(role=''){this.role=role}
  closest(selector){
    if(selector==='#musicApp [data-close-player]')return this.role==='close'?{}:null;
    if(selector==='#musicApp [data-play-release]')return this.role==='play'?{}:null;
    if(selector==='#musicApp [data-v609-action="music-depth"]')return this.role==='depth'?{}:null;
    if(selector==='#musicApp [data-release-id]')return this.role==='album'?{}:null;
    if(selector==='#musicApp .mv559-tracklist button,#musicApp [data-track-id]')return this.role==='track'?{}:null;
    if(selector==='#musicApp [data-open-spotify],#musicApp .mv559-actions a[target="_blank"]')return this.role==='external'?{}:null;
    return null;
  }
}
class FakeDocument extends EventTarget {
  constructor(){
    super();this.defaultView={CustomEvent:FakeCustomEvent};
    this.documentElement=new FakeNode({id:'html',tag:'html'});
    this.body={dataset:{screen:'music'}};
    this.head={children:[],append:node=>this.head.children.push(node)};
    this.nodes=new Map();
    this.screen=this.add(new FakeNode({id:'music',classes:['screen','active']}));
    this.title=new FakeNode({tag:'h2'});
    this.app=this.add(new FakeNode({id:'musicApp'}));
    this.orb=this.add(new FakeNode({id:'orb',tag:'button'}));
    this.canvas=this.add(new FakeNode({id:'orbCanvas',tag:'canvas'}));
    this.orb.append(this.canvas);this.screen.append(this.title,this.app);
  }
  add(node){this.nodes.set(node.id,node);return node}
  createElement(tag){return new FakeNode({tag})}
  getElementById(id){return this.nodes.get(id)||this.head.children.find(node=>node.id===id)||null}
  querySelector(selector){if(selector==='#app > .screen.active[id],.screen.active[id]')return this.screen;return null}
  querySelectorAll(selector){if(selector==='#orb')return[this.orb];if(selector==='#orbCanvas')return[this.canvas];return[]}
}
class FakeWindow extends EventTarget {constructor(){super();this.location={hash:'#music'}}}

const fire=(target,type,detail={},eventTarget=null)=>{
  const event=new FakeCustomEvent(type,{detail});
  if(eventTarget)Object.defineProperty(event,'target',{value:eventTarget});
  target.dispatchEvent(event);
};
let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks+=1};
const c=MUSICA_WORLD_CONTRACT_V625;

ok(c.version===625&&c.work==='WORK13','release dentro do WORK13');
ok(c.universe==='palco-das-estrelas'&&c.reality==='music','mundo declarado');
ok(c.sequence.length===8&&c.sequence[1]==='two-real-albums','travessia da obra');
ok(c.musicAuthority==='V559-preserved'&&c.livingMediaAuthority==='V609-preserved','autoridades preservadas');
ok(c.artist==='Hércules DX'&&c.verifiedAlbumCount===2&&c.verifiedTracks===18,'discografia real');
ok(c.verifiedAlbums[0].title==='Sobre as Estrelas'&&c.verifiedAlbums[0].tracks===10,'primeiro álbum real');
ok(c.verifiedAlbums[1].title==='Z'&&c.verifiedAlbums[1].tracks===8,'segundo álbum real');
ok(c.inventedAlbums===0&&c.inventedTracks===0,'nenhum catálogo inventado');
ok(c.futureReleaseTypes.join('|')==='album|ep|single'&&c.futureReleasesAdminEditable,'expansão pelo Admin');
ok(c.draftPublishedFlowPreserved&&c.publishedCatalogueOnly,'publicação editorial preservada');
ok(c.playerLoadsAfterExplicitGesture&&c.playbackNeverStartsOnArrival&&!c.autoplay,'silêncio até o gesto');
ok(c.maximumActivePlayers===1&&c.anotherPlayerStopsBeforePlayback,'um player');
ok(c.canonicalOrbRespondsOnExplicitChoice&&c.canonicalOrbResponse==='existing-pulse-only','Orbe responde sem motor novo');
ok(c.listeningHistoryReads===0&&c.privateContentReads===0,'privacidade preservada');
ok(c.reusesCanonicalOrb&&c.newCanvases===0&&c.newPlayers===0,'uma Orbe e player existente');
ok(c.permanentAnimationLoops===0&&c.mutationObservers===0&&c.deferredTimers===0,'sem peso contínuo');
ok(c.work14===false,'sem WORK14');

const doc=new FakeDocument();const win=new FakeWindow();
const pulses=[];
const world=createMusicaWorldV625({
  media:{status:()=>({version:559})},livingMedia:{status:()=>({version:609})},
  orbCore:{pulse:(kind,detail)=>pulses.push({kind,detail})},documentTarget:doc,windowTarget:win
});
ok(doc.documentElement.dataset.work13MusicaWorld==='v625','identidade global');
ok(doc.screen.dataset.musicaUniverse==='palco-das-estrelas'&&doc.screen.dataset.musicaWorldPresence==='present','palco presente');
ok(doc.app.dataset.musicaWorldPrivacy==='public-catalogue-and-public-player-state-only','corpo público e limitado');
ok(doc.app.dataset.musicaAutoplay==='off'&&doc.app.dataset.musicaMaximumPlayers==='1','travas no corpo');
ok(world.phase==='albums','entrada mostra as duas obras');
ok(doc.title.textContent==='Sobre as Estrelas e Z acendem o Palco das Estrelas.','convite verdadeiro');
ok(doc.head.children.length===1&&doc.head.children[0].href.includes('musica-world-v625.css'),'estilo único');

fire(doc,'click',{},new FakeTarget('album'));
ok(world.phase==='album'&&world.albumChoices===1,'escolha explícita de álbum');
ok(pulses.length===1&&pulses[0].kind==='music-album','Orbe responde à obra escolhida');
doc.screen.dataset.v609Phase='detail';
fire(doc,'click',{},new FakeTarget('depth'));
ok(world.phase==='tracks'&&world.trackRequests===1,'faixas só por pedido');
fire(doc,'click',{},new FakeTarget('track'));
ok(world.phase==='tracks'&&world.trackRequests===2,'faixa explícita registrada sem conteúdo');
fire(doc,'click',{},new FakeTarget('play'));
ok(world.phase==='playing'&&world.playRequests===1,'player só após gesto');
ok(pulses.length===2&&pulses[1].kind==='music-play','Orbe responde ao play no motor existente');
doc.app.frames=1;
ok(world.audit().singlePlayer&&world.audit().activePlayers===1,'um player auditado');
doc.app.frames=2;
ok(world.audit().singlePlayer===false,'duplicação é detectada');
doc.app.frames=0;
fire(doc,'click',{},new FakeTarget('close'));
ok(world.phase==='album'&&world.playerCloses===1,'fechar devolve à obra');
fire(doc,'click',{},new FakeTarget('external'));
ok(world.phase==='passage'&&world.externalPassages===1,'destino oficial explícito');
fire(doc,'divina:music-state',{route:'music',state:'playing',secret:'CANARY_PRIVATE_MEDIA'});
ok(world.phase==='playing'&&world.publicSignals===1,'estado público sincronizado');
ok(!JSON.stringify(world.status()).includes('CANARY'),'payload não é retido');
fire(doc,'divina:menu-state',{state:'open'});
ok(world.phase==='portal','pentagrama abre o portal');
doc.screen.dataset.v609Phase='focus';doc.app.activeRelease=true;
fire(doc,'divina:menu-state',{state:'closed'});
ok(world.phase==='album','retorno preserva a obra');
const audit=world.audit();
ok(audit.oneCanonicalOrb&&audit.oneCanonicalCanvas&&audit.duplicateOrbs===0,'unicidade auditada');
ok(!audit.autoplay&&audit.inventedAlbums===0&&audit.inventedTracks===0,'verdade auditada');
fire(doc,'divina:route-start',{id:'videos'});
ok(world.phase==='travel','travessia responde');
doc.body.dataset.screen='videos';
fire(doc,'divina:route-ready',{id:'videos'});
ok(world.phase==='rest'&&doc.screen.dataset.musicaWorldPresence==='away','repouso fora do palco');
ok(world.status().networkCalls===0&&world.status().storageWrites===0&&world.status().work14===false,'sem efeito paralelo');
world.destroy();
ok(doc.getElementById('divinaMusicaWorldV625').removed===true,'desmontagem remove estilo');
ok(!doc.documentElement.dataset.work13MusicaWorld&&!doc.screen.dataset.musicaWorld&&!doc.app.dataset.musicaWorld,'desmontagem limpa identidade');

console.log(`PASS ${checks}/${checks} — runtime do Palco das Estrelas V625`);
