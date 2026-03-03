import * as cheerio from "cheerio";

export interface OGMetadata {
  title: string | null;
  description: string | null;
  image_url: string | null;
  site_name: string | null;
}

export async function fetchOGMetadata(url: string): Promise<OGMetadata> {
  try {
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
