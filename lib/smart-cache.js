'use strict'

const os = require('os');
const zlib = require('zlib');
const gunzip = require('util').promisify(zlib.gunzip);

module.exports = SmartCache;

function SmartCache(opt = {}) {
	opt.avgSize ??= 1e4;
	opt.maxSize ??= opt.avgSize * 10;

	let map = new Map();
	let todoList = [];
	let processing = false;

	setInterval(triggerCleanup, 15*60*1000);
	setInterval(triggerRecompression, 10*1000);

	return cache;

	async function cache(key, cbValue) {
		let entry = map.get(key);
		if (entry) {
			entry.countRead++;
			return entry.value;
		}

		entry = {
			value: await cbValue(),
			countRead: 1,
			recompressed: false,
		}
		map.set(key, entry);
		if (map.size < opt.avgSize) todoList.push(entry);
		if (map.size > opt.maxSize) process.nextTick(triggerCleanup);
		return entry.value;
	}

	function triggerCleanup() {
		if (map.size < opt.avgSize) return;

		let list = Array.from(map.entries());
		list.sort((a, b) => b[1].countRead - a[1].countRead);

		list = list.slice(0, opt.avgSize);
		list.forEach(e => e[1].countRead /= 2);
		todoList = list.filter(e => !e.recompressed)
		
		map = new Map(list);
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
