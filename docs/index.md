# install map-server

## How to …

- [test map-server locally?](docs/InstallLocal.md)
- [generate your own vector tiles?](docs/OpenMapTiles.md)
- [upload and share vector tiles with others?](docs/ShareTiles.md)



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