import Phrase from './Phrase';
import { site } from '../content/site';
import { useLanguage } from '../i18n';
import LanguageToggle from './LanguageToggle';
import { ThemeChoice } from './ThemeToggle';

export default function Footer() {
    const { footer } = useLanguage().copy;

    return (
        <footer className="footer on-plum">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <img src="/brand/lumiere-L-wordmark-on-dark.svg" alt="Lumière" width="140" height="32" />
                    <p>
                        <Phrase text={footer.tagline} />
                    </p>
                </div>
                <nav className="footer-links" aria-label="Footer">
                    <a href={site.privacyUrl}>{footer.privacy}</a>
                    <a href={site.termsUrl}>{footer.terms}</a>
                    <a href={`mailto:${site.supportEmail}`}>{footer.support}</a>
                </nav>
                <div className="footer-toggles">
                    <ThemeChoice />
                    <LanguageToggle tone="dark" />
                </div>
            </div>
            <div className="container">
                <div className="footer-bottom">
                    <span>
                        © {new Date().getFullYear()} Lumière. {footer.rights}
                    </span>
                    <a href={site.poweredByUrl} target="_blank" rel="noreferrer" className="footer-powered">
                        <img src="/brand/powered-by-onezcodes-dark.webp" alt={footer.poweredBy} width="110" height="56" loading="lazy" decoding="async" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
