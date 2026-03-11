const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

app.setName("tldrq");

if (app.dock && !app.isPackaged) {
  app.dock.setIcon(path.join(__dirname, "icon.png"));
}

const SITE_URL = "https://tldrq.com";
const PROTOCOL = "tldrq";

// Register as handler for tldrq:// URLs
if (process.defaultApp) {
  app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [
    path.resolve(process.argv[1]),
  ]);
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

let mainWindow;
let authPollInterval;

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

  // Intercept Supabase OAuth navigations — redirect to system browser
  // so passkeys work and PKCE stays in one browser context
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.includes("supabase.co/auth")) {
      event.preventDefault();
      try {
        const parsed = new URL(url);
        const provider = parsed.searchParams.get("provider");
        if (provider) {
          shell.openExternal(`${SITE_URL}/auth/login-desktop?provider=${provider}`);
          startAuthPolling();
        }
      } catch {
        shell.openExternal(url);
      }
    }
  });

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes("/auth/login-desktop")) {
      shell.openExternal(url);
      startAuthPolling();
      return { action: "deny" };
    }
    if (!url.startsWith(SITE_URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
}

// Poll the desktop auth page — when OAuth completes in the browser,
// the callback redirects to /auth/desktop?tokens=... which we can fetch
function startAuthPolling() {
  stopAuthPolling();
  authPollInterval = setInterval(async () => {
    try {
      // Check Electron's cookies for a Supabase session
      const cookies = await mainWindow.webContents.session.cookies.get({
        url: SITE_URL,
      });
      // If we have a supabase auth cookie, auth might have succeeded via protocol handler
      const hasSession = cookies.some((c) => c.name.includes("auth-token"));
      if (hasSession) {
        stopAuthPolling();
        mainWindow.loadURL(SITE_URL);
        mainWindow.focus();
      }
    } catch {
      // ignore polling errors
    }
  }, 2000);

  // Stop polling after 5 minutes
  setTimeout(stopAuthPolling, 300000);
}

function stopAuthPolling() {
  if (authPollInterval) {
    clearInterval(authPollInterval);
    authPollInterval = null;
  }
}

// Handle tldrq:// URL (macOS: open-url event)
app.on("open-url", (event, url) => {
  event.preventDefault();
  handleProtocolUrl(url);
});

function handleProtocolUrl(url) {
  // tldrq://auth/callback?access_token=...&refresh_token=...
  try {
    const parsed = new URL(url);
    const accessToken =
      parsed.searchParams.get("access_token") ||
      new URLSearchParams(parsed.pathname.split("?")[1]).get("access_token");
    const refreshToken =
      parsed.searchParams.get("refresh_token") ||
      new URLSearchParams(parsed.pathname.split("?")[1]).get("refresh_token");

    if (accessToken && refreshToken && mainWindow) {
      stopAuthPolling();
      // Load the desktop auth page in Electron to set the session
      mainWindow.loadURL(
        `${SITE_URL}/auth/desktop?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`
      );
      mainWindow.focus();
    }
  } catch {
    // ignore parse errors
  }
}

app.whenReady().then(createWindow);

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
