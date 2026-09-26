/*
 * DIVINA BRUXA 4.0.1 · MOTOR DE HISTÓRIAS COESAS
 *
 * Uma única narrativa governa a resposta inteira. Amor, Mente, Espírito e
 * Matéria deixam de acrescentar fragmentos independentes e passam a servir ao
 * mesmo arco: situação, tensão, escolha, consequência e compreensão.
 */

import {
  loveHash,
  normalizeEmotionalText,
  secureLoveSeed
} from './love-engine-v370.js';
import {
  matterResponse,
  normalizePreferredName
} from './matter-engine-v400.js';

export const STORY_ENGINE_NAME = 'HISTÓRIA';
export const STORY_ENGINE_VERSION = '4.0.1';
export const STORY_ENGINE_LABEL = 'COMEÇO · MOVIMENTO · CONSEQUÊNCIA';

export const STORY_COVENANT = Object.freeze([
  'cada resposta sustenta uma única história',
  'toda história tem situação, tensão, escolha e consequência',
  'as cartas abrem ficção de vida sem virar explicação de significado',
  'nenhuma narrativa é apresentada como fato, previsão ou memória da pessoa',
  'ações e fontes aparecem como continuação concreta, nunca como frase solta'
]);

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const mix = (seed, ...parts) => loveHash([seed, ...parts].join('¦'));
const choose = (values, seed, key) => values[mix(seed, key) % values.length];
const upperFirst = value => value ? `${value.charAt(0).toLocaleUpperCase('pt-BR')}${value.slice(1)}` : '';

const PEOPLE = Object.freeze([
  'Lia', 'Maya', 'Nina', 'Clara', 'Aurora', 'Elis', 'Luna', 'Cecília',
  'Noa', 'Alex', 'Ravi', 'Gael', 'Theo', 'Ícaro', 'Caio', 'Davi'
]);

const PLACES = Object.freeze([
  'num café quase vazio', 'na cozinha depois do jantar', 'no caminho de volta para casa',
  'diante de uma janela aberta', 'numa tarde comum de trabalho', 'durante uma caminhada sem pressa',
  'no quarto onde guardava seus planos', 'num banco de praça ao fim do dia'
]);

const DURATIONS = Object.freeze([
  'algumas semanas', 'muitos dias', 'tempo suficiente para o incômodo ganhar nome',
  'uma sequência de manhãs parecidas', 'mais tempo do que desejava admitir', 'um período de mudanças silenciosas'
]);

