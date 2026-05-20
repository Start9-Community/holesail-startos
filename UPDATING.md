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

The currently recorded upstream version lives in the StartOS package version, in [`startos/versions/index.ts`](startos/versions/index.ts) (which file it imports as `current`) — e.g. `v2.4.1.7.ts` means upstream `2.4.1`.

## Applying the bump

The image tag is `:latest`, so no `dockerTag` or `Dockerfile` change is needed. Rename and edit the version file to reflect the new upstream:

1. Rename `startos/versions/v<OLD>.ts` to `startos/versions/v<NEW>.<N>.ts` (e.g. `v2.4.1.7.ts` → `v2.5.0.1.ts`).
2. In that file, update the export name, the `version` string (`'<NEW>:<N>'`), and `releaseNotes` for every locale.
3. In [`startos/versions/index.ts`](startos/versions/index.ts), update the `import` path and the `current:` symbol to match.

No migration is required for a pure upstream bump; leave `other: []` and the `up`/`down` migration stubs as they are.
