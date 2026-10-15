import { createContext, useContext, useEffect, useState } from 'react';
import en from './content/en';
import my from './content/my';

export const LANGUAGES = { en, my };
const STORAGE_KEY = 'lumiere-landing-lang';
const LanguageContext = createContext(null);

function initialLanguage() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved && LANGUAGES[saved]) {
            return saved;
        }
    } catch {
        // Storage can be blocked (private mode); fall back to the browser language.
    }

    return navigator.language?.toLowerCase().startsWith('my') ? 'my' : 'en';
}

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(initialLanguage);

    useEffect(() => {
        document.documentElement.lang = lang;
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
