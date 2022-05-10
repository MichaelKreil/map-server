'use strict'

module.exports = init();

async function init() {

	const fs = require('fs');
	const config = require('../config.js');
	const { guessMime, readFiles } = require('./helper.js');
	const SmartCache = require('./smart-cache.js');
	const { respondCachedValue } = SmartCache({useCaching:config.useCaching});


	const filenames = readFiles('../static');

	return { handleFileRequest }

	async function handleFileRequest(request, response) {
		let { path } = request;
		path = decodeURI(path.join('/'));

		if (!filenames.has(path)) {
			response.writeHead(404);
			response.end('file not found: ' + JSON.stringify(path));
			return
		}

		await respondCachedValue(
			path,
			() => {
				let filename = filenames.get(path);
				return { raw:fs.readFileSync(filename), mime:guessMime(filename) }
			},
			request, response
		)
	}
}
