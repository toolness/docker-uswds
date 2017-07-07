This is an attempt at making it easier to work on the
[U.S. Web Design Standards][] and their [documentation][].

## Prerequisites

You just need [Docker][].

You do *not* need node, ruby, or anything else.

If you are on Windows, you will also need `bash`, which you can probably
get most easily by installing [git for Windows][].

## Quick start

Run the following at the terminal:

```
bash clone-repos.sh
bash update.sh
docker-compose up
```

Then visit any of:

  * http://localhost:3000/ for the fractal site.
  * http://localhost:4000/ for the USWDS docs.

Whenever you make changes to any files, the proper static assets
will be rebuilt, and your changes will show up on the relevant local
website(s).

## Sub-repositories

The `clone-repos.sh` script cloned 18F's official versions of:

  * USWDS into the `web-design-standards` folder
  * USWDS docs into the `web-design-standards-docs` folder

Feel free to make edits in these folders.

If you want, you can clone your own forks of these repositories
instead of running `clone-repos.sh`; just make sure their directory
names stay the same.

## Updating

Whenever you update this repository or any of the
sub-repositories--specifically, if the dependencies in any of them
changed--you will want to re-run `bash update.sh`.

## Disabling Jekyll

Sometimes you may want to work only on the design standards, without
waiting for Jekyll to build (which can take some time). To do this,
create a `docker-compose.override.yml` file in the root of the
repository with the following content:

```yaml
version: '2'
services:
  app:
    environment:
      DISABLE_JEKYLL: yup
```

Then run `docker-compose up` again.

## Disabling Jekyll incremental builds

It seems Jekyll's incremental build system doesn't work well with
certain kinds of edits, and it even [breaks some templates][]; if you
need to disable it, add `DISABLE_JEKYLL_INCREMENTAL: yup` to your
environment via the override file described above.

[breaks some templates]: https://github.com/jekyll/jekyll/issues/4112

## Running all the tests

To easily run all the tests for both the Standards and the documentation,
run:

```
bash test-everything.sh
```

## Running other commands

If you want to run other `npm` commands or other scripts within
the context of Docker, the easiest way to do this is by running a
shell inside the main container:

```
docker-compose run app bash
```

Once you do this, you'll be in an interactive shell within the main
container. You can `cd /web-design-standards` to visit the USWDS repository
or `cd /web-design-standards-docs` to visit the documentation repository.

## Deploying to S3

It's possible to deploy your build fractal site and documentation site
to S3. You'll need the [AWS CLI][]. If you work for 18F, you will
probably want to set up an [AWS sandbox account][], too.

To generate the requisite static files, run:

```
bash update.sh
bash collect-static-files.sh
```

Now all your static files will be in the `collected-static-files` directory,
with the Standards docs in the root and the fractal site under the
`fractal` subdirectory.

The rest of these instructions assume your bucket name is `${BUCKET_NAME}`.
You'll want to change it to the actual name of your bucket.

You can create a S3 bucket and configure it as a website with:

```
aws s3api create-bucket --bucket ${BUCKET_NAME} --region us-east-1
aws s3 website s3://${BUCKET_NAME} --index-document index.html
```

Then you can sync your static files with the bucket using:

```
aws s3 sync collected-static-files s3://${BUCKET_NAME} --acl public-read
```

Now your Standards docs will be at the following URL:

```
http://${BUCKET_NAME}.s3-website-us-east-1.amazonaws.com/
```

And your fractal site will be at the `fractal` subdirectory under that URL.

[Docker]: https://www.docker.com/community-edition
[git for Windows]: https://git-for-windows.github.io/
[U.S. Web Design Standards]: https://github.com/18F/web-design-standards
[documentation]: https://github.com/18F/web-design-standards-docs
[AWS CLI]: https://aws.amazon.com/cli/
[AWS sandbox account]: https://before-you-ship.18f.gov/infrastructure/sandbox/