const THEMES = Object.freeze({
  relationship:Object.freeze({
    domain:'amor e reciprocidade',
    keywords:/\b(?:amor|amar|relacao|relação|namoro|casamento|paixao|paixão|apaixonada|apaixonado|saudade|ex|voltar|romance)\b/,
    titles:Object.freeze(['A conversa que devolveu a verdade', 'Quando o amor parou de ser adivinhação', 'O afeto que precisou encontrar reciprocidade']),
    situation:Object.freeze([
      '{p} percebeu que uma relação importante vinha sendo sustentada mais por expectativa do que por conversas honestas.',
      '{p} gostava de alguém, mas começou a notar que apenas seus próprios gestos mantinham a proximidade de pé.',
      '{p} carregava um afeto verdadeiro e, ao mesmo tempo, já não conseguia ignorar a distância entre promessa e atitude.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, cada silêncio recebeu uma explicação diferente, e o esforço de imaginar respostas cansou mais do que a própria dúvida.',
      'Sempre que a relação parecia avançar, um novo recuo devolvia tudo ao começo e deixava {p} tentando compreender sem ajuda o que precisava ser dito a dois.',
      'A esperança continuava presente, mas já dividia espaço com uma pergunta simples: havia reciprocidade real ou apenas vontade de acreditar?'
    ]),
    choice:Object.freeze([
      'Quando a situação se repetiu {place}, {p} parou de interpretar sinais e fez uma pergunta direta, sem acusar nem se diminuir.',
      '{p} decidiu não produzir mais desculpas pelo outro e passou a observar o que existia em atitudes concretas.',
      'Em vez de insistir numa resposta perfeita, {p} explicou o que sentia, definiu o que precisava e deixou espaço para uma escolha verdadeira.'
    ]),
    result:Object.freeze([
      'A conversa não resolveu tudo, mas separou carinho de reciprocidade e devolveu clareza ao que antes parecia impossível de nomear.',
      'A resposta recebida não foi exatamente a desejada, porém retirou o peso da espera e permitiu que {p} voltasse a cuidar da própria vida.',
      'O vínculo mudou depois disso: o que era mútuo permaneceu, e o que dependia apenas de esforço unilateral deixou de comandar os dias.'
    ]),
    truth:Object.freeze([
      'No fim, {p} entendeu que amor não precisa de histórias inventadas para permanecer verdadeiro; precisa de presença, limite e gesto compatível.',
      'A experiência mostrou que sentir muito não obriga ninguém a aceitar pouco, e que dignidade também faz parte de uma história de amor.',
      '{p} saiu dessa passagem sabendo que uma relação pode terminar ou mudar sem transformar o afeto vivido em mentira.'
    ]),
    closing:Object.freeze(['Se esta história tocar seu momento, observe ações antes de completar silêncios.', 'O próximo capítulo não exige pressa; exige reciprocidade visível.', 'Amor e verdade conseguem permanecer na mesma frase.'])
  }),
  decision:Object.freeze({
    domain:'decisão e responsabilidade',
    keywords:/\b(?:decidir|decisao|decisão|escolher|escolha|duvida|dúvida|confusa|confuso|caminho|opcao|opção)\b/,
    titles:Object.freeze(['A escolha que deixou de fugir dos fatos', 'O dia em que a dúvida ganhou critérios', 'Uma decisão construída sem violência']),
    situation:Object.freeze([
      '{p} estava diante de duas possibilidades e tentava encontrar uma certeza absoluta antes de dar qualquer passo.',
      '{p} precisava escolher um caminho, mas medo e desejo falavam ao mesmo tempo e tornavam todos os sinais contraditórios.',
      '{p} adiava uma decisão importante porque imaginava que a opção certa eliminaria todo risco e todo desconforto.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, novas hipóteses foram acrescentadas ao problema, mas nenhuma delas substituiu os fatos que já estavam disponíveis.',
      'Quanto mais {p} tentava prever cada consequência, menos conseguia reconhecer o que era realmente controlável no presente.',
      'A dúvida cresceu porque possibilidades diferentes estavam sendo comparadas sem critérios comuns de segurança, desejo e realidade.'
    ]),
    choice:Object.freeze([
      '{place}, {p} escreveu o que sabia, o que apenas imaginava e o que não aceitaria perder; a escolha começou a ganhar contorno.',
      '{p} trocou a pergunta “qual caminho é perfeito?” por “qual caminho é responsável, possível e coerente comigo agora?”.',
      'Em vez de decidir tudo de uma vez, {p} escolheu um primeiro gesto reversível e definiu quando avaliaria o resultado.'
    ]),
    result:Object.freeze([
      'A incerteza não desapareceu, mas perdeu o poder de paralisar porque o próximo passo ficou menor, concreto e verificável.',
      'A decisão trouxe trabalho e também alívio: {p} já não precisava sustentar simultaneamente futuros incompatíveis.',
      'Depois do primeiro movimento, informações novas apareceram e permitiram ajustar o caminho sem tratar mudança de ideia como fracasso.'
    ]),
    truth:Object.freeze([
      '{p} compreendeu que maturidade não é prever tudo; é escolher com os dados disponíveis e continuar capaz de corrigir a rota.',
      'No fim, a melhor escolha não foi a que prometia ausência de medo, mas a que preservava realidade, dignidade e possibilidade de revisão.',
      'A dúvida deixou de ser inimiga quando passou a indicar quais perguntas ainda precisavam de resposta concreta.'
    ]),
    closing:Object.freeze(['Uma decisão inteira pode começar com um passo pequeno e verificável.', 'Separe fato, hipótese e desejo antes de escolher.', 'O caminho pode ser corrigido; sua dignidade não precisa ser negociada.'])
  }),
  work:Object.freeze({
    domain:'trabalho e propósito',
    keywords:/\b(?:trabalho|emprego|carreira|dinheiro|projeto|negocio|negócio|cliente|chefe|profissao|profissão)\b/,
    titles:Object.freeze(['O projeto que encontrou um chão possível', 'Quando esforço ganhou direção', 'A coragem de reorganizar o trabalho']),
    situation:Object.freeze([
      '{p} dedicava muita energia a um projeto, mas os dias terminavam cheios de tarefas e vazios de avanço reconhecível.',
      '{p} continuava num trabalho que oferecia segurança, embora já não deixasse espaço para aprender, criar ou descansar.',
      '{p} tinha uma ideia importante e esperava sentir confiança total antes de mostrá-la a alguém.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, urgências menores ocuparam o lugar das decisões difíceis e deram a impressão de movimento sem produzir direção.',
      'O medo de perder estabilidade fazia {p} suportar uma rotina que consumia justamente a energia necessária para construir uma alternativa.',
      'Cada revisão parecia insuficiente, e o desejo de apresentar algo impecável mantinha o trabalho preso no rascunho.'
    ]),
    choice:Object.freeze([
      '{place}, {p} definiu uma entrega pequena, um prazo real e uma pessoa confiável para avaliar o que já existia.',
      '{p} separou sobrevivência de propósito e criou um plano que protegia as contas sem abandonar completamente a mudança desejada.',
      'Em vez de trabalhar até a exaustão, {p} escolheu três prioridades e deixou o restante fora daquele ciclo.'
    ]),
    result:Object.freeze([
      'A primeira entrega não mudou tudo, mas produziu retorno concreto e mostrou exatamente o que precisava ser melhorado.',
      'Com limites visíveis, o trabalho começou a caber no dia e deixou de ocupar também o descanso, o corpo e as relações.',
      'A mudança avançou devagar, porém cada etapa concluída reduziu a dependência de coragem momentânea.'
    ]),
    truth:Object.freeze([
      '{p} descobriu que propósito sem estrutura vira cobrança, enquanto estrutura sem propósito vira repetição.',
      'No fim, consistência significou continuar sem transformar o próprio corpo em combustível descartável.',
      'O projeto ganhou realidade quando deixou de precisar nascer perfeito e passou a aceitar crescimento comprovável.'
    ]),
    closing:Object.freeze(['Transforme ambição em uma entrega que caiba nesta semana.', 'Trabalho sustentável também precisa preservar quem o realiza.', 'O próximo resultado nasce de prioridade, não de exaustão.'])
  }),
  family:Object.freeze({
    domain:'família e pertencimento',
    keywords:/\b(?:familia|família|mae|mãe|pai|irma|irmã|irmao|irmão|filha|filho|casa|parente)\b/,
    titles:Object.freeze(['A casa onde cada voz encontrou um limite', 'O afeto que aprendeu a conversar', 'Quando pertencer deixou de significar silêncio']),
    situation:Object.freeze([
      '{p} amava a própria família, mas havia assuntos que sempre terminavam em culpa, interrupção ou silêncio prolongado.',
      '{p} ocupava o papel de resolver os problemas de todos e quase nunca percebia quando suas próprias necessidades ficavam por último.',
      '{p} queria preservar um vínculo familiar sem continuar aceitando comportamentos que feriam sua tranquilidade.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, cada tentativa de conversa repetiu o mesmo roteiro, porque todos defendiam posições antes de reconhecer o que realmente havia acontecido.',
      'O medo de ter sua recusa confundida com ingratidão fazia {p} dizer sim mesmo quando tempo, dinheiro e energia já não eram suficientes.',
      'A proximidade tornava os limites mais difíceis, como se amar alguém significasse permitir acesso irrestrito a cada parte da vida.'
    ]),
    choice:Object.freeze([
      '{place}, {p} descreveu um comportamento específico, explicou seu impacto e pediu uma mudança concreta sem atacar a história inteira da família.',
      '{p} decidiu ajudar apenas dentro de condições que não destruíssem seu próprio equilíbrio.',
      'Quando a conversa voltou ao antigo ciclo, {p} encerrou o encontro com respeito e marcou outro momento para continuar.'
    ]),
    result:Object.freeze([
      'Nem todos compreenderam de imediato, mas o novo limite interrompeu a repetição e mostrou que a relação precisaria aprender outra forma.',
      'A culpa apareceu, porém diminuiu cada vez que {p} percebeu que cuidado verdadeiro não exige autoabandono.',
      'Alguns vínculos se aproximaram e outros ficaram mais distantes, revelando quais relações conseguiam existir junto com respeito.'
    ]),
    truth:Object.freeze([
      'No fim, {p} entendeu que pertencer não deveria custar a própria voz.',
      'A história mostrou que limite não é falta de amor; muitas vezes é a única condição para que o amor deixe de machucar.',
      '{p} descobriu que uma família pode ser honrada sem repetir tudo o que aprendeu dentro dela.'
    ]),
    closing:Object.freeze(['Diga o comportamento, o impacto e o limite sem transformar tudo em julgamento.', 'Pertencer não exige desaparecer.', 'Cuidado familiar também precisa respeitar quem cuida.'])
  }),
  friendship:Object.freeze({
    domain:'amizade e presença',
    keywords:/\b(?:amiga|amigo|amizade|sozinha|sozinho|companhia|grupo|afastamento)\b/,
    titles:Object.freeze(['A amizade que sobreviveu à conversa', 'Quando companhia virou presença real', 'O vínculo que precisou de verdade']),
    situation:Object.freeze([
      '{p} sentia falta de uma amizade que antes parecia simples, mas agora dependia de convites que quase sempre partiam do mesmo lado.',
      '{p} participava de muitas conversas e ainda assim não encontrava espaço para dizer como realmente se sentia.',
      '{p} percebeu que uma amizade importante havia mudado e não sabia se deveria insistir, perguntar ou apenas se afastar.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, pequenas ausências foram acumuladas até parecerem uma resposta definitiva, embora nenhuma conversa tivesse acontecido.',
      'O receio de incomodar transformou necessidade de companhia em silêncio, e o silêncio passou a parecer prova de abandono.',
      'Cada encontro cordial escondia a pergunta que realmente importava: ainda existia disponibilidade para uma amizade recíproca?'
    ]),
    choice:Object.freeze([
      '{place}, {p} enviou uma mensagem simples, falou da distância sem acusação e perguntou se havia vontade de reconstruir a presença.',
      '{p} escolheu procurar duas pessoas seguras e dizer claramente que precisava de companhia, sem minimizar o próprio momento.',
      'Em vez de testar a amizade com silêncio, {p} contou o que havia percebido e deixou o outro responder com liberdade.'
    ]),
    result:Object.freeze([
      'A resposta mostrou que parte da distância vinha de problemas nunca compartilhados, e a amizade encontrou uma forma nova, menos automática e mais honesta.',
      'Nem todos puderam se aproximar, mas uma presença verdadeira foi suficiente para quebrar a certeza de que ninguém se importava.',
      'A conversa não recuperou o passado, porém definiu com clareza o vínculo possível no presente.'
    ]),
    truth:Object.freeze([
      '{p} aprendeu que companhia real não é quantidade de mensagens; é espaço seguro para existir com verdade.',
      'No fim, pedir presença foi menos doloroso do que continuar transformando silêncio em sentença sobre o próprio valor.',
      'A amizade mudou sem perder necessariamente sua importância, e {p} pôde parar de cobrar do presente a forma exata do passado.'
    ]),
    closing:Object.freeze(['Uma conversa honesta vale mais do que um teste silencioso.', 'Procure presença capaz de responder, não apenas contato.', 'Pedir companhia é um gesto humano, não uma fraqueza.'])
  }),
  selfworth:Object.freeze({
    domain:'dignidade e identidade',
    keywords:/\b(?:valor|autoestima|vergonha|rejeicao|rejeição|fracasso|culpa|suficiente|identidade|quem sou)\b/,
    titles:Object.freeze(['O nome que voltou para as próprias mãos', 'Quando um erro deixou de contar a história inteira', 'A dignidade que não precisava ser conquistada']),
    situation:Object.freeze([
      '{p} começou a medir o próprio valor por uma rejeição recente e passou a tratar um acontecimento como resumo de toda a sua vida.',
      '{p} havia cometido um erro e confundia responsabilidade com a obrigação de se humilhar indefinidamente.',
      '{p} comparava seus bastidores com a aparência organizada da vida alheia e sempre concluía que estava em atraso.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, cada lembrança foi usada como prova de insuficiência, enquanto conquistas, cuidado e resistência desapareciam da narrativa.',
      'A tentativa de reparar o que aconteceu se transformou em punição permanente e deixou de produzir mudança concreta.',
      'Quanto mais {p} procurava confirmação externa, mais qualquer silêncio parecia retirar um valor que nunca deveria depender de aprovação constante.'
    ]),
    choice:Object.freeze([
      '{place}, {p} escreveu o fato sem insultar a própria identidade e separou o que precisava ser reparado do que apenas precisava ser perdoado.',
      '{p} decidiu avaliar a própria trajetória com a mesma precisão e humanidade que ofereceria a alguém que amasse.',
      'Em vez de buscar uma prova grandiosa de valor, {p} cumpriu um compromisso pequeno consigo e repetiu o gesto no dia seguinte.'
    ]),
    result:Object.freeze([
      'A vergonha não desapareceu imediatamente, mas perdeu espaço quando ações reais substituíram acusações internas repetidas.',
      'O erro continuou fazendo parte da história sem receber autoridade para definir todos os outros capítulos.',
      'Pouco a pouco, {p} voltou a reconhecer capacidade em experiências que antes pareciam pequenas demais para contar.'
    ]),
    truth:Object.freeze([
      'No fim, {p} entendeu que dignidade não é recompensa concedida depois da perfeição.',
      'A responsabilidade tornou-se mais forte quando deixou de depender de crueldade contra si.',
      '{p} recuperou o próprio nome ao perceber que nenhuma rejeição conhece a totalidade de uma pessoa.'
    ]),
    closing:Object.freeze(['Repare o que for necessário sem transformar humilhação em método.', 'Um acontecimento não possui a pessoa inteira.', 'Dignidade pode coexistir com mudança.'])
  }),
  change:Object.freeze({
    domain:'mudança e recomeço',
    keywords:/\b(?:mudar|mudanca|mudança|recomeco|recomeço|novo|nova|partir|viagem|cidade|fase|futuro)\b/,
    titles:Object.freeze(['A mudança que começou antes da partida', 'O recomeço construído por etapas', 'Quando o futuro deixou de ser apenas imaginação']),
    situation:Object.freeze([
      '{p} desejava uma mudança profunda, mas observava o futuro como se fosse necessário abandonar toda a vida atual de uma só vez.',
      '{p} sabia que um ciclo havia terminado, embora os hábitos antigos continuassem organizando cada dia.',
      '{p} queria recomeçar e, ao mesmo tempo, sentia culpa por deixar para trás uma versão de si que havia sobrevivido até ali.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, planos enormes alternaram entusiasmo e paralisia porque nenhum deles cabia de verdade na semana presente.',
      'A ausência de uma ruptura visível fazia {p} acreditar que nada estava mudando, mesmo quando escolhas pequenas já apontavam outra direção.',
      'O passado oferecia familiaridade, enquanto o futuro oferecia possibilidade; entre os dois, {p} ainda precisava construir uma ponte prática.'
    ]),
    choice:Object.freeze([
      '{place}, {p} escolheu uma parte concreta da mudança e marcou data, custo, apoio necessário e primeiro passo.',
      '{p} parou de esperar uma identidade nova chegar pronta e começou a praticar uma rotina compatível com a vida desejada.',
      'Em vez de destruir tudo o que existia, {p} preservou o que ainda sustentava sua vida e abriu espaço para o novo crescer ao lado.'
    ]),
    result:Object.freeze([
      'O recomeço perdeu o brilho de fantasia e ganhou algo melhor: continuidade possível, ajustes reais e sinais visíveis de progresso.',
      'Alguns dias ainda pareciam antigos, mas as escolhas repetidas começaram a criar uma realidade diferente.',
      'A culpa diminuiu quando {p} compreendeu que agradecer ao passado não exige permanecer dentro dele.'
    ]),
    truth:Object.freeze([
      'No fim, {p} descobriu que mudança verdadeira raramente acontece num único gesto; ela se torna inevitável pela repetição de escolhas compatíveis.',
      'O futuro começou quando deixou de ser promessa e passou a ocupar horário, orçamento e atitude.',
      '{p} reconheceu que recomeçar não apaga a história anterior; apenas impede que ela seja o único destino disponível.'
    ]),
    closing:Object.freeze(['Dê ao futuro uma tarefa concreta no presente.', 'Recomeçar não exige apagar o caminho anterior.', 'Uma mudança grande pode ser construída por escolhas pequenas e repetidas.'])
  }),
  grief:Object.freeze({
    domain:'perda e continuidade',
    keywords:/\b(?:luto|perda|perdi|morte|morreu|fim|terminou|dor|triste|tristeza|chorar)\b/,
    titles:Object.freeze(['A vida que continuou sem apagar a ausência', 'O lugar que a memória encontrou', 'Quando a dor deixou de caminhar sozinha']),
    situation:Object.freeze([
      '{p} atravessava uma ausência que havia mudado o tamanho dos dias e a forma de reconhecer lugares conhecidos.',
      '{p} tentava voltar à rotina depois de uma perda, mas tarefas simples ainda carregavam lembranças inesperadas.',
      '{p} sentia que seguir adiante poderia parecer abandono daquilo que havia sido importante.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, a dor alternou silêncio e intensidade, sem obedecer à ordem que outras pessoas esperavam.',
      'A tentativa de parecer bem exigia tanta energia que quase não sobrava espaço para sentir, descansar ou pedir companhia.',
      'Cada momento de alegria vinha acompanhado de culpa, como se a vida precisasse permanecer parada para provar amor ao que foi perdido.'
    ]),
    choice:Object.freeze([
      '{place}, {p} contou a alguém confiável como os dias realmente estavam e permitiu que a presença substituísse a obrigação de explicar tudo.',
      '{p} criou um gesto simples para honrar a memória e outro gesto igualmente simples para cuidar da vida que continuava.',
      'Em vez de exigir um encerramento completo, {p} aceitou atravessar aquele dia específico com apoio, alimento e descanso possíveis.'
    ]),
    result:Object.freeze([
      'A ausência continuou existindo, mas já não ocupava sozinha todos os cômodos da experiência.',
      'A memória encontrou um lugar que não impedia novos vínculos, risos ou planos de aparecerem ao redor dela.',
      'Com companhia e tempo, {p} começou a distinguir saudade de culpa e continuidade de esquecimento.'
    ]),
    truth:Object.freeze([
      'No fim, {p} compreendeu que continuar vivendo não reduz a importância do que foi amado.',
      'A dor não precisou desaparecer para deixar de governar cada decisão.',
      '{p} descobriu que memória e futuro podem ocupar a mesma vida sem se anularem.'
    ]),
    closing:Object.freeze(['Não atravesse uma perda pesada sem presença humana segura.', 'Continuar não é esquecer.', 'Hoje pode pedir cuidado sem exigir conclusão.'])
  }),
  creativity:Object.freeze({
    domain:'criação e expressão',
    keywords:/\b(?:criar|criatividade|arte|musica|música|cantar|escrever|historia|história|ideia|inspiracao|inspiração)\b/,
    titles:Object.freeze(['A obra que aceitou nascer incompleta', 'Quando a criação saiu do silêncio', 'O primeiro rascunho de uma vida mais autoral']),
    situation:Object.freeze([
      '{p} carregava uma ideia que parecia viva por dentro, mas sempre encontrava uma razão para adiá-la antes de ganhar forma.',
      '{p} criava em segredo e comparava cada começo imperfeito com obras que outras pessoas levaram anos para terminar.',
      '{p} havia perdido o prazer de criar porque todo gesto artístico passou a ser julgado como produto antes mesmo de existir.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, inspiração e medo apareceram juntos, e {p} confundiu insegurança com falta de talento.',
      'A exigência de originalidade absoluta transformou referências, tentativas e aprendizado em motivos de vergonha.',
      'Quanto mais importante a obra parecia, maior se tornava o risco imaginado de mostrá-la ainda humana e incompleta.'
    ]),
    choice:Object.freeze([
      '{place}, {p} estabeleceu um tempo curto para criar sem editar e outro momento separado para revisar com critérios claros.',
      '{p} escolheu concluir uma versão pequena antes de começar novamente, aceitando que acabamento também faz parte da criatividade.',
      'Em vez de perguntar se a obra era genial, {p} perguntou se ela estava honesta, inteira o bastante e pronta para receber retorno.'
    ]),
    result:Object.freeze([
      'A primeira versão revelou falhas e também uma voz que nunca teria aparecido enquanto tudo permanecesse apenas imaginado.',
      'O prazer retornou quando criar deixou de ser julgamento permanente e voltou a ser prática, curiosidade e construção.',
      'O retorno recebido não definiu o valor da obra, mas ofereceu informações concretas para o próximo movimento.'
    ]),
    truth:Object.freeze([
      'No fim, {p} entendeu que criatividade não é ausência de limite; é a capacidade de transformar limite em forma.',
      'A obra começou a existir quando {p} permitiu que ela fosse verdadeira antes de ser perfeita.',
      '{p} descobriu que uma voz autoral não chega pronta: ela se reconhece depois de muitas escolhas concluídas.'
    ]),
    closing:Object.freeze(['Termine uma versão antes de exigir uma obra definitiva.', 'A criação precisa existir para poder crescer.', 'Honestidade e acabamento podem caminhar juntos.'])
  }),
  boundaries:Object.freeze({
    domain:'limite e proteção',
    keywords:/\b(?:limite|respeito|abuso|raiva|briga|proteger|afastar|afastamento|injustica|injustiça)\b/,
    titles:Object.freeze(['O limite que interrompeu a repetição', 'Quando dizer não protegeu o que ainda era possível', 'A firmeza que não precisou virar crueldade']),
    situation:Object.freeze([
      '{p} percebeu que uma situação se repetia porque suas recusas eram tratadas como convites para novas negociações.',
      '{p} estava com raiva depois de ter um limite ignorado e precisava agir sem permitir que o impulso decidisse tudo.',
      '{p} queria preservar uma relação, mas já não conseguia fazer isso ao custo de aceitar o mesmo desrespeito.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, cada concessão evitou um conflito imediato e fortaleceu o problema que voltaria depois.',
      'A vontade de responder na mesma intensidade prometia alívio rápido, mas também poderia criar consequências difíceis de reparar.',
      'O receio de parecer cruel fazia {p} explicar demais, enquanto a outra pessoa discutia cada detalhe e ignorava o limite central.'
    ]),
    choice:Object.freeze([
      '{place}, {p} afirmou o limite em uma frase curta, explicou a consequência e encerrou a conversa quando a negociação recomeçou.',
      '{p} esperou a intensidade diminuir, registrou os fatos e procurou apoio antes de tomar uma decisão irreversível.',
      'Em vez de provar quem estava certo, {p} definiu o comportamento que não aceitaria e o que faria para se proteger.'
    ]),
    result:Object.freeze([
      'A reação do outro foi desconfortável, mas deixou claro que o limite era necessário justamente porque não seria aceito sem resistência.',
      'A pausa evitou uma resposta destrutiva e permitiu que firmeza, evidência e segurança ocupassem o lugar do impulso.',
      'A relação precisou mudar; onde houve respeito, ganhou forma nova, e onde não houve, a distância tornou-se proteção.'
    ]),
    truth:Object.freeze([
      'No fim, {p} entendeu que um limite não precisa ser aprovado por quem se beneficiava da ausência dele.',
      'A história mostrou que firmeza pode proteger sem humilhar e que paz não é o mesmo que silêncio obrigatório.',
      '{p} descobriu que dizer não a uma repetição também pode ser uma forma de dizer sim à própria vida.'
    ]),
    closing:Object.freeze(['Um limite claro não precisa de uma defesa infinita.', 'Proteção e respeito podem existir sem vingança.', 'Observe quem só aceita sua presença quando seu limite desaparece.'])
  }),
  rest:Object.freeze({
    domain:'cansaço e recuperação',
    keywords:/\b(?:cansada|cansado|exausta|exausto|descansar|sono|pressao|pressão|sobrecarga|ansiedade|parar)\b/,
    titles:Object.freeze(['O descanso que impediu a vida de quebrar', 'Quando o mínimo voltou a ser suficiente', 'A pausa que devolveu direção']),
    situation:Object.freeze([
      '{p} vinha cumprindo obrigações sem espaço para perceber que o corpo já estava funcionando apenas por insistência.',
      '{p} tratava descanso como prêmio e sempre encontrava uma tarefa nova antes de se permitir parar.',
      '{p} queria resolver todos os problemas num único dia, embora sua energia já não acompanhasse a urgência da mente.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, pequenos erros aumentaram, decisões simples ficaram pesadas e qualquer pedido adicional parecia impossível de suportar.',
      'Quanto mais o cansaço crescia, mais {p} tentava compensar com esforço, criando exatamente o ciclo que mantinha a exaustão.',
      'A culpa transformava cada pausa em ansiedade e impedia que o descanso cumprisse sua função de recuperação.'
    ]),
    choice:Object.freeze([
      '{place}, {p} reduziu o dia ao essencial, pediu ajuda numa tarefa específica e adiou uma decisão que não precisava ser tomada sob exaustão.',
      '{p} marcou o descanso antes das demais tarefas e protegeu esse horário como protegeria um compromisso importante.',
      'Em vez de prometer uma recuperação completa, {p} escolheu alimento, água, silêncio e uma noite com menos exigências.'
    ]),
    result:Object.freeze([
      'Nada foi magicamente resolvido, mas o corpo deixou de enfrentar sozinho uma lista construída para uma energia que já não existia.',
      'Depois da pausa, alguns problemas continuaram grandes e outros revelaram que eram apenas urgências produzidas pelo cansaço.',
      'A ajuda recebida mostrou que dividir peso não reduz competência; aumenta a possibilidade de continuar.'
    ]),
    truth:Object.freeze([
      'No fim, {p} compreendeu que descanso não interrompe a vida; ele impede que a vida seja consumida pelo próprio esforço.',
      'O mínimo digno daquele dia valeu mais do que uma promessa grandiosa impossível de sustentar.',
      '{p} descobriu que respeitar o corpo também é uma decisão inteligente, não uma falha de vontade.'
    ]),
    closing:Object.freeze(['Reduza o dia ao essencial antes de cobrar clareza de um corpo exausto.', 'Descanso é parte da continuidade.', 'O mínimo possível de hoje pode proteger o amanhã.'])
  }),
  presence:Object.freeze({
    domain:'vida presente',
    keywords:/a^/,
    titles:Object.freeze(['O dia em que a vida ganhou uma sequência', 'Uma história construída pelo próximo gesto', 'Quando o presente deixou de ser apenas espera']),
    situation:Object.freeze([
      '{p} sentia que muitas partes da vida pediam atenção ao mesmo tempo e já não sabia qual delas deveria vir primeiro.',
      '{p} carregava uma inquietação difícil de nomear, como se algo precisasse mudar sem ainda mostrar exatamente o quê.',
      '{p} havia chegado a um momento em que continuar do mesmo modo parecia pesado, mas começar de outro jeito ainda parecia abstrato.'
    ]),
    tension:Object.freeze([
      'Durante {duration}, pensamentos diferentes disputaram espaço e transformaram qualquer escolha numa tentativa de resolver a vida inteira.',
      'A falta de um nome claro para o problema fazia cada sensação parecer maior e mais definitiva do que realmente era.',
      'Quanto mais {p} esperava por certeza, mais o presente se enchia de decisões pequenas tomadas automaticamente.'
    ]),
    choice:Object.freeze([
      '{place}, {p} escolheu uma pergunta concreta, separou o que dependia de ação do que dependia de tempo e começou pela menor parte possível.',
      '{p} parou de procurar uma frase capaz de explicar tudo e descreveu apenas o fato, o sentimento e a necessidade daquele momento.',
      'Em vez de prometer transformação total, {p} definiu um gesto que poderia ser concluído antes do fim do dia.'
    ]),
    result:Object.freeze([
      'O problema não desapareceu, mas ganhou tamanho humano e deixou de ocupar sozinho todo o horizonte.',
      'A primeira ação revelou qual era a pergunta seguinte e transformou confusão em uma sequência possível.',
      'Ao final do dia, {p} não tinha todas as respostas, porém já possuía evidência de movimento e um lugar de onde continuar.'
    ]),
    truth:Object.freeze([
      'No fim, {p} entendeu que uma vida coerente não nasce de uma resposta perfeita, mas de escolhas que conseguem conversar entre si.',
      'A história mostrou que clareza muitas vezes aparece depois do primeiro gesto, e não antes dele.',
      '{p} descobriu que o presente pode ser suficiente para começar sem precisar fingir certeza sobre o futuro.'
    ]),
    closing:Object.freeze(['Dê um nome concreto ao que precisa acontecer primeiro.', 'Uma história inteira pode começar com um gesto possível.', 'Clareza também é consequência de movimento.'])
  })
});

