# node-svg-rebrander
Node based application to single or bulk recolour SVGs (multi colour support)

run `npm i` to install

Set brandOptions inside index.js to specify what colours you want to target, and what colour to replace the target with.

By default app will look in `./input/` for svgs and output to `./output/`.

Run `node index.js --collection` to run the app and rebrand/recolour svgs.

Run `node index.js --symbolise` to run the app and output the found icons as an svg instance to be used in a nunjucks file. ie:

`<symbol id="icon-house">{% include "../brand/coop/images/icon-house.svg" %}</symbol>`
