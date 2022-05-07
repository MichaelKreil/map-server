'use strict'

module.exports = init();

async function init() {
	
	const fs = require('fs');
	const config = require('../config.js');
	const { readFiles } = require('./helper.js');
	const { respondWithEncoding } = require('./encodings.js');
	const fileCache = require('./smart-cache.js')();

	const filenames = readFiles('../styles');

/*
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
	*/

	return { handleStyleRequest }

	async function handleStyleRequest(req, res) {
		let { path, encodings } = req;
		path = decodeURI(path.join('/'));

		if (!filenames.has(path)) {
			res.writeHead(404);
			res.end('file not found: ' + JSON.stringify(path));
			return
		}

		if (config.useCaching) {
			const result = await fileCache(path, async () => {
				let buffer = fs.readFileSync(filenames.get(path));
				if (path.endsWith('/style.json')) buffer = fixStyleDefinition(buffer);
				return {raw:buffer }
			})
			respondWithEncoding(res, result, encodings, config.corsHeader)
		} else {
			let buffer = fs.readFileSync(filenames.get(path));
			if (path.endsWith('/style.json')) buffer = fixStyleDefinition(buffer);
			res.writeHead(200);
			res.end(buffer);
		}
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
