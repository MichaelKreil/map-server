'use strict'

const fs = require('fs');
const http = require('http');
const https = require('https');
const { resolve } = require('path');
const MBTiles = require('@mapbox/mbtiles');

const dbName = 'germany';
const port = 8080;

start()

async function start() {
	const db = await loadDatabase()

	http.createServer(handleRequest).listen(port, () => console.log('Listening at :'+port));

	async function handleRequest(req, res) {
		let parts = req.url.replace(/.*\//g,'').split('.');
		const z = parseInt(parts[0], 10);
		const x = parseInt(parts[1], 10);
		const y = parseInt(parts[2], 10);

		try {
			const { buffer, headers } = await db.get(z, x, y)
			res.writeHead(200, headers)
			res.end(buffer)
		} catch (error) {
			res.writeHead(404)
			res.end('tile not found^')
		}
	}
}

function loadDatabase() {
	return new Promise(resLoad => {
		let filename = resolve(__dirname, 'db', dbName + '.mbtiles');
		new MBTiles(filename, (err, mbtiles) => {
			if (err) throw err;

			mbtiles

			let db = { get }
			resLoad(db);

			function get(z, x, y) {
				return new Promise(resGet => 
					mbtiles.getTile(z, x, y, (err, buffer, headers) => 
						resGet({buffer, headers})
					)
				)
			}
		})
	})
}
