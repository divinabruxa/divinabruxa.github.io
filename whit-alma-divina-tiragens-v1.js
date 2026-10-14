/** Capítulos relacionais de Cruz Celta e Mesa Real. Não sorteia nem altera acesso. */
import { WHIT_THEME_AXES } from './whit-alma-divina-base-v1.js';
export const WHIT_SPREAD_NARRATIVE_VERSION='1.0.0';
const lower=s=>s.charAt(0).toLocaleLowerCase('pt-BR')+s.slice(1);
const unique=list=>[...new Set(list.filter(Boolean))];
const natural=list=>list.length<2?list.join(''):list.slice(0,-1).join(', ')+' e '+list.at(-1);
function ordered(layout){return [...layout.contexts].sort((a,b)=>a.position.index-b.position.index);}
function themes(contexts){const counts=new Map();for(const c of contexts)for(const t of c.card.themes)counts.set(t,(counts.get(t)||0)+1);return [...counts].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t])=>WHIT_THEME_AXES[t]).filter(Boolean);}
function chapter({key,label,contexts,links=[],frame,closing}){
  if(!contexts.length)return null;
  const first=contexts[0],last=contexts.at(-1);
  const transition=unique(links.filter(l=>l.kind==='transition').map(l=>l.narrative)).slice(0,2);
  const contrasts=contexts.find(c=>['challenge','cost','hopeFear'].includes(c.position.role))||contexts.find(c=>c.card.themes.some(t=>['ruptura','conflito','incerteza','dor','apego'].includes(t)))||first;
  const dialogue=transition.length?transition.join(' '):`A força de ${first.card.strength} encontra a exigência de ${last.card.strength}. Essa aproximação pede cuidado com o risco de ${contrasts.card.tension}.`;
  const paragraphs=[
    `${frame} A imagem de abertura mostra que ${lower(first.card.scene)}. ${first.functionText} O conjunto deste capítulo convida a ${natural(themes(contexts))}; esses temas pertencem às imagens presentes, sem preencher as posições que ainda não foram reveladas.`,
    `${dialogue} O contraste não precisa ser resolvido por uma frase otimista. Pode indicar a diferença entre o que se deseja preservar e o que precisa de outra forma para continuar. A força de ${contrasts.card.strength} pede medida quando encontra o risco de ${contrasts.card.tension}.`,
    `${closing} Uma atitude a considerar é: ${lower(last.card.action)}. Compare essa proposta com as condições reais da pergunta. O valor do capítulo está em perceber uma relação e localizar um gesto possível, sem transformar a história em um resultado inevitável.`
  ];
  return {key,label,positions:contexts.map(c=>c.position.index),canonicalIds:contexts.map(c=>c.card.canonicalId),paragraphs,text:paragraphs.join('\n\n')};
}
function celtic(layout){
  const all=ordered(layout),select=ids=>all.filter(c=>ids.includes(c.position.index));
  const groups=[
    {key:'celtic-knot',label:'O nó central',ids:[0,1],frame:'O nó central reúne a situação presente e aquilo que a atravessa. A segunda imagem é uma tensão, não um anúncio de desastre.',closing:'Antes de procurar uma conclusão, observe o que essa tensão muda na forma de participar da situação.'},
    {key:'celtic-roots',label:'Raízes e movimento',ids:[2,3,4,5],frame:'Intenção, base, passado e movimento possível dialogam sem se tornarem uma biografia conhecida. O passado é uma função simbólica; o futuro é uma possibilidade.',closing:'Uma passagem ganha sentido quando reconhece o que oferece sustentação e o que está deixando de servir.'},
    {key:'celtic-direction',label:'Postura, vínculos e direção',ids:[6,7,8,9],frame:'Postura, ambiente, expectativas e direção mostram como uma escolha pode conversar com o contexto. A mesa não conhece pensamentos privados de outras pessoas.',closing:'A síntese recebe o percurso inteiro. Um conselho só se torna útil quando respeita a tensão da mesa e os limites da situação.'}
  ];
  return groups.map(g=>{
    const result=chapter({...g,contexts:select(g.ids),links:layout.links.filter(l=>g.ids.includes(l.fromPosition)&&g.ids.includes(l.toPosition))});
    if(!result)return null;
    const get=i=>all.find(c=>c.position.index===i);
    const segments=g.key==='celtic-roots'
      ? [get(2)&&`A intenção procura ${get(2).card.strength}.`,get(3)&&`Como base simbólica, ${lower(get(3).card.scene)}.`,get(4)&&`O padrão que se afasta evoca ${get(4).card.symbol}.`,get(5)&&`O movimento possível pede cuidado com ${get(5).card.tension}.`]
      : g.key==='celtic-direction'
      ? [get(6)&&`Uma postura a explorar encontra força em ${get(6).card.strength}.`,get(7)&&`No ambiente simbólico, ${lower(get(7).card.scene)}.`,get(8)&&`As expectativas pedem distinguir ${get(8).card.strength} do risco de ${get(8).card.tension}.`,get(9)&&`A direção reúne esse contraste numa proposta: ${lower(get(9).card.action)}.`]
      : [];
    if(segments.some(Boolean)){result.paragraphs.splice(1,0,segments.filter(Boolean).join(' '));result.text=result.paragraphs.join('\n\n');}
    return result;
  }).filter(Boolean);
}
function royal(layout){
  const all=ordered(layout),chapters=[];
  for(let row=1;row<=6;row++){
    const contexts=all.filter(c=>c.position.row===row);
    const positions=new Set(contexts.map(c=>c.position.index));
    const c=chapter({key:'royal-row-'+row,label:`Linha ${row} · os fios desta passagem`,contexts,
      links:layout.links.filter(l=>positions.has(l.fromPosition)&&positions.has(l.toPosition)),
      frame:`Nesta linha, ${contexts.length} ${contexts.length===1?'imagem foi revelada':'imagens foram reveladas'}. A linha é uma sequência espacial, sem representar um mês ou uma área fixa da vida.`,
      closing:'Observe como as imagens se aproximam ou mudam de tom ao longo da linha. A última casa não é um destino; participa do contraste e da direção deste capítulo.'});
    if(c)chapters.push(c);
  }
  const center=all.filter(c=>[32,45].includes(c.position.index));
  if(center.length)chapters.push(chapter({key:'royal-center',label:'O centro da mesa',contexts:center,
    links:layout.links.filter(l=>l.fromPosition===32&&l.toPosition===45),
    frame:'O centro geométrico fica entre duas linhas. As imagens efetivamente presentes ali oferecem um ponto de aproximação entre os fios da mesa; não representam uma autoridade superior às demais.',
    closing:'Compare o centro com os padrões das linhas antes de tratá-lo como a resposta principal.'}));
  const vertical=layout.links.filter(l=>l.toPosition-l.fromPosition===13);
  if(vertical.length){
    const strongest=vertical.find(l=>l.kind==='transition')||vertical.find(l=>l.kind==='contrast')||vertical[0];
    const selected=all.filter(c=>[strongest.fromPosition,strongest.toPosition].includes(c.position.index));
    chapters.push(chapter({key:'royal-crossings',label:'Relações entre as linhas',contexts:selected,links:[strongest],
      frame:'As vizinhanças verticais aproximam imagens de linhas diferentes. Uma relação selecionada ajuda a ler o contraste; ela não substitui as outras relações da mesa.',
      closing:`Neste ponto, as posições ${selected.map(c=>c.position.label).join(' e ')} dialogam espacialmente. Confira como esse diálogo se aproxima dos temas que reaparecem nas outras linhas.`}));
  }
  return chapters;
}
export function enrichWhitSpread(text,layout){
  if(!['cruz-celta','mesa-real'].includes(layout.spreadId))return text;
  const all=ordered(layout),total=layout.spreadId==='cruz-celta'?10:78,complete=all.length===total;
  const chapters=layout.spreadId==='cruz-celta'?celtic(layout):royal(layout);
  const themeText=natural(themes(all));
  const summary=layout.spreadId==='cruz-celta'
    ? `A Cruz Celta reúne uma tensão central, suas raízes e uma direção possível. ${complete?'As dez posições estão presentes.':'A história está em formação: '+all.length+' de dez posições foram reveladas.'} Os temas que atravessam a composição convidam a ${themeText}. ${text.tendencyText} ${text.counselText}`
    : `A Mesa Real reúne fios que precisam ser observados juntos. ${complete?'As 78 cartas estão presentes.':'A mesa está em formação: '+all.length+' de 78 cartas foram reveladas.'} Entre as imagens reveladas, os temas recorrentes convidam a ${themeText}. ${text.tendencyText} ${text.counselText}`;
  // Cada fio de linha contribui para a integração, sem transformar 78 cartas em 78 definições.
  const integration=layout.spreadId==='mesa-real'
    ? `Na leitura conjunta, ${chapters.filter(c=>c.key.startsWith('royal-row')).map(c=>`a linha ${c.key.split('-').at(-1)} convida a ${natural(themes(all.filter(x=>c.positions.includes(x.position.index))))}`).join('; ')}. Essas recorrências não apagam as diferenças de uma linha para outra. Elas ajudam a reconhecer onde um tema insiste, onde muda de expressão e onde encontra contraste. Uma predominância não define a personalidade de ninguém: descreve o repertório simbólico desta mesa.`
    : `Para integrar a Cruz Celta, não basta olhar apenas a posição final. O desafio modifica a forma de ler a situação; a base e o passado ajudam a explorar o que sustenta ou antecede o movimento; postura, ambiente e expectativas mostram o que precisa ser considerado antes de concluir. As posições ainda ocultas não recebem uma história inventada. Quando todas estiverem presentes, a direção poderá ser comparada ao percurso inteiro.`;
  const bridge=`A leitura profunda nasce dessa comparação. Se um capítulo parece pedir avanço e outro pede pausa, vale perguntar o que deve avançar e o que precisa de tempo. Duas necessidades podem coexistir sem que uma delas torne a outra falsa. A mente separa interpretação e evidência; o amor examina reciprocidade e limite; a atitude encontra escala possível; a espiritualidade dá linguagem à passagem. ${text.closing}`;
  const paragraphs=[...text.paragraphs,integration,bridge];
  const responses={...text.depthResponses,...Object.fromEntries(chapters.map(c=>[c.key,c.text]))};
  responses.complete=[text.symbolicNotice||'Uma história simbólica criada a partir do Tarot para inspirar reflexão.',...paragraphs].join('\n\n');
  return {...text,essence:'Ficção simbólica para reflexão. '+summary,paragraphs,story:paragraphs.join('\n\n'),depthResponses:responses,
    depthOptions:[...text.depthOptions.filter(o=>o.key!=='positions'),...chapters.map(c=>({key:c.key,label:c.label}))],
    chapters,spreadProfile:{version:WHIT_SPREAD_NARRATIVE_VERSION,total,revealed:all.length,complete,coveredCanonicalIds:all.map(c=>c.card.canonicalId),spatialRelations:layout.links.length}
  };
}