const THEME_IDS = Object.freeze(Object.keys(THEMES));

function fill(template, values) {
  return upperFirst(template.replace(/\{(p|place|duration)\}/g, (_, key) => values[key] || ''));
}

function themeFor(input, emotion, seed) {
  const text = normalizeEmotionalText(input);
  const explicit = THEME_IDS.filter(id => id !== 'presence').find(id => THEMES[id].keywords.test(text));
  if (explicit) return explicit;
  const emotional = {
    affection:'relationship', longing:'relationship', sadness:'grief', loneliness:'friendship',
    fear:'decision', confusion:'decision', anger:'boundaries', selfworth:'selfworth',
    exhaustion:'rest', joy:'creativity', hope:'change'
  }[emotion];
  if (emotional) return emotional;
  return THEME_IDS[mix(seed, text, 'theme') % THEME_IDS.length];
}

function buildNarrative(themeId, seed, preferredName = '') {
  const theme = THEMES[themeId] || THEMES.presence;
  const chosenName = normalizePreferredName(preferredName).split(' ')[0] || choose(PEOPLE, seed, 'person');
  const values = Object.freeze({
    p:chosenName,
    place:choose(PLACES, seed, 'place'),
    duration:choose(DURATIONS, seed, 'duration')
  });
  const sentence = (bank, key) => fill(choose(bank, seed, key), values);
  return Object.freeze({
    themeId,
    domain:theme.domain,
    protagonist:chosenName,
    title:choose(theme.titles, seed, 'title'),
    situation:sentence(theme.situation, 'situation'),
    tension:sentence(theme.tension, 'tension'),
    choice:sentence(theme.choice, 'choice'),
    result:sentence(theme.result, 'result'),
    truth:sentence(theme.truth, 'truth'),
    closing:choose(theme.closing, seed, 'closing')
  });
}

