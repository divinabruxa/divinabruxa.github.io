/* DIVINA BRUXA 4.0 — RITMO PRIVADO DO DIÁRIO V556 */
import { store } from './storage.js';

const KEY='return-rhythm-v6';
const dateKey=value=>{
  const date=new Date(value);
  return Number.isNaN(date.getTime())?'':`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
};
const todayKey=()=>dateKey(new Date());
const validDays=value=>[...new Set((Array.isArray(value)?value:[]).map(String).filter(day=>/^\d{4}-\d{2}-\d{2}$/.test(day)))].sort().slice(-90);
const streakFor=days=>{
  if(!days.length)return 0;
  const set=new Set(days),cursor=new Date();
  if(!set.has(dateKey(cursor))){cursor.setDate(cursor.getDate()-1);if(!set.has(dateKey(cursor)))return 0;}
  let streak=0;
  while(set.has(dateKey(cursor))){streak+=1;cursor.setDate(cursor.getDate()-1);}
  return streak;
};

export class RhythmEngine{
  constructor(root){this.root=root;this.host=null;this.render();}
  state(){const saved=store.get(KEY,{days:[],startedAt:null});return{days:validDays(saved?.days),startedAt:saved?.startedAt||null};}
  save(state){store.set(KEY,{days:validDays(state.days),startedAt:state.startedAt||null});}
  checkIn(){const state=this.state(),today=todayKey();if(!state.days.includes(today))state.days.push(today);this.save({days:state.days,startedAt:state.startedAt||today});this.render();}
  reset(){const confirmed=globalThis.confirm?globalThis.confirm('Recomeçar somente o ritmo de presença? Suas memórias do Diário não serão apagadas.'):true;if(!confirmed)return;store.remove(KEY);this.render();}
  render(){
    if(!this.root)return;
    const state=this.state(),today=todayKey(),checked=state.days.includes(today),streak=streakFor(state.days);
    if(!this.host){this.root.insertAdjacentHTML('afterbegin','<aside class="rhythm-v6" aria-label="Jornada de retorno"></aside>');this.host=this.root.querySelector('.rhythm-v6');}
    this.host.innerHTML=`<div><p class="eyebrow">PULSO DA ORBE</p><h3>Um pequeno encontro por vez.</h3><p>Presença é escolha, não obrigação. O ritmo fica somente neste aparelho.</p></div><div class="rhythm-stat"><strong>${streak}</strong><small>${streak===1?'dia seguido':'dias seguidos'}</small></div><div class="rhythm-actions"><button type="button" data-rhythm-checkin ${checked?'disabled':''}>${checked?'Presença registrada hoje':'Registrar presença de hoje'}</button><button type="button" data-rhythm-reset>Limpar somente o ritmo</button></div>`;
    this.host.querySelector('[data-rhythm-checkin]').onclick=()=>this.checkIn();
    this.host.querySelector('[data-rhythm-reset]').onclick=()=>this.reset();
  }
  status(){const state=this.state();return Object.freeze({release:'V556',days:state.days.length,streak:streakFor(state.days),privateLocal:true,automaticCheckIn:false,permanentAnimationLoops:0});}
}
