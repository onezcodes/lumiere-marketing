import { LANGUAGES, useLanguage } from '../i18n';

export default function LanguageToggle({ tone = 'light' }) {
    const { lang, setLang } = useLanguage();

    return (
        <div className={`lang-toggle lang-toggle-${tone}`} role="group" aria-label="Language">
            {Object.values(LANGUAGES).map(({ meta }) => (
                <button key={meta.lang} type="button" lang={meta.lang} aria-pressed={lang === meta.lang} onClick={() => setLang(meta.lang)}>
                    {meta.short}
                </button>
            ))}
        </div>
    );
}
