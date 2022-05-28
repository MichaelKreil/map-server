# grandine


- 8 cpus
- 32 GB RAM
- 300GB SSD


from https://github.com/thomersch/grandine

~~~bash
sudo apt-get install golang libgeos-dev libleveldb-dev
go get -u github.com/thomersch/grandine
cd ~/go/src/github.com/thomersch/grandine
make build
~~~

./bin/grandine-converter --help
./bin/grandine-inspect --help
./bin/grandine-spatialize --help
./bin/grandine-tiler --help

~~~bash
wget -O mapping.yaml "https://github.com/openmaptiles/openmaptiles/raw/master/layers/aeroway/mapping.yaml"
~/go/src/github.com/thomersch/grandine/bin/grandine-spatialize -in planet-latest.osm.pbf -mapping mapping.yaml -out planet.spaten
~~~












# sequentially-generate-planet-mbtiles

## hardware requirements

temp-osm2mbtiles

- 16 cpus
- 16 GB RAM
- 600GB SSD

## install docker

~~~bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
~~~

GIT_SSH_COMMAND="ssh -i ~/.ssh/sequentially-generate-planet-mbtiles" git clone --recurse-submodules https://github.com/MichaelKreil/sequentially-generate-planet-mbtiles.git
cd "sequentially-generate-planet-mbtiles"
git config core.sshCommand "ssh -i ~/.ssh/sequentially-generate-planet-mbtiles -F /dev/null"
git config pull.rebase false

sudo ./release/v2.2.0-sequentially-generate-planet-mbtiles.exe





# IGNORE REST




[openmaptiles-tools](https://github.com/openmaptiles/openmaptiles-tools) is a collection of tools to generate [vector tiles](https://wiki.openstreetmap.org/wiki/Vector_tiles) from [OpenStreetMap dumps](https://wiki.openstreetmap.org/wiki/Planet.osm). Probably it is not the most performant way. But at least it works, despite all the complexity and steps required by this process. Here is documented how to generate vector tiles in [MBTiles format](https://wiki.openstreetmap.org/wiki/MBTiles) for the whole planet.

## hardware requirements

- minimum of 4 cores
- 16 GB RAM
- 1TB SSD

## install `docker` and `docker-compose`

~~~bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
apt-get update
apt install -y docker-compose
~~~

## install and configure `openmaptiles-tools`

~~~bash
git clone https://github.com/openmaptiles/openmaptiles.git
cd openmaptiles
sed -i "s+MAX_ZOOM=.*+MAX_ZOOM=14+" .env
sed -i "s+MAX_PARALLEL_PSQL=.*+MAX_PARALLEL_PSQL=$(nproc)+" .env
sed -i "s+COPY_CONCURRENCY=.*+COPY_CONCURRENCY=$(nproc)+" .env
~~~

`$(nproc)` returns the number of cores and is used to set the number of concurrent processes. If you change the number of cores later (e.g. for tile creation), you might want the set the correct number here.

And now you can run the individual steps:

~~~bash
make stop-db
make
make clean
make all
make download area=planet
make init-dirs
make start-db
make import-data
make import-osm
make import-borders
~~~

Wait for about 1 day, then:

~~~bash
make import-wikidata
make generate-bbox-file
~~~

Wait for about 7 days, then:

~~~bash
make import-sql
make generate-tiles-pg
~~~
