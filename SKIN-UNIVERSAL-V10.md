# Divina Bruxa — Macroetapa 5: skins universais

## Promessa visual

Ao escolher uma skin, a pessoa deve sentir que entrou em uma nova realidade. A troca altera todas as superfícies de orbe e a linguagem de luz, sem recarregar a página e sem apagar o estado da leitura.

## Superfícies obrigatórias

1. Orbe principal da Home.
2. Orbe interna do menu.
3. Mini-orbe do cabeçalho.
4. Orbe do dock e atalhos.
5. Orbe da mesa de Tarot.
6. Orbes contextuais de carregamento e confirmação.
7. Orbe da experiência IA, quando habilitada.

## Contrato por skin

Cada skin precisa fornecer uma miniatura, uma imagem de superfície, cores de destaque, brilho, fundo, partículas e fallback. O acervo PNG atual permanece como fonte até que a versão derivada seja aprovada visualmente.

## Regras de experiência

- Troca em até 300 ms após a seleção.
- Nenhum flash branco ou imagem quebrada.
- Nenhuma recriação do runtime.
- Persistência local imediata e sincronização futura por conta.
- Fallback automático para a Orbe Clássica Divina.
- Movimento reduzido mantém a mudança de cor e imagem, sem partículas.

## Critério de saída

As 30 skins passam por 42 asserções visuais cada: sete superfícies, seis estados (normal, foco, toque, carregamento, erro e movimento reduzido). Total: 1.260 verificações.
