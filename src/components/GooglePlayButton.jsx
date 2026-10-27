import { site } from '../content/site';
import { useLanguage } from '../i18n';

/** The Android call to action. Says "Coming soon" until `site.playStoreUrl` is set. */
export default function GooglePlayButton({ variant = 'ghost' }) {
    const { copy } = useLanguage();
    const live = Boolean(site.playStoreUrl);
    const className = `btn btn-${variant}`;
    const icon = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.5 2.8c-.3.2-.5.6-.5 1.1v16.2c0 .5.2.9.5 1.1l9.1-9.2-9.1-9.2Zm10.5 7.8 2.6-2.6L6.4 1.6l8.6 9Zm4.1-1.8-3 1.7-2.8 2.8 2.8 2.8 3-1.7c1.1-.6 1.1-2.4 0-3.6Zm-4.1 4.6-8.6 9 11.2-6.4-2.6-2.6Z" />
        </svg>
    );

    return live ? (
        <a className={className} href={site.playStoreUrl} target="_blank" rel="noreferrer">
            {icon}
            {copy.cta.playStore}
        </a>
    ) : (
        <a className={className} href="#get-app">
            {icon}
            {copy.cta.playSoon}
        </a>
    );
}