function cardIdentity(card) {
  return `${card?.canonicalId ?? card?.id ?? 'carta'}:${clean(card?.name, 100) || 'Carta sem nome'}`;
}

function signature(seed, key) {
  return mix(seed, key).toString(36).toUpperCase().padStart(8, '0');
}

export function storyForCard(card, seed = secureLoveSeed(), {
  scope = 'carta',
  moment = 'agora',
  intention = '',
  preferredName = ''
} = {}) {
  const safeSeed = `${seed}:${cardIdentity(card)}:${scope}:${moment}`;
  const themeId = themeFor(intention, '', safeSeed);
  const narrative = buildNarrative(themeId, safeSeed, preferredName);
  const cardName = clean(card?.name, 100) || 'esta carta';
  const heartline = `A carta “${cardName}” abre esta ficção: ${narrative.situation}`;
  const whisper = narrative.tension;
  const paragraphs = Object.freeze([
    narrative.choice,
    narrative.result,
    narrative.truth
  ]);
  return Object.freeze({
    engine:'ARBÍTRIO+AMOR+MENTE+ESPÍRITO+MATÉRIA+HISTÓRIA',
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'HISTÓRIA COESA · FICÇÃO DE VIDA',
    loveLabel:'CUIDADO PRESENTE',
    emotionEngine:'AMOR',
    title:narrative.title,
    heartline,
    whisper,
    paragraphs,
    story:paragraphs.join('\n\n'),
    closing:narrative.closing,
    signature:signature(safeSeed, 'card-story'),
    loveSignature:signature(safeSeed, 'care'),
    theme:themeId,
    protagonist:narrative.protagonist,
    cohesion:Object.freeze({ beginning:true, tension:true, choice:true, consequence:true, ending:true })
  });
}

