'use strict'

module.exports = init();

async function init() {
	
	const fs = require('fs');
	const config = require('../config.js');
	const { readFiles } = require('./helper.js');

	const files = readFiles('../styles');
	for (let [slug, filename] of files) {
		if (config.useCaching) {
			let buffer = fs.readFileSync(filename);
			if (filename.endsWith('/style.json')) fixStyleDefinition(buffer);
			files.set(slug, () => buffer);
		} else {
			if (filename.endsWith('/style.json')) {
				files.set(slug, () => fixStyleDefinition(fs.readFileSync(filename)));
			} else {
				files.set(slug, () => fs.readFileSync(filename));
			}
		}
	}

	return { handleStyleRequest }

	function handleStyleRequest(path, res) {
		path = decodeURI(path.join('/'));

		if (!files.has(path)) {
			res.writeHead(404);
			res.end('file not found: ' + path);
			return
		}

		let buffer = files.get(path)();
		if (path.endsWith('/style.json')) fixStyleDefinition(buffer);
		res.writeHead(200, config.corsHeader).end(buffer)
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
