/* DIVINA BRUXA — MOTOR UNIVERSAL DE SKINS V8
   Um catálogo, uma skin ativa, todas as superfícies sincronizadas.
   Compatível com o SkinsEngine V6 existente; não depende de backend.
*/
const ROOT='./';
const SKIN_IMAGES=Object.freeze({
  classic:'skin-classica-divina-v1.png',lunar:'skin-lunar-misterio-v1.png',solar:'skin-solar-dourada-v1.png',ocean:'skin-oceanos-copas-v1.png',emerald:'skin-esmeralda-ancestral-v1.png',fire:'skin-fogo-sagrado-v1.png',cosmic:'skin-cosmica-infinita-v1.png',eclipse:'skin-eclipse-sombria-v1.png',venus:'skin-rosa-venus-v1.png',amethyst:'skin-ametista-real-v1.png',sapphire:'skin-safira-celestial-v1.png',ruby:'skin-rubi-bruxa-v1.png',aurora:'skin-aurora-boreal-v1.png',storm:'skin-tempestade-astral-v1.png',fairy:'skin-jardim-fadas-v1.png',isis:'skin-templo-isis-v1.png','twin-flame':'skin-chama-gemea-v1.png',realities:'skin-portal-realidades-v1.png',queen:'skin-rainha-universo-v1.png',supreme:'skin-divina-suprema-v1.png','moon-silver':'skin-lua-prata-v1.png',solstice:'skin-solsticio-dourado-v1.png',neptune:'skin-mare-netuno-v1.png','enchanted-forest':'skin-floresta-encantada-v1.png','cosmic-dragon':'skin-dragao-cosmico-v1.png','lunar-rose':'skin-rosa-lunar-v1.png','saturn-crystal':'skin-cristal-saturno-v1.png','violet-phoenix':'skin-fenix-violeta-v1.png','celestial-oracle':'skin-oraculo-celestial-v1.png','star-crown':'skin-coroa-estrelas-v1.png'
});
const STORAGE_KEY='divina-active-skin-v8';
const valid=id=>Object.prototype.hasOwnProperty.call(SKIN_IMAGES,id)?id:'classic';
const read=()=>{try{return valid(localStorage.getItem(STORAGE_KEY)||'classic')}catch{return'classic'}};
const write=id=>{try{localStorage.setItem(STORAGE_KEY,id)}catch{/* armazenamento opcional */}};
const url=id=>`${ROOT}${SKIN_IMAGES[valid(id)]}`;

export class UniversalSkinSystem{
  constructor(){this.active=read();this.apply(this.active);this.observe();}
  observe(){
    this.attributeObserver=new MutationObserver(()=>{const id=valid(document.body?.dataset.orbeSkin||this.active);if(id!==this.active)this.apply(id)});
    if(document.body)this.attributeObserver.observe(document.body,{attributes:true,attributeFilter:['data-orbe-skin']});
    window.addEventListener('orbe:skin-select',event=>this.apply(event.detail?.id||event.detail));
  }
  apply(id){
    this.active=valid(id);write(this.active);
    const image=url(this.active);
    document.body?.setAttribute('data-orbe-skin',this.active);
    document.documentElement.style.setProperty('--db-skin-image',`url("${image}")`);
    document.documentElement.style.setProperty('--db-skin-id',`"${this.active}"`);
    document.querySelectorAll('[data-orbe-skin-image]').forEach(node=>{
      if(node.tagName==='IMG')node.src=image;else node.style.backgroundImage=`url("${image}")`;
      node.dataset.skinId=this.active;
    });
    document.querySelectorAll('.skin-orb,.skin-preview').forEach(node=>{node.style.setProperty('--db-preview-image',`url("${image}")`)});
    window.dispatchEvent(new CustomEvent('orbe:skin-change',{detail:{id:this.active,image,source:'universal-v8'}}));
  }
  select(id){this.apply(id);return this.active}
  getImage(id=this.active){return url(id)}
  destroy(){this.attributeObserver?.disconnect()}
}

const boot=()=>{if(!window.divinaSkinSystem)window.divinaSkinSystem=new UniversalSkinSystem()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
