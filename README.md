# node-svg-rebrander
Node based application to single or bulk recolour SVGs (multi colour support)

run `npm i` to install

Set brandOptions inside index.js to specify what colours you want to target, and what colour to replace the target with.

By default app will look in `./input/` for svgs and output to `./output/`.

Run `node index.js ` to run the app and follow the instructions.

Run `sym` at prompt to output the found icons as an svg instance to be used in a nunjucks file. ie:

`<symbol id="icon-house">{% include "../images/icon-house.svg" %}</symbol>`
