const { app, BrowserWindow, shell } = require("electron");
const http = require("http");
const path = require("path");

app.setName("tldrq");

if (app.dock && !app.isPackaged) {
  app.dock.setIcon(path.join(__dirname, "icon.png"));
}

const SITE_URL = "https://tldrq.com";

let mainWindow;
let authServer;
let authServerPort;

// Start a local HTTP server to receive OAuth callback tokens
function startAuthServer() {
  return new Promise((resolve) => {
    authServer = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost`);

      if (url.pathname === "/auth/callback") {
        const accessToken = url.searchParams.get("access_token");
        const refreshToken = url.searchParams.get("refresh_token");

        // Respond with a page that auto-closes
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="background:#0a0a0a;color:#999;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:system-ui">
              <p>Sign-in successful! You can close this tab.</p>
            </body>
          </html>
        `);

        if (accessToken && refreshToken && mainWindow) {
          // Load the desktop auth page in Electron to set the session
          mainWindow.loadURL(
            `${SITE_URL}/auth/desktop?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`
          );
          mainWindow.focus();
        }
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    // Listen on a random available port
    authServer.listen(0, "127.0.0.1", () => {
      authServerPort = authServer.address().port;
      resolve(authServerPort);
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 480,
    minHeight: 600,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(SITE_URL);

  // Make header draggable for window movement (re-inject on every navigation)
  const injectDragCSS = () => {
    mainWindow.webContents.insertCSS(`
      header { -webkit-app-region: drag; }
      header button, header a, header input, header select, header [role="button"] {
        -webkit-app-region: no-drag;
      }
    `);
  };
  mainWindow.webContents.on("did-finish-load", injectDragCSS);
  mainWindow.webContents.on("did-navigate-in-page", injectDragCSS);

  // Intercept Supabase OAuth navigations — redirect to system browser
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.includes("supabase.co/auth")) {
      event.preventDefault();
      try {
        const parsed = new URL(url);
        const provider = parsed.searchParams.get("provider");
        if (provider) {
          shell.openExternal(
            `${SITE_URL}/auth/login-desktop?provider=${provider}&port=${authServerPort}`
          );
        }
      } catch {
        shell.openExternal(url);
      }
    }
  });

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes("/auth/login-desktop")) {
      // Ensure port is included
      const hasPort = url.includes("port=");
      const authUrl = hasPort ? url : `${url}&port=${authServerPort}`;
      shell.openExternal(authUrl);
      return { action: "deny" };
    }
    if (!url.startsWith(SITE_URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
}

app.whenReady().then(async () => {
  await startAuthServer();
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (authServer) {
    authServer.close();
  }
});
