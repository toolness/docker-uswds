This is an attempt at making it easier to work on the U.S. Web Design
Standards and associated documentation.

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

## Sub-repositories

The `clone-repos.sh` script cloned 18F's official versions of:

  * USWDS into the `web-design-standards` folder
  * USWDS docs into the `web-design-standards-docs` folder

Feel free to make edits in these folders.

If you want, you can clone your own forks of these repositories
instead of running `clone-repos.sh`; just make sure their directory
names stay the same.

## Updating

Whenever you update this repository or any of the sub-repositories,
though--specifically, if the dependencies in any of them changed--you will
want to re-run `bash update.sh`.
