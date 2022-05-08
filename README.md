# map-server

# on Hetzner Port 80

git clone https://github.com/MichaelKreil/map-server.git
cd map-server
cp config.example-hetzner.js config.js
mkdir database
cd database
wget -O planet.torrent "https://archive.org/download/osm-2017-07-03-planet.mbtiles/osm-2017-07-03-planet.mbtiles_archive.torrent"
aria2c --show-files planet.torrent
aria2c -o planet.mbtiles --select-file=1 planet.torrent


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