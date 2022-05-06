'use strict'

module.exports = init();

async function init() {
	const fs = require('fs');
	const { resolve } = require('path');
	const config = require('../config.js');
	const packageData = JSON.parse(fs.readFileSync(resolve(__dirname, '../package.json')));
	
	return { handleStatusRequest }

	function handleStatusRequest(path, res) {
		res.writeHead(200, {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
		}).end(JSON.stringify({
			version: packageData.version,
			dbName: config.dbName,
			port: config.port,
			baseUrl: config.baseUrl,
			useCaching: config.useCaching,
		}, null, '\t'))
	}
}
