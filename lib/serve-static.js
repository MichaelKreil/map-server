'use strict'

module.exports = init();

async function init() {

	const fs = require('fs');
	const config = require('../config.js');
	const { readFiles } = require('./helper.js');
	const { respondWithEncoding } = require('./encodings.js');
	const fileCache = require('./smart-cache.js')();

	const filenames = readFiles('../static');

	return { handleFileRequest }

	async function handleFileRequest(req, res) {
		let { path, encodings } = req;
		path = decodeURI(path.join('/'));

		if (!filenames.has(path)) {
			res.writeHead(404);
			res.end('file not found: ' + JSON.stringify(path));
			return
		}

		if (config.useCaching) {
			const result = await fileCache(path, async () => ({ raw:fs.readFileSync(filenames.get(path)) }))
			respondWithEncoding(res, result, encodings, config.corsHeader)
		} else {
			res.writeHead(200);
			res.end(fs.readFileSync(filenames.get(path)));
		}
	}
}
