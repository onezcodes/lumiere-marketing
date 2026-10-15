import { createContext, useContext, useEffect, useState } from 'react';
import en from './content/en';
import my from './content/my';

export const LANGUAGES = { en, my };
const STORAGE_KEY = 'lumiere-landing-lang';
const LanguageContext = createContext(null);

/** The language a URL is for: `/my/` is Burmese, everything else English. */
export function languageForPath(pathname) {
    return /^\/my(\/|$)/.test(pathname) ? 'my' : 'en';
}

function storedLanguage() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return LANGUAGES[saved] ? saved : null;
    } catch {
        // Storage can be blocked (private mode).
        return null;
    }
}

/**
 * Each language has its own prerendered URL (`/` and `/my/`), so search engines index both.
 * The page starts in its URL's language; the toggle switches in place and updates the URL.
 */
export function LanguageProvider({ initialLang, children }) {
    const [lang, setLang] = useState(() => initialLang ?? languageForPath(window.location.pathname));

    // Someone who chose Burmese before (or whose phone is set to it) and lands on the English
    // address moves to Burmese. A link straight to /my/ is always respected.
    useEffect(() => {
        const saved = storedLanguage();
        const prefersBurmese = saved === 'my' || (!saved && navigator.language?.toLowerCase().startsWith('my'));
        if (lang === 'en' && prefersBurmese) {
            setLang('my');
        }
        // Only on arrival.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const { meta, seo } = LANGUAGES[lang];
        document.documentElement.lang = lang;
        document.title = seo.title;
        document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
        if (window.location.pathname !== meta.path) {
            window.history.replaceState(null, '', meta.path + window.location.search + window.location.hash);
        }
        // The Myanmar font is large: fetch it only for people who read the page in Burmese.
        if (lang === 'my' && !document.getElementById('font-myanmar')) {
            const link = document.createElement('link');
            link.id = 'font-myanmar';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;600;700&display=swap';
            document.head.appendChild(link);
        }
        try {
            window.localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // Not remembering the choice is fine.
        }
    }, [lang]);

    return <LanguageContext.Provider value={{ lang, setLang, copy: LANGUAGES[lang] }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}
