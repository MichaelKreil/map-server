'use strict'

const os = require('os');
const zlib = require('zlib');
const gunzip = require('util').promisify(zlib.gunzip);

let encodingCache = new Map();

module.exports = SmartCache;

function SmartCache(opt = {}) {
	opt.avgSize ??= 1e4;
	opt.maxSize ??= opt.avgSize * 10;

	let cache = new Map();
	let todoList = [];
	let processing = false;

	setInterval(triggerCleanup, 15*60*1000);
	setInterval(triggerRecompression, 10*1000);

	return {
		respondCachedValue
	}

	async function respondCachedValue(key, cbData, request, response) {
		let data;

		if (opt.useCaching) {
			let entry = cache.get(key);
			if (entry) {
				entry.countRead++;
			} else {
				entry = {
					data: await cbData(),
					countRead: 1,
					recompressed: false,
				}

				if (!entry.data) return response.writeHead(404).end('file not found: ' + request.url);

				cache.set(key, entry);
				if (cache.size < opt.avgSize) todoList.push(entry);
				if (cache.size > opt.maxSize) process.nextTick(triggerCleanup);
			}
			data = entry.data;
		} else {
			data = await cbData();
		}

		if (!data) return response.writeHead(404).end('file not found: ' + request.url);

		const encodings = parseEncodings(request);
		const headers = {
			'Content-Type': data.mime ?? 'application/octet-stream',
			'Access-Control-Allow-Origin': '*',
		}
			
		if (encodings.br && data.br) {
			headers['Content-Encoding'] = 'br';
			return response.writeHead(200, headers).end(data.br)
		}
	
		if (encodings.gzip && data.gzip) {
			headers['Content-Encoding'] = 'gzip';
			return response.writeHead(200, headers).end(data.gzip)
		}
	
		if (!data.raw) {
			if (!data.gzip) {
				console.log('fuckup');
				console.log(data);
			}
			data.raw = await gunzip(data.gzip);
		}
	
		response.writeHead(200, headers).end(data.raw)
	}

	function triggerCleanup() {
		if (cache.size < opt.avgSize) return;

		let list = Array.from(cache.entries());
		list.sort((a, b) => b[1].countRead - a[1].countRead);

		list = list.slice(0, opt.avgSize);
		list.forEach(e => e[1].countRead /= 2);
		todoList = list.filter(e => !e.recompressed)
		
		cache = new Map(list);
	}

	async function triggerRecompression() {
		if (processing) return;
		if (todoList.length === 0) return;

		if (os.loadavg()[0] > 0.5) return;

		processing = true;
		const todo = todoList.shift();
		const value = todo.value;
		if (!value.raw) value.raw = await gunzip(value.gzip);
		value.gzip = await gzip(value.raw);
		value.br = await brotli(value.raw);
		value.recompressed = true;
		processing = false;

		process.nextTick(triggerRecompression)
	}
}

function gzip(buffer) {
	return new Promise(res => {
		zlib.gzip(buffer, {level:9}, (err, result) => res(result))
	})
}

function brotli(buffer) {
	return new Promise(res => {
		zlib.brotliCompress(buffer, {params:{
			[zlib.constants.BROTLI_PARAM_QUALITY]: 11,
			[zlib.constants.BROTLI_PARAM_SIZE_HINT]: buffer.length,
		}}, (err, result) => res(result))
	})
}

function parseEncodings(request) {
	let encodingString = request.headers['accept-encoding'];
	if (encodingCache.has(encodingString)) return encodingCache.get(encodingString);

	let encodings = {};
	(''+encodingString).toLowerCase().split(',').forEach(encoding => {
		encodings[encoding.trim()] = true;
	})
	encodingCache.set(encodingString, encodings);
	if (encodingCache.size > 1000) encodingCache = new Map();
	return encodings;
}
