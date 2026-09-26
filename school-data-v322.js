export const SCHOOL_MODULES = Object.freeze([
  {
    id:'fundamentos', number:1, title:'Fundamentos do Tarot', symbol:'✦',
    intro:'Aprenda a observar imagem, posição, contexto e pergunta antes de procurar uma resposta pronta.',
    focus:['O Tarot como linguagem simbólica', 'Perguntas abertas e responsáveis', 'Registro da primeira impressão'],
    lesson:['Uma leitura começa antes de qualquer significado: observe a cena, a direção dos corpos, as cores e o ponto para onde seu olhar foi primeiro. Essa impressão inicial é matéria legítima da leitura.', 'Depois, aproxime a imagem da pergunta. A carta não é uma sentença isolada; ela ocupa uma posição e conversa com uma pessoa real, em um momento real.'],
    practice:'Escolha uma carta sem procurar o nome. Escreva três verbos que a imagem desperta e transforme-os em uma única frase.'
  },
  {
    id:'maiores', number:2, title:'Os 22 Arcanos Maiores', symbol:'☉', cardFilter:'major',
    intro:'Os Maiores mostram forças arquetípicas, mudanças de ciclo e experiências que reorganizam a jornada.',
    focus:['Sequência do Louco ao Mundo', 'Arquétipo e sombra', 'Elemento e correspondência'],
    lesson:['Os Maiores marcam experiências que reorganizam a jornada: início, escolha, ruptura, cura, integração. Estude a sequência como uma travessia, não como vinte e duas caixas separadas.', 'Toda força arquetípica possui luz, excesso e ausência. Pergunte como aquela potência está se manifestando, em vez de decidir antecipadamente se a carta é boa ou ruim.'],
    practice:'Ordene três Arcanos Maiores ao acaso e conte a transformação que acontece entre o primeiro e o último.'
  },
  {
    id:'paus', number:3, title:'Paus · Fogo', symbol:'△', cardFilter:'paus',
    intro:'Paus fala de energia, coragem, criação, desejo e do modo como uma vontade ganha movimento.',
    focus:['Impulso e direção', 'Criatividade e conflito', 'Ação possível'],
    lesson:['Paus mostra onde a vida deseja movimento. O fogo pode inspirar, iluminar e iniciar; quando perde direção, também pode consumir energia sem construir passagem.', 'Observe se a chama da carta está nascendo, disputando espaço, amadurecendo ou pedindo descanso. A pergunta central é: para onde esta energia quer ir?'],
    practice:'Escolha uma carta de Paus e escreva uma ação possível que caiba nas próximas vinte e quatro horas.'
  },
  {
    id:'copas', number:4, title:'Copas · Água', symbol:'▽', cardFilter:'copas',
    intro:'Copas observa emoções, vínculos, imaginação e aquilo que precisa ser sentido sem virar sentença.',
    focus:['Vínculo e reciprocidade', 'Intuição e projeção', 'Cuidado emocional'],
    lesson:['Copas aproxima a leitura do sentir, dos vínculos e da imaginação. Emoção não é prova de um fato externo, mas é uma verdade interna que merece escuta e cuidado.', 'Leia o movimento da água: ela chega, transborda, estagna, parte ou encontra outro rio? Essa dinâmica revela mais do que um rótulo emocional pronto.'],
    practice:'Diante de uma carta de Copas, complete: “Eu sinto…, eu preciso…, eu posso cuidar disso por meio de…”.'
  },
  {
    id:'espadas', number:5, title:'Espadas · Ar', symbol:'◇', cardFilter:'espadas',
    intro:'Espadas torna visíveis pensamento, verdade, conflito, limite e as escolhas que exigem clareza.',
    focus:['Narrativa mental', 'Decisão e consequência', 'Verdade sem crueldade'],
    lesson:['Espadas mostra como pensamento, palavra e conflito moldam a experiência. A mente pode abrir caminhos ou construir prisões com o mesmo poder de linguagem.', 'Separe o que é observável da história contada sobre o que aconteceu. Essa distinção transforma ansiedade em discernimento e verdade em escolha responsável.'],
    practice:'Escreva duas colunas: “o que sei” e “o que estou supondo”. Deixe a carta indicar qual coluna precisa de atenção.'
  },
  {
    id:'ouros', number:6, title:'Ouros · Terra', symbol:'□', cardFilter:'ouros',
    intro:'Ouros ancora a leitura no corpo, no trabalho, nos recursos e no tempo necessário para construir.',
    focus:['Realidade material', 'Ritmo e consistência', 'Valor e sustentabilidade'],
    lesson:['Ouros devolve a leitura ao corpo, ao tempo, ao trabalho e aos recursos. Uma intenção só ganha raiz quando encontra um gesto repetível no mundo concreto.', 'Observe o que está sendo cultivado, protegido, trocado ou acumulado. Prosperidade saudável precisa sustentar a vida, não apenas produzir aparência de segurança.'],
    practice:'Escolha uma carta de Ouros e transforme sua mensagem em um cuidado concreto com tempo, corpo, casa ou recurso.'
  },
  {
    id:'corte', number:7, title:'As Cartas da Corte', symbol:'♕', cardFilter:'court',
    intro:'Pajem, Cavaleiro, Rainha e Rei podem representar postura, estágio de aprendizagem ou dinâmica relacional.',
    focus:['Função antes de gênero', 'Pessoa, energia ou convite', 'Maturação de cada naipe'],
    lesson:['As figuras da Corte podem representar alguém, uma postura disponível ou uma fase de desenvolvimento. Leia primeiro a função que exercem, sem aprisioná-las em gênero ou idade.', 'Pajens descobrem, Cavaleiros movimentam, Rainhas aprofundam e Reis responsabilizam. O naipe mostra em qual território essa função está atuando.'],
    practice:'Retire uma figura da Corte e pergunte: “Que postura esta presença me convida a experimentar agora?”.'
  },
  {
    id:'numeros', number:8, title:'Números e Padrões', symbol:'#',
    intro:'Do Ás ao Dez, os números criam ritmos que atravessam os quatro naipes e ajudam a reconhecer padrões.',
    focus:['Potencial, desenvolvimento e conclusão', 'Repetições numéricas', 'Contrastes entre elementos'],
    lesson:['Os números criam uma pulsação comum entre os naipes. Ases iniciam; números intermediários desenvolvem tensões e recursos; Dezes mostram o resultado acumulado de um ciclo.', 'Uma repetição numérica em tiragem destaca uma fase do processo. Compare como o mesmo número respira de forma diferente no Fogo, na Água, no Ar e na Terra.'],
    practice:'Separe as quatro cartas de um mesmo número e escreva a única pergunta que todas parecem responder de modos diferentes.'
  },
  {
    id:'elementos', number:9, title:'Naipes e Elementos', symbol:'✣',
    intro:'Fogo, Água, Ar e Terra revelam onde há excesso, ausência, apoio ou tensão dentro de uma tiragem.',
    focus:['Dignidades elementais', 'Equilíbrio da leitura', 'Elemento dominante e ausente'],
    lesson:['Elementos descrevem modos de acontecer: Fogo move, Água sente, Ar compreende e Terra materializa. Nenhum é melhor; cada um resolve uma parte diferente da experiência.', 'Em uma tiragem, excesso e ausência são pistas. Muito Fogo pode pedir direção; pouca Terra pode pedir chão. A leitura nasce da relação, não da contagem isolada.'],
    practice:'Observe três cartas e identifique qual elemento conduz, qual apoia e qual qualidade está ausente.'
  },
  {
    id:'posicoes', number:10, title:'A Força das Posições', symbol:'⌖',
    intro:'A mesma carta muda de função conforme a posição. Leia primeiro o papel da casa, depois a imagem.',
    focus:['Pergunta da posição', 'Carta como resposta contextual', 'Evitar significado automático'],
    lesson:['A posição é a pergunta específica feita à carta. Antes de interpretar a imagem, leia em voz alta a função daquela casa: origem, desafio, recurso, conselho ou direção.', 'A mesma carta pode proteger em uma posição e limitar em outra. Contexto não altera a imagem; altera o trabalho que ela realiza dentro da leitura.'],
    practice:'Coloque a mesma carta em “recurso” e depois em “desafio”. Escreva como sua voz muda sem contradizer sua essência.'
  },
  {
    id:'combinacoes', number:11, title:'Combinações de Cartas', symbol:'∞',
    intro:'Cartas conversam por direção, repetição, contraste, progressão numérica e continuidade de imagem.',
    focus:['Duplas e tríades', 'Cartas que reforçam ou tensionam', 'Criar uma frase visual'],
    lesson:['Uma combinação não é a soma de dois verbetes. Observe quem olha para quem, qual carta parece iniciar o movimento e qual responde, interrompe ou transforma a primeira.', 'Comece com duplas e use verbos de ligação: abre, protege, confronta, acelera, cura. Depois inclua a terceira carta como consequência ou ponto de escolha.'],
    practice:'Retire três cartas e forme uma frase: “A primeira abre…, a segunda responde…, a terceira transforma…”.'
  },
  {
    id:'sintese', number:12, title:'Síntese da Leitura', symbol:'◎',
    intro:'Sintetizar é escolher o fio central sem apagar nuances nem transformar tendência em destino inevitável.',
    focus:['Tema dominante', 'Movimento e ponto de escolha', 'Próximo passo concreto'],
    lesson:['Síntese é o fio capaz de atravessar todas as cartas sem apagar suas diferenças. Procure o movimento que se repete e o ponto onde a pessoa ainda possui escolha.', 'Uma boa síntese cabe em poucas frases: o que está acontecendo, o que pede consciência e qual gesto pode ser experimentado. Profundidade não exige excesso de palavras.'],
    practice:'Resuma uma tiragem em três linhas: “o movimento”, “o ponto de escolha” e “o gesto possível”.'
  },
  {
    id:'tiragens-praticas', number:13, title:'Tiragens Práticas', symbol:'⋯',
    intro:'Comece pequeno. Uma boa tiragem possui pergunta clara, posições necessárias e fechamento compreensível.',
    focus:['Uma carta e três tempos', 'Dois Caminhos', 'Revisão posterior no Diário'],
    lesson:['A melhor tiragem é a menor estrutura capaz de acolher a pergunta. Posições demais podem diluir o essencial; posições claras criam uma conversa que pode ser acompanhada.', 'Registre a pergunta antes de revelar e revise depois. O retorno mostra quais leituras foram úteis, onde houve projeção e como seu método está amadurecendo.'],
    practice:'Crie uma tiragem de três posições para uma pergunta real e dê a cada posição uma função diferente e necessária.'
  },
  {
    id:'cruz-celta', number:14, title:'Cruz Celta', symbol:'✚',
    intro:'Dez posições organizam situação, tensão, consciência, base, tempo, postura, ambiente e síntese.',
    focus:['Ordem tradicional', 'Eixo temporal', 'Coluna de integração'],
    lesson:['A Cruz Celta organiza dez vozes. O centro mostra situação e tensão; as bases revelam consciência, raiz e tempo; a coluna lateral integra postura, ambiente, desejo e direção.', 'Leia primeiro os eixos antes de mergulhar em cada detalhe. Uma carta final não apaga as nove anteriores: ela responde ao caminho que todas construíram.'],
    practice:'Monte apenas o centro e a coluna lateral. Conte como a postura da pessoa modifica a direção final.'
  },
  {
    id:'mesa-real', number:15, title:'Mesa Real', symbol:'▦',
    intro:'As 78 cartas formam um campo amplo. Leia por vizinhança, linhas, repetições e zonas antes de concluir.',
    focus:['Treze colunas por seis linhas', 'Cartas próximas e distantes', 'Mapa antes do detalhe'],
    lesson:['A Mesa Real é um campo completo. Comece vendo a paisagem: concentrações de naipe, Maiores, figuras, sequências e vazios. Só depois aproxime o olhar de uma região.', 'Linhas podem mostrar movimentos contínuos; colunas revelam ecos; vizinhanças criam frases. A amplitude pede ritmo para que detalhe e conjunto permaneçam conectados.'],
    practice:'Em uma mesa aberta, escolha uma carta-âncora e leia apenas suas quatro vizinhas antes de ampliar o campo.'
  },
  {
    id:'etica', number:16, title:'Ética e Responsabilidade', symbol:'⚖',
    intro:'Tarot não substitui cuidado médico, jurídico ou financeiro e não deve afirmar pensamentos secretos como fato.',
    focus:['Autonomia de quem consulta', 'Consentimento e privacidade', 'Limites e encaminhamento responsável'],
    lesson:['Uma leitura responsável amplia escolhas em vez de produzir dependência. Evite afirmar pensamentos secretos, diagnósticos, crimes, gravidez, morte ou certezas sobre terceiros.', 'Privacidade, consentimento e limite fazem parte da técnica. Quando a questão exige cuidado médico, jurídico, financeiro ou psicológico, a leitura deve reconhecer seu alcance.'],
    practice:'Reescreva uma afirmação absoluta como hipótese simbólica que devolva autonomia e permita verificação na realidade.'
  },
  {
    id:'avancada', number:17, title:'Prática Avançada', symbol:'✺',
    intro:'Integre técnica, presença e revisão crítica. Uma leitura madura sabe reconhecer incerteza e aprender com o retorno.',
    focus:['Hipótese em vez de sentença', 'Comparação entre leituras', 'Construção de método próprio'],
    lesson:['Prática avançada combina repertório com capacidade de revisar a própria leitura. Registre hipóteses, reconheça incertezas e compare a interpretação com o retorno recebido.', 'Seu método nasce de escolhas consistentes: como formular perguntas, observar combinações, sintetizar e encerrar. Técnica madura não elimina mistério; oferece a ele um recipiente confiável.'],
    practice:'Revise uma leitura antiga e marque: o que foi imagem, o que foi inferência e o que o tempo realmente confirmou.'
  }
]);
