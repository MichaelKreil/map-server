
# openmaptiles-tools

[openmaptiles-tools](https://github.com/openmaptiles/openmaptiles-tools) is a collection of tools to generate [vector tiles](https://wiki.openstreetmap.org/wiki/Vector_tiles) from [OpenStreetMap dumps](https://wiki.openstreetmap.org/wiki/Planet.osm). Probably it is not the most performant way. But at least it works, despite all the complexity and steps required by this process. Here is documented how to generate vector tiles in [MBTiles format](https://wiki.openstreetmap.org/wiki/MBTiles) for the whole planet.

## hardware requirements

- minimum of 4 cores
- 16 GB RAM
- 1TB SSD

## install `docker` and `docker-compose`

~~~bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get update
apt install -y docker-compose
~~~

## install and configure `openmaptiles-tools`

~~~bash
git clone https://github.com/openmaptiles/openmaptiles.git
cd openmaptiles
sed -i "s+MAX_ZOOM=.*+MAX_ZOOM=15+" .env
sed -i "s+MAX_PARALLEL_PSQL=.*+MAX_PARALLEL_PSQL=$(nproc)+" .env
sed -i "s+COPY_CONCURRENCY=.*+COPY_CONCURRENCY=$(nproc)+" .env
~~~

`$(nproc)` returns the number of cores and is used to set the number of concurrent processes. If you change the number of cores later (e.g. for tile creation), you might want the set the correct number here.

And now you can run the individual steps:

~~~bash
make
make clean
make all
make download area=planet
make init-dirs
make start-db
make import-data
make import-osm
~~~

Wait for about 12 hours, then:

~~~bash
make import-wikidata
make import-sql
~~~

Wait for about 5 days, then:

~~~bash
make generate-bbox-file
make generate-tiles-pg
~~~
