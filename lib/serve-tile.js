'use strict'

module.exports = init();

async function init() {

	const { resolve } = require('path');
	const MBTiles = require('@mapbox/mbtiles');
	const config = require('../config.js');
	const SmartCache = require('./smart-cache.js');
	const { respondCachedValue } = SmartCache();
	
	const db = await loadDatabase();
	
	return {
		handleTileRequest,
		handleTileMetaRequest,
	}
	
	async function handleTileRequest(request, response) {
		const { path } = request;
		const key = path.join('/');
		await respondCachedValue(key, async () => {
			const z = parseInt(path[0], 10);
			const x = parseInt(path[1], 10);
			const y = parseInt(path[2].replace(/\..*/,''), 10);
			try {
				let gzip = (await db.get(z, x, y)).buffer;
				if (!gzip) return false;
				return { gzip, mime:'application/x-protobuf' }
			} catch (e) {
				return false;
			}
		}, request, response);
	}
	
	async function handleTileMetaRequest(request, response) {
		const key = 'tiles.json';
		await respondCachedValue(key, async () => {
			let data = await db.getInfo();
			data.tiles = [config.baseUrl+'/tiles/{z}/{x}/{y}.pbf'];
			data = JSON.stringify(data)
			return { raw:data, mime:'application/json' }
		}, request, response)
	}
	
	function loadDatabase() {
		return new Promise(resolveLoad => {
			let filename = resolve(__dirname, '../database', config.dbName + '.mbtiles');
			new MBTiles(filename, (err, mbtiles) => {
				if (err) throw err;

				resolveLoad({ get, getInfo });
	
				function get(z, x, y) {
					return new Promise(resolveGet => 
						mbtiles.getTile(z, x, y, (err, buffer, headers) => resolveGet({buffer, headers}))
					)
				}
				function getInfo() {
					return new Promise(resolveGet => 
						mbtiles.getInfo((err, info) => resolveGet(info))
					)
				}
			})
		})
	}
}
