#! /bin/bash

set -e

cd /scripts
${NPM_CMD} install

cd /web-design-standards

${NPM_CMD} install --unsafe-perm

cd /web-design-standards-docs

rm -f node_modules/uswds

${NPM_CMD} install --unsafe-perm

rm -rf node_modules/uswds
ln -s /web-design-standards node_modules/uswds

${NPM_CMD} run prestart
jekyll build --incremental ${JEKYLL_FLAGS}
