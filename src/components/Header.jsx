import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n';
import AppStoreButton from './AppStoreButton';
import Icon from './Icon';
import LanguageToggle from './LanguageToggle';
import { ThemeButton } from './ThemeToggle';

export default function Header() {
    const { copy } = useLanguage();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const links = [
        ['#features', copy.nav.features],
        ['#wallpapers', copy.nav.wallpapers],
        ['#tarot', copy.nav.tarot],
        ['#guide', copy.nav.guide],
        ['#readers', copy.nav.readers],
        ['#faq', copy.nav.faq],
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onKey = (event) => event.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <header className={`header ${scrolled || open ? 'is-scrolled' : 'is-top'}`}>
            <div className="container header-inner">
                <a href="#top" className="header-logo" aria-label="Lumière">
                    <img src="/brand/lumiere-L-wordmark.svg" alt="Lumière" width="132" height="30" className="logo-light" />
                    <img src="/brand/lumiere-L-wordmark-on-dark.svg" alt="" width="132" height="30" className="logo-dark" />
                </a>
                <nav className="header-nav" aria-label="Main">
                    {links.map(([href, label]) => (
                        <a key={href} href={href}>
                            {label}
                        </a>
                    ))}
                </nav>
                <div className="header-actions">
                    <LanguageToggle />
                    <ThemeButton />
                    <button type="button" className="header-menu-btn" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
                        <Icon name={open ? 'close' : 'menu'} />
                        <span className="visually-hidden">{open ? copy.nav.close : copy.nav.menu}</span>
                    </button>
                </div>
            </div>
            <nav id="mobile-nav" className={`mobile-nav ${open ? 'is-open' : ''}`} aria-label="Main" hidden={!open}>
                {links.map(([href, label]) => (
                    <a key={href} href={href} onClick={() => setOpen(false)}>
                        {label}
                    </a>
                ))}
                <AppStoreButton />
            </nav>
        </header>
    );
}
