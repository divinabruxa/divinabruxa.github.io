/* DIVINA BRUXA 3.0 — MACROETAPA 10/14 · BIBLIOTECA PÚBLICA V544
   Uma camada editorial leve sobre as 78 cartas, os guias e a busca local. */

import { CARDS } from './tarot-data.js';
import './tarot-meanings.js?v=544';
import { cardContentId, normalizeLibraryText } from './card-library-policy.js?v=544';

const RELEASE='V544';
const PATHS=Object.freeze([
  ['essencia','✦','Quero entender uma carta','essência significado mensagem'],
  ['amor','♡','Quero estudar relações','amor reciprocidade vínculo consentimento'],
  ['trabalho','⌘','Quero olhar trabalho e dinheiro','carreira trabalho dinheiro recursos'],
  ['simbolos','◇','Quero aprender pelos símbolos','símbolos imagem cor elemento'],
  ['combinacoes','⇄','Quero comparar cartas','combinações contraste síntese'],
  ['conselho','☾','Quero transformar em ação','conselho reflexão próximo passo']
]);
const GUIDES=Object.freeze([
  ['Começar do zero','tarot-para-iniciantes.html','Estrutura, famílias e primeira prática.'],
  ['Observar símbolos','simbolos-do-tarot.html','Cor, gesto, objeto e composição antes da interpretação.'],
  ['Fazer boas perguntas','como-fazer-perguntas-ao-tarot.html','Perguntas abertas com autonomia e contexto.'],
  ['Embaralhar com cuidado','como-embaralhar-cartas-de-tarot.html','Quatro métodos acessíveis e conservação.'],
  ['Cuidar do baralho','como-limpar-consagrar-baralho-de-tarot.html','Limpeza física, guarda e ritual sem danificar.'],
  ['Estudar por 30 dias','plano-de-estudo-do-tarot-em-30-dias.html','Rotina curta, revisão e prática progressiva.'],
  ['Registrar leituras','diario-de-tarot.html','Modelos de ficha e revisão privada.'],
  ['Ler com responsabilidade','etica-e-responsabilidade.html','Consentimento, limites e realidade.']
]);

const meaningFor=card=>globalThis.DivinaBruxaTarotMeanings?.get?.(cardContentId(card))||null;
const audit=()=>{
  const ids=new Set(CARDS.map(card=>cardContentId(card)));
  const meanings=CARDS.filter(card=>meaningFor(card)).length;
  const failures=[];
  if(CARDS.length!==78)failures.push('CARD_COUNT');
  if(ids.size!==78)failures.push('CARD_ID_UNIQUE');
  if(CARDS.some(card=>card.orientation!=='normal'))failures.push('ORIENTATION');
  if(meanings!==78)failures.push('MEANING_COUNT');
  return Object.freeze({release:RELEASE,cards:CARDS.length,uniqueCards:ids.size,directCards:CARDS.filter(card=>card.orientation==='normal').length,deepMeanings:meanings,guides:GUIDES.length,privateSearchReads:0,failures:Object.freeze(failures),passed:failures.length===0});
};

function applyQuery(root,query){
  const input=root.querySelector('[data-query],[data-library-query]');
  if(!input)return false;
  const search=root.querySelector('[data-search]');
  if(search?.hidden)root.querySelector('[data-search-toggle]')?.click();
  input.value=query;
  input.dispatchEvent(new Event('input',{bubbles:true}));
  input.focus({preventScroll:true});
  input.scrollIntoView?.({block:'center',behavior:'auto'});
  return true;
}

function render(root){
  root.querySelector('#publicLibraryCoreV544')?.remove();
  const section=document.createElement('section');
  section.id='publicLibraryCoreV544';
  section.className='pl544';
  section.setAttribute('aria-labelledby','pl544Title');
  section.innerHTML=`<header class="pl544__head"><div><p class="eyebrow">BIBLIOTECA PÚBLICA · 78 VOZES</p><h3 id="pl544Title">Entre pela pergunta que trouxe você.</h3><p>A busca encontra nomes em três idiomas, elementos, símbolos, palavras-chave e camadas profundas — sempre em posição direta.</p></div><span aria-hidden="true">78</span></header>
    <div class="pl544__paths">${PATHS.map(([,sigil,title,query])=>`<button type="button" data-v544-query="${query}"><span aria-hidden="true">${sigil}</span><b>${title}</b><small>BUSCAR NAS CARTAS</small></button>`).join('')}</div>
    <details class="pl544__guides"><summary><span aria-hidden="true">▤</span><span><b>Guias para aprender de verdade</b><small>Oito caminhos conectados à Biblioteca</small></span><i aria-hidden="true">＋</i></summary><div>${GUIDES.map(([title,href,copy])=>`<a href="${href}"><b>${title}</b><small>${copy}</small><span aria-hidden="true">→</span></a>`).join('')}</div></details>
    <ol class="pl544__method" aria-label="Método de leitura responsável"><li><b>Observe</b><span>nome, imagem, elemento e gesto</span></li><li><b>Contextualize</b><span>pergunta, posição e realidade</span></li><li><b>Relacione</b><span>luz, tensão e combinações</span></li><li><b>Escolha</b><span>um próximo passo possível</span></li></ol>`;
  const anchor=root.querySelector('.lb302__sanctuary,.library-tools');
  anchor?.before(section);
  if(!anchor)root.prepend(section);
  root.dataset.publicLibrary='v544';
}

export function createPublicLibraryCoreV544(){
  const controller=new AbortController();
  let result=audit();
  const enhance=()=>{
    const roots=[document.getElementById('cardLibraryApp'),document.getElementById('universalLibraryApp')].filter(root=>root?.children?.length);
    roots.forEach(render);
    return roots.length;
  };
  document.addEventListener('divina:library-world-ready',enhance,{signal:controller.signal});
  document.addEventListener('divina:public-library-ready',enhance,{signal:controller.signal});
  document.addEventListener('divina:page-ready',event=>{if(event.detail?.id==='library')enhance();},{signal:controller.signal});
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-v544-query]');
    if(!button)return;
    const root=button.closest('#cardLibraryApp,#universalLibraryApp');
    if(root)applyQuery(root,normalizeLibraryText(button.dataset.v544Query));
  },{signal:controller.signal});
  enhance();
  return Object.freeze({release:RELEASE,enhance,audit:()=>result,status:()=>Object.freeze({...result,macroStage:'10-of-14',permanentAnimationLoops:0,mutationObservers:0,extraApiCalls:0}),destroy:()=>controller.abort()});
}
