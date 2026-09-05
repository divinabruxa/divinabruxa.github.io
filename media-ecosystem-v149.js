/* DIVINA BRUXA V149 — PORTAIS EDITORIAIS ENTRE MÚSICA, VÍDEO E TAROT */

const journeys=Object.freeze({
  music:Object.freeze([
    ['videos','▶','De Frente com o Tarot','Conversas e capítulos do canal oficial.'],
    ['tarot','✦','Tarot Livre','Revele as cartas no seu próprio ritmo.'],
    ['journal','▤','Diário da Orbe','Guarde o que a música despertou em você.']
  ]),
  videos:Object.freeze([
    ['music','♫','Música & Vibração','Ouça os universos sonoros de Hércules DX.'],
    ['tarot','✦','Tarot Livre','Atravesse a experiência completa das 78 cartas.'],
    ['school','▥','Escola do Tarot','Aprofunde símbolos, combinações e prática.']
  ])
});

export class MediaEcosystemV149{
  constructor(root,current){
    this.root=root;
    this.current=current;
    this.render();
  }

  render(){
    if(!this.root||this.root.querySelector('[data-media-coda]'))return;
    const items=journeys[this.current]||[];
    const host=document.createElement('aside');
    host.className='media-v149-coda';
    host.dataset.mediaCoda=this.current;
    host.setAttribute('aria-labelledby',`media-coda-${this.current}`);
    host.innerHTML=`<header><p class="eyebrow">CONTINUE NO UNIVERSO</p><h3 id="media-coda-${this.current}">A próxima passagem está perto.</h3></header><nav aria-label="Outros caminhos da Divina Bruxa">${items.map(([id,sigil,title,description])=>`<button type="button" data-go="${id}"><span aria-hidden="true">${sigil}</span><span><b>${title}</b><small>${description}</small></span><i aria-hidden="true">→</i></button>`).join('')}</nav>`;
    this.root.append(host);
  }
}
