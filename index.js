'use strict'

const fs = require('fs');
const https = require('https');

const config = require('./config.js');


start()

async function start() {
	const { handleTileRequest, handleTileMetaRequest } = await require('./lib/serve-tile.js');
	const { handleFileRequest } = await require('./lib/serve-static.js');
	const { handleStyleRequest } = await require('./lib/serve-style.js');
	const { handleStatusRequest } = await require('./lib/serve-status.js');

	https
		.createServer({
			key: fs.readFileSync('cert/privkey.pem'),
			cert: fs.readFileSync('cert/fullchain.pem'),
		}, handleRequest)
		.listen(config.port, () => console.log('Listening at: '+config.port));

	async function handleRequest(req, res) {
		let path = req.url.replace(/^\/*/,'').split('/');
		let main = path[0];
		path = path.slice(1);
		switch (main) {
			case 'tiles': return handleTileRequest(path, res);
			case 'static': return handleFileRequest(path, res);
			case 'styles': return handleStyleRequest(path, res);
			case 'tiles.json': return handleTileMetaRequest(path, res);
			case 'status': return handleStatusRequest(path, res);
			case '': return res.end('willkommen')
		}
		res.writeHead(404);
		res.end('unknown request '+req.url)
	}
}
