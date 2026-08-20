import { CARDS } from './tarot-data.js';
import { store } from './storage.js';

function shuffle(ids) { const a=[...ids]; for(let i=a.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; }
function fresh() { return { waiting: shuffle(CARDS.map(c=>c.id)), revealed: [], reversed: [], completed: false }; }

export class FreeTarot {
  constructor(root) { this.root=root; this.state=store.get('free-tarot',fresh()); if(!this.valid())this.state=fresh(); this.bind(); this.render(); }
  valid(){const ids=[...this.state.waiting,...this.state.revealed];return ids.length===78&&new Set(ids).size===78;}
  bind(){this.root.querySelector('#nextCard').addEventListener('click',()=>this.draw());this.root.querySelector('#resetDeck').addEventListener('click',()=>this.reset());this.root.querySelector('#memory').addEventListener('click',e=>{const b=e.target.closest('[data-index]');if(b)this.show(+b.dataset.index,false);});}
  draw(){if(!this.state.waiting.length)return;const id=this.state.waiting.shift();this.state.revealed.push(id);this.state.reversed.push(Math.random()<.22);this.state.completed=!this.state.waiting.length;store.set('free-tarot',this.state);this.render();this.show(this.state.revealed.length-1,true);navigator.vibrate?.([12,22,18]);}
  show(index,animate=true){const id=this.state.revealed[index],card=CARDS[id],rev=this.state.reversed[index],stage=this.root.querySelector('#current');stage.className=`current ${rev?'reversed':''} ${animate?'birth':''}`;stage.innerHTML=`<img src="${card.image}" alt="${card.name}"><div class="card-label"><strong>${card.name}</strong><span>${rev?'Invertida':'Direta'}</span></div>`;if(animate)setTimeout(()=>stage.classList.remove('birth'),850);}
  render(){const total=this.state.revealed.length;this.root.querySelector('#count').innerHTML=`${total}<small>/78</small>`;this.root.querySelector('#remaining').textContent=this.state.waiting.length?`${this.state.waiting.length} cartas aguardam`:'Ciclo completo';this.root.querySelector('#memory').innerHTML=this.state.revealed.map((id,i)=>`<button data-index="${i}" aria-label="Rever ${CARDS[id].name}"><img src="${CARDS[id].image}" alt=""><span>${i+1}</span></button>`).join('');this.root.querySelector('#resetDeck').hidden=!this.state.completed;this.root.querySelector('#nextCard').disabled=this.state.completed;if(total)this.show(total-1,false);}
  reset(){this.state=fresh();store.set('free-tarot',this.state);this.root.querySelector('#current').className='current empty';this.root.querySelector('#current').innerHTML='<div class="empty-card">A próxima carta nascerá da Orbe.</div>';this.render();}
}
