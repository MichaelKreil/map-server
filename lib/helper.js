'use strict'

const { extname } = require('path');
const http = require('http');
const https = require('https');

module.exports = {
	guessMime,
	request,
}

function request(url, options) {
	return new Promise(async (resolve, reject) => {
		let protocol;
		if (url.startsWith('https://')) protocol = https;
		else if (url.startsWith('http://')) protocol = http;
		else throw Error('unknown protocol: '+url);

		protocol
			.request(url, options, response => resolve(response))
			.on('error', error => reject(error))
			.end();
	})
}

function guessMime(filename) {
	switch (extname(filename).toLowerCase()) {
		case '.css':  return 'text/css';
		case '.gif':  return 'image/gif';
		case '.htm':  return 'text/html';
		case '.html': return 'text/html';
		case '.jpeg': return 'image/jpeg';
		case '.jpg':  return 'image/jpeg';
		case '.js':   return 'text/javascript';
		case '.json': return 'application/json';
		case '.map':  return 'application/json';
		case '.pbf':  return 'application/x-protobuf';
		case '.png':  return 'image/png';
		default:
			console.error('unknown extension in guessMime: "'+extname(filename).toLowerCase()+'"');
	}
}

for (let i = 0; i <= 2; i++) {
	const l = 5 - i * 2;
	const end = '\x1b[0m';
	const prefix = '  '.repeat(i+1) + '• ';

	Object.defineProperty(String.prototype, 'red' + i, { get() { return color(l, 0, 0) + prefix + this + end } });
	Object.defineProperty(String.prototype, 'green' + i, { get() { return color(0, l, 0) + prefix + this + end } });
	Object.defineProperty(String.prototype, 'white' + i, { get() { return color(l, l, l) + prefix + this + end } });
	
	function color(r, g, b) { return `\x1b[38;5;${r + 6 * g + 36 * b + 16}m`; }
}
