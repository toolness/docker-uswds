#! /bin/bash

set -e

cd /scripts
${NPM_CMD} install

cd /web-design-standards

${NPM_CMD} install --unsafe-perm
fractal build

if [ -n "$DISABLE_JEKYLL" ]; then
  echo "Jekyll is disabled, so bypassing uswds-docs setup."
  exit 0
fi

cd /web-design-standards-docs

bundle

# Hacky equivalent for https://github.com/jekyll/jekyll-redirect-from/pull/155
cp /scripts/fixed-jekyll-redirect-from-redirect.html \
  /usr/local/bundle/gems/jekyll-redirect-from-0.12.1/lib/jekyll-redirect-from/redirect.html

export USWDS_PATH="node_modules/uswds"

if [[ -L "$USWDS_PATH" ]]
then
  # It's a symlink left over from an earlier run; delete it.
  rm -f $USWDS_PATH
fi

${NPM_CMD} install --unsafe-perm

rm -rf $USWDS_PATH
ln -s /web-design-standards $USWDS_PATH

${NPM_CMD} run prestart

# Force Jekyll to rebuild its incremental regeneration metadata from
# scratch, just in case anything is out of sync.
rm -f .jekyll-metadata

# When we build the docs site, don't pull from a fractal server, b/c
# we're probably not running one; and anyways, we just built the
# static fractal site.
unset FRACTAL_BASE_URL

jekyll build --incremental ${JEKYLL_FLAGS}
