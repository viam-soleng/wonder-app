# wonder-app

Single-machine [Viam application](https://docs.viam.com/build-apps/hosting/overview/) for Wonder, built with Svelte 5 + TypeScript + Vite.

Once published, the app is served at `https://wonder_<namespace>.viamapplications.com`. Viam handles login and machine selection, then the app connects directly to the chosen machine using a machine-scoped API key delivered via cookie.

## Development

```bash
pnpm install

# Full flow with Viam auth emulation (recommended):
VIAM_MACHINE_ID=<your-machine-id> pnpm dev:viam
# then open http://localhost:8012/start (use Chrome; Firefox blocks localhost WebRTC)

# Plain Vite dev server (shows the error screen without credentials):
pnpm dev
```

`dev:viam` requires the [Viam CLI](https://docs.viam.com/dev/tools/cli/) and a `viam login` session.

## Checks

```bash
pnpm run check    # svelte-check + tsc
pnpm run format   # prettier
```

## Build & deploy

```bash
make module        # build and package module.tar.gz (meta.json + dist/)
make upload        # upload current version to the Viam registry

make show-version  # current git tag
make bump-patch    # tag next patch version
make deploy        # push main + tag; GitHub Actions builds and uploads
```

CI (`.github/workflows/deploy.yml`) deploys on semver tag push. It needs `VIAM_API_KEY_ID` / `VIAM_API_KEY` repo secrets (an org API key with module upload permission).

## Notes

- `meta.json` must have `visibility: "public"` and the `applications` entry for the app to be hosted.
- Uploaded versions are immutable; the hosted app always serves the latest version (live within ~5 minutes).
- `vite.config.ts` uses `base: './'` because the app is served under a `/machine/{machineId}/` path prefix.
