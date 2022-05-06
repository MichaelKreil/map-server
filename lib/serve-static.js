'use strict'

module.exports = init();

async function init() {

	const fs = require('fs');
	const config = require('../config.js');
	const { readFiles } = require('./helper.js');

	const files = readFiles('../static');
	for (let [slug, filename] of files) {
		if (config.useCaching) {
			let buffer = fs.readFileSync(filename);
			files.set(slug, () => buffer);
		} else {
			files.set(slug, () => fs.readFileSync(filename));
		}
	}

	return { handleFileRequest }

	function handleFileRequest(path, res) {
		path = decodeURI(path.join('/'));

		if (!files.has(path)) {
			res.writeHead(404);
			res.end('file not found: ' + JSON.stringify(path));
			return
		}

		res.writeHead(200, config.corsHeader).end(files.get(path)())
	}
}
