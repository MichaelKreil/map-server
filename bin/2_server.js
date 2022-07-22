'use strict'

const http = require('http');
const config = require('../config.js');

start()

async function start() {
	const sourceLookup = new Map();
	for (let source of require('../lib/tilesources.js')) {
		await source.open();
		sourceLookup.set(source.name, source.serve);
	}

	let server = http.createServer(handleRequest);
	server.listen(config.port, () => console.log('Listening at: ' + config.port));

	function handleRequest(request, response) {
		let path = request.url.split('/');
		let serve = sourceLookup.get(path[1]);
		if (!serve) {
			response.writeHead(404);
			response.end('unknown request ' + request.url)
			return
		}
		serve(path.slice(2), response);
		/*
		let name = req.path.shift();
		switch (main) {
			case 'tiles': return handleTileRequest(req, res);
			case 'static': return handleFileRequest(req, res);
			case 'styles': return handleStyleRequest(req, res);
			case 'tiles.json': return handleTileMetaRequest(req, res);
			case 'status': return handleStatusRequest(req, res);
			case '': return res.writeHead(200, { 'Content-Type': 'text/plain' }).end('running')
		}
		res.writeHead(404);
		res.end('unknown request ' + req.url)
		*/
	}
}
