'use strict'

const http = require('http');
const config = require('../config.js');

start()

async function start() {
	const sourceLookup = new Map();
	for (let source of require('../lib/tilesources.js')) {
		await source.open();
		sourceLookup.set(source.name, source.handleRequest);
	}

	let server = http.createServer(handleRequest);
	server.listen(config.port, () => console.log('Listening at: ' + config.port));

	function handleRequest(request, response) {
		let path = request.url.split('/');
		let handleRequest = sourceLookup.get(path[1]);
		if (!handleRequest) {
			response.writeHead(404);
			response.end('unknown request ' + request.url)
			return
		}
		handleRequest(path.slice(2), response);
	}
}
