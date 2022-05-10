'use strict'

module.exports = init();

async function init() {
	
	const fs = require('fs');
	const config = require('../config.js');
	const { guessMime, readFiles } = require('./helper.js');
	const SmartCache = require('./smart-cache.js');
	const { respondCachedValue } = SmartCache({useCaching:config.useCaching});

	const filenames = readFiles('../styles');

	return { handleStyleRequest }

	async function handleStyleRequest(request, response) {
		let { path } = request;
		path = decodeURI(path.join('/'));

		if (!filenames.has(path)) {
			response.writeHead(404);
			response.end('file not found: ' + JSON.stringify(path));
			return
		}

		return await respondCachedValue(path, async () => {
			let filename = filenames.get(path);
			let buffer = fs.readFileSync(filename);
			if (filename.endsWith('/style.json')) buffer = fixStyleDefinition(buffer);
			return { raw:buffer, mime:guessMime(filename) }
		}, request, response)
	}

	function fixStyleDefinition(buffer) {
		let data = JSON.parse(buffer);
		for (let source of Object.values(data.sources)) source.url = fixUrl(source.url);
		data.sprite = fixUrl(data.sprite);
		data.glyphs = fixUrl(data.glyphs);
		return Buffer.from(JSON.stringify(data));

		function fixUrl(url) {
			url = (new URL(url, config.baseUrl)).toString();
			url = decodeURI(url);
			return url;
		}
	}
}
