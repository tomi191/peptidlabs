/**
 * Schema.org JSON-LD builders.
 * Consume the returned object via `<script type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />`.
 */

const BASE_URL = "https://peptidlabs.eu";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PeptidLabs",
    legalName: "PeptidLabs",
    url: BASE_URL,
    logo: `${BASE_URL}/icon.svg`,
    description:
      "European supplier of HPLC-tested research peptides. 66+ peptides at 98%+ purity with batch-specific Certificate of Analysis.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@peptidlabs.eu",
      contactType: "customer service",
      availableLanguage: ["Bulgarian", "English"],
    },
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PeptidLabs",
    url: BASE_URL,
    inLanguage: ["bg-BG", "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/bg/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${BASE_URL}${c.path}`,
    })),
  };
}

type ItemListEntry = {
  name: string;
  url: string;
  image?: string | null;
  price?: number;
};

export function itemListSchema(items: ItemListEntry[], listName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(listName ? { name: listName } : {}),
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
      ...(item.name ? { name: item.name } : {}),
    })),
  };
}

/**
 * Build canonical Metadata.alternates for a localized path.
 * `path` should start with the locale segment, e.g. `/bg/waitlist`.
 */
export function alternatesFor(path: string, locale: string) {
  const slug = path.replace(/^\/(bg|en)/, "");
  return {
    canonical: `${BASE_URL}/${locale}${slug}`,
    languages: {
      bg: `${BASE_URL}/bg${slug}`,
      en: `${BASE_URL}/en${slug}`,
    },
  };
}

/** Build OpenGraph + Twitter blocks consistently. */
export function socialMeta({
  title,
  description,
  path,
  locale,
  images,
}: {
  title: string;
  description: string;
  path: string;
  locale: string;
  images?: string[];
}) {
  const slug = path.replace(/^\/(bg|en)/, "");
  return {
    openGraph: {
      type: "website" as const,
      siteName: "PeptidLabs",
      title,
      description,
      url: `${BASE_URL}/${locale}${slug}`,
      locale: locale === "bg" ? "bg_BG" : "en_US",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}

/** Convenience for pages that use both alternates + social meta. */
export function buildMetadata({
  title,
  description,
  path,
  locale,
  images,
}: {
  title: string;
  description: string;
  path: string;
  locale: string;
  images?: string[];
}) {
  return {
    title,
    description,
    alternates: alternatesFor(path, locale),
    ...socialMeta({ title, description, path, locale, images }),
  };
}
