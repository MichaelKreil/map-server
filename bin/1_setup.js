'use strict'

const tileSources = require('../lib/tilesources.js');

start();

async function start() {
	console.log(`setup sources`);
	for (let source of tileSources) {
		console.log(`  check source "${source.name}"`);

		if (await source.isOkay()) {
			console.log(`    source is ok ✅`);
			continue
		}

		console.log(`    download "${source.name}"`);

		if (!await source.isSpaceAvailable()) {
			console.log(`    not enough space ❗️`);
			continue;
		}
		
		await source.download(v => {
			v = Math.round(v * 100);
			process.stdout.write(`\r      ${'■'.repeat(v)}${'□'.repeat(100 - v) }  `)
		});

		console.log(`\n    finished ✅`);
	}
}
