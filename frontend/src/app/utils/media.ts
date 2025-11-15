// src/app/utils/media.ts
type MediaFormatKey = 'thumbnail' | 'small' | 'medium' | 'large';

interface MediaFormat {
  url?: string | null;
}

interface MediaLike {
  url?: string | null;
  formats?: Partial<Record<MediaFormatKey, MediaFormat>>;
}

const DEFAULT_STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

export function ensureAbsoluteStrapiUrl(
  url?: string | null,
  baseUrl: string = DEFAULT_STRAPI_URL
): string | null {
  if (!url) {
    return null;
  }

  if (ABSOLUTE_URL_REGEX.test(url)) {
    return url;
  }

  return `${baseUrl}${url}`;
}

interface ResolveMediaOptions {
  preferFormats?: MediaFormatKey[];
  baseUrl?: string;
  useOriginalFirst?: boolean;
}

export function resolveMediaUrl(
  media?: MediaLike | null,
  options?: ResolveMediaOptions
): string | null {
  if (!media) {
    return null;
  }

  if (options?.useOriginalFirst) {
    const original = ensureAbsoluteStrapiUrl(media.url, options?.baseUrl);
    if (original) {
      return original;
    }
  }

  const preferFormats =
    options?.preferFormats ?? ['large', 'medium', 'small', 'thumbnail'];

  for (const format of preferFormats) {
    const formattedUrl = media.formats?.[format]?.url;
    const absoluteUrl = ensureAbsoluteStrapiUrl(
      formattedUrl,
      options?.baseUrl
    );
    if (absoluteUrl) {
      return absoluteUrl;
    }
  }

  return ensureAbsoluteStrapiUrl(media.url, options?.baseUrl);
}
