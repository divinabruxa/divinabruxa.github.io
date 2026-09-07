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

const required=['sitemap.xml','buscar.html','busca-v165.js','plano-de-estudo-do-tarot-em-30-dias.html','escola-do-tarot.html','guias-para-comecar.html','diario-de-tarot.html','diario-tarot-v173.css','diario-tarot-v173.js','00-LEIA-PRIMEIRO-V173-DIARIO-DE-TAROT.txt','DIARIO-TAROT-V173.json','QA-V173-DIARIO-DE-TAROT.mjs','ARQUIVOS-V173-SHA256.txt'];
for(const file of required)pass(`Arquivo presente: ${file}`,exists(file));
if(failures.length){console.error(JSON.stringify({suite:'DIVINA-BRUXA-V173-DIARIO-DE-TAROT',status:'FAIL',failures},null,2));process.exit(1);}

const html=read('diario-de-tarot.html'),css=read('diario-tarot-v173.css'),js=read('diario-tarot-v173.js');
const title=html.match(/<title>([^<]+)<\/title>/)?.[1]||'';
const description=html.match(/<meta name="description" content="([^"]+)">/)?.[1]||'';
pass('Título exato',title==='Diário de Tarot: como criar e usar | Divina Bruxa');
pass('Título adequado',title.length>=35&&title.length<=65,`${title.length}`);
pass('Descrição adequada',description.length>=120&&description.length<=165,`${description.length}`);
pass('Canonical',html.includes('<link rel="canonical" href="https://divinabruxa.com.br/diario-de-tarot.html">'));
pass('Robots',html.includes('index,follow,max-image-preview:large'));
pass('Idioma',html.includes('<html lang="pt-BR">'));
pass('H1 único',count(html,/<h1(?:\s|>)/g)===1);
pass('Main único',count(html,/<main\b[^>]*id="conteudo"/g)===1);
pass('Skip link',html.includes('<a class="skip-link" href="#conteudo">'));
pass('CSS do portal',html.includes('seo-portal-v154.css?v=154'));
pass('CSS V173',html.includes('diario-tarot-v173.css?v=173'));
pass('JS V173',html.includes('diario-tarot-v173.js?v=173'));
pass('Sem imagem social',!/property="og:image"/.test(html));
pass('Sem nome pessoal',!/\b[ií]sis\b/i.test(html));
pass('Somente JSON-LD e script local',count(html,/<script(?:\s|>)/g)===2&&count(html,/type="application\/ld\+json"/g)===1&&count(html,/src="diario-tarot-v173\.js\?v=173"/g)===1);
pass('Imagem existente com dimensões',html.includes('<img src="diario-espelho-celestial-v1.webp" width="864" height="1296"'));
pass('Alt descritivo',html.includes('alt="Livro celestial aberto representando registros e revisões de Tarot"'));

for(const tag of ['header','nav','main','article','section','aside','footer','figure','figcaption','ol','ul','li','dl','dt','dd','details','summary','form','label','select','option','textarea','button','pre'])pass(`Tags ${tag}`,count(html,new RegExp(`<${tag}(?:\\s|>)`,'g'))===count(html,new RegExp(`</${tag}>`,'g')));
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
pass('IDs únicos',ids.length===new Set(ids).size,`${ids.length}/${new Set(ids).size}`);
const hashTargets=[...html.matchAll(/href="#([^"]+)"/g)].map(match=>match[1]);
pass('Âncoras internas válidas',hashTargets.every(id=>ids.includes(id)));
for(const match of html.matchAll(/aria-labelledby="([^"]+)"/g))for(const id of match[1].split(/\s+/))pass(`ARIA encontra ${id}`,ids.includes(id));

