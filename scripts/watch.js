const child_process = require('child_process');
const chokidar = require('chokidar');
const express = require('express');

const PORT = process.env.PORT || 4000;
const JEKYLL_FLAGS = process.env.JEKYLL_FLAGS || '';
const USWDS = '/web-design-standards';
const DOCS = '/web-design-standards-docs';
const NPM_CMD = process.env.NPM_CMD || 'npm';

// Watch the given files in the given directory for changes, running
// the given callback when anything changes.
//
// The callback is expected to return a Promise that resolves whenever
// its task is completed. In the meantime, further file changes will
// not trigger the callback; once the callback is complete, if any
// files were changed in the meantime, the callback will be called once
// more.
function watch(cwd, files, cb) {
  let currentTask = null;
  let queuedTasks = 0;
  const watcher = chokidar.watch(files, {
    cwd: cwd,
    ignoreInitial: true
  });
  const onFileChanged = (event, path) => {
    if (currentTask) {
      console.log(`${cwd}/${path} changed but task is busy; queuing.`);
      queuedTasks++;
      return;
    }
    let cleanup = () => {
      currentTask = null;
      if (queuedTasks > 0) {
        onFileChanged();
      }
    };

    currentTask = cb() || Promise.resolve();
    queuedTasks = 0;
    currentTask.then(() => {
      cleanup();
    });
    currentTask.catch(reason => {
      console.log(reason);
      cleanup();
    });
  };

  watcher.on('all', onFileChanged);
}

// Run the given command with the given args in the given directory.
//
// Returns a Promise that resolves once the command is finished, or
// rejects if the process errored or exited with a non-zero status code.
function run(cwd, command, args) {
  const cmdline = `${cwd}/${command} ${args.join(' ')}`;
  return new Promise((resolve, reject) => {
    console.log(`Running ${cmdline}.`);
    const child = child_process.spawn(command, args, {
      cwd: cwd,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(`${cmdline} exited with code ${code}!`);
      }
    });
  });
}

// Run the given npm command using 'npm run', in the given directory.
function npmRun(cwd, cmd) {
  return run(cwd, NPM_CMD, ['run', cmd, '--silent']);
}

const jekyll = () => run(
  DOCS, 'jekyll',
  ['build', '--incremental'].concat(JEKYLL_FLAGS.split(' '))
);

// Make it easy for Docker to terminate us.
process.on('SIGTERM', () => {
  // TODO: Consider waiting for children and/or terminating them.
  process.exit(0);
});

// CSS
const buildDocsCss = () => npmRun(DOCS, "build-css").then(jekyll);
watch(USWDS, "src/stylesheets/{components,core,elements,}/*.scss",
      () => npmRun(USWDS, 'build:css').then(buildDocsCss));
watch(DOCS, "css/**/*.scss", buildDocsCss);

// JS
const buildDocsJs = () => npmRun(DOCS, "build-js").then(jekyll);
watch(USWDS, "src/js/**/*.js",
      () => npmRun(USWDS, 'build:js').then(buildDocsJs));
watch(DOCS, "js/**/*.js", buildDocsJs);

// Images
const buildDocsImg = () => npmRun(DOCS, "build-img").then(jekyll);
watch(DOCS, "img", buildDocsImg);
watch(USWDS, "src/img", buildDocsImg);

// Fonts
watch(USWDS, "src/fonts", () => npmRun(DOCS, "build-fonts").then(jekyll));

// Other Jekyll files
watch(DOCS, [
  '_components',
  '_data',
  '_drafts',
  '_includes',
  '_layouts',
  '_plugins',
  '_posts',
  'pages',
  '_config.yml',
], jekyll);

console.log('Now watching files for changes. Feel free to edit them!');

const app = express();

app.use(express.static(`${DOCS}/_site`));

app.listen(PORT, () => {
  console.log(`Serving Jekyll site on port ${PORT}.`);
});
