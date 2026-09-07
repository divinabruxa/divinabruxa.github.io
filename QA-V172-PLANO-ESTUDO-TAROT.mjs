import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

const root=path.resolve(process.argv[2]||process.cwd());
const checks=[],failures=[];
const pass=(name,condition,detail='')=>{checks.push(Boolean(condition));if(!condition)failures.push(detail?`${name}: ${detail}`:name);};
const filePath=name=>path.join(root,name);
const exists=name=>fs.existsSync(filePath(name))&&fs.statSync(filePath(name)).isFile();
const read=name=>fs.readFileSync(filePath(name),'utf8');
const bytes=name=>fs.readFileSync(filePath(name));
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const count=(value,expression)=>[...value.matchAll(expression)].length;
const countLiteral=(value,needle)=>value.split(needle).length-1;

const required=['sitemap.xml','buscar.html','busca-v165.js','tarot-para-iniciantes.html','escola-do-tarot.html','guias-para-comecar.html','plano-de-estudo-do-tarot-em-30-dias.html','plano-estudo-tarot-v172.css','plano-estudo-tarot-v172.js','00-LEIA-PRIMEIRO-V172-PLANO-ESTUDO-TAROT.txt','PLANO-ESTUDO-TAROT-V172.json','QA-V172-PLANO-ESTUDO-TAROT.mjs','ARQUIVOS-V172-SHA256.txt'];
for(const file of required)pass(`Arquivo presente: ${file}`,exists(file));
if(failures.length){console.error(JSON.stringify({suite:'DIVINA-BRUXA-V172-PLANO-ESTUDO-TAROT-30-DIAS',status:'FAIL',failures},null,2));process.exit(1);}

const html=read('plano-de-estudo-do-tarot-em-30-dias.html'),css=read('plano-estudo-tarot-v172.css'),js=read('plano-estudo-tarot-v172.js');
const title=html.match(/<title>([^<]+)<\/title>/)?.[1]||'';
const description=html.match(/<meta name="description" content="([^"]+)">/)?.[1]||'';
pass('Título exato',title==='Plano de estudo do Tarot em 30 dias | Divina Bruxa');
pass('Título adequado',title.length>=35&&title.length<=65,`${title.length}`);
pass('Descrição adequada',description.length>=120&&description.length<=165,`${description.length}`);
pass('Canonical',html.includes('<link rel="canonical" href="https://divinabruxa.com.br/plano-de-estudo-do-tarot-em-30-dias.html">'));
pass('Robots',html.includes('index,follow,max-image-preview:large'));
pass('Idioma',html.includes('<html lang="pt-BR">'));
pass('H1 único',count(html,/<h1(?:\s|>)/g)===1);
pass('Main único',count(html,/<main\b[^>]*id="conteudo"/g)===1);
pass('Skip link',html.includes('<a class="skip-link" href="#conteudo">'));
pass('CSS do portal',html.includes('seo-portal-v154.css?v=154'));
pass('CSS V172',html.includes('plano-estudo-tarot-v172.css?v=172'));
pass('JS V172',html.includes('plano-estudo-tarot-v172.js?v=172'));
pass('Sem imagem social',!/property="og:image"/.test(html));
pass('Sem nome pessoal',!/\b[ií]sis\b/i.test(html));
pass('Somente JSON-LD e script local',count(html,/<script(?:\s|>)/g)===2&&count(html,/type="application\/ld\+json"/g)===1&&count(html,/src="plano-estudo-tarot-v172\.js\?v=172"/g)===1);
pass('Imagem existente com dimensões',html.includes('<img src="tarot-atlas.webp" width="3000" height="3600"'));
pass('Alt descritivo',html.includes('alt="Mosaico contemporâneo das 78 cartas da coleção Divina Bruxa"'));
pass('Hero sem promessa de domínio',html.includes('Trinta dias constroem fundamentos; não encerram o aprendizado'));

