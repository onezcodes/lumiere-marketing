import { LANGUAGES, useLanguage } from '../i18n';
import { hreflang } from '../seo';

export default function LanguageToggle({ tone = 'light' }) {
    const { lang, setLang } = useLanguage();

    return (
        <div className={`lang-toggle lang-toggle-${tone}`} role="group" aria-label="Language">
            {Object.values(LANGUAGES).map(({ meta }) => (
                <a
                    key={meta.lang}
                    href={meta.path}
                    lang={meta.lang}
                    hrefLang={hreflang(meta.lang)}
                    aria-current={lang === meta.lang ? 'page' : undefined}
                    onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                        event.preventDefault();
                        setLang(meta.lang);
                    }}
                >
                    {meta.short}
                </a>
            ))}
        </div>
    );
}
