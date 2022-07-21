'use strict'

const config = require('../config.js');
const { existsSync, statSync, createWriteStream } = require('fs');
const { resolve } = require('path');
const { request } = require('./helper.js');
const checkDiskSpace = require('check-disk-space').default

class TileSource {
	constructor(opt) {
		this.name = opt.name;
		this.srcUrl = opt.srcUrl;
		this.localFilename = resolve(config.folders.sources, opt.name + '.' + opt.extension);
	}
	async isOkay() {
		// check existence
		if (!existsSync(this.localFilename)) return false;

		// compare size
		await this.fetchSizes()
		if (this.sizeRemote !== this.sizeLocal) return false;

		return true;
	}
	async isSpaceAvailable() {
		let sizeLeft = (await checkDiskSpace(config.folders.sources)).free;

		await this.fetchSizes();
		sizeLeft = sizeLeft + this.sizeLocal - this.sizeRemote;

		return sizeLeft > 5e9 // 5GB should be left
	}
	async fetchSizes() {
		if (!this.sizeRemote) {
			let response = await request(this.srcUrl, { method: 'HEAD' });
			this.sizeRemote = parseInt(response.headers['content-length'], 10);
			if (existsSync(this.localFilename)) {
				this.sizeLocal = statSync(this.localFilename).size;
			} else {
				this.sizeLocal = 0;
			}
		}
	}
	async download(progress) {
		let response = await request(this.srcUrl, {});
		if (response.statusCode !== 200) throw Error();

		let lastTime = Date.now();
		let pos = 0;
		return await new Promise(resolve => response
			.on('data', chunk => {
				pos += chunk.length;
				if (Date.now() < lastTime + 500) return;
				lastTime += 500;
				progress(Math.min(1,pos / this.sizeRemote))
			})
			.on('end', () => { progress(1); resolve() })
			.pipe(createWriteStream(this.localFilename))
		)
	}
}

class MBTSource extends TileSource {
	constructor(opt) {
		opt.extension = 'mbtiles';
		super(opt);
	}

}

class TarSource extends TileSource {
	constructor(opt) {
		opt.extension = 'tar';
		super(opt);
	}

}

function getTileSource(opt) {
	switch (opt.type) {
		case 'tar': return new TarSource(opt);
		case 'mbtiles': return new MBTSource(opt);
	}
	throw Error(`unknown tile source type "${opt.type}"`)
}

module.exports = config.sources.map(getTileSource);
