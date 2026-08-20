import { CARDS } from './tarot-data.js';import { meaning } from './meaning-engine.js';
const DEFINITIONS=[
 {name:'Uma Carta',positions:['Resposta'],description:'Uma direção clara para o agora.'},
 {name:'Passado · Presente · Tendência',positions:['Passado','Presente','Tendência'],description:'Entenda a linha do tempo da questão.'},
 {name:'Situação · Ação · Resultado',positions:['Situação','Ação','Resultado'],description:'Transforme reflexão em movimento.'},
 {name:'Amor',positions:['Você','A outra energia','O caminho da relação'],description:'Uma leitura simbólica dos vínculos.'},
 {name:'Dois Caminhos',positions:['Situação','Caminho A','Resultado A','Caminho B','Resultado B'],description:'Compare as energias de duas escolhas.'},
 {name:'Cruz Celta',positions:['Presente','Desafio','Raiz','Passado','Possibilidade','Futuro próximo','Você','Ambiente','Esperanças e medos','Síntese'],description:'Um panorama profundo em dez posições.'}
];
function shuffle(){const a=[...CARDS];for(let i=a.length-1;i;i--){const u=new Uint32Array(1);crypto.getRandomValues(u);const j=u[0]%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
export class SpreadsEngine{
 constructor(grid,result,onSave){this.grid=grid;this.result=result;this.onSave=onSave;this.renderMenu();}
 renderMenu(){this.grid.innerHTML=DEFINITIONS.map((s,i)=>`<button data-spread="${i}"><h3>${s.name}</h3><span>${s.description}</span><small>${s.positions.length} carta${s.positions.length>1?'s':''}</small></button>`).join('');this.grid.onclick=e=>{const b=e.target.closest('[data-spread]');if(b)this.draw(+b.dataset.spread);};}
 draw(index){const spread=DEFINITIONS[index],cards=shuffle().slice(0,spread.positions.length).map((card,i)=>({card,reversed:Math.random()<.2,position:spread.positions[i]}));this.result.innerHTML=`<article class="spread-reading"><p class="eyebrow">${spread.name}</p><div class="spread-layout count-${cards.length}">${cards.map(x=>`<figure class="${x.reversed?'reversed':''}"><span>${x.position}</span><img src="${x.card.image}" alt="${x.card.name}"><figcaption>${x.card.name}</figcaption></figure>`).join('')}</div><div class="spread-meanings">${cards.map(x=>{const m=meaning(x.card,x.reversed);return `<article><span>${x.position}</span><h3>${x.card.name}</h3><p class="keywords">${m.keywords}</p><p>${m.message}</p></article>`}).join('')}</div><button class="primary" data-save-spread>Guardar tiragem no Diário</button></article>`;this.result.querySelector('[data-save-spread]').onclick=()=>this.onSave({text:`Tiragem ${spread.name}: ${cards.map(x=>`${x.position} — ${x.card.name}`).join('; ')}`,cardIds:cards.map(x=>x.card.id),type:'spread'});this.result.scrollIntoView({behavior:'smooth'});}
}
