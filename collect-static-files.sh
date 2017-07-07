#! /bin/bash

# https://stackoverflow.com/a/34386471
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXC="*"

docker-compose run -w '/web-design-standards' app fractal build

export STATIC_DIR=collected-static-files

rm -rf ${STATIC_DIR}

cp -r web-design-standards-docs/_site ${STATIC_DIR}
cp -r web-design-standards/build/ ${STATIC_DIR}/fractal
