const ROOT_DIR = '/web-design-standards-docs';
const watch = require(ROOT_DIR + '/node_modules/nswatch');
const package = require(ROOT_DIR + '/package.json');

// For some reason having two containers watch the same directory
// simultaneously results in one of them always seeing changes
// even when they don't exist. So we're going to make the `docs`
// process watch the `dist` directory of uswds instead of the
// `src` directory, which makes it not freak out.
const REPLACERS = {
  "./node_modules/uswds/src/stylesheets": "./node_modules/uswds/dist/css",
  "./node_modules/uswds/src/fonts": "./node_modules/uswds/dist/fonts",
  "./node_modules/uswds/src/img": "./node_modules/uswds/dist/img",
  "./node_modules/uswds/src/js": "./node_modules/uswds/dist/js"
};

process.chdir(ROOT_DIR);

Object.keys(package.watch).forEach(function(key) {
  watch(REPLACERS[key] || key, package.watch[key]);
});

// Make it easy for Docker to terminate us.
process.on('SIGTERM', function() {
  process.exit(0);
});
