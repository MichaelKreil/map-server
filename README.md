# install map-server

# on Hetzner, port 80

nvm install --lts
nvm use --lts
git clone https://github.com/MichaelKreil/map-server.git
cd map-server
npm i
cp config.example-hetzner.js config.js
mkdir database
cd database
aria2c "magent:uri???????"
cd ..
npm start



apt install transmission-cli

# distribute new mbtiles file

## uploading to archive

curl -LOs https://archive.org/download/ia-pex/ia
chmod +x ia
./ia configure
./ia upload osm-planet-2022-04-30.mbtiles osm-planet-2022-04-30.mbtiles

extract webseeds from IA torrent file

## uploading to digital ocean

https://docs.digitalocean.com/products/spaces/resources/s3cmd/
s3cmd -v put osm-planet-2022-04-30.geojsonl.xz s3://michaelkreil/osm/

## creating torrent

pip install torf-cli
/usr/local/bin/torf osm-planet-2022-04-30.mbtiles \
-n osm-planet-2022-04-30.mbtiles \
-c "vector tiles, as MBTiles file, covering the planet, based on OpenStreetMap, from 2022-04-30, converted with OpenMapTiles, by Michael Kreil, © OpenStreetMap contributors" \
-d 2022-04-30 \
-t http://tracker.openbittorrent.com:80/announce,udp://9.rarbg.com:2810/announce,udp://exodus.desync.com:6969/announce,udp://tracker.moeking.me:6969/announce,udp://tracker.openbittorrent.com:6969/announce,udp://tracker.opentrackr.org:1337/announce,udp://tracker.theoks.net:6969/announce,udp://tracker.torrent.eu.org:451/announce,udp://tracker2.dler.org:80/announce,udp://www.torrent.eu.org:451/announce \
-w https://archive.org/download/osm-planet-2022-04-30.mbtiles/ \
-w http://ia902507.us.archive.org/3/items/osm-planet-2022-04-30.mbtiles/ \
-w https://michaelkreil.fra1.digitaloceanspaces.com/osm/ \
-o osm-planet-2022-04-30.mbtiles.torrent

## seeding torrent

aria2c -V --seed-ratio=0.0 germany-2022.mbtiles.torrent

# other notes




oder komplett in GC und Daten im Bucket?
Compress cached files with gzip and brotli

https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service


### cluster node

install script:
	apt update
	apt install aria2
	- node, npm
	- git

	user for web
	public user key for admin stuff

	git clone


	echo "add this ip to that file on github"

loop:
	git pull
	npm install
	download data
	npm start

node server:
	- cache
	- version, status, statistics, https status
	- CORS uses domain list


### cluster manager

	checks status of all machines
	list dns entries
	commands for:
		- sending certificate and restart
		- pull, update and force restart




34.107.51.255