'use strict'

const { } = require('../lib/helper.js');
const tileSources = require('../lib/tilesources.js');

start();

async function start() {
	console.log(`setup sources`.white0);
	for (let source of tileSources) {
		console.log(`check source "${source.name}"`.white1);

		if (await source.isOkay()) {
			console.log(`source is ok ✓`.green2);
			continue
		}

		console.log(`download "${source.name}"`.white2);

		if (!await source.isSpaceAvailable()) {
			console.log(`not enough space !`.red2);
			continue;
		}
		
		await source.download(v => {
			v = Math.round(v * 100);
			process.stdout.write(`\r${'■'.repeat(v)}${'□'.repeat(100 - v)}   `.white2)
		});

		console.log(`\n    finished ✓`.green2);
	}
}
