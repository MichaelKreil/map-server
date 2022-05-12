

## edit style

https://github.com/maputnik/editor

recommend:
```bash
docker run -it --rm -p 8888:8888 maputnik/editor
```

## generate sprites

installation is tricky on MacOS
```
brew install mapnik
npm install -g @beyondtracks/spritezero-cli
```

spritezero sprite icons/ --unique
spritezero sprite@2x icons/ --retina --unique
pngquant -f --output sprite.png sprite.png
pngquant -f --output sprite@2x.png sprite@2x.png
optipng sprite.png -o7
optipng sprite@2x.png -o7
jq -cr '.' sprite.json > tmp.json; mv tmp.json sprite.json
jq -cr '.' sprite@2x.json > tmp.json; mv tmp.json sprite@2x.json

## generate glyphs

https://github.com/sabas/genfontgl

https://github.com/openmaptiles/fonts

