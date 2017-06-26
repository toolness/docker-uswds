#! /bin/bash

set -e

cd /scripts
npm install

cd /web-design-standards

npm install --unsafe-perm

cd /web-design-standards-docs

rm -f node_modules/uswds

npm install --unsafe-perm

rm -rf node_modules/uswds
ln -s /web-design-standards node_modules/uswds

npm run prestart
jekyll build --incremental ${JEKYLL_FLAGS}
