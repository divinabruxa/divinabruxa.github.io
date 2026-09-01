export const CONSULTATION_POLICY=Object.freeze({
  environment:'sandbox',
  contactEmail:'orbedasrealidades@hotmail.com',
  channels:Object.freeze(['email']),
  phoneRequired:true,
  services:Object.freeze([
    Object.freeze({id:'mesa-real-profissional',name:'Mesa Real Profissional',price:500,detail:'Leitura ampla para observar ciclos, caminhos e decisões.'}),
    Object.freeze({id:'leitura-pensamentos',name:'Leitura de Pensamentos',price:500,detail:'Leitura simbólica de intenções, vínculos e padrões da relação.'}),
    Object.freeze({id:'carta-conselho',name:'Carta de Conselho',price:300,detail:'Uma carta, uma pergunta e uma orientação profunda.'}),
    Object.freeze({id:'pergunta-direta',name:'Pergunta Direta',price:150,detail:'Uma questão específica para iluminar o próximo passo.'})
  ])
});
