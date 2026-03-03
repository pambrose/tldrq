interface LoginNotification {
  email: string | undefined;
  name: string | undefined;
  provider: string | undefined;
}

export async function notifySlackUserLogin(user: LoginNotification): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const displayName = user.name || user.email || "Unknown user";
  const now = new Date().toString().replace(/ GMT.*$/, "");
  const providerLabel = user.provider ? ` via ${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}` : "";
  const text = `👋 ${displayName} just logged in${providerLabel} - ${now}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`Slack webhook failed: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error("Slack webhook error:", err instanceof Error ? err.message : err);
  } finally {
    clearTimeout(timeout);
  }
}
