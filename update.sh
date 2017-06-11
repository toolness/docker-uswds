#! /bin/bash

docker-compose build
docker-compose run app bash scripts/update.sh
