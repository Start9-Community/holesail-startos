# Updating the upstream version

Holesail's container runs the `holesail/holesail:latest` Docker image (no tag pin), so the upstream version is not held by a `dockerTag` or `Dockerfile` here. The only place it surfaces in this repo is the StartOS package version `2.4.1:N` — a "bump" is recording that a new upstream release exists by updating that version string.

## Determining the upstream version

The `holesail` CLI/server is published as an npm package by [holesail/holesail](https://github.com/holesail/holesail). The Docker image built from [holesail/holesail-docker](https://github.com/holesail/holesail-docker) wraps that npm package and is published to Docker Hub as [`holesail/holesail`](https://hub.docker.com/r/holesail/holesail). All four typically advance together; npm is the canonical source.

- **npm — `holesail`** (canonical):

  ```sh
  npm view holesail version
  ```

- **GitHub releases — [holesail/holesail](https://github.com/holesail/holesail)**:

  ```sh
  gh release view -R holesail/holesail --json tagName -q .tagName
  ```

- **GitHub tags — [holesail/holesail](https://github.com/holesail/holesail)** (fallback if no release published):

  ```sh
  gh api repos/holesail/holesail/tags --jq '.[0].name'
  ```

- **Docker Hub — [holesail/holesail](https://hub.docker.com/r/holesail/holesail)** (confirms an image with the new version is available):

  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/holesail/holesail/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

The currently recorded upstream version is the upstream part of the `version` string in [`startos/versions/current.ts`](startos/versions/current.ts) — e.g. `2.4.1:12` means upstream `2.4.1`.

## Applying the bump

The image tag is `:latest`, so no `dockerTag` or `Dockerfile` change is needed. Edit [`startos/versions/current.ts`](startos/versions/current.ts) in place: set the `version` string to `'<NEW>:0'` and rewrite `releaseNotes` for every locale.

No migration is required for a pure upstream bump; leave `other: []` and the `up`/`down` migration stubs as they are.
