# Install in Hetzner Cloud

Get an account at and login into: https://console.hetzner.cloud

Add a server (e.g. Debian, CPX21 for 8,21€ per month), set it up and login.

Ensure you use the latest version of node, e.g. by:
~~~bash
nvm install --lts
nvm use --lts
~~~

Clone, configure map-server
~~~bash
git clone https://github.com/MichaelKreil/map-server.git
cd map-server
npm i
cp config.example-hetzner.js config.js
~~~

Check `config.js`, e.g. change `baseUrl` to your domain.

Download data and start server:
~~~bash
mkdir database
cd database
aria2c "osm-planet-2022-04-30.mbtiles.torrent"
cd ..
npm start
~~~



