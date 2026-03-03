import * as cheerio from "cheerio";

export interface OGMetadata {
  title: string | null;
  description: string | null;
  image_url: string | null;
  site_name: string | null;
}

function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("/")[0];
    if (
      u.hostname === "www.youtube.com" ||
      u.hostname === "youtube.com" ||
      u.hostname === "m.youtube.com"
    ) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const shortMatch = u.pathname.match(/^\/(shorts|embed|v)\/([^/?]+)/);
      if (shortMatch) return shortMatch[2];
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchYouTubeMetadata(url: string, videoId: string): Promise<OGMetadata> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const response = await fetch(oembedUrl, { signal: controller.signal });
  clearTimeout(timeout);

  if (!response.ok) return { title: null, description: null, image_url: null, site_name: "YouTube" };

  const data = await response.json();
  return {
    title: data.title || null,
    description: data.author_name ? `By ${data.author_name}` : null,
    image_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    site_name: "YouTube",
  };
}

export async function fetchOGMetadata(url: string): Promise<OGMetadata> {
  try {
    // Use YouTube oEmbed API for reliable title + thumbnail
    const videoId = getYouTubeVideoId(url);
    if (videoId) return await fetchYouTubeMetadata(url, videoId);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ReadingListBot/1.0",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return { title: null, description: null, image_url: null, site_name: null };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const ogTitle =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      null;

    const ogDescription =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      null;

    const ogImage =
      $('meta[property="og:image"]').attr("content") || null;

    const ogSiteName =
      $('meta[property="og:site_name"]').attr("content") || null;

    return {
      title: ogTitle?.trim() || null,
      description: ogDescription?.trim() || null,
      image_url: ogImage?.trim() || null,
      site_name: ogSiteName?.trim() || null,
    };
  } catch {
    return { title: null, description: null, image_url: null, site_name: null };
  }
}