for(const tag of ['header','nav','main','article','section','aside','footer','figure','figcaption','ol','li','dl','dt','dd','details','summary','fieldset','legend','form','label','select','option','button'])pass(`Tags ${tag}`,count(html,new RegExp(`<${tag}(?:\\s|>)`,'g'))===count(html,new RegExp(`</${tag}>`,'g')));
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
pass('IDs únicos',ids.length===new Set(ids).size,`${ids.length}/${new Set(ids).size}`);
const hashTargets=[...html.matchAll(/href="#([^"]+)"/g)].map(match=>match[1]);
pass('Âncoras internas válidas',hashTargets.every(id=>ids.includes(id)));
for(const match of html.matchAll(/aria-labelledby="([^"]+)"/g))for(const id of match[1].split(/\s+/))pass(`ARIA encontra ${id}`,ids.includes(id));

let graph=[];try{graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph']||[];pass('JSON-LD válido',true);}catch(error){pass('JSON-LD válido',false,error.message);}
for(const type of ['Organization','WebSite','ImageObject','BreadcrumbList','Article','FAQPage'])pass(`JSON-LD ${type}`,graph.some(item=>item['@type']===type));
const article=graph.find(item=>item['@type']==='Article');
const faq=graph.find(item=>item['@type']==='FAQPage');
pass('Article com datas',article?.datePublished==='2026-09-07'&&article?.dateModified==='2026-09-07');
pass('Article gratuito e em português',article?.isAccessibleForFree===true&&article?.inLanguage==='pt-BR');
pass('Article com quatro citações',article?.citation?.length===4&&new Set(article.citation).size===4);
pass('Article com cinco palavras-chave',article?.keywords?.length===5);
pass('FAQPage com cinco perguntas',faq?.mainEntity?.length===5&&faq.mainEntity.every(item=>item['@type']==='Question'&&item.acceptedAnswer?.['@type']==='Answer'));
pass('Imagem estruturada contemporânea',graph.find(item=>item['@type']==='ImageObject')?.caption==='Mosaico contemporâneo das 78 cartas da coleção Divina Bruxa');

pass('Navegação interna completa',['#planejador','#metodo','#plano-completo','#ritmo','#duvidas','#fontes'].every(value=>html.includes(`href="${value}"`)));
const form=html.match(/<form class="planner-form"[\s\S]*?<\/form>/)?.[0]||'';
pass('Formulário do planejador presente',form.includes('data-study-planner'));
pass('Seleção nativa do dia',count(form,/<select/g)===1&&count(form,/<option/g)===30);
for(let day=1;day<=30;day++)pass(`Opção do dia ${day}`,form.includes(`value="${day}"`));
pass('Um grupo de duração',count(form,/<fieldset>/g)===1&&count(form,/<legend>/g)===1);
pass('Três durações nativas',count(form,/type="radio" name="duration"/g)===3&&count(form,/<label(?:\s|>)/g)===4);
for(const value of ['10','20','30'])pass(`Duração ${value}`,count(form,new RegExp(`type="radio" name="duration" value="${value}"`,'g'))===1);
pass('Duração mínima pré-selecionada',form.includes('value="10" checked'));
pass('Botão de montagem',form.includes('<button class="button button-primary" type="submit">Montar minha sessão</button>'));
pass('Progresso do planejador',html.includes('data-study-count')&&html.includes('data-study-progress'));
pass('Resultado acessível',html.includes('data-study-result aria-labelledby="study-result-title" aria-live="polite" aria-atomic="true"')&&html.includes('id="study-result-title" tabindex="-1"'));
pass('Navegação anterior e próxima',count(html,/data-day-(?:prev|next)/g)===2);
pass('Fallback sem JavaScript',html.includes('O plano completo dos 30 dias continua disponível logo abaixo'));
pass('Privacidade explícita',html.includes('Nada é enviado ou guardado'));

const phaseSections=[...html.matchAll(/<section class="phase-section(?: closing-days)?"[\s\S]*?<\/section>/g)].map(match=>match[0]);
pass('Cinco blocos do percurso',phaseSections.length===5,`${phaseSections.length}`);
pass('Quatro fases de sete dias',phaseSections.slice(0,4).every(section=>count(section,/class="day-card"/g)===7));
pass('Fechamento com dois dias',count(phaseSections[4]||'',/class="day-card"/g)===2);
const dayIds=[...html.matchAll(/<article id="dia-(\d+)" class="day-card">/g)].map(match=>Number(match[1]));
pass('Trinta dias visíveis',dayIds.length===30,`${dayIds.length}`);
pass('Dias em sequência',dayIds.every((day,index)=>day===index+1));
pass('Trinta rótulos de dia',count(html,/<span>DIA \d{2}<\/span>/g)===30);
for(const heading of ['Enxergue o mapa do baralho','Aprenda a gramática dos Menores','Reconheça personagens e símbolos','Transforme repertório em leitura','Revise o caminho e desenhe o próximo'])pass(`Fase: ${heading}`,html.includes(`<h2 id=`)&&html.includes(heading));
for(const heading of ['Crie seu caderno de observação','Mapeie as 78 cartas','Conheça quatro domínios','Use três lentes para a corte','Formule uma questão útil','Crie um mapa das lacunas','Faça uma leitura e escolha o próximo ciclo'])pass(`Dia-chave: ${heading}`,html.includes(`<h3>${heading}</h3>`));
pass('Quatro promessas',count(html.match(/<div class="promise-grid">([\s\S]*?)<\/div>/)?.[1]||'',/<article>/g)===4);
pass('Quatro princípios',count(html.match(/<div class="method-principles">([\s\S]*?)<\/div>/)?.[1]||'',/<article>/g)===4);
pass('Três ritmos',count(html.match(/<div class="rhythm-grid">([\s\S]*?)<\/div>/)?.[1]||'',/<article>/g)===3);
pass('Ritmos 10, 20 e 30',html.includes('<span>10</span>')&&html.includes('<span>20</span>')&&html.includes('<span>30</span>'));
pass('Regra de retomada',html.includes('Não dobre a sessão seguinte e não recomece por obrigação'));
pass('Cinco perguntas visíveis',count(html,/<details>/g)===5&&count(html,/<summary>/g)===5);
pass('Quatro fontes numeradas',count(html,/<li id="fonte-[^"]+">/g)===4);
pass('Quatro links externos seguros',count(html,/target="_blank" rel="noopener noreferrer"/g)===4);
pass('Limite da ciência explícito',html.includes('não validam o Tarot como instrumento de previsão'));
pass('Limite de trinta dias explícito',html.includes('Uma base prática, não uma promessa de domínio instantâneo'));
pass('Sem compensação obrigatória',html.includes('Um dia perdido não precisa ser compensado'));
pass('Sem memorização mecânica',html.includes('sem decorar frases prontas'));
pass('Cartas diretas',html.includes('Orientação</dt><dd>Cartas diretas'));

const sourceUrls=['https://www.vam.ac.uk/articles/tarot-cards','https://journals.sagepub.com/doi/10.1177/1529100612453266','https://pubmed.ncbi.nlm.nih.gov/16507066/','https://journals.sagepub.com/doi/10.1111/j.1467-9280.2008.02127.x'];
for(const url of sourceUrls)pass(`Fonte: ${url}`,countLiteral(html,url)===2,`${countLiteral(html,url)}`);
for(const link of ['guias-para-comecar.html','tarot-para-iniciantes.html','arcanos-maiores.html','arcanos-menores.html','numerologia-no-tarot.html','figuras-da-corte-no-tarot.html','simbolos-do-tarot.html','tarot-livre.html','como-fazer-perguntas-ao-tarot.html','tiragem-de-uma-carta.html','metodologia-do-tarot.html','tiragem-de-tres-cartas.html','combinacoes-de-cartas-no-tarot.html','etica-e-responsabilidade.html','tiragens-de-tarot.html','buscar.html','escola-do-tarot.html','cartas-do-tarot.html'])pass(`Link editorial: ${link}`,html.includes(`href="${link}"`));

try{new Function(js);pass('JavaScript sintaticamente válido',true);}catch(error){pass('JavaScript sintaticamente válido',false,error.message);}
pass('JS possui trinta sessões',count(js,/\{ phase:'/g)===30&&js.includes('sessions.length !== 30'));
for(const phaseName of ['FASE 1 · MAPA DO BARALHO','FASE 2 · GRAMÁTICA DOS MENORES','FASE 3 · PERSONAGENS E SÍMBOLOS','FASE 4 · LEITURA E RESPONSABILIDADE','FECHAMENTO · DIAGNÓSTICO','FECHAMENTO · CONTINUIDADE'])pass(`JS contém ${phaseName}`,js.includes(phaseName));
pass('JS possui três durações',js.includes('10: [')&&js.includes('20: [')&&js.includes('30: ['));
pass('JS monta três etapas em dez minutos',count(js.match(/10: \[([\s\S]*?)\n    \]/)?.[1]||'',/\['/g)===3);
pass('JS monta quatro etapas em vinte minutos',count(js.match(/20: \[([\s\S]*?)\n    \]/)?.[1]||'',/\['/g)===4);
pass('JS monta quatro etapas em trinta minutos',count(js.match(/30: \[([\s\S]*?)\n    \]/)?.[1]||'',/\['/g)===4);
pass('JS atualiza com APIs seguras',js.includes('steps.replaceChildren')&&js.includes('.textContent =')&&!/\.innerHTML\b|insertAdjacentHTML|outerHTML/.test(js));
pass('JS controla progresso',js.includes('progress.style.width')&&js.includes('(day / 30) * 100'));
pass('JS controla limites dos dias',js.includes('previous.disabled = day === 1')&&js.includes('next.disabled = day === 30'));
pass('JS usa envio do formulário local',js.includes("form.addEventListener('submit'")&&js.includes('event.preventDefault()'));
pass('JS sem rede',!/(?:\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource)/.test(js));
pass('JS sem armazenamento',!/(?:localStorage|sessionStorage|indexedDB|document\.cookie)/.test(js));
pass('JS respeita movimento reduzido',js.includes("matchMedia('(prefers-reduced-motion: reduce)')"));
pass('JS sem nome pessoal',!/\b[ií]sis\b/i.test(js));

try{
  const listeners={};
  const fakeNode=(name='node')=>({name,textContent:'',href:'',disabled:false,style:{},children:[],addEventListener(type,handler){listeners[`${name}:${type}`]=handler;},append(...children){this.children.push(...children);},replaceChildren(...children){this.children=children;},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;}});
  const fakeForm=fakeNode('form');fakeForm.elements={duration:{value:'10'}};fakeForm.querySelectorAll=()=>[fakeNode('radio1'),fakeNode('radio2'),fakeNode('radio3')];
  const fakeSelect=fakeNode('select');fakeSelect.value='1';
  const fakeResult=fakeNode('result');
  const fakeMap={'[data-study-planner]':fakeForm,'[data-study-day]':fakeSelect,'[data-study-result]':fakeResult,'[data-study-count]':fakeNode('count'),'[data-study-progress]':fakeNode('progress'),'[data-study-phase]':fakeNode('phase'),'[data-study-duration]':fakeNode('duration'),'[data-study-title]':fakeNode('title'),'[data-study-focus]':fakeNode('focus'),'[data-study-number]':fakeNode('number'),'[data-study-steps]':fakeNode('steps'),'[data-study-support]':fakeNode('support'),'[data-study-anchor]':fakeNode('anchor'),'[data-day-prev]':fakeNode('previous'),'[data-day-next]':fakeNode('next')};
  vm.runInNewContext(js,{document:{querySelector:selector=>fakeMap[selector]||null,createElement:tag=>fakeNode(tag)},window:{matchMedia:()=>({matches:true})}});
  pass('Execução inicial do planejador',fakeMap['[data-study-count]'].textContent==='Dia 1 de 30'&&fakeMap['[data-study-steps]'].children.length===3&&fakeMap['[data-day-prev]'].disabled===true&&fakeMap['[data-day-next]'].disabled===false);
  fakeSelect.value='15';fakeForm.elements.duration.value='20';listeners['form:submit']({preventDefault(){}});
  pass('Execução do dia 15 em vinte minutos',fakeMap['[data-study-title]'].textContent==='Compare os quatro Pajens'&&fakeMap['[data-study-steps]'].children.length===4&&fakeMap['[data-study-support]'].href==='figuras-da-corte-no-tarot.html');
  fakeSelect.value='30';fakeForm.elements.duration.value='30';listeners['form:submit']({preventDefault(){}});
  pass('Execução do dia 30 em trinta minutos',fakeMap['[data-study-number]'].textContent==='30'&&fakeMap['[data-study-steps]'].children.length===4&&fakeMap['[data-day-prev]'].disabled===false&&fakeMap['[data-day-next]'].disabled===true);
}catch(error){
  pass('Execução simulada do planejador',false,error.message);
}

pass('CSS com seleção acessível',css.includes('.duration-options input:focus-visible + span')&&css.includes('.duration-options input:checked + span'));
pass('CSS com foco de controles',css.includes('.day-select-wrap select:focus-visible')&&css.includes('.day-navigation button:focus-visible'));
pass('CSS com planejador',css.includes('.study-tool')&&css.includes('.planner-form')&&css.includes('.study-result')&&css.includes('.session-steps'));
pass('CSS com percurso',css.includes('.phase-section')&&css.includes('.phase-header')&&css.includes('.day-grid')&&css.includes('.day-card'));
pass('CSS com layouts editoriais',css.includes('.promise-grid')&&css.includes('.method-principles')&&css.includes('.rhythm-grid')&&css.includes('.source-list'));
pass('CSS móvel',css.includes('@media (max-width: 1020px)')&&css.includes('@media (max-width: 760px)')&&css.includes('@media (max-width: 580px)'));
pass('CSS para telas mínimas',css.includes('@media (max-width: 340px)'));
pass('CSS respeita movimento reduzido',css.includes('@media (prefers-reduced-motion: reduce)'));
pass('CSS de impressão',css.includes('@media print')&&css.includes('.study-tool')&&css.includes('.phase-section'));
const openBraces=count(css,/{/g),closeBraces=count(css,/}/g);
pass('CSS equilibrado',openBraces===closeBraces,`${openBraces}/${closeBraces}`);

const beginner=read('tarot-para-iniciantes.html'),school=read('escola-do-tarot.html'),guides=read('guias-para-comecar.html');
for(const [name,content] of [['Iniciantes',beginner],['Escola',school],['Guias',guides]])pass(`${name} liga o plano uma vez`,count(content,/href="plano-de-estudo-do-tarot-em-30-dias\.html"/g)===1);
const beginnerAddition='<a href="plano-de-estudo-do-tarot-em-30-dias.html"><span aria-hidden="true">30</span><strong>Plano de estudo</strong><small>Trinta dias no seu ritmo</small></a>';
const schoolAddition='<a href="plano-de-estudo-do-tarot-em-30-dias.html">Seguir o plano gratuito de 30 dias →</a>';
const guidesCurrent='Anote o que percebeu e volte depois. <a href="plano-de-estudo-do-tarot-em-30-dias.html">Use o plano de 30 dias</a> para transformar revisão em uma rotina possível.';
const guidesPrevious='Anote o que percebeu e volte depois. O aprendizado nasce da comparação entre símbolo, experiência e realidade.';
pass('Iniciantes V171 preservado fora da integração',sha256(beginner.replace(beginnerAddition,''))==='c8c024bb84d83b5efe0c0168124caf579d463d6e51bf89f78796715ebc061eb6',sha256(beginner.replace(beginnerAddition,'')));
pass('Escola preservada fora da integração',sha256(school.replace(schoolAddition,''))==='c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df',sha256(school.replace(schoolAddition,'')));
pass('Guias V171 preservado fora da integração',sha256(guides.replace(guidesCurrent,guidesPrevious))==='4d1ac7097063fc89b8b7b8595387ef86b2c26c2ff9465fd0459ea5403537ed0f',sha256(guides.replace(guidesCurrent,guidesPrevious)));

const searchHtml=read('buscar.html'),searchScript=read('busca-v165.js');
pass('Busca anuncia 124 caminhos',searchHtml.includes('124 CAMINHOS · UMA BUSCA'));
pass('Busca usa revisão V172',searchHtml.includes('busca-v165.js?v=172'));
pass('Índice contém plano uma vez',count(searchScript,/\['Plano de estudo do Tarot em 30 dias', 'plano-de-estudo-do-tarot-em-30-dias\.html'/g)===1);
pass('Plano em destaque',searchScript.includes('[1,2,3,4,5,6,14,15,26,27,28,29,30,31,32].includes(index)'));
const recoveredSearchHtml=searchHtml.replace('124 CAMINHOS · UMA BUSCA','123 CAMINHOS · UMA BUSCA').replace('busca-v165.js?v=172','busca-v165.js?v=171');
pass('Página de busca V171 preservada',sha256(recoveredSearchHtml)==='1cd89e8d99904e639b3d107947da9928980f280754a7dded3c520b9031548e26',sha256(recoveredSearchHtml));
const studyIndexLine="  ['Plano de estudo do Tarot em 30 dias', 'plano-de-estudo-do-tarot-em-30-dias.html', '30 dias · 10–30 min', 'aprender', 'Plano gratuito e interativo para estudar Tarot em 30 dias com sessões de 10, 20 ou 30 minutos, revisão espaçada, prática de memória, Arcanos Maiores, Arcanos Menores, naipes, números, figuras da corte, símbolos, perguntas, tiragens, combinações e ética. como cronograma rotina curso aprender memorizar decorar cartas caderno iniciante'],\n";
const recoveredSearchScript=searchScript.replace(studyIndexLine,'').replace('[1,2,3,4,5,6,14,15,26,27,28,29,30,31,32].includes(index)','[1,2,3,4,5,6,14,15,26,27,28,29,30,31].includes(index)');
pass('Motor de busca V171 preservado',sha256(recoveredSearchScript)==='26ac7563113cd0e076f1c8a0538b03b8823e65defa5a9b29e9eee083cc45d3c0',sha256(recoveredSearchScript));

const sitemap=read('sitemap.xml');
pass('Sitemap com 125 URLs',count(sitemap,/<url>/g)===125);
pass('Sitemap mantém 78 imagens',count(sitemap,/<image:image>/g)===78);
pass('Plano único no sitemap',count(sitemap,/<loc>https:\/\/divinabruxa\.com\.br\/plano-de-estudo-do-tarot-em-30-dias\.html<\/loc>/g)===1);
const pageLocs=[...sitemap.matchAll(/<loc>(https:\/\/divinabruxa\.com\.br\/(?![^<]+\.(?:webp|png|jpe?g|svg))[^<]*)<\/loc>/g)].map(match=>match[1]);
pass('URLs de página únicas',pageLocs.length===125&&new Set(pageLocs).size===125,`${pageLocs.length}/${new Set(pageLocs).size}`);
const sitemapBlock='  <url>\n    <loc>https://divinabruxa.com.br/plano-de-estudo-do-tarot-em-30-dias.html</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n';
pass('Sitemap V171 preservado',sha256(sitemap.replace(sitemapBlock,''))==='91035869f8d1ccb11afd50637837fa6e256e6f6a2481a3c9d24a2b9948fb2d06',sha256(sitemap.replace(sitemapBlock,'')));

const contract=JSON.parse(read('PLANO-ESTUDO-TAROT-V172.json'));
pass('Contrato V172',contract.schemaVersion==='172.0.0');
pass('Contrato plano completo',contract.studyPlan?.days===30&&contract.studyPlan?.corePhases===4&&contract.studyPlan?.closingDays===2&&contract.studyPlan?.staticDayCards===30);
pass('Contrato três durações',JSON.stringify(contract.studyPlan?.availableDurationsMinutes)===JSON.stringify([10,20,30]));
pass('Contrato sem promessa instantânea',contract.studyPlan?.masteryPromisedInThirtyDays===false&&contract.studyPlan?.missedDayCompensationRequired===false);
pass('Contrato planejador local',contract.planner?.runsLocally===true&&contract.planner?.networkRequests===false&&contract.planner?.answersStored===false&&contract.planner?.staticFallbackWithoutJavaScript===true);
pass('Contrato limite científico',contract.learningMethod?.generalLearningResearchOnly===true&&contract.learningMethod?.presentedAsEvidenceForTarotPrediction===false);
pass('Contrato quatro referências',contract.learningMethod?.externalReferences===4&&contract.content?.sourceEntries===4);
pass('Contrato acessibilidade',contract.accessibility?.nativeSelect===true&&contract.accessibility?.nativeRadioGroups===true&&contract.accessibility?.reducedMotion===true&&contract.accessibility?.printStyles===true);
pass('Contrato busca 124',contract.searchIntegration?.indexedDestinationsAfter===124&&Object.values(contract.searchIntegration?.categoryCounts||{}).reduce((a,b)=>a+b,0)===124);
pass('Contrato sitemap 125',contract.discoverability?.sitemapUrlsAfter===125&&contract.discoverability?.sitemapImageEntries===78);
pass('Contrato Tarot Livre',contract.safeguards?.tarotLivreChanged===false&&contract.safeguards?.tarotLivreCards===78&&contract.safeguards?.tarotLivreRepeats===false&&contract.safeguards?.tarotLivreMeaningsInsideFreeMode===false&&contract.safeguards?.tarotLivreMesaReal==='13x6');
pass('Contrato consultas',JSON.stringify(contract.safeguards?.consultationPricesBrl)===JSON.stringify([250,150,100,50])&&contract.safeguards?.consultationEmailRequired===true&&contract.safeguards?.ownerEmail==='orbedasrealidades@hotmail.com');
pass('Contrato sem cobrança ou Resend',contract.safeguards?.realBillingAdded===false&&contract.safeguards?.resendAdded===false);
pass('Contrato treze arquivos',contract.installation?.filesInPackage===13&&contract.installation?.replace?.length===6&&contract.installation?.add?.length===7);

const manifest=new Map();
for(const line of read('ARQUIVOS-V172-SHA256.txt').trim().split(/\r?\n/)){const match=line.match(/^([a-f0-9]{64})  (.+)$/);if(match)manifest.set(match[2],match[1]);}
const hashed=required.filter(file=>file!=='ARQUIVOS-V172-SHA256.txt');
pass('Manifesto doze hashes',manifest.size===12,`${manifest.size}`);
for(const file of hashed)pass(`Hash ${file}`,manifest.get(file)===sha256(bytes(file)));

const stable={
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701','tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0','consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423','carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c','tiragens-de-tarot.html':'ce6268945e0a839a07f124d035d64df040d60495241364c628c6db24885d07e0','historia-do-tarot.html':'7d63c8fdc0a45225e29648b9118b43ee6c688d08c37fde67507a8696ce72216c','historia-tarot-v167.css':'fbe141aa683fdce8776111aa3bd9f3a362a799ed185ffa5d0bcc6cac44053d73','simbolos-do-tarot.html':'8650b833ef42e6eb6334e2ace93284b87f55dfe94fc48fc3db59f972dc7acca2','simbolos-tarot-v168.css':'df957a3c75a410f69745cd4070c37e707b02e17ddc6af2363ccf196b784b9ac2','simbolos-tarot-v168.js':'07dd2277c6b1e0a96055cc2f7448c46eb8928d5abc0490422cf83de53b158ef5','glossario-do-tarot.html':'456e905fbeabbe17df4efbc5e12aebee68f986d536c9b1b9465a6cd2eb3b3936','tipos-de-tarot.html':'f4a0149a8f5d9bf890802a110390c256b4d74164249982f6859c32bb4870b668','como-escolher-um-baralho-de-tarot.html':'ca04fea54bf5dead1bdf7cd95cb05fffaf2b439fddd5c6b71f7f9caa134579a1','escolher-baralho-v170.css':'2c889c4fc2bb29d758bac7fcb2f3c32f72578d46cd6e9235278b992695cab6de','escolher-baralho-v170.js':'eeb74aeb3d009a3c201e0787912725683135588710750185924bd8e22470ddf2','como-embaralhar-cartas-de-tarot.html':'3cc2117f4598bb79cbe23ad1dd2a3395297e182967878048ee7a5b9cc57efab4','embaralhar-tarot-v171.css':'35c5328ec4e404704ea7c70d10ba99eb48f8e1ce52655471a3d45e6222707e64','embaralhar-tarot-v171.js':'daedc0065a3e9c4a3031bc3caaa1e4f5a4d0d32f25b72150afca486427c2085d','seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6','busca-v165.css':'7af9c88c6ceb1e695c368d67c6789020df964986ec197fb693b95f6bb9af7f48','robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd','spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0','consultation-policy.js':'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3','consultation-engine.js':'745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050','tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
const full=Object.keys(stable).every(exists);
if(full){
  for(const [file,hash] of Object.entries(stable))pass(`Crítico preservado: ${file}`,sha256(bytes(file))===hash);
  pass('Atlas existente preservado',exists('tarot-atlas.webp')&&fs.statSync(filePath('tarot-atlas.webp')).size>1000000);
  for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match=>match[1]).filter(value=>!/^(https?:|mailto:|tel:|#|data:)/.test(value))){const clean=ref.split(/[?#]/)[0].replace(/^\.\//,'')||'index.html';pass(`Destino da página: ${ref}`,exists(clean));}
  for(const ref of [...js.matchAll(/link:'([^']+)'/g)].map(match=>match[1]))pass(`Destino do planejador: ${ref}`,exists(ref));
  const {CARDS}=await import(`${pathToFileURL(filePath('tarot-data.js')).href}?qa=172`);
  pass('Baralho de dados mantém 78 cartas',CARDS.length===78,`${CARDS.length}`);
  let source=searchScript.replace(/^import[^\n]+\n/,'');source=source.slice(0,source.indexOf('const form ='));
  let data={};try{data=new Function('CARDS',`${source};return {PAGES,entries,normalize};`)(CARDS);pass('Índice executa',true);}catch(error){pass('Índice executa',false,error.message);}
  const entries=data.entries||[],normalize=data.normalize||String;
  pass('Índice possui 124 destinos',entries.length===124,`${entries.length}`);
  pass('Índice possui 124 URLs únicas',new Set(entries.map(item=>item.url)).size===124);
  const categories=Object.fromEntries(['cartas','tiragens','aprender','portal'].map(category=>[category,entries.filter(item=>item.category===category).length]));
  pass('Categorias 78 + 14 + 22 + 10',JSON.stringify(categories)===JSON.stringify({cartas:78,tiragens:14,aprender:22,portal:10}),JSON.stringify(categories));
  pass('Índice liga o plano em destaque',entries.some(item=>item.url==='plano-de-estudo-do-tarot-em-30-dias.html'&&item.featured));
  const find=query=>{const tokens=normalize(query).split(' ').filter(Boolean);return entries.filter(entry=>tokens.every(token=>entry.searchable.includes(token)||normalize(entry.title).includes(token)));};
  for(const query of ['plano de estudo','tarot 30 dias','como estudar tarot','memorizar cartas','10 minutos'])pass(`Busca encontra plano: ${query}`,find(query).some(item=>item.url==='plano-de-estudo-do-tarot-em-30-dias.html'));
  pass('Busca ainda encontra embaralhar',find('baralho grande').some(item=>item.url==='como-embaralhar-cartas-de-tarot.html'));
  pass('Busca ainda encontra escolher baralho',find('primeiro baralho').some(item=>item.url==='como-escolher-um-baralho-de-tarot.html'));
  pass('Busca ainda encontra símbolos',find('lanterna').some(item=>item.url==='simbolos-do-tarot.html'));
  pass('Busca ainda encontra carta',find('A Lua').some(item=>item.title==='A Lua'));
  const free=read('tarot-livre.html'),consult=read('consultas-de-tarot.html');
  pass('Tarot Livre 13 × 6',free.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre direto e sem repetição',free.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Tarot Livre sem interpretação automática',free.includes('sem uma interpretação automática entre você e a imagem'));
  pass('Consultas preservam preços',['R$ 250','R$ 150','R$ 100','R$ 50'].every(value=>consult.includes(value)));
  pass('Consultas preservam e-mail',consult.includes('Seu e-mail é obrigatório para o contato'));
}else{
  const packageFiles=fs.readdirSync(root,{withFileTypes:true}).filter(entry=>entry.isFile()).map(entry=>entry.name).sort();
  pass('Pacote contém somente treze arquivos',JSON.stringify(packageFiles)===JSON.stringify([...required].sort()),packageFiles.join(', '));
}

const result={suite:'DIVINA-BRUXA-V172-PLANO-ESTUDO-TAROT-30-DIAS',status:failures.length?'FAIL':'PASS',mode:full?'full-project':'release-package',root,total:checks.length,passed:checks.filter(Boolean).length,failed:failures};
console.log(JSON.stringify(result,null,2));if(failures.length)process.exit(1);
