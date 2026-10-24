import { site } from './content/site.js';

/** Public origin, no trailing slash. Canonicals, share images, the sitemap and llms.txt all use it. */
export const siteUrl = site.siteUrl.replace(/\/$/, '');

export function pageUrl(langPath) {
    return siteUrl + langPath;
}

export function shareImage(lang) {
    return `${siteUrl}/og/share-${lang}.jpg`;
}

/** The numeric App Store id from `site.appStoreUrl` (…/id1234567890), for the Smart App Banner. */
export function appStoreId() {
    return site.appStoreUrl?.match(/id(\d+)/)?.[1] ?? null;
}

/** Real app screens shown on the page, for the app's structured data. */
const SCREENSHOTS = ['home', 'my-reading', 'birth-chart', 'match', 'personal-reading', 'booking'];

/** hreflang region for Burmese: the site is written for Myanmar. */
export function hreflang(lang) {
    return lang === 'my' ? 'my-MM' : lang;
}

const ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export function structuredData(copy) {
    const { meta, seo, faq, features } = copy;
    const url = pageUrl(meta.path);
    const image = shareImage(meta.lang);
    const orgId = `${siteUrl}/#organization`;
    const siteId = `${siteUrl}/#website`;
    const appId = `${siteUrl}/#app`;

    const organization = {
        '@type': 'Organization',
        '@id': orgId,
        name: 'Lumière',
        url: `${siteUrl}/`,
        logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/android-chrome-512x512.png`,
            width: 512,
            height: 512,
        },
        email: site.supportEmail,
        areaServed: { '@type': 'Country', name: 'Myanmar' },
        knowsLanguage: ['my', 'en'],
    };

    const maker = {
        '@type': 'Organization',
        '@id': `${site.poweredByUrl}/#organization`,
        name: 'OneZ Codes',
        url: site.poweredByUrl,
    };

    const website = {
        '@type': 'WebSite',
        '@id': siteId,
        name: 'Lumière',
        url: `${siteUrl}/`,
        inLanguage: ['en', 'my'],
        publisher: { '@id': orgId },
    };

    const app = {
        '@type': 'MobileApplication',
        '@id': appId,
        name: 'Lumière',
        operatingSystem: 'iOS',
        applicationCategory: 'LifestyleApplication',
        description: seo.description,
        inLanguage: ['my', 'en'],
        url,
        image,
        screenshot: SCREENSHOTS.map((screen) => `${siteUrl}/screens/${screen}-720.webp`),
        featureList: features.groups.flatMap((group) => group.items.map((item) => item.title)),
        countriesSupported: 'MM',
        isAccessibleForFree: true,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'MMK',
            availability: 'https://schema.org/InStock',
        },
        publisher: { '@id': orgId },
        creator: { '@id': maker['@id'] },
        ...(site.appStoreUrl ? { downloadUrl: site.appStoreUrl, installUrl: site.appStoreUrl } : {}),
    };

    const webpage = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: seo.title,
        description: seo.description,
        inLanguage: meta.lang,
        isPartOf: { '@id': siteId },
        about: { '@id': appId },
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
        publisher: { '@id': orgId },
    };

    const questions = {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        url: `${url}#faq`,
        inLanguage: meta.lang,
        isPartOf: { '@id': `${url}#webpage` },
        mainEntity: faq.items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
    };

    return { '@context': 'https://schema.org', '@graph': [organization, maker, website, webpage, app, questions] };
}

function upsertMeta(attr, key, content) {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

/** Keep the live `<head>` in step when someone switches language without a full reload. */
export function applyDocumentSeo(copy) {
    const { meta, seo } = copy;
    const url = pageUrl(meta.path);
    const image = shareImage(meta.lang);

    document.documentElement.lang = meta.lang;
    document.title = seo.title;
    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'robots', ROBOTS);
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.shareDescription);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:image:secure_url', image);
    upsertMeta('property', 'og:image:alt', seo.imageAlt);
    upsertMeta('property', 'og:locale', meta.locale);
    upsertMeta('property', 'og:locale:alternate', meta.lang === 'en' ? 'my_MM' : 'en_US');
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.shareDescription);
    upsertMeta('name', 'twitter:image', image);
    upsertMeta('name', 'twitter:image:alt', seo.imageAlt);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', url);

    const payload = JSON.stringify(structuredData(copy)).replace(/</g, '\\u003c');
    let script = document.head.querySelector('script[type="application/ld+json"]');
    if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }
    script.textContent = payload;
}

export { ROBOTS };
