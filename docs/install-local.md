# Install Locallly

ensure you use the latest version of node, e.g. by:

~~~bash
nvm install --lts
nvm use --lts
~~~

clone, configure and start map-server

~~~bash
git clone https://github.com/MichaelKreil/map-server.git
cd map-server
npm i
cp config.example-localhost.js config.js
mkdir database
cd database
aria2c "osm-planet-2022-04-30.mbtiles.torrent"
cd ..
npm start
~~~
