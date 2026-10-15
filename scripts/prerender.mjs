/**
 * After `vite build`: renders the page once per language into real HTML, so search engines and
 * link previews (Facebook, Viber, Telegram) see the content without running JavaScript.
 *
 *   dist/index.html      English, at /
 *   dist/my/index.html   Burmese, at /my/
 *
 * Each page gets its own title, description, canonical link, hreflang alternates, share image
 * and structured data. robots.txt and sitemap.xml are written from the same site URL.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const serverDir = path.join(root, 'dist-ssr');

const { render, LANGUAGES } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href);
const { site } = await import(pathToFileURL(path.join(root, 'src/content/site.js')).href);

const base = site.siteUrl.replace(/\/$/, '');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const langs = Object.values(LANGUAGES);

const attr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const urlFor = (lang) => base + LANGUAGES[lang].meta.path;
// JSON inside <script> must not be able to close the tag.
const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

function structuredData(copy) {
    const { meta, seo, faq } = copy;
    const app = {
        '@type': 'MobileApplication',
        name: 'Lumière',
        operatingSystem: 'iOS',
        applicationCategory: 'LifestyleApplication',
        description: seo.description,
        inLanguage: ['my', 'en'],
        url: urlFor(meta.lang),
        image: `${base}/og/share-${meta.lang}.jpg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'MMK' },
        ...(site.appStoreUrl ? { downloadUrl: site.appStoreUrl, installUrl: site.appStoreUrl } : {}),
    };
    const website = { '@type': 'WebSite', name: 'Lumière', url: urlFor(meta.lang), inLanguage: meta.lang };
    const questions = {
        '@type': 'FAQPage',
        inLanguage: meta.lang,
        mainEntity: faq.items.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
    };

    return { '@context': 'https://schema.org', '@graph': [website, app, questions] };
}

function head(copy) {
    const { meta, seo } = copy;
    const url = urlFor(meta.lang);
    const image = `${base}/og/share-${meta.lang}.jpg`;
    const tags = [
        `<title>${attr(seo.title)}</title>`,
        `<meta name="description" content="${attr(seo.description)}" />`,
        `<link rel="canonical" href="${url}" />`,
        ...langs.map((other) => `<link rel="alternate" hreflang="${other.meta.lang}" href="${urlFor(other.meta.lang)}" />`),
        `<link rel="alternate" hreflang="x-default" href="${urlFor('en')}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="Lumière" />`,
        `<meta property="og:title" content="${attr(seo.title)}" />`,
        `<meta property="og:description" content="${attr(seo.shareDescription)}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:image" content="${image}" />`,
        `<meta property="og:image:type" content="image/jpeg" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${attr(seo.imageAlt)}" />`,
        `<meta property="og:locale" content="${meta.locale}" />`,
        ...langs.filter((other) => other !== copy).map((other) => `<meta property="og:locale:alternate" content="${other.meta.locale}" />`),
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${attr(seo.title)}" />`,
        `<meta name="twitter:description" content="${attr(seo.shareDescription)}" />`,
        `<meta name="twitter:image" content="${image}" />`,
        `<script type="application/ld+json">${json(structuredData(copy))}</script>`,
    ];
    if (meta.lang === 'my') {
        // Same id as i18n.jsx, so the font isn't requested twice.
        tags.push('<link id="font-myanmar" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;600;700&display=swap" />');
    }

    return tags.join('\n        ');
}

function page(copy) {
    const { lang } = copy.meta;
    const replaced = template
        .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
        .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, head(copy))
        .replace('<div id="root"></div>', `<div id="root">${render(lang)}</div>`);
    if (replaced === template || !replaced.includes('rel="canonical"') || replaced.includes('<div id="root"></div>')) {
        throw new Error('index.html is missing the <!--seo--> block or the empty #root it expects.');
    }

    return replaced;
}

for (const copy of langs) {
    const file = path.join(dist, copy.meta.path, 'index.html');
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, page(copy));
    console.log(`prerendered ${copy.meta.path} → ${path.relative(root, file)}`);
}

await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

const alternates = langs.map((copy) => `    <xhtml:link rel="alternate" hreflang="${copy.meta.lang}" href="${urlFor(copy.meta.lang)}" />`).join('\n');
const today = new Date().toISOString().slice(0, 10);
const urls = langs
    .map(
        (copy) =>
            `  <url>\n    <loc>${urlFor(copy.meta.lang)}</loc>\n    <lastmod>${today}</lastmod>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor('en')}" />\n  </url>`,
    )
    .join('\n');
await writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
);
console.log('wrote robots.txt and sitemap.xml');

await rm(serverDir, { recursive: true, force: true });