export function storyConversation(cards = [], positions = [], seed = secureLoveSeed(), intention = '', preferredName = '') {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  const identities = validCards.map(cardIdentity).join('→');
  const safeSeed = `${seed}:${identities}:conversation`;
  const themeId = themeFor(intention, '', safeSeed);
  const narrative = buildNarrative(themeId, safeSeed, preferredName);
  const first = validCards[0];
  const middleIndex = Math.floor((validCards.length - 1) / 2);
  const middle = validCards[middleIndex];
  const last = validCards[validCards.length - 1];
  const positionAt = index => clean(positions[index], 100) || `posição ${index + 1}`;
  const lead = `O primeiro capítulo acontece em ${positionAt(0)}, com a carta “${clean(first.name, 100)}”; ${narrative.situation}`;
  const story = validCards.length === 1
    ? [
        `${narrative.tension} A presença de “${clean(first.name, 100)}” não encerra a situação nem entrega uma resposta pronta; ela ilumina o momento em que a história precisa mudar de direção.`,
        `${narrative.choice} ${narrative.result}`,
        `A consequência desse movimento fecha o capítulo sem fechar a vida: ${narrative.truth}`
      ].join('\n\n')
    : [
        `${narrative.tension} Por isso, a passagem até ${positionAt(middleIndex)}, com a carta “${clean(middle.name, 100)}”, não repete o começo: ela exige uma escolha.`,
        `${narrative.choice} ${narrative.result}`,
        `Quando a carta “${clean(last.name, 100)}” chega a ${positionAt(validCards.length - 1)}, a história encontra consequência: ${narrative.truth}`
      ].join('\n\n');
  const stages = [narrative.situation, narrative.tension, narrative.choice, narrative.result, narrative.truth];
  const voices = Object.freeze(validCards.map((card, index) =>
    `Capítulo ${index + 1} · ${positionAt(index)} · ${clean(card.name, 100)}: ${stages[index % stages.length]}`
  ));
  return Object.freeze({
    engine:'ARBÍTRIO+AMOR+MENTE+ESPÍRITO+MATÉRIA+HISTÓRIA',
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'HISTÓRIA COESA · CARTAS EM SEQUÊNCIA',
    title:narrative.title,
    heartline:`Esta tiragem acompanha ${narrative.protagonist} numa história sobre ${narrative.domain}.`,
    lead,
    story,
    voices,
    closing:narrative.closing,
    signature:signature(safeSeed, 'spread-story'),
    loveSignature:signature(safeSeed, 'care'),
    theme:themeId,
    protagonist:narrative.protagonist,
    cohesion:Object.freeze({ beginning:true, tension:true, choice:true, consequence:true, ending:true })
  });
}

