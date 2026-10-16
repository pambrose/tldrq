---
icon: lucide/rocket
---

# Deployment

tldrq runs on three services: **Supabase** holds the data and handles sign-in, **Vercel** runs the Next.js app,
and **GitHub Pages** serves this documentation. Setting up a new deployment takes five steps.

## 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open its SQL editor and run `supabase/schema.sql` (see [Database](database.md)).
3. From the project's API settings, copy the **project URL** and the **anon public key**. They become
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

!!! warning
    `schema.sql` drops the application's tables and function before creating them. Never run it against a
    database whose data you want to keep.

## 2. OAuth providers

The sign-in page offers exactly two providers, GitHub and Google. Enable both in Supabase's Auth providers. Each
needs an OAuth app at the provider whose callback is Supabase's, not tldrq's:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

=== "Google"

    1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an OAuth client ID
       for a web application.
    2. Add `https://<project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI.
    3. Paste the client ID and secret into Supabase's Google provider, and enable it.

=== "GitHub"

    1. In [GitHub Developer Settings](https://github.com/settings/developers), create an OAuth App.
    2. Set its authorization callback URL to `https://<project-ref>.supabase.co/auth/v1/callback`.
    3. Paste the client ID and secret into Supabase's GitHub provider, and enable it.

## 3. URL configuration

In Supabase's Auth URL configuration:

- **Site URL**: the production URL, `https://tldrq.com`.
- **Redirect URLs**: every address sign-in may return to. Sign-in returns to the origin it started from, so list
  each one:

    ```text
    https://tldrq.com/auth/callback
    https://tldrq.com/auth/callback-desktop
    http://localhost:3000/auth/callback
    ```

    The second is for the desktop app, the third for local development. Add any preview deployment's origin you
    want to sign in on too. See [Authentication](authentication.md#supabase-redirect-urls).

## 4. Vercel

1. Import the GitHub repository into [Vercel](https://vercel.com) as a Next.js project.
2. Add the environment variables, for both the Production and Preview environments:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SLACK_WEBHOOK_URL` (optional; see [Configuration](configuration.md#slack-sign-in-notifications))
3. Deploy, then add the custom domain.

From then on, Vercel deploys `master` to production and builds a preview deployment for every pull request. Its
checks, "Vercel" and "Vercel Preview Comments", are required before merging to `master`
(see [Branch protection](ci-releases.md#branch-protection)).

Next.js inlines the `NEXT_PUBLIC_` variables at build time, so redeploy after changing them.

## 5. Verify

Work through this checklist after a new deployment, or after changing auth or environment settings:

- Visiting the site signed out redirects to `/login`.
- Signing in with GitHub works, and so does signing in with Google.
- The four default collections (Videos, Tweets, Articles, Repos) exist after the first sign-in.
- Saving a YouTube URL files it in Videos, with a thumbnail.
- Saving a GitHub repository files it in Repos, with stars and forks.
- A share link opens in a private browser window, without signing in.
- Desktop sign-in completes, if you use the desktop app.
- A sign-in message arrives in Slack, if `SLACK_WEBHOOK_URL` is set.

## The desktop app

The desktop app has nothing to deploy: it loads `https://tldrq.com`, so it picks up every web deploy. Users build
the DMG themselves ([Desktop App Internals](desktop.md)).

## The docs site

This site is built and published by `.github/workflows/docs.yml` to GitHub Pages at <https://docs.tldrq.com>; see
[CI, Dependencies & Releases](ci-releases.md#documentation-workflow).
