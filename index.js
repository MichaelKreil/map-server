'use strict'

const fs = require('fs');
const http = require('http');
const https = require('https');
const { resolve, relative } = require('path');
const MBTiles = require('@mapbox/mbtiles');

const config = require('./config.js');

start()

async function start() {
	const files = readFiles('docs');
	const db = await loadDatabase();

	http.createServer(handleRequest).listen(config.port, () => console.log('Listening at :'+config.port));

	async function handleRequest(req, res) {
		let url = req.url.split('/');
		switch (url[1]) {
			case 'static':
				let path = url.slice(2).join('/');
				if (!path) path = '';
				path = decodeURI(path);
				if (!files.has(path)) return handleError();
				let buffer = fs.readFileSync(files.get(path));
				if (path.endsWith('style.json')) buffer = fixStyleDefinition(buffer);
				res.writeHead(200).end(buffer)
			return;
			case 'tiles.json':
				let data = await db.getInfo();
				data.tiles = [config.baseUrl+'/tiles/{z}/{x}/{y}.pbf']
				res.writeHead(200)
				res.end(JSON.stringify(data, null, '\t'))
			return;
			case 'tiles':
				const z = parseInt(url[2], 10);
				const x = parseInt(url[3], 10);
				const y = parseInt(url[4].replace(/\..*/,''), 10);

				try {
					const { buffer, headers } = await db.get(z, x, y)
					res.writeHead(200, headers)
					res.end(buffer)
				} catch (error) {
					handleError(error)
				}
			return;
		}
		handleError();

		function handleError() {
			res.writeHead(404)
			res.end('not found')
		}
	}
}

function loadDatabase() {
	return new Promise(resLoad => {
		let filename = resolve(__dirname, 'db', config.dbName + '.mbtiles');
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

function readFiles(folder) {
	let files = new Map();
	scan(resolve(__dirname, folder));
	return files;

	function scan(fol) {
		fs.readdirSync(fol).forEach(entry => {
			entry = resolve(fol, entry);
			if (fs.statSync(entry).isDirectory()) return scan(entry)
			let slug = relative(folder, entry);
			if (slug.startsWith('index.htm')) slug = '';
			files.set(slug, entry);
		})
	}
}

function fixStyleDefinition(buffer) {
	let data = JSON.parse(buffer);
	for (let source of Object.values(data.sources)) source.url = fixUrl(source.url);
	data.sprite = fixUrl(data.sprite);
	data.glyphs = fixUrl(data.glyphs);
	return Buffer.from(JSON.stringify(data));

	function fixUrl(url) {
		url = (new URL(url, config.baseUrl)).toString();
		url = decodeURI(url);
		return url;
	}
}
