import * as cheerio from "cheerio";

export interface OGMetadata {
  title: string | null;
  description: string | null;
  image_url: string | null;
  site_name: string | null;
}

// --- URL detection functions ---

export function isYouTubeUrl(url: string): boolean {
  return getYouTubeVideoId(url) !== null;
}

export function isTwitterUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      (u.hostname === "x.com" || u.hostname === "www.x.com" ||
       u.hostname === "twitter.com" || u.hostname === "www.twitter.com") &&
      /^\/\w+\/status\/\d+/.test(u.pathname)
    );
  } catch {
    return false;
  }
}

export function isVimeoUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.hostname === "vimeo.com" || u.hostname === "www.vimeo.com") &&
      /^\/\d+/.test(u.pathname);
  } catch {
    return false;
  }
}

export function isTikTokUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      (u.hostname === "www.tiktok.com" || u.hostname === "tiktok.com") &&
      u.pathname.includes("/video/")
    );
  } catch {
    return false;
  }
}

export function isGitRepoUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === "github.com" || u.hostname === "www.github.com" ||
      u.hostname === "gitlab.com" || u.hostname === "www.gitlab.com"
    );
  } catch {
    return false;
  }
}

function isSpotifyUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === "open.spotify.com" &&
      /^\/(track|album|playlist|episode|show)\//.test(u.pathname);
  } catch {
    return false;
  }
}

function isRedditUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      (u.hostname === "www.reddit.com" || u.hostname === "reddit.com" ||
       u.hostname === "old.reddit.com") &&
      /^\/r\/\w+\/comments\//.test(u.pathname)
    );
  } catch {
    return false;
  }
}

function isSoundCloudUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.hostname === "soundcloud.com" || u.hostname === "www.soundcloud.com") &&
      u.pathname.split("/").filter(Boolean).length >= 2;
  } catch {
    return false;
  }
}

function isFlickrUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.hostname === "www.flickr.com" || u.hostname === "flickr.com") &&
      u.pathname.startsWith("/photos/");
  } catch {
    return false;
  }
}

function isInstagramUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.hostname === "www.instagram.com" || u.hostname === "instagram.com") &&
      /^\/(p|reel|tv)\//.test(u.pathname);
  } catch {
    return false;
  }
}

function isSlideShareUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.hostname === "www.slideshare.net" || u.hostname === "slideshare.net") &&
      u.pathname.split("/").filter(Boolean).length >= 2;
  } catch {
    return false;
  }
}

// --- Helpers ---

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

/** Generic oEmbed fetch with timeout — returns parsed JSON or null on failure */
async function fetchOEmbedData(oembedUrl: string): Promise<Record<string, unknown> | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(oembedUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/** Generic OG metadata scraper for sites without oEmbed */
async function fetchGenericOGMetadata(url: string): Promise<OGMetadata> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  const response = await fetch(url, {
    signal: controller.signal,
    headers: { "User-Agent": "ReadingListBot/1.0" },
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
}

// --- Platform-specific fetch functions ---

async function fetchYouTubeMetadata(url: string, videoId: string): Promise<OGMetadata> {
  const data = await fetchOEmbedData(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
  );
  return {
    title: (data?.title as string) || null,
    description: data?.author_name ? `By ${data.author_name}` : null,
    image_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    site_name: "YouTube",
  };
}

async function fetchTwitterImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "ReadingListBot/1.0" },
    });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const html = await response.text();
    const $ = cheerio.load(html);
    return $('meta[property="og:image"]').attr("content")?.trim() || null;
  } catch {
    return null;
  }
}

async function fetchTwitterMetadata(url: string): Promise<OGMetadata> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`;

  // Fetch oEmbed and OG image in parallel
  const [oembedResponse, imageUrl] = await Promise.all([
    fetch(oembedUrl, { signal: controller.signal }),
    fetchTwitterImage(url),
  ]);
  clearTimeout(timeout);

  if (!oembedResponse.ok) return { title: null, description: null, image_url: imageUrl, site_name: "X" };

  const data = await oembedResponse.json();
  // Strip HTML tags from the tweet text
  const tweetText = data.html
    ? cheerio.load(data.html)("blockquote").first().text().trim()
    : null;
  return {
    title: data.author_name ? `@${data.author_name}` : null,
    description: tweetText || null,
    image_url: imageUrl,
    site_name: "X",
  };
}

async function fetchVimeoMetadata(url: string): Promise<OGMetadata> {
  const data = await fetchOEmbedData(
    `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`
  );
  return {
    title: (data?.title as string) || null,
    description: data?.author_name ? `By ${data.author_name}` : null,
    image_url: (data?.thumbnail_url as string) || null,
    site_name: "Vimeo",
  };
}

async function fetchTikTokMetadata(url: string): Promise<OGMetadata> {
  const data = await fetchOEmbedData(
    `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
  );
  return {
    title: (data?.title as string) || null,
    description: data?.author_name ? `By ${data.author_name}` : null,
    image_url: (data?.thumbnail_url as string) || null,
    site_name: "TikTok",
  };
}

