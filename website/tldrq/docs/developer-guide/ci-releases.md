---
icon: lucide/git-pull-request
---

# CI, Dependencies & Releases

## CI workflow

`.github/workflows/ci.yml` runs on every pull request and every push to `master`. Its one job, `verify`, named
**Lint and build**, runs on `ubuntu-latest`: check out, set up Node 26 with the npm cache, `npm ci`,
`npm run lint`, `npm run build`. It needs no secrets.

```yaml title=".github/workflows/ci.yml"
--8<-- ".github/workflows/ci.yml"
```

## Documentation workflow

`.github/workflows/docs.yml` builds and publishes this site.

- **When it runs**: on pull requests and pushes to `master` that change `website/**` or a repository file a page
  includes (the schema, the two `package.json` files, the workflows and the Dependabot config), and on manual runs
  (`workflow_dispatch`).
- **The `docs` job** checks that the nav and the pages match (`check_nav.py`, since `--strict` doesn't catch a nav
  entry whose page is missing), then builds with `zensical build --clean --strict`, which fails on broken links,
  missing anchors and missing included files. On a push to `master` or a manual run it also uploads the site as the
  Pages artifact.
- **The `deploy` job** runs only for those deploying events and publishes the artifact to the `github-pages`
  environment, which accepts deployments from `master` only. The site is served at <https://docs.tldrq.com>.
- **Hardening**: actions are pinned by commit SHA, checkout doesn't keep the token in `.git/config`, nothing is
  cached, and each job gets only the permissions it needs.

It isn't a required check. When a page starts including another repository file, add that file to both path lists
in the workflow, so changing it rebuilds the site.

```yaml title=".github/workflows/docs.yml"
--8<-- ".github/workflows/docs.yml"
```

## Branch protection

Two layers protect `master`:

- **Classic branch protection** requires the **GitGuardian Security Checks**, **Lint and build**, **Vercel** and
  **Vercel Preview Comments** checks, and requires a branch to be up to date with `master` before it merges. It
  isn't enforced for admins.
- **A repository ruleset**, "master protection", also requires **Lint and build**, with a bypass for repository
  admins.

In practice: update a pull request's branch (`gh pr update-branch <number>`, or **Update branch** on GitHub) and
wait for the checks before merging. When several PRs are ready, merge them one at a time, updating each in turn.

## Dependabot

`.github/dependabot.yml` checks weekly, and every update waits 7 days after its release (`cooldown`) so a broken
or compromised version has time to be caught; security updates skip the wait.

- **npm, root**: minor and patch updates arrive together in one PR. Majors of `next` and `eslint-config-next` come
  together, as do majors of `react`, `react-dom`, `@types/react` and `@types/react-dom`. Majors are ignored for:
    - `@types/node`, which tracks the Node major the app runs on (26, as in CI);
    - `typescript`, because TypeScript 7 drops the JavaScript compiler API that the Next.js build's type-check and
      typescript-eslint use;
    - `eslint`, because the plugins bundled in `eslint-config-next` crash on ESLint 10.
- **npm, `electron/`**: one grouped PR. CI doesn't build the desktop app, so check these by hand with `npm start`
  (see [Desktop App Internals](desktop.md#testing-changes)).
- **GitHub Actions**: one grouped PR, which covers the SHA-pinned actions in `docs.yml` too.

```yaml title=".github/dependabot.yml"
--8<-- ".github/dependabot.yml"
```

## Releases

tldrq's releases follow one process, visible in its tags and in pull requests such as "Bump version to 0.2.11":

1. On a branch, bump `version` in `package.json` and `package-lock.json`. `npm version 0.2.12 --no-git-tag-version`
   does both.
2. Add a section for the version to `CHANGELOG.md`, which follows
   [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).
3. Add the release notes, exactly as they'll be published, to the top of `RELEASE_NOTES.md`.
4. Open a pull request titled "Bump version to 0.2.12", get the checks green, and merge it.
5. Tag the merge commit on `master` with the version, without a `v` prefix (`0.2.12`), and create the GitHub
   release, titled with a `v` prefix (`v0.2.12`). Its description summarizes the changes and ends with a link to the
   full diff:

    ```text
    **Full Changelog**: https://github.com/pambrose/tldrq/compare/0.2.11...0.2.12
    ```

    For example:

    ```bash
    gh release create 0.2.12 --target master --title v0.2.12 --notes-file notes.md
    ```

The app shows the version from `package.json` in its header and on the sign-in page. Vercel deploys the merge, so
the release is live once that deploy finishes. The desktop wrapper's own version, in `electron/package.json`, isn't
part of this process.
