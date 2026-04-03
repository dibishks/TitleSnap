import { useEffect } from 'react';

interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: string;
  robots?: string;
  canonicalPath?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_SITE_NAME = 'TitleSnap';

const ensureMetaTag = (selector: string, attribute: 'name' | 'property', value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  return element;
};

const ensureLinkTag = (selector: string, rel: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  return element;
};

const toAbsoluteUrl = (value?: string) => {
  if (!value) {
    return '';
  }

  try {
    return new URL(value, window.location.origin).toString();
  } catch {
    return '';
  }
};

export const useSeo = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  robots = 'index, follow',
  canonicalPath,
  structuredData,
}: SeoConfig) => {
  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(canonicalPath || `${window.location.pathname}${window.location.search}`);
    const imageUrl = toAbsoluteUrl(image);

    document.title = title;

    ensureMetaTag('meta[name="description"]', 'name', 'description').content = description;
    ensureMetaTag('meta[name="keywords"]', 'name', 'keywords').content = keywords || '';
    ensureMetaTag('meta[name="robots"]', 'name', 'robots').content = robots;
    ensureMetaTag('meta[name="author"]', 'name', 'author').content = DEFAULT_SITE_NAME;

    ensureMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name').content =
      DEFAULT_SITE_NAME;
    ensureMetaTag('meta[property="og:type"]', 'property', 'og:type').content = type;
    ensureMetaTag('meta[property="og:title"]', 'property', 'og:title').content = title;
    ensureMetaTag('meta[property="og:description"]', 'property', 'og:description').content =
      description;
    ensureMetaTag('meta[property="og:url"]', 'property', 'og:url').content = canonicalUrl;

    ensureMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card').content = imageUrl
      ? 'summary_large_image'
      : 'summary';
    ensureMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title').content = title;
    ensureMetaTag(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description'
    ).content = description;

    if (imageUrl) {
      ensureMetaTag('meta[property="og:image"]', 'property', 'og:image').content = imageUrl;
      ensureMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image').content = imageUrl;
    }

    const canonical = ensureLinkTag('link[rel="canonical"]', 'canonical');
    canonical.href = canonicalUrl;

    const existingSchema = document.getElementById('seo-structured-data');
    if (existingSchema) {
      existingSchema.remove();
    }

    if (structuredData) {
      const schema = document.createElement('script');
      schema.type = 'application/ld+json';
      schema.id = 'seo-structured-data';
      schema.text = JSON.stringify(structuredData);
      document.head.appendChild(schema);
    }
  }, [canonicalPath, description, image, keywords, robots, structuredData, title, type]);
};
