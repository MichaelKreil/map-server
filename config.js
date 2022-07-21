'use strict'


const { resolve } = require('path');

module.exports = {
	sources: [
		{ name: 'hitzekarte', type: 'tar', srcUrl: 'https://static.datenhub.net/tiles/hitzekarte.tar' },
		{ name: 'osm', type: 'mbtiles', srcUrl: 'https://static.datenhub.net/tiles/osm.mbtiles' },
	],
	folders: {
		sources: resolve(__dirname, 'tiles'),
	},
	port: 8000,
}
