function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Privacy or terms, in English and Burmese, as one HTML document. */
export function legalPage({ en, my, email, robots, siteUrl, kind }) {
    const safeEmail = escapeAttr(email);
    const htmlText = (value) => escapeAttr(value).replaceAll(safeEmail, `<a href="mailto:${safeEmail}">${safeEmail}</a>`);
    const article = (copy, lang) => {
        const block = copy.legal[kind];
        return `<article id="${lang}" lang="${lang}">
            <p class="legal-lang">${lang === 'en' ? 'English' : 'မြန်မာ'}</p>
            <h1>${escapeAttr(block.title)}</h1>
            ${block.paragraphs.map((paragraph) => `<p>${htmlText(paragraph)}</p>`).join('\n            ')}
        </article>`;
    };
    const other = kind === 'privacy' ? 'terms' : 'privacy';

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeAttr(en.legal[kind].title)} · Lumière</title>
    <meta name="description" content="${escapeAttr(en.legal[kind].paragraphs[0])}" />
    <meta name="robots" content="${escapeAttr(robots)}" />
    <link rel="canonical" href="${siteUrl}/${kind}/" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700&amp;family=Noto+Sans+Myanmar:wght@400;600;700&amp;display=swap" />
    <style>
        :root { color-scheme: light dark; }
        body { margin: 0; background: #fff; color: #42273b; font-family: Figtree, sans-serif; font-size: 17px; line-height: 1.6; }
        header, main { width: min(680px, calc(100% - 40px)); margin: 0 auto; }
        header { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 28px 0; }
        header a { color: inherit; font-weight: 700; text-decoration: none; }
        nav { display: flex; flex-wrap: wrap; gap: 14px; font-size: 14px; }
        nav a { color: #70566d; }
        h1 { font-size: clamp(32px, 5vw, 40px); line-height: 1.2; margin: 0 0 16px; }
        article + article { margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(66, 39, 59, 0.15); }
        article[lang='my'] { font-family: Figtree, 'Noto Sans Myanmar', sans-serif; line-height: 1.85; }
        p { margin: 0 0 14px; }
        a { color: #42273b; }
        .legal-lang { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #70566d; }
        article[lang='my'] .legal-lang { letter-spacing: 0; text-transform: none; font-size: 14px; }
        footer { padding: 8px 0 64px; color: #70566d; font-size: 14px; }
        @media (prefers-color-scheme: dark) {
            body { background: #150d13; color: #f2e9ef; }
            header > a, main a { color: #f2e9ef; }
            nav a, .legal-lang, footer { color: #b39cad; }
            article + article { border-top-color: rgba(242, 233, 239, 0.16); }
        }
    </style>
</head>
<body>
    <header>
        <a href="/">${escapeAttr(en.legal.back)}</a>
        <nav>
            <a href="#en">English</a>
            <a href="#my">မြန်မာ</a>
            <a href="/${other}/">${escapeAttr(en.legal[other].title)}</a>
        </nav>
    </header>
    <main>
        ${article(en, 'en')}
        ${article(my, 'my')}
        <footer><a href="/">English</a> · <a href="/my/">မြန်မာ</a></footer>
    </main>
</body>
</html>
`;
}
