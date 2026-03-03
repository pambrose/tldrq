interface BookmarkNotification {
  title: string | null;
  url: string;
  collectionName: string | null;
  priority: string;
}

export function notifySlackBookmarkCreated(bookmark: BookmarkNotification): void {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const displayTitle = bookmark.title || bookmark.url;
  const titleLink = `<${bookmark.url}|${displayTitle}>`;

  const parts = [`📎 New bookmark: ${titleLink}`];
  if (bookmark.collectionName) {
    parts.push(`Collection: ${bookmark.collectionName}`);
  }
  if (bookmark.priority && bookmark.priority !== "normal") {
    parts.push(`Priority: ${bookmark.priority}`);
  }

  const text = parts.join("\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal: controller.signal,
  })
    .then((res) => {
      if (!res.ok) {
        console.error(`Slack webhook failed: ${res.status} ${res.statusText}`);
      }
    })
    .catch((err) => {
      console.error("Slack webhook error:", err instanceof Error ? err.message : err);
    })
    .finally(() => clearTimeout(timeout));
}
