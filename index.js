'use strict'

const fs = require('fs');
const http = require('http');
const https = require('https');

const { parseEncodings } = require('./lib/encodings.js');
const config = require('./config.js');

start()

async function start() {
	const { handleTileRequest, handleTileMetaRequest } = await require('./lib/serve-tile.js');
	const { handleFileRequest } = await require('./lib/serve-static.js');
	const { handleStyleRequest } = await require('./lib/serve-style.js');
	const { handleStatusRequest } = await require('./lib/serve-status.js');

	let server;
	if (config.useSSL) {
		server = https.createServer({
			key: fs.readFileSync('cert/privkey.pem'),
			cert: fs.readFileSync('cert/fullchain.pem'),
		}, handleRequest)
	} else {
		server = http.createServer(handleRequest);
	}
	server.listen(config.port, () => console.log('Listening at: '+config.port));

	async function handleRequest(req, res) {
		req.path = req.url.replace(/^\/*/,'').split('/');
		let main = req.path.shift();
		req.encodings = parseEncodings(req);
		switch (main) {
			case 'tiles': return handleTileRequest(req, res);
			case 'static': return handleFileRequest(req, res);
			case 'styles': return handleStyleRequest(req, res);
			case 'tiles.json': return handleTileMetaRequest(req, res);
			case 'status': return handleStatusRequest(req, res);
			case '': return res.writeHead(200).end('running')
		}
		res.writeHead(404);
		res.end('unknown request '+req.url)
	}
}
