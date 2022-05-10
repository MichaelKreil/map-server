'use strict'

const http = require('http');
const config = require('./config.js');

start()

async function start() {
	const { handleTileRequest, handleTileMetaRequest } = await require('./lib/serve-tile.js');
	const { handleFileRequest } = await require('./lib/serve-static.js');
	const { handleStyleRequest } = await require('./lib/serve-style.js');
	const { handleStatusRequest } = await require('./lib/serve-status.js');

	let server = http.createServer(handleRequest);
	server.listen(config.port, () => console.log('Listening at: '+config.port));

	async function handleRequest(req, res) {
		req.path = req.url.replace(/^\/*/,'').split('/');
		let main = req.path.shift();
		switch (main) {
			case 'tiles': return handleTileRequest(req, res);
			case 'static': return handleFileRequest(req, res);
			case 'styles': return handleStyleRequest(req, res);
			case 'tiles.json': return handleTileMetaRequest(req, res);
			case 'status': return handleStatusRequest(req, res);
			case '': return res.writeHead(200, { 'Content-Type':'text/plain' }).end('running')
		}
		res.writeHead(404);
		res.end('unknown request '+req.url)
	}
}