function spiritualBridge(mode, protagonist) {
  if (mode === 'jesus') return `${protagonist} escolheu olhar a situação pela compaixão inspirada em Jesus Cristo, sem transformar fé em ordem nem abandonar os fatos.`;
  if (mode === 'cacurucaia') return `${protagonist} recordou a força simbólica de Cacurucaia e protegeu dignidade e limite sem entregar a decisão a uma voz externa.`;
  if (mode === 'duas-vozes') return `${protagonist} reuniu compaixão e dignidade como inspirações simbólicas, mantendo cada tradição em seu lugar e a decisão nas próprias mãos.`;
  return '';
}

function actionEnding(base) {
  const action = base.actions?.[0];
  if (!action) return '';
  if (base.matterQuery) return `Uma história verdadeira sobre “${base.matterQuery}” precisa de fatos, datas e fontes verificáveis. Por isso, os caminhos abaixo levam à pesquisa pública e só serão abertos se você escolher tocar neles.`;
  if (action.kind === 'route') return `Como continuação concreta, o caminho abaixo leva a ${action.label}. Ele é uma possibilidade dentro do site, não uma decisão tomada por você.`;
  if (action.kind === 'card') return `A história encontrou uma imagem concreta em ${action.label}. Você pode abrir essa carta abaixo e observar antes de concluir qualquer coisa.`;
  if (action.kind === 'guide') return `Para transformar a reflexão em conhecimento, o conteúdo “${action.label}” ficou disponível abaixo como próximo capítulo possível.`;
  return '';
}

