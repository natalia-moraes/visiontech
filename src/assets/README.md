# Pasta de assets

Imagens do projeto (logos, ilustrações e fotos de produto).

## Catálogo (cards de produto)

Os cards usam o campo `image` definido em `src/data/glasses.js`. Hoje cada
modelo cai para o SVG gerado quando não há um PNG correspondente. Para usar
fotos reais nos cards, coloque os arquivos em `src/assets/glasses/` e referencie
o nome no objeto do modelo (campo `overlayPng`) — o carregamento é resiliente
(`import.meta.glob`), então um arquivo ausente não quebra o build.

## Provador virtual (overlay no rosto)

A arte sobreposta ao rosto é **gerada vetorialmente** em
`src/utils/glassesSvg.js` (frontal, transparente e ancorada para o MediaPipe).
Não há arquivos de imagem envolvidos nessa etapa.
