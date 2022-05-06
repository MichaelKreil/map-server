'use strict'

module.exports = init();

async function init() {
	const config = require('../config.js');
	
	return { handleStatusRequest }

	function handleStatusRequest(path, res) {
		res.writeHead(200, {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
		}).end(JSON.stringify({
			version: config.version,
			dbName: config.dbName,
			port: config.port,
			baseUrl: config.baseUrl,
			useCaching: config.useCaching,
		}, null, '\t'))
	}
}
