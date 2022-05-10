'use strict'

const fs = require('fs');
const { extname, resolve, relative } = require('path');

module.exports = {
	guessMime,
	readFiles,
}

function readFiles(folder, useCaching) {
	folder = resolve(__dirname, folder);

	let files = new Map();
	scan(resolve(__dirname, folder));
	return files;

	function scan(fol) {
		fs.readdirSync(fol).forEach(entry => {
			let fullname = resolve(fol, entry);
			if (fs.statSync(fullname).isDirectory()) return scan(fullname)

			let slug = relative(folder, fullname);
			files.set(slug, fullname);

			slug = slug.replace(/(^|\/)index\.html?$/, '');
			if (!files.has(slug)) files.set(slug, fullname);
		})
	}
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
