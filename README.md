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

[Docker]: https://www.docker.com/community-edition
[git for Windows]: https://git-for-windows.github.io/
[U.S. Web Design Standards]: https://github.com/18F/web-design-standards
[documentation]: https://github.com/18F/web-design-standards-docs
