/**
 * After `vite build`: renders the page once per language into real HTML, so search engines and
 * link previews (Facebook, Viber, Telegram) see the content without running JavaScript.
 *
 *   dist/index.html      English, at /
 *   dist/my/index.html   Burmese, at /my/
 *
 * Each page gets its own title, description, canonical link, hreflang alternates, share image
 * and structured data. robots.txt, sitemap.xml and llms.txt are written from the same site URL.
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const serverDir = path.join(root, 'dist-ssr');

const { render, LANGUAGES } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href);
const { siteUrl, pageUrl, shareImage, hreflang, structuredData, appStoreId, ROBOTS } = await import(pathToFileURL(path.join(root, 'src/seo.js')).href);

const { legalPage } = await import(pathToFileURL(path.join(root, 'src/legal-page.js')).href);
const { pricing, site } = await import(pathToFileURL(path.join(root, 'src/content/site.js')).href);
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const langs = Object.values(LANGUAGES);

const attr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const urlFor = (lang) => pageUrl(LANGUAGES[lang].meta.path);
// JSON inside <script> must not be able to close the tag.
const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

function head(copy) {
    const { meta, seo } = copy;
    const url = urlFor(meta.lang);
    const image = shareImage(meta.lang);
    const tags = [
        `<title>${attr(seo.title)}</title>`,
        `<meta name="description" content="${attr(seo.description)}" />`,
        `<meta name="robots" content="${ROBOTS}" />`,
        `<meta name="application-name" content="Lumière" />`,
        `<link rel="canonical" href="${url}" />`,
        ...langs.map((other) => `<link rel="alternate" hreflang="${hreflang(other.meta.lang)}" href="${urlFor(other.meta.lang)}" />`),
        `<link rel="alternate" hreflang="x-default" href="${urlFor('en')}" />`,
        `<link rel="sitemap" type="application/xml" title="Sitemap" href="${siteUrl}/sitemap.xml" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="Lumière" />`,
        `<meta property="og:title" content="${attr(seo.title)}" />`,
        `<meta property="og:description" content="${attr(seo.shareDescription)}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:image" content="${image}" />`,
        `<meta property="og:image:secure_url" content="${image}" />`,
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
        `<meta name="twitter:image:alt" content="${attr(seo.imageAlt)}" />`,
        `<script type="application/ld+json">${json(structuredData(copy))}</script>`,
    ];
    if (appStoreId()) {
        // Safari on iPhone shows its own "Open / Get" banner for the app.
        tags.push(`<meta name="apple-itunes-app" content="app-id=${appStoreId()}" />`);
    }
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

await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

const alternates = langs.map((copy) => `    <xhtml:link rel="alternate" hreflang="${hreflang(copy.meta.lang)}" href="${urlFor(copy.meta.lang)}" />`).join('\n');
// When the page last changed (its copy, sections or screenshots), not when it was built, so a
// redeploy alone doesn't tell crawlers there is something new. Falls back to today outside git.
function lastChanged() {
    try {
        return execFileSync('git', ['log', '-1', '--format=%cs', '--', 'src', 'public/screens', 'index.html'], { cwd: root, encoding: 'utf8' }).trim() || null;
    } catch {
        return null;
    }
}
const today = lastChanged() ?? new Date().toISOString().slice(0, 10);
const urls = langs
    .map((copy) => {
        const image = shareImage(copy.meta.lang);
        const priority = copy.meta.lang === 'en' ? '1.0' : '0.9';
        return [
            '  <url>',
            `    <loc>${urlFor(copy.meta.lang)}</loc>`,
            `    <lastmod>${today}</lastmod>`,
            '    <changefreq>monthly</changefreq>',
            `    <priority>${priority}</priority>`,
            alternates,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor('en')}" />`,
            '    <image:image>',
            `      <image:loc>${image}</image:loc>`,
            `      <image:title>${attr(copy.seo.imageAlt)}</image:title>`,
            '    </image:image>',
            '  </url>',
        ].join('\n');
    })
    .join('\n');

for (const kind of ['privacy', 'terms']) {
    const file = path.join(dist, kind, 'index.html');
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(
        file,
        legalPage({
            en: LANGUAGES.en,
            my: LANGUAGES.my,
            email: site.supportEmail,
            robots: ROBOTS,
            siteUrl,
            kind,
        }),
    );
    console.log(`wrote /${kind}/`);
}

const legalUrls = ['privacy', 'terms']
    .map(
        (kind) => `  <url>
    <loc>${siteUrl}/${kind}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`,
    )
    .join('\n');

await writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n${legalUrls}\n</urlset>\n`,
);

const en = LANGUAGES.en;
const my = LANGUAGES.my;
const faqLines = (copy) => copy.faq.items.map((item) => `- ${item.q} ${item.a}`).join('\n');
await writeFile(
    path.join(dist, 'llms.txt'),
    `# Lumière

> ${en.seo.description}

Lumière is an iPhone astrology app for people in Myanmar. It includes a monthly reading for each of the 12 signs, a Western birth chart (for life, this year and today, with a life timeline), a personal Destiny Matrix, Mahabote (Myanmar weekday astrology: animal, direction and planet), compatibility for two birthdays, yes-or-no tarot, monthly wallpapers, party games for friends (Who am I? and Now you know me), and real readers you can ask or book. Basic is free; Plus is monthly and new members get 7 days free. Personal readings, bookings and gift cards use credits at ${pricing.mmkPerCredit} MMK each. The site and the app are in Burmese and English.

## Pages

- [English](${urlFor('en')}): ${en.seo.title}
- [Burmese](${urlFor('my')}): ${my.seo.title}

## English

${en.hero.subtitle}

${faqLines(en)}

## မြန်မာ

${my.hero.subtitle}

${faqLines(my)}
`,
);
console.log('wrote robots.txt, sitemap.xml and llms.txt');

await rm(serverDir, { recursive: true, force: true });
