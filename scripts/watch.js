const child_process = require('child_process');

const USWDS = '/web-design-standards';
const DOCS = '/web-design-standards-docs';

const chokidar = require(USWDS + '/node_modules/chokidar');

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

// Run the given command using 'npm run', in the given directory.
//
// Returns a Promise that resolves once the command is finished, or
// rejects if the process errored or exited with a non-zero status code.
function npmRun(cwd, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`Running ${cwd}/npm ${cmd}.`);
    const child = child_process.spawn('npm', ['run', cmd], {
      cwd: cwd,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(`npm ${cmd} exited with code ${code}!`);
      }
    });
  });
}

// Make it easy for Docker to terminate us.
process.on('SIGTERM', () => {
  // TODO: Consider waiting for children and/or terminating them.
  process.exit(0);
});

// CSS
const buildDocsCss = () => npmRun(DOCS, "build-css");
watch(USWDS, "src/stylesheets/{components,core,elements,}/*.scss",
      () => npmRun(USWDS, 'build:css').then(buildDocsCss));
watch(DOCS, "css/**/*.scss", buildDocsCss);

// JS
const buildDocsJs = () => npmRun(DOCS, "build-js");
watch(USWDS, "src/js/**/*.js",
      () => npmRun(USWDS, 'build:js').then(buildDocsJs));
watch(DOCS, "js/**/*.js", buildDocsJs);

// Images
const buildDocsImg = () => npmRun(DOCS, "build-img");
watch(DOCS, "img", buildDocsImg);
watch(USWDS, "src/img", buildDocsImg);

// Fonts
watch(USWDS, "src/fonts", () => npmRun(DOCS, "build-fonts"));

console.log('Now watching files for changes. Feel free to edit them!');
