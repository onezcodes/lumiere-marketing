function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const TESTFLIGHT_APP = 'https://apps.apple.com/app/testflight/id899247664';

/**
 * The TestFlight install page at /beta/, in English and Burmese, as one HTML document. Without
 * `testFlightUrl` the button reads "Opening soon". Kept out of search results (noindex): the
 * link is for people we send there, not a store page.
 */
export function betaPage({ en, my, email, siteUrl, testFlightUrl }) {
    const safeEmail = escapeAttr(email);
    const htmlText = (value) => escapeAttr(value).replaceAll(safeEmail, `<a href="mailto:${safeEmail}">${safeEmail}</a>`);
    const section = (copy, lang) => {
        const beta = copy.beta;
        const action = testFlightUrl
            ? `<a class="install" href="${escapeAttr(testFlightUrl)}">${escapeAttr(beta.button)}</a>
            <p class="desktop">${escapeAttr(beta.desktop)}</p>`
            : `<span class="install is-soon" aria-disabled="true">${escapeAttr(beta.soon)}</span>
            <p class="note">${escapeAttr(beta.soonNote)}</p>`;
        return `<section id="${lang}" lang="${lang}" data-lang="${lang}">
            <h1>${escapeAttr(beta.title)}</h1>
            <p class="intro">${escapeAttr(beta.intro)}</p>
            ${action}
            <p class="needs">${escapeAttr(beta.needs)}</p>
            <h2>${escapeAttr(beta.stepsTitle)}</h2>
            <ol>
                ${beta.steps.map((step) => `<li>${escapeAttr(step)}</li>`).join('\n                ')}
            </ol>
            <p><a href="${TESTFLIGHT_APP}">${escapeAttr(beta.testFlight)}</a></p>
            <p class="small">${htmlText(beta.feedback)}</p>
            <p class="small">${escapeAttr(beta.expiry)}</p>
        </section>`;
    };

    return `<!doctype html>
<html lang="my">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${escapeAttr(en.beta.title)} · Lumière</title>
    <meta name="description" content="${escapeAttr(en.beta.intro)}" />
    <meta name="robots" content="noindex, follow" />
    <meta name="theme-color" content="#2d1b29" />
    <link rel="canonical" href="${siteUrl}/beta/" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta property="og:title" content="${escapeAttr(en.beta.title)} · Lumière" />
    <meta property="og:description" content="${escapeAttr(en.beta.intro)}" />
    <meta property="og:url" content="${siteUrl}/beta/" />
    <meta property="og:image" content="${siteUrl}/og/share-en.jpg" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700&amp;family=Noto+Sans+Myanmar:wght@400;600;700&amp;display=swap" />
    <style>
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; min-height: 100vh; background: radial-gradient(120% 70% at 50% 0%, #4a2c42 0%, #2d1b29 55%, #150d13 100%) fixed; color: #f2e9ef; font-family: Figtree, -apple-system, sans-serif; font-size: 17px; line-height: 1.6; }
        header, main { width: min(560px, calc(100% - 32px)); margin: 0 auto; }
        header { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 24px 0 8px; }
        header img { display: block; height: 32px; width: auto; }
        nav { display: flex; gap: 6px; }
        nav button { font: inherit; font-size: 14px; color: #b39cad; background: transparent; border: 1px solid rgba(242, 233, 239, 0.16); border-radius: 999px; padding: 6px 12px; cursor: pointer; }
        nav button[aria-pressed='true'] { color: #2d1b29; background: #daf7dc; border-color: #daf7dc; }
        main { padding: 24px 0 64px; }
        .mark { display: block; width: 88px; height: 88px; margin: 24px 0 20px; border-radius: 22px; }
        h1 { font-size: clamp(30px, 8vw, 40px); line-height: 1.2; margin: 0 0 12px; }
        h2 { font-size: 18px; margin: 36px 0 8px; }
        p { margin: 0 0 14px; }
        a { color: #9ee493; }
        .intro { color: #e3d6df; }
        .install { display: block; text-align: center; margin: 24px 0 10px; padding: 16px 20px; border-radius: 16px; background: #9ee493; color: #2d1b29; font-weight: 700; font-size: 18px; text-decoration: none; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3); }
        .install:active { transform: scale(0.98); }
        .install.is-soon { background: rgba(242, 233, 239, 0.12); color: #b39cad; box-shadow: none; }
        .note, .needs, .desktop, .small { color: #b39cad; font-size: 15px; }
        .desktop { display: none; }
        .is-desktop .desktop { display: block; }
        ol { margin: 0 0 18px; padding-left: 22px; }
        li { margin-bottom: 10px; }
        section[lang='my'] { font-family: Figtree, 'Noto Sans Myanmar', sans-serif; line-height: 1.85; }
        section[hidden] { display: none; }
        footer { padding: 8px 0 48px; color: #b39cad; font-size: 14px; }
        footer a { color: #b39cad; }
    </style>
    <script>
        (function () {
            var lang = 'my';
            try {
                var saved = localStorage.getItem('lumiere-landing-lang');
                if (saved === 'en' || saved === 'my') lang = saved;
                else if (!/^my/i.test(navigator.language || '')) lang = 'en';
            } catch (e) {}
            document.documentElement.lang = lang;
            if (!/iPhone|iPad|iPod/.test(navigator.userAgent) && !(navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent))) {
                document.documentElement.className = 'is-desktop';
            }
        })();
    </script>
</head>
<body>
    <header>
        <a href="/"><img src="/brand/lumiere-L-wordmark-on-dark.svg" alt="Lumière" /></a>
        <nav aria-label="Language">
            <button type="button" data-set="my">မြန်မာ</button>
            <button type="button" data-set="en">English</button>
        </nav>
    </header>
    <main>
        <img class="mark" src="/apple-touch-icon.png" alt="" />
        ${section(my, 'my')}
        ${section(en, 'en')}
        <footer><a href="/app-privacy/">App privacy</a> · <a href="/terms/">Terms</a> · <a href="/">lumiere.onezcodes.com</a></footer>
    </main>
    <script>
        (function () {
            function show(lang) {
                document.documentElement.lang = lang;
                document.querySelectorAll('section[data-lang]').forEach(function (s) { s.hidden = s.getAttribute('data-lang') !== lang; });
                document.querySelectorAll('nav button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === lang)); });
            }
            document.querySelectorAll('nav button').forEach(function (b) {
                b.addEventListener('click', function () {
                    var lang = b.getAttribute('data-set');
                    try { localStorage.setItem('lumiere-landing-lang', lang); } catch (e) {}
                    show(lang);
                });
            });
            show(document.documentElement.lang === 'en' ? 'en' : 'my');
        })();
    </script>
</body>
</html>
`;
}
