import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { LANGUAGES } from './i18n';

export { LANGUAGES };

/** The page's HTML in one language, for scripts/prerender.mjs. */
export function render(lang) {
    return renderToString(
        <StrictMode>
            <App initialLang={lang} />
        </StrictMode>,
    );
}
