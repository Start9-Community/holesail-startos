# Updating the upstream version

Holesail runs the prebuilt `holesail/holesail` Docker Hub image, built by [holesail/holesail-docker](https://github.com/holesail/holesail-docker) from [holesail/holesail](https://github.com/holesail/holesail). The pin is `images.holesail.source.dockerTag` in [`startos/manifest/index.ts`](startos/manifest/index.ts), as `holesail/holesail:<tag>@sha256:<digest>`.

## Determining the upstream version

- **npm — `holesail`** (the version the image carries):

  ```sh
  npm view holesail version
  ```

- **GitHub releases — [holesail/holesail](https://github.com/holesail/holesail)**:

  ```sh
  gh release view -R holesail/holesail --json tagName -q .tagName
  ```

- **Docker Hub — [holesail/holesail](https://hub.docker.com/r/holesail/holesail)**: each tag with its manifest digest and architectures.

  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/holesail/holesail/tags?page_size=20&ordering=last_updated" \
    | jq -r '.results[] | "\(.name) \(.digest) \([.images[].architecture] | join(","))"'
  ```

  Pick the build that carries the new release and lists both `amd64` and `arm64`. The image is built from holesail/holesail's default branch, so its per-build `sha-<commit>` tag (the holesail-docker commit) is the stable name for it. A version tag such as `2.4.1` is not always published for both architectures.

- **Confirm the Holesail version in that build:** the `version` in holesail/holesail's `package.json` at the time the image was built.

  ```sh
  gh api "repos/holesail/holesail/commits?until=<last_updated>&per_page=1" --jq '.[0].sha'
  gh api "repos/holesail/holesail/contents/package.json?ref=<sha>" -H "Accept: application/vnd.github.raw" | jq -r .version
  ```

## Applying the bump

1. Set `images.holesail.source.dockerTag` in [`startos/manifest/index.ts`](startos/manifest/index.ts) to `holesail/holesail:<tag>@sha256:<digest>`, using the multi-architecture digest from the Docker Hub listing above.
2. Set the upstream part of `version` in [`startos/versions/current.ts`](startos/versions/current.ts) to the Holesail version that build carries.
3. Check that `serverScript` in [`startos/utils.ts`](startos/utils.ts) still matches the new build: the library at `/usr/src/app/src/index.js`, its `Holesail` constructor options, and the `--live` branch of `src/bin/holesail.mjs` it mirrors.
