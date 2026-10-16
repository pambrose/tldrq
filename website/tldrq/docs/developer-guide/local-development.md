---
icon: lucide/terminal
---

# Local Development

## Prerequisites

- **Node 26** and npm. That's the version CI builds with (`.github/workflows/ci.yml`).
- A **Supabase project** with GitHub and/or Google sign-in enabled. [Deployment](deployment.md) walks through
  creating one and setting up the providers.
- **[uv](https://docs.astral.sh/uv/)**, if you want to build this documentation site.

## Set up Supabase

Run `supabase/schema.sql` in the project's SQL editor to create the tables, policies and function (see
[Database](database.md)).

!!! warning
    `schema.sql` starts by dropping the application's tables and function, so running it on a database that
    already has data deletes that data.

Then add `http://localhost:3000/auth/callback` to the project's redirect URLs (Supabase's Auth URL configuration).
Sign-in sends the user back to the current origin's `/auth/callback` (`src/components/auth/login-buttons.tsx`), so
Supabase has to allow the local origin too.

## Environment

Create `.env.local` in the repository root (it's gitignored, like every `.env*` file):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# Optional: Slack incoming webhook for sign-in notices
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

[Configuration](configuration.md#environment-variables) describes each variable.

## Run the app

```bash
npm install
npm run dev
```

Open <http://localhost:3000>; you're sent to the sign-in page. CI installs with `npm ci`, which uses
`package-lock.json` exactly.

## Scripts

| Command | Runs | Does |
|---|---|---|
| `npm run dev` | `next dev` | Development server with hot reload |
| `npm run build` | `next build` | Production build, including the TypeScript type-check |
| `npm start` | `next start` | Serves the production build |
| `npm run lint` | `eslint` | Lints the project |

There's no test suite. `npm run build` needs no secrets, because the Supabase clients are only created when a
request comes in; CI builds without any.

## Linting

`eslint.config.mjs` combines `eslint-config-next`'s core-web-vitals and TypeScript configurations, then:

- turns off `@next/next/no-img-element`, because bookmark thumbnails come from arbitrary domains that
  `next/image` would need a wildcard to allow;
- allows `require` in `electron/**/*.js`, since the Electron main process is CommonJS;
- ignores `website/**`, so the docs site's uv environment and build output aren't linted.

So `npm run lint` covers `electron/main.js` too.

## The desktop app

```bash
cd electron
npm install
npm start
```

The app loads production, `https://tldrq.com` (`SITE_URL` in `electron/main.js`), not your dev server. To try it
against local code, change `SITE_URL` temporarily and add that origin's `/auth/callback-desktop` to Supabase's
redirect URLs. See [Desktop App Internals](desktop.md).

## The docs site

This site lives in `website/tldrq/`: `zensical.toml` and the pages in `docs/`. `website/pyproject.toml` requires
Zensical 0.0.70 or later, `website/uv.lock` pins the exact version, and uv installs the Python version in
`website/.python-version` by itself.

The `Makefile` at the repository root wraps the commands; `make help` lists its targets:

| Target | Runs | Does |
|---|---|---|
| `make docs-serve` | `uv run zensical serve` in `website/tldrq` | Removes old output, then serves a live preview at <http://localhost:8000> |
| `make docs-build` | `uv run --locked python ../check_nav.py`, then `uv run --locked zensical build --clean --strict`, in `website/tldrq` | What CI runs: checks that the nav and the pages under `docs/` match, then builds into `website/tldrq/site/` (gitignored) |
| `make docs-clean` | `rm -rf` | Removes `website/tldrq/site/` and `website/tldrq/.cache/` |
| `make upgrade-site` | `uv lock --upgrade` in `website` | Moves `website/uv.lock` to the newest Zensical and dependencies; review and commit the lock file |

To run the commands by hand, run them from `website/tldrq`: files that pages include are found relative to it.

Pages include repository files, such as `supabase/schema.sql`, `package.json` and the workflows, instead of copying
them, so the docs can't drift from them. Any build fails if an included file is missing. Each included
file must also be listed in the path filters of `.github/workflows/docs.yml`, so that changing it rebuilds the
site; see [CI, Dependencies & Releases](ci-releases.md#documentation-workflow).
