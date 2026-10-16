---
icon: lucide/settings
---

# Configuration

## Environment variables

These are the only environment variables the code reads:

| Variable | Required | Read by | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `src/lib/supabase/server.ts`, `client.ts`, `middleware.ts` | The Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | The same three files | The project's anon (public) key |
| `SLACK_WEBHOOK_URL` | No | `src/lib/utils/slack.ts` | A Slack incoming webhook for [sign-in notifications](#slack-sign-in-notifications) |

Next.js inlines `NEXT_PUBLIC_` values into the browser bundle when it builds, so set them before building and
redeploy after changing them. The anon key is meant to be public: Row Level Security, not the key, protects the
data (see [Database](database.md#row-level-security)).

## Slack sign-in notifications

When `SLACK_WEBHOOK_URL` is set, every successful sign-in, through `/auth/callback` (web) or
`/auth/callback-desktop` (desktop), posts a message to it:

```json
{"text": "👋 Ada Lovelace just logged in via Github - Thu Oct 16 2026 11:42:07"}
```

- The name is the account's full name, else its email address, else "Unknown user".
- The provider is the provider's ID with a capital first letter: `Github` or `Google`.
- The date is the server's local time, without the time zone.

The request times out after 5 seconds. Failures are logged with `console.error` and never stop a sign-in, but
the callbacks wait for the request, so a slow webhook can delay sign-in by up to 5 seconds. When the
variable isn't set, nothing is sent.

## Project configuration files

| File | Holds |
|---|---|
| `next.config.ts` | Nothing yet: tldrq runs on Next.js defaults |
| `tsconfig.json` | Compiler options and the path alias `@/*` → `./src/*` |
| `eslint.config.mjs` | ESLint rules (see [Local Development](local-development.md#linting)) |
| `postcss.config.mjs` | The `@tailwindcss/postcss` plugin |
| `src/app/globals.css` | The Tailwind import and the class-based `dark` variant |
| `electron/package.json` | The desktop app's dependencies and electron-builder settings |

## Hard-coded values

A few values live in the code rather than in configuration:

- The desktop app's `SITE_URL`, `https://tldrq.com`, in `electron/main.js`.
- The header's GitHub link, in `src/components/layout/header.tsx`.
- The page title ("tldrq.com") and description ("The last tab you’ll ever need") in `src/app/layout.tsx`.