let graph=[];try{graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph']||[];pass('JSON-LD válido',true);}catch(error){pass('JSON-LD válido',false,error.message);}
for(const type of ['Organization','WebSite','ImageObject','BreadcrumbList','Article','HowTo','FAQPage'])pass(`JSON-LD ${type}`,graph.some(item=>item['@type']===type));
const article=graph.find(item=>item['@type']==='Article');
const howTo=graph.find(item=>item['@type']==='HowTo');
const faq=graph.find(item=>item['@type']==='FAQPage');
pass('Article com datas',article?.datePublished==='2026-09-07'&&article?.dateModified==='2026-09-07');
pass('Article gratuito e em português',article?.isAccessibleForFree===true&&article?.inLanguage==='pt-BR');
pass('Article com duas citações',article?.citation?.length===2&&new Set(article.citation).size===2);
pass('Article com cinco palavras-chave',article?.keywords?.length===5);
pass('HowTo com cinco movimentos',howTo?.totalTime==='PT10M'&&howTo?.step?.length===5&&howTo.step.every((item,index)=>item['@type']==='HowToStep'&&item.position===index+1));
pass('FAQPage com cinco perguntas',faq?.mainEntity?.length===5&&faq.mainEntity.every(item=>item['@type']==='Question'&&item.acceptedAnswer?.['@type']==='Answer'));
pass('Imagem estruturada correta',graph.find(item=>item['@type']==='ImageObject')?.caption==='Livro celestial representando o Diário de Tarot da Divina Bruxa');

pass('Navegação interna completa',['#gerador','#modelos','#anatomia','#metodo','#privacidade','#duvidas','#fontes'].every(value=>html.includes(`href="${value}"`)));
const form=html.match(/<form class="template-form"[\s\S]*?<\/form>/)?.[0]||'';
pass('Formulário do gerador presente',form.includes('data-template-form'));
pass('Três seleções nativas',count(form,/<select/g)===3&&count(form,/<label>/g)===3);
pass('Oito opções no total',count(form,/<option/g)===8);
pass('Quatro tipos de ficha',['one','three','study','review'].every(value=>form.includes(`<option value="${value}">`)));
pass('Duas profundidades',['essential','complete'].every(value=>form.includes(`<option value="${value}">`)));
pass('Dois suportes',['paper','digital'].every(value=>form.includes(`<option value="${value}">`)));
pass('Botão de geração',form.includes('<button class="button button-primary" type="submit">Gerar minha ficha</button>'));
pass('Saída somente leitura',html.includes('<textarea id="template-output" data-template-output rows="18" readonly>'));
pass('Espelho de impressão',html.includes('<pre class="template-print-copy" data-template-print aria-hidden="true"></pre>'));
pass('Botão de cópia',html.includes('data-copy-template>Copiar modelo</button>'));
pass('Botão de impressão',html.includes('data-print-template>Imprimir ficha</button>'));
pass('Acesso ao Diário privado',count(html,/href="\.\/#journal"/g)>=3);
pass('Status acessível de cópia',html.includes('data-copy-status role="status" aria-live="polite" aria-atomic="true"'));
pass('Fallback sem JavaScript',html.includes('Use o modelo essencial já exibido ou siga os oito campos abaixo'));
pass('Privacidade do gerador',html.includes('Ele não recebe texto pessoal, não faz requisições e não guarda a ficha'));

const modelGrid=html.match(/<div class="template-type-grid">([\s\S]*?)<\/div><\/section>/)?.[1]||'';
pass('Quatro modelos visíveis',count(modelGrid,/<article>/g)===4);
pass('Quatro atalhos de modelo',count(modelGrid,/data-preset="(?:one|three|study|review)"/g)===4);
for(const model of ['Uma carta','Três cartas','Estudo de uma carta','Revisão'])pass(`Modelo: ${model}`,modelGrid.includes(`<h3>${model}</h3>`));
const anatomy=html.match(/<ol class="anatomy-grid">([\s\S]*?)<\/ol>/)?.[1]||'';
pass('Oito campos essenciais',count(anatomy,/<li>/g)===8);
for(const field of ['Data e contexto','Pergunta ou intenção','Método e posições','Cartas diretas','Observação visual','Hipótese e consulta','Síntese e limite','Ação e revisão'])pass(`Campo: ${field}`,anatomy.includes(`<h3>${field}</h3>`));
const method=html.match(/<ol class="method-path">([\s\S]*?)<\/ol>/)?.[1]||'';
pass('Cinco movimentos do método',count(method,/<li>/g)===5);
for(const step of ['Defina pergunta e posições','Descreva o que realmente vê','Escreva sua hipótese','Consulte e sintetize','Volte sem reescrever'])pass(`Movimento: ${step}`,method.includes(`<h3>${step}</h3>`));
pass('Exemplo com oito campos',count(html.match(/<article class="example-sheet">([\s\S]*?)<\/article>/)?.[1]||'',/<dt>/g)===8);
pass('Exemplo explicitamente fictício',html.includes('EXEMPLO FICTÍCIO · UMA CARTA'));
pass('Exemplo usa carta direta',html.includes('2 de Espadas · direta'));
const privacy=html.match(/<div class="privacy-grid">([\s\S]*?)<\/div>/)?.[1]||'';
pass('Três contextos de privacidade',count(privacy,/<article>/g)===3);
for(const mediumName of ['Papel','Nota digital','Diário da Divina Bruxa'])pass(`Privacidade: ${mediumName}`,privacy.includes(`<h3>${mediumName}</h3>`));
pass('Risco de exclusão local',html.includes('Apagar os dados do navegador pode remover o conteúdo local'));
const errors=html.match(/<section class="content-section common-errors"[\s\S]*?<ul>([\s\S]*?)<\/ul>/)?.[1]||'';
pass('Seis erros comuns',count(errors,/<li>/g)===6);
pass('Cinco perguntas visíveis',count(html,/<details>/g)===5&&count(html,/<summary>/g)===5);
pass('Duas fontes numeradas',count(html,/<li id="fonte-[^"]+">/g)===2);
pass('Dois links externos seguros',count(html,/target="_blank" rel="noopener noreferrer"/g)===2);
pass('Limite científico explícito',html.includes('não validam o Tarot como instrumento de previsão'));
pass('Sem afirmação sobre terceiros',html.includes('Não transforme uma impressão simbólica sobre outra pessoa em fato'));
pass('Limites profissionais',html.includes('atendimento médico, psicológico, jurídico e financeiro qualificado'));

const sourceUrls=['https://journals.sagepub.com/doi/10.1177/1529100612453266','https://pubmed.ncbi.nlm.nih.gov/16507066/'];
for(const url of sourceUrls)pass(`Fonte: ${url}`,countLiteral(html,url)===2,`${countLiteral(html,url)}`);
for(const link of ['plano-de-estudo-do-tarot-em-30-dias.html','escola-do-tarot.html','cartas-do-tarot.html','tarot-livre.html','metodologia-do-tarot.html','etica-e-responsabilidade.html','privacidade-e-dados.html','guias-para-comecar.html','buscar.html'])pass(`Link editorial: ${link}`,html.includes(`href="${link}"`));

try{new Function(js);pass('JavaScript sintaticamente válido',true);}catch(error){pass('JavaScript sintaticamente válido',false,error.message);}
pass('JS com quatro modelos',js.includes('const models = Object.freeze')&&['one: {','three: {','study: {','review: {'].every(value=>js.includes(value)));
pass('JS com essencial e completa por modelo',count(js,/\n      essential: \[/g)===4&&count(js,/\n      complete: \[/g)===4);
pass('JS com dois suportes',js.includes("paper: 'Preencha à mão")&&js.includes("digital: 'Salve em um local"));
pass('JS monta texto vazio',js.includes("output.value = lines.join('\\n')")&&js.includes('printCopy.textContent = output.value'));
pass('JS usa área de transferência',js.includes('navigator.clipboard?.writeText')&&js.includes('await navigator.clipboard.writeText(output.value)'));
pass('JS possui alternativa de cópia',js.includes('output.select()')&&js.includes('output.setSelectionRange(0, output.value.length)'));
pass('JS imprime a ficha',js.includes("printButton.addEventListener('click'")&&js.includes('window.print()'));
pass('JS ativa quatro atalhos',js.includes("document.querySelectorAll('[data-preset]')")&&js.includes('button.dataset.preset'));
pass('JS atualiza sem HTML injetado',js.includes('.textContent =')&&!/\.innerHTML\b|insertAdjacentHTML|outerHTML/.test(js));
pass('JS sem rede',!/(?:\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource)/.test(js));
pass('JS sem armazenamento',!/(?:localStorage|sessionStorage|indexedDB|document\.cookie)/.test(js));
pass('JS respeita movimento reduzido',js.includes("matchMedia('(prefers-reduced-motion: reduce)')"));
pass('JS sem nome pessoal',!/\b[ií]sis\b/i.test(js));

try{
  const listeners={};let printed=0,copied='';
  const fakeNode=(name='node')=>({name,textContent:'',value:'',href:'',dataset:{},children:[],addEventListener(type,handler){listeners[`${name}:${type}`]=handler;},focus(){this.focused=true;},select(){this.selected=true;},setSelectionRange(start,end){this.range=[start,end];},scrollIntoView(){this.scrolled=true;}});
  const fakeForm=fakeNode('form'),fakeOutput=fakeNode('output'),fakePrintCopy=fakeNode('printCopy'),fakeKind=fakeNode('kind'),fakeDepth=fakeNode('depth'),fakeMedium=fakeNode('medium');
  fakeKind.value='one';fakeDepth.value='essential';fakeMedium.value='paper';
  const presets=['one','three','study','review'].map(value=>{const item=fakeNode(`preset-${value}`);item.dataset.preset=value;return item;});
  const fakeMap={'[data-template-form]':fakeForm,'[data-template-output]':fakeOutput,'[data-template-print]':fakePrintCopy,'[data-template-kind]':fakeKind,'[data-template-depth]':fakeDepth,'[data-template-medium]':fakeMedium,'[data-template-kind-label]':fakeNode('kindLabel'),'[data-template-depth-label]':fakeNode('depthLabel'),'[data-template-note]':fakeNode('note'),'#template-title':fakeNode('title'),'[data-template-result]':fakeNode('result'),'[data-copy-template]':fakeNode('copy'),'[data-print-template]':fakeNode('print'),'[data-copy-status]':fakeNode('status')};
  vm.runInNewContext(js,{document:{querySelector:selector=>fakeMap[selector]||null,querySelectorAll:selector=>selector==='[data-preset]'?presets:[]},navigator:{clipboard:{writeText:async text=>{copied=text;}}},window:{matchMedia:()=>({matches:true}),print:()=>{printed++;}}});
  pass('Execução inicial do gerador',fakeOutput.value.startsWith('DIÁRIO DE TAROT · LEITURA DE UMA CARTA')&&fakeOutput.value.includes('SUPORTE: PAPEL OU IMPRESSÃO')&&fakePrintCopy.textContent===fakeOutput.value);
  fakeKind.value='three';fakeDepth.value='complete';fakeMedium.value='digital';listeners['form:submit']({preventDefault(){}});
  pass('Execução da ficha completa digital',fakeOutput.value.includes('POSIÇÃO 3 · FUNÇÃO:')&&fakeOutput.value.includes('SUPORTE: NOTA OU DIÁRIO DIGITAL')&&fakeMap['[data-template-depth-label]'].textContent==='COMPLETA');
  await listeners['copy:click']();
  pass('Execução da cópia',copied===fakeOutput.value&&fakeMap['[data-copy-status]'].textContent.includes('Modelo copiado'));
  listeners['preset-review:click']();
  pass('Execução do atalho de revisão',fakeKind.value==='review'&&fakeOutput.value.startsWith('DIÁRIO DE TAROT · REVISÃO DE LEITURA'));
  listeners['print:click']();
  pass('Execução da impressão',printed===1&&fakePrintCopy.textContent===fakeOutput.value);
}catch(error){pass('Execução simulada do gerador',false,error.message);}

pass('CSS com foco de controles',css.includes('.template-form select:focus-visible')&&css.includes('.template-result textarea:focus-visible')&&css.includes('.template-type-grid button:focus-visible'));
pass('CSS com gerador',css.includes('.journal-tool')&&css.includes('.template-form')&&css.includes('.template-result')&&css.includes('.template-actions'));
pass('CSS com ficha pautada',css.includes('repeating-linear-gradient')&&css.includes('--paper-line'));
pass('CSS com modelos e anatomia',css.includes('.template-type-grid')&&css.includes('.anatomy-grid'));
pass('CSS com método e privacidade',css.includes('.method-path')&&css.includes('.privacy-grid')&&css.includes('.privacy-rule'));
pass('CSS com exemplo e fontes',css.includes('.example-sheet')&&css.includes('.source-list'));
pass('CSS móvel',css.includes('@media (max-width: 1040px)')&&css.includes('@media (max-width: 760px)')&&css.includes('@media (max-width: 560px)'));
pass('CSS para telas mínimas',css.includes('@media (max-width: 340px)'));
pass('CSS respeita movimento reduzido',css.includes('@media (prefers-reduced-motion: reduce)'));
pass('CSS imprime somente ficha',css.includes('@media print')&&css.includes('.page-shell > :not(.journal-tool)')&&css.includes('.template-print-copy'));
const openBraces=count(css,/{/g),closeBraces=count(css,/}/g);
pass('CSS equilibrado',openBraces===closeBraces,`${openBraces}/${closeBraces}`);

const plan=read('plano-de-estudo-do-tarot-em-30-dias.html'),school=read('escola-do-tarot.html'),guides=read('guias-para-comecar.html');
for(const [name,content] of [['Plano de 30 dias',plan],['Escola',school],['Guias',guides]])pass(`${name} liga o Diário uma vez`,count(content,/href="diario-de-tarot\.html"/g)===1);
const planAddition='<a href="diario-de-tarot.html"><span aria-hidden="true">✎</span><strong>Diário de Tarot</strong><small>Registre e revise suas leituras</small></a>';
const schoolAddition='<a href="diario-de-tarot.html">Criar uma ficha no Diário de Tarot →</a>';
const guidesAddition=' <a href="diario-de-tarot.html">Crie sua ficha de leitura</a>.';
pass('Plano V172 preservado fora da integração',sha256(plan.replace(planAddition,''))==='feb6c746df2b88e970c7fd35121032842633c05426a5c8ba62b37f958dc96c60',sha256(plan.replace(planAddition,'')));
pass('Escola V172 preservada fora da integração',sha256(school.replace(schoolAddition,''))==='34a69b40a82a08308ba499590db3524fc87d06417b8ce355f15071a8a466d648',sha256(school.replace(schoolAddition,'')));
pass('Guias V172 preservado fora da integração',sha256(guides.replace(guidesAddition,''))==='0ec3a419db35b8c25a369f44a8d096f2c419da6796ee625ed6fa222c917eb8cc',sha256(guides.replace(guidesAddition,'')));

const searchHtml=read('buscar.html'),searchScript=read('busca-v165.js');
pass('Busca anuncia 125 caminhos',searchHtml.includes('125 CAMINHOS · UMA BUSCA'));
pass('Busca usa revisão V173',searchHtml.includes('busca-v165.js?v=173'));
pass('Índice contém Diário uma vez',count(searchScript,/\['Diário de Tarot', 'diario-de-tarot\.html'/g)===1);
pass('Diário em destaque',searchScript.includes('[1,2,3,4,5,6,14,15,26,27,28,29,30,31,32,33].includes(index)'));
const recoveredSearchHtml=searchHtml.replace('125 CAMINHOS · UMA BUSCA','124 CAMINHOS · UMA BUSCA').replace('busca-v165.js?v=173','busca-v165.js?v=172');
pass('Página de busca V172 preservada',sha256(recoveredSearchHtml)==='d8c847956e8a5921e94f138e39455a513ec2a7e7991bda0b166569a1ea8aa564',sha256(recoveredSearchHtml));
const diaryIndexLine="  ['Diário de Tarot', 'diario-de-tarot.html', '4 modelos de ficha', 'aprender', 'Guia para criar um Diário de Tarot com gerador local de fichas para uma carta, três cartas, estudo e revisão; modelos essencial e completo, copiar, imprimir, caderno, registro de leitura, observação, hipótese, síntese, privacidade e aprendizado. como fazer anotar escrever revisar leituras journaling journal celular papel'],\n";
const recoveredSearchScript=searchScript.replace(diaryIndexLine,'').replace('[1,2,3,4,5,6,14,15,26,27,28,29,30,31,32,33].includes(index)','[1,2,3,4,5,6,14,15,26,27,28,29,30,31,32].includes(index)');
pass('Motor de busca V172 preservado',sha256(recoveredSearchScript)==='c0cce31af03ff2768cbd290d8dc4b652e388c9503737a1a92f103d08b0f07f31',sha256(recoveredSearchScript));

const sitemap=read('sitemap.xml');
pass('Sitemap com 126 URLs',count(sitemap,/<url>/g)===126);
pass('Sitemap mantém 78 imagens',count(sitemap,/<image:image>/g)===78);
pass('Diário único no sitemap',count(sitemap,/<loc>https:\/\/divinabruxa\.com\.br\/diario-de-tarot\.html<\/loc>/g)===1);
const pageLocs=[...sitemap.matchAll(/<loc>(https:\/\/divinabruxa\.com\.br\/(?![^<]+\.(?:webp|png|jpe?g|svg))[^<]*)<\/loc>/g)].map(match=>match[1]);
pass('URLs de página únicas',pageLocs.length===126&&new Set(pageLocs).size===126,`${pageLocs.length}/${new Set(pageLocs).size}`);
const sitemapBlock='  <url>\n    <loc>https://divinabruxa.com.br/diario-de-tarot.html</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n';
pass('Sitemap V172 preservado',sha256(sitemap.replace(sitemapBlock,''))==='84309ac9f816b19232e594e960c52c91e7a806e8a1f5e524a5de9aff3e5cc992',sha256(sitemap.replace(sitemapBlock,'')));

const contract=JSON.parse(read('DIARIO-TAROT-V173.json'));
pass('Contrato V173',contract.schemaVersion==='173.0.0');
pass('Contrato quatro modelos',contract.journalGuide?.templateModelCount===4&&contract.journalGuide?.templateModels?.length===4);
pass('Contrato duas profundidades e suportes',contract.journalGuide?.depthOptions?.length===2&&contract.journalGuide?.mediumOptions?.length===2);
pass('Contrato conteúdo completo',contract.journalGuide?.essentialFields===8&&contract.journalGuide?.methodSteps===5&&contract.journalGuide?.commonErrors===6&&contract.journalGuide?.faqQuestions===5);
pass('Contrato gerador local',contract.templateGenerator?.runsLocally===true&&contract.templateGenerator?.acceptsPersonalText===false&&contract.templateGenerator?.networkRequests===false&&contract.templateGenerator?.answersStored===false);
pass('Contrato copiar e imprimir',contract.templateGenerator?.copySupported===true&&contract.templateGenerator?.copyFallbackSelectsText===true&&contract.templateGenerator?.printSupported===true&&contract.templateGenerator?.printOnlyTemplate===true);
pass('Contrato editorial responsável',contract.editorialMethod?.separatesObservationHypothesisAndReference===true&&contract.editorialMethod?.preservesOriginalHypothesisForReview===true&&contract.editorialMethod?.treatsThirdPartyClaimsAsFacts===false&&contract.editorialMethod?.researchPresentedAsTarotValidation===false);
pass('Contrato privacidade',contract.privacy?.paperRisksExplained===true&&contract.privacy?.digitalSyncRisksExplained===true&&contract.privacy?.currentDivinaJournalLocalOnlyExplained===true&&contract.privacy?.browserDataDeletionRiskExplained===true);
pass('Contrato acessibilidade',contract.accessibility?.nativeSelects===3&&contract.accessibility?.copyStatusLiveRegion===true&&contract.accessibility?.reducedMotion===true&&contract.accessibility?.printStyles===true);
pass('Contrato busca 125',contract.searchIntegration?.indexedDestinationsAfter===125&&Object.values(contract.searchIntegration?.categoryCounts||{}).reduce((a,b)=>a+b,0)===125);
pass('Contrato sitemap 126',contract.discoverability?.sitemapUrlsAfter===126&&contract.discoverability?.sitemapImageEntries===78&&contract.discoverability?.socialPreviewImageAdded===false);
pass('Contrato Tarot Livre',contract.safeguards?.tarotLivreChanged===false&&contract.safeguards?.tarotLivreCards===78&&contract.safeguards?.tarotLivreRepeats===false&&contract.safeguards?.tarotLivreMeaningsInsideFreeMode===false&&contract.safeguards?.tarotLivreMesaReal==='13x6');
pass('Contrato consultas',JSON.stringify(contract.safeguards?.consultationPricesBrl)===JSON.stringify([250,150,100,50])&&contract.safeguards?.consultationEmailRequired===true&&contract.safeguards?.ownerEmail==='orbedasrealidades@hotmail.com');
pass('Contrato sem cobrança, Resend ou nome',contract.safeguards?.realBillingAdded===false&&contract.safeguards?.resendAdded===false&&contract.safeguards?.personalNamePublished===false);
pass('Contrato treze arquivos',contract.installation?.filesInPackage===13&&contract.installation?.replace?.length===6&&contract.installation?.add?.length===7);

const manifest=new Map();
for(const line of read('ARQUIVOS-V173-SHA256.txt').trim().split(/\r?\n/)){const match=line.match(/^([a-f0-9]{64})  (.+)$/);if(match)manifest.set(match[2],match[1]);}
const hashed=required.filter(file=>file!=='ARQUIVOS-V173-SHA256.txt');
pass('Manifesto doze hashes',manifest.size===12,`${manifest.size}`);
for(const file of hashed)pass(`Hash ${file}`,manifest.get(file)===sha256(bytes(file)));

const stable={
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701','tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0','consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423','carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c','tarot-para-iniciantes.html':'823bbdac464c1bb17cd18be7c247c2baddbf9c950d7513d848f86968b20b8e72','tiragens-de-tarot.html':'ce6268945e0a839a07f124d035d64df040d60495241364c628c6db24885d07e0','historia-do-tarot.html':'7d63c8fdc0a45225e29648b9118b43ee6c688d08c37fde67507a8696ce72216c','simbolos-do-tarot.html':'8650b833ef42e6eb6334e2ace93284b87f55dfe94fc48fc3db59f972dc7acca2','simbolos-tarot-v168.css':'df957a3c75a410f69745cd4070c37e707b02e17ddc6af2363ccf196b784b9ac2','simbolos-tarot-v168.js':'07dd2277c6b1e0a96055cc2f7448c46eb8928d5abc0490422cf83de53b158ef5','glossario-do-tarot.html':'456e905fbeabbe17df4efbc5e12aebee68f986d536c9b1b9465a6cd2eb3b3936','tipos-de-tarot.html':'f4a0149a8f5d9bf890802a110390c256b4d74164249982f6859c32bb4870b668','como-escolher-um-baralho-de-tarot.html':'ca04fea54bf5dead1bdf7cd95cb05fffaf2b439fddd5c6b71f7f9caa134579a1','como-embaralhar-cartas-de-tarot.html':'3cc2117f4598bb79cbe23ad1dd2a3395297e182967878048ee7a5b9cc57efab4','plano-estudo-tarot-v172.css':'a806ea3226ae1262eec6dbaee587c737787a48b21a37408fba382bbfa9768016','plano-estudo-tarot-v172.js':'b1c0bc9aee0b931ad1db12e7148ecc0ea14336486609feb31e774c79ad65e908','seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6','busca-v165.css':'7af9c88c6ceb1e695c368d67c6789020df964986ec197fb693b95f6bb9af7f48','robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd','spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0','consultation-policy.js':'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3','consultation-engine.js':'745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050','tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
const full=Object.keys(stable).every(exists);
if(full){
  for(const [file,hash] of Object.entries(stable))pass(`Crítico preservado: ${file}`,sha256(bytes(file))===hash);
  pass('Imagem do Diário existente preservada',exists('diario-espelho-celestial-v1.webp')&&fs.statSync(filePath('diario-espelho-celestial-v1.webp')).size>100000);
  for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match=>match[1]).filter(value=>!/^(https?:|mailto:|tel:|#|data:)/.test(value))){const clean=ref.split(/[?#]/)[0].replace(/^\.\//,'')||'index.html';pass(`Destino da página: ${ref}`,exists(clean));}
  const {CARDS}=await import(`${pathToFileURL(filePath('tarot-data.js')).href}?qa=173`);
  pass('Baralho de dados mantém 78 cartas',CARDS.length===78,`${CARDS.length}`);
  let source=searchScript.replace(/^import[^\n]+\n/,'');source=source.slice(0,source.indexOf('const form ='));
  let data={};try{data=new Function('CARDS',`${source};return {PAGES,entries,normalize};`)(CARDS);pass('Índice executa',true);}catch(error){pass('Índice executa',false,error.message);}
  const entries=data.entries||[],normalize=data.normalize||String;
  pass('Índice possui 125 destinos',entries.length===125,`${entries.length}`);
  pass('Índice possui 125 URLs únicas',new Set(entries.map(item=>item.url)).size===125);
  const categories=Object.fromEntries(['cartas','tiragens','aprender','portal'].map(category=>[category,entries.filter(item=>item.category===category).length]));
  pass('Categorias 78 + 14 + 23 + 10',JSON.stringify(categories)===JSON.stringify({cartas:78,tiragens:14,aprender:23,portal:10}),JSON.stringify(categories));
  pass('Índice liga o Diário em destaque',entries.some(item=>item.url==='diario-de-tarot.html'&&item.featured));
  const find=query=>{const tokens=normalize(query).split(' ').filter(Boolean);return entries.filter(entry=>tokens.every(token=>entry.searchable.includes(token)||normalize(entry.title).includes(token)));};
  for(const query of ['diario de tarot','como anotar leituras','ficha de leitura','caderno de tarot','revisar leitura'])pass(`Busca encontra Diário: ${query}`,find(query).some(item=>item.url==='diario-de-tarot.html'));
  pass('Busca ainda encontra plano',find('plano de estudo').some(item=>item.url==='plano-de-estudo-do-tarot-em-30-dias.html'));
  pass('Busca ainda encontra embaralhar',find('baralho grande').some(item=>item.url==='como-embaralhar-cartas-de-tarot.html'));
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

const result={suite:'DIVINA-BRUXA-V173-DIARIO-DE-TAROT',status:failures.length?'FAIL':'PASS',mode:full?'full-project':'release-package',root,total:checks.length,passed:checks.filter(Boolean).length,failed:failures};
console.log(JSON.stringify(result,null,2));if(failures.length)process.exit(1);