export function storyResponse(input, {
  seed = secureLoveSeed(),
  preferredName = '',
  ...matterOptions
} = {}) {
  const raw = clean(input, 700);
  const base = matterResponse(raw, { ...matterOptions, preferredName, seed:`${seed}:materia` });
  const safeSeed = `${seed}:${normalizeEmotionalText(raw)}:${base.intent || 'support'}`;

  if (base.safety) return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    storyTitle:'Segurança antes da história',
    storySignature:signature(safeSeed, 'safety'),
    storyCohesion:true
  });

  if (base.matterQuery) {
    const text = `A pergunta chegou com um nome concreto: “${base.matterQuery}”. Contar uma história como se ela fosse verdadeira, sem consultar fontes atuais, transformaria imaginação em desinformação.\n\nPor isso, Whit não vai preencher lacunas com frases bonitas nem fingir que conhece toda a internet. Os caminhos abaixo levam a fontes públicas, mostram a informação fora do site e só abrem quando você toca.\n\nA verdade desta resposta está no limite: fatos pertencem às fontes verificáveis; a ficção permanece reservada ao universo do Tarot.`;
    return Object.freeze({
      ...base,
      engine:`${base.engine}+${STORY_ENGINE_NAME}`,
      version:STORY_ENGINE_VERSION,
      storyEngine:STORY_ENGINE_NAME,
      storyTitle:'Uma pergunta que exige fontes',
      storySignature:signature(safeSeed, 'research'),
      storyCohesion:true,
      spiritVoices:Object.freeze([]),
      spiritSynthesis:'',
      spiritBlessing:'',
      execution:null,
      actions:Object.freeze(base.actions.filter(action => action.kind === 'research')),
      text
    });
  }

  const themeId = themeFor(raw, base.emotion || base.profile?.primary || '', safeSeed);
  const narrative = buildNarrative(themeId, safeSeed, preferredName);
  const bridge = spiritualBridge(base.spiritMode, narrative.protagonist);
  const ending = actionEnding(base);
  const paragraphs = [
    `${narrative.situation} ${narrative.tension}`,
    `${narrative.choice}${bridge ? ` ${bridge}` : ''} ${narrative.result}`,
    `${narrative.truth} ${narrative.closing}${ending ? `\n\n${ending}` : ''}`
  ];
  return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    storyTitle:narrative.title,
    storySignature:signature(safeSeed, 'conversation-story'),
    storyTheme:themeId,
    storyCohesion:true,
    spiritVoices:Object.freeze([]),
    spiritSynthesis:'',
    spiritBlessing:'',
    text:paragraphs.join('\n\n')
  });
}

export function storyCapacity() {
  const perTheme = PEOPLE.length * PLACES.length * DURATIONS.length * 3 * 3 * 3 * 3 * 3 * 3;
  const cardConversations = 78 * 78;
  const structuralCombinations = perTheme * THEME_IDS.length * cardConversations;
  return Object.freeze({
    themes:THEME_IDS.length,
    structuralCombinations,
    seedSpace:2 ** 32,
    combinations:structuralCombinations * (2 ** 32),
    exceedsOneBillion:structuralCombinations > 1_000_000_000
  });
}
