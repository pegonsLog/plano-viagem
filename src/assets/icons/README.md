# Ícones da Aplicação - Bear Family

## 🐻 Imagem Base
A aplicação agora usa a imagem `bear-family.png` como ícone principal, perfeita para representar um app de viagem em família!

## Gerando Ícones

Para gerar os ícones em diferentes tamanhos a partir da imagem bear-family.png:

### Opção 1: Ferramenta Online (Recomendado)
1. Acesse: https://realfavicongenerator.net/
2. Faça upload do arquivo `bear-family.png`
3. Configure as opções desejadas
4. Baixe os ícones gerados com os nomes corretos

### Opção 2: Usando ImageMagick (se instalado)
```bash
# Instalar ImageMagick primeiro
# Windows: choco install imagemagick
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Gerar ícones
magick convert bear-family.png -resize 72x72 bear-family-72x72.png
magick convert bear-family.png -resize 96x96 bear-family-96x96.png
magick convert bear-family.png -resize 128x128 bear-family-128x128.png
magick convert bear-family.png -resize 144x144 bear-family-144x144.png
magick convert bear-family.png -resize 152x152 bear-family-152x152.png
magick convert bear-family.png -resize 192x192 bear-family-192x192.png
magick convert bear-family.png -resize 384x384 bear-family-384x384.png
magick convert bear-family.png -resize 512x512 bear-family-512x512.png
```

### Opção 3: Usando Node.js (sharp)
```bash
npm install sharp-cli -g
sharp -i bear-family.png -o bear-family-72x72.png --width 72 --height 72
sharp -i bear-family.png -o bear-family-96x96.png --width 96 --height 96
# ... e assim por diante para todos os tamanhos
```

## Arquivos Necessários

- bear-family.png (original)
- bear-family-72x72.png - Android Chrome
- bear-family-96x96.png - Android Chrome
- bear-family-128x128.png - Chrome Web Store
- bear-family-144x144.png - Windows Metro
- bear-family-152x152.png - iOS Safari
- bear-family-192x192.png - Android Chrome (recomendado)
- bear-family-384x384.png - Android Chrome
- bear-family-512x512.png - Android Chrome (recomendado)

## 🚀 Próximos Passos

1. Gere os ícones usando uma das opções acima
2. Substitua os arquivos na pasta `src/assets/icons/`
3. Teste a PWA no navegador
4. Verifique se os ícones aparecem corretamente na instalação

A imagem bear-family é perfeita para o tema de viagem em família! 🐻✈️