async function fetchSpotifyMetadata(url: string): Promise<OGMetadata> {
  const data = await fetchOEmbedData(
    `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
  );
  return {
    title: (data?.title as string) || null,
    description: null,
    image_url: (data?.thumbnail_url as string) || null,
    site_name: "Spotify",
  };
}

async function fetchRedditMetadata(url: string): Promise<OGMetadata> {
  // Reddit oEmbed returns HTML embed; fetch both oEmbed and OG tags in parallel
  const [oembedData, ogMetadata] = await Promise.all([
    fetchOEmbedData(`https://www.reddit.com/oembed?url=${encodeURIComponent(url)}&format=json`),
    fetchGenericOGMetadata(url),
  ]);

  return {
    title: ogMetadata.title,
    description: oembedData?.author_name
      ? `By u/${oembedData.author_name}`
      : ogMetadata.description,
    image_url: ogMetadata.image_url,
    site_name: "Reddit",
  };
}

async function fetchSoundCloudMetadata(url: string): Promise<OGMetadata> {
  const data = await fetchOEmbedData(
    `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`
  );
  return {
    title: (data?.title as string) || null,
    description: data?.author_name ? `By ${data.author_name}` : null,
    image_url: (data?.thumbnail_url as string) || null,
    site_name: "SoundCloud",
  };
}

async function fetchFlickrMetadata(url: string): Promise<OGMetadata> {
  const data = await fetchOEmbedData(
    `https://www.flickr.com/services/oembed/?url=${encodeURIComponent(url)}&format=json`
  );
  return {
    title: (data?.title as string) || null,
    description: data?.author_name ? `By ${data.author_name}` : null,
    // Flickr returns the image itself in `url`, thumbnail in `thumbnail_url`
    image_url: (data?.url as string) || (data?.thumbnail_url as string) || null,
    site_name: "Flickr",
  };
}

async function fetchSlideShareMetadata(url: string): Promise<OGMetadata> {
  const data = await fetchOEmbedData(
    `https://www.slideshare.net/api/oembed/2?url=${encodeURIComponent(url)}&format=json`
  );
  return {
    title: (data?.title as string) || null,
    description: data?.author_name ? `By ${data.author_name}` : null,
    image_url: (data?.thumbnail_url as string) || null,
    site_name: "SlideShare",
  };
}

// --- Main entry point ---

export async function fetchOGMetadata(url: string): Promise<OGMetadata> {
  try {
    const videoId = getYouTubeVideoId(url);
    if (videoId) return await fetchYouTubeMetadata(url, videoId);
    if (isTwitterUrl(url)) return await fetchTwitterMetadata(url);
    if (isVimeoUrl(url)) return await fetchVimeoMetadata(url);
    if (isTikTokUrl(url)) return await fetchTikTokMetadata(url);
    if (isSpotifyUrl(url)) return await fetchSpotifyMetadata(url);
    if (isRedditUrl(url)) return await fetchRedditMetadata(url);
    if (isSoundCloudUrl(url)) return await fetchSoundCloudMetadata(url);
    if (isFlickrUrl(url)) return await fetchFlickrMetadata(url);
    if (isSlideShareUrl(url)) return await fetchSlideShareMetadata(url);

    // Instagram has no public oEmbed — use OG scraping with site_name fallback
    if (isInstagramUrl(url)) {
      const metadata = await fetchGenericOGMetadata(url);
      return { ...metadata, site_name: metadata.site_name || "Instagram" };
    }

    return await fetchGenericOGMetadata(url);
  } catch {
    return { title: null, description: null, image_url: null, site_name: null };
  }
}
