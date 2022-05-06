'use strict'

const fs = require('fs');
const { resolve, relative } = require('path');

module.exports = {
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
