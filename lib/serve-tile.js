'use strict'

module.exports = init();

async function init() {

	const { resolve } = require('path');
	const MBTiles = require('@mapbox/mbtiles');
	const config = require('../config.js');
	
	const db = await loadDatabase();
	
	return {
		handleTileRequest,
		handleTileMetaRequest,
	}
	
	async function handleTileRequest(path, res) {
		const z = parseInt(path[0], 10);
		const x = parseInt(path[1], 10);
		const y = parseInt(path[2].replace(/\..*/,''), 10);
	
		try {
			const { buffer, headers } = await db.get(z, x, y)
			Object.assign(headers, config.corsHeader);
			res.writeHead(200, headers)
			res.end(buffer)
		} catch (error) {
			res.writeHead(404)
			res.end(`tile ${z}/${x}/${y} not found`)
		}
	}
	
	async function handleTileMetaRequest(req, res) {
		let data = await db.getInfo();
		data.tiles = [config.baseUrl+'/tiles/{z}/{x}/{y}.pbf']
		res.writeHead(200, config.corsHeader)
		res.end(JSON.stringify(data, null, '\t'))
	}
	
	function loadDatabase() {
		return new Promise(resLoad => {
			let filename = resolve(__dirname, '../database', config.dbName + '.mbtiles');
			new MBTiles(filename, (err, mbtiles) => {
				if (err) throw err;
				resLoad({ get, getInfo });
	
				function get(z, x, y) {
					return new Promise(resGet => 
						mbtiles.getTile(z, x, y, (err, buffer, headers) => resGet({buffer, headers}))
					)
				}
				function getInfo() {
					return new Promise(resGet => 
						mbtiles.getInfo((err, info) => resGet(info))
					)
				}
			})
		})
	}
}
