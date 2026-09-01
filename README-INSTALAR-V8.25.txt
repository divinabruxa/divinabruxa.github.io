DIVINA BRUXA — INSTALAÇÃO SEGURA V8.25

1. Baixe DIVINA-BRUXA-V8-MACROETAPAS-1-25.zip.
2. Extraia o ZIP no iPhone. Todos os arquivos ficam no mesmo nível.
3. No GitHub, abra divinabruxa/divinabruxa.github.io.
4. Envie os arquivos para a raiz sem apagar os existentes.
5. Não envie novamente as 78 cartas ou as imagens das skins.
6. Não altere CNAME.
7. No index.html, antes de </body>, acrescente:
   <script type="module" src="divina-v8-loader.js?v=8.23"></script>
8. Salve e aguarde o GitHub Pages concluir.
9. Abra o site em aba privada e teste Home, menu, Orbe, Tarot Livre e skins.
10. Não altere sw.js até a aprovação visual.

RETORNO SE ALGO FICAR ERRADO:
- Remova somente a linha do divina-v8-loader.js adicionada ao index.html.
- Os arquivos V8 podem permanecer na raiz sem serem carregados.
- Não apague cartas, imagens, CNAME ou motores existentes.
