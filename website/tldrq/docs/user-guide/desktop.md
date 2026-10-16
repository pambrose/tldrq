---
icon: lucide/monitor
---

# Desktop App

The tldrq desktop app is a macOS app that shows tldrq.com in a window of its own, with no separate title bar: the
window buttons sit over the page, and you drag the page's header to move the window. Everything inside works exactly as it does on the web, and the app always shows the
current version of the site.

## Getting the app

There's no download on the Releases page; you build the app from its source:

1. Clone the [repository](https://github.com/pambrose/tldrq).
2. In its `electron` folder, run:

    ```bash
    npm install
    npm run build
    ```

3. Open the `.dmg` it creates in `electron/dist` and drag **tldrq** to Applications.

To try the app without packaging it, run `npm start` in the same folder instead of `npm run build`. The
[Developer Guide](../developer-guide/desktop.md) has the details.

## Signing in

Click **Sign in with GitHub** or **Sign in with Google** as usual. The app opens the sign-in in your default
browser, so your passkeys and saved logins work. When you've signed in there, the browser tab shows
"Sign-in successful! You can close this tab." and the app switches to your dashboard.

Keep the app open while you sign in: the browser hands your sign-in back to the running app. That browser stays
signed in to tldrq.com too.

## Links and windows

- Links to other sites, such as your bookmarks, open in your default browser. tldrq.com pages stay in the app.
- Closing the window doesn't quit the app. Click its Dock icon to open a new window.
- Quit with Cmd+Q.

## Signing out

The app and the browser you signed in with share one session, so **Sign out** in either one signs out both. Your
other devices stay signed in.
