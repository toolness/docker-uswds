#! /bin/bash

set -e

# https://stackoverflow.com/a/34386471
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXC="*"

docker-compose run -w '/web-design-standards' app npm test
docker-compose run -w '/web-design-standards-docs' app npm test

echo "All tests passed."
