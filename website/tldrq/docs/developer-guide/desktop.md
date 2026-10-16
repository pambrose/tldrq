---
icon: lucide/app-window
---

# Desktop App Internals

The desktop app is a thin Electron wrapper around the live site: one file, `electron/main.js`, with its own
`electron/package.json`. It has no copy of the web app, so every web deploy reaches it without a rebuild.

## main.js walkthrough

### Startup

- `app.setName("tldrq")`.
- When running unpackaged (`npm start`), the Dock icon is set to `electron/icon.png`.
- `SITE_URL` is `https://tldrq.com`.
- When the app is ready, it starts the local auth server, then creates the window.

### The window

`createWindow()` opens a `BrowserWindow` of 1200×800 (at least 480×600) with `titleBarStyle: "hiddenInset"` and
the traffic lights at (16, 16), and loads `SITE_URL`. Its web preferences are `nodeIntegration: false` and
`contextIsolation: true`, with no preload script: the page is an ordinary website with no access to Node.

### Draggable header

With the title bar hidden, the page's header doubles as one. On `did-finish-load` and `did-navigate-in-page`, the
app injects CSS with `insertCSS`:

```css
header { -webkit-app-region: drag; }
header button, header a, header input, header select, header [role="button"] {
  -webkit-app-region: no-drag;
}
```

### Navigation and new windows

- **`will-navigate`**: a navigation to any URL containing `supabase.co/auth` is cancelled. If it has a `provider`
  parameter, the app opens `SITE_URL/auth/login-desktop?provider=…&port=…` in the default browser instead; if the
  URL can't be parsed, it opens the URL itself there.
- **`setWindowOpenHandler`**: a `/auth/login-desktop` URL gets `&port=` and the auth server's port appended if it
  has none, and opens in the default browser. Any other URL that doesn't start with `SITE_URL` (bookmarks, the
  GitHub link) also opens in the default browser with `shell.openExternal`. Both are denied inside the app. URLs on
  `SITE_URL` may open as new app windows.

### The local auth server

`startAuthServer()` creates an `http` server listening on `127.0.0.1`, on port 0 so the OS picks a free one, once
per launch. On `/auth/callback` it replies with a small dark page reading "Sign-in successful! You can close this
tab." and, when both `access_token` and `refresh_token` are present, loads
`SITE_URL/auth/desktop?access_token=…&refresh_token=…` in the main window and focuses it. Every other path gets a
404. The whole flow is in [Authentication](authentication.md#desktop-sign-in).

### Lifecycle

- `activate` (clicking the Dock icon) creates a window if none is open.
- `window-all-closed` quits the app, except on macOS, where it keeps running.
- `before-quit` closes the auth server.

## Running and building

```bash
cd electron
npm install
npm start          # electron .
npm run build      # electron-builder --mac
```

`npm run build` writes a DMG to `electron/dist/`, which is gitignored along with `electron/node_modules/`.

## Package configuration

```json title="electron/package.json"
--8<-- "electron/package.json"
```

electron-builder's settings, under `build`:

- `appId` `com.tldrq.app` and `productName` `tldrq`;
- the macOS category `public.app-category.productivity`;
- a `dmg` target, with `icon.icns` as the app icon.

The wrapper's `version` is its own; the web app's releases don't change it.

## Testing changes

CI doesn't install, build or run `electron/`, although `npm run lint` does lint `main.js`. Dependabot groups the
`electron/` dependencies into one weekly PR, which needs a manual check with `npm start`: sign in, open a bookmark
(it should open in the default browser), and sign out.

To run the app against a local dev server, see
[Local Development](local-development.md#the-desktop-app).
