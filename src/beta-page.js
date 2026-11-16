function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const TESTFLIGHT_APP = 'https://apps.apple.com/app/testflight/id899247664';

/** The "What is Lumière?" card, the steps and the small print, shared by both beta pages. */
function details(copy, beta, htmlText, small) {
    return `<a class="about" href="${escapeAttr(copy.meta.path)}">
                <span class="about-text"><strong>${escapeAttr(beta.about)}</strong><span>${escapeAttr(beta.aboutNote)}</span><span class="about-link">${escapeAttr(beta.aboutLink)}</span></span>
                <span class="about-arrow" aria-hidden="true">→</span>
            </a>
            <h2>${escapeAttr(beta.stepsTitle)}</h2>
            <ol>
                ${beta.steps.map((step) => `<li>${escapeAttr(step)}</li>`).join('\n                ')}
            </ol>
            ${small.map((line) => `<p class="small">${htmlText(line)}</p>`).join('\n            ')}`;
}

/**
 * The TestFlight install page at /beta/, in English and Burmese, as one HTML document. Without
 * `testFlightUrl` the button reads "Opening soon". Kept out of search results (noindex): the
 * link is for people we send there, not a store page.
 */
export function betaPage({ en, my, email, siteUrl, testFlightUrl }) {
    const section = (copy, lang, htmlText) => {
        const beta = copy.beta;
        // Two numbered buttons in order: get TestFlight first, then install Lumière through it.
        const getTestFlight = `<a class="install is-first" href="${TESTFLIGHT_APP}"><span class="num">1</span>${escapeAttr(beta.testFlight)}</a>
            <p class="aside">${escapeAttr(beta.testFlightNote)}</p>`;
        const action = testFlightUrl
            ? `${getTestFlight}
            <a class="install" href="${escapeAttr(testFlightUrl)}"><span class="num">2</span>${escapeAttr(beta.button)}</a>
            <p class="desktop">${escapeAttr(beta.desktop)}</p>`
            : `${getTestFlight}
            <span class="install is-soon" aria-disabled="true"><span class="num">2</span>${escapeAttr(beta.soon)}</span>
            <p class="note">${escapeAttr(beta.soonNote)}</p>`;
        return `<section id="${lang}" lang="${lang}" data-lang="${lang}">
            <h1>${escapeAttr(beta.title)}</h1>
            <p class="intro">${escapeAttr(beta.intro)}</p>
            ${action}
            <p class="needs">${escapeAttr(beta.needs)}</p>
            ${details(copy, beta, htmlText, [beta.feedback, beta.expiry])}
        </section>`;
    };
    return shell({
        en,
        my,
        email,
        siteUrl,
        path: '/beta/',
        copyKey: 'beta',
        imageAlt: 'Lumière, Myanmar astrology on iPhone',
        // Anything that isn't an iPhone or iPad (iPadOS reports itself as a Mac with touch).
        notTarget: "!/iPhone|iPad|iPod/.test(navigator.userAgent) && !(navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent))",
        section,
    });
}

/**
 * The Android test page at /android-beta/: one button that downloads the APK, then how to let
 * Android install it. The APK is too big for the site's own static files, so it lives elsewhere
 * (`apkUrl`); without it the button reads "Opening soon". Noindex, like /beta/.
 */
export function androidBetaPage({ en, my, email, siteUrl, apkUrl, apkVersion, apkSize }) {
    const section = (copy, lang, htmlText) => {
        const beta = copy.androidBeta;
        const meta = [apkVersion && beta.version.replace('{version}', apkVersion), apkSize].filter(Boolean).join(' · ');
        const action = apkUrl
            ? `<a class="install" href="${escapeAttr(apkUrl)}" download><span class="install-text">${escapeAttr(beta.button)}${meta ? `<span class="install-meta">${escapeAttr(meta)}</span>` : ''}</span></a>
            <p class="desktop">${escapeAttr(beta.desktop)}</p>`
            : `<span class="install is-soon" aria-disabled="true">${escapeAttr(beta.soon)}</span>
            <p class="note">${escapeAttr(beta.soonNote)}</p>`;
        return `<section id="${lang}" lang="${lang}" data-lang="${lang}">
            <h1>${escapeAttr(beta.title)}</h1>
            <p class="intro">${escapeAttr(beta.intro)}</p>
            ${action}
            <p class="needs">${escapeAttr(beta.needs)}</p>
            ${details(copy, beta, htmlText, [beta.updates, beta.feedback, beta.safety])}
        </section>`;
    };
    return shell({
        en,
        my,
        email,
        siteUrl,
        path: '/android-beta/',
        copyKey: 'androidBeta',
        imageAlt: 'Lumière, Myanmar astrology app',
        notTarget: '!/Android/i.test(navigator.userAgent)',
        section,
    });
}

/** The document both beta pages share: header with the language switch, both languages, footer. */
function shell({ en, my, email, siteUrl, path, copyKey, imageAlt, notTarget, section }) {
    const safeEmail = escapeAttr(email);
    const htmlText = (value) => escapeAttr(value).replaceAll(safeEmail, `<a href="mailto:${safeEmail}">${safeEmail}</a>`);
    const title = `${escapeAttr(en[copyKey].title)} · Lumière`;
    const description = escapeAttr(en[copyKey].intro);
    return `<!doctype html>
<html lang="my">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="noindex, follow" />
    <meta name="theme-color" content="#2d1b29" />
    <link rel="canonical" href="${siteUrl}${path}" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Lumière" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${siteUrl}${path}" />
    <meta property="og:image" content="${siteUrl}/og/share-en.jpg" />
    <meta property="og:image:secure_url" content="${siteUrl}/og/share-en.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${imageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${siteUrl}/og/share-en.jpg" />
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
        .about { display: flex; align-items: center; gap: 16px; margin: 28px 0 8px; padding: 16px 18px; border: 1.5px solid #9ee493; border-radius: 16px; background: rgba(158, 228, 147, 0.08); color: #f2e9ef; text-decoration: none; }
        .about:hover { background: rgba(158, 228, 147, 0.14); }
        .about:active { transform: scale(0.98); }
        .about-text { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
        .about-text strong { font-size: 19px; }
        .about-text span { color: #e3d6df; font-size: 15px; }
        .about-text .about-link { color: #9ee493; font-weight: 600; }
        .about-arrow { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: #9ee493; color: #2d1b29; font-size: 20px; font-weight: 700; }
        .install { display: flex; align-items: center; justify-content: center; gap: 12px; text-align: center; margin: 24px 0 10px; padding: 16px 20px; border-radius: 16px; background: #9ee493; color: #2d1b29; font-weight: 700; font-size: 18px; text-decoration: none; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3); }
        .install:active { transform: scale(0.98); }
        .install.is-first { background: #f2e9ef; margin-top: 28px; }
        .install-text { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .install-meta { font-size: 14px; font-weight: 600; opacity: 0.7; }
        .num { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: #2d1b29; color: #f2e9ef; font-size: 16px; }
        .is-soon .num { background: rgba(242, 233, 239, 0.16); color: #b39cad; }
        .aside { text-align: center; }
        .install.is-soon { background: rgba(242, 233, 239, 0.12); color: #b39cad; box-shadow: none; }
        .note, .needs, .desktop, .small, .aside { color: #b39cad; font-size: 15px; }
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
            if (${notTarget}) {
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
        ${section(my, 'my', htmlText)}
        ${section(en, 'en', htmlText)}
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
