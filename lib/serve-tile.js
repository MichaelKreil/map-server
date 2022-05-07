'use strict'

module.exports = init();

async function init() {

	const { resolve } = require('path');
	const MBTiles = require('@mapbox/mbtiles');
	const config = require('../config.js');
	const fileCache = require('./smart-cache.js')();
	const { respondWithEncoding } = require('./encodings.js');
	
	const db = await loadDatabase();
	const headerPBF = Object.assign({ 'Content-Type': 'application/x-protobuf' }, config.corsHeader);
	
	return {
		handleTileRequest,
		handleTileMetaRequest,
	}
	
	async function handleTileRequest(req, res) {
		const { path, encodings } = req;
		const key = path.join('/');
		const result = await fileCache(key, async () => {
			const z = parseInt(path[0], 10);
			const x = parseInt(path[1], 10);
			const y = parseInt(path[2].replace(/\..*/,''), 10);
			try {
				return { gzip:(await db.get(z, x, y)).buffer }
			} catch (e) {
				return false;
			}
		})

		if (!result) {
			res.writeHead(404)
			res.end(`tile ${z}/${x}/${y} not found`)
			return;
		}

		return respondWithEncoding(res, result, encodings, headerPBF);
	}
	
	async function handleTileMetaRequest(req, res) {
		const { encodings } = req;
		const key = 'tiles.json';
		const result = await fileCache(key, async () => {
			let data = await db.getInfo();
			data.tiles = [config.baseUrl+'/tiles/{z}/{x}/{y}.pbf'];
			data = JSON.stringify(data)
			return { raw:data }
		})

		return respondWithEncoding(res, result, encodings, config.corsHeader);
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
