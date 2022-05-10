# How to share your vector tiles with others?

## 1. Upload to archive.org

In this example I use the name "osm-planet-2022-04-30". Since you propably have a different area and date, you should change the name accordingly.

~~~bash
curl -LOs https://archive.org/download/ia-pex/ia
chmod +x ia
./ia configure
./ia upload osm-planet-2022-04-30.mbtiles osm-planet-2022-04-30.mbtiles
~~~

Wait till torrent file is generated at:
https://archive.org/details/osm-planet-2022-04-30.mbtiles

extract the webseeds from the torrent file, e.g. by scanning it with `transmission-show`

## 2. Upload to CDN

e.g. to Digital Ocean: https://docs.digitalocean.com/products/spaces/resources/s3cmd/

```
s3cmd put osm-planet-2022-04-30.mbtiles s3://michaelkreil/osm/
s3cmd setacl s3://michaelkreil/osm/osm-planet-2022-04-30.mbtiles --acl-public
```

Use the public folder also as webseed: https://michaelkreil.fra1.digitaloceanspaces.com/osm/

## 3. Create Torrent

~~~bash
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
~~~

share the torrent file

## 4. Seeding

~~~bash
aria2c --seed-ratio=0.0 osm-planet-2022-04-30.mbtiles.torrent
~~~
