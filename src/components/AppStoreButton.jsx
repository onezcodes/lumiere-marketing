import { site } from '../content/site';
import { useLanguage } from '../i18n';
import AppleLogo from './AppleLogo';

/** The one filled call to action. Says "Coming soon" until `site.appStoreUrl` is set. */
export default function AppStoreButton({ variant = 'primary', compact = false }) {
    const { copy } = useLanguage();
    const live = Boolean(site.appStoreUrl);
    const label = compact ? copy.cta.getApp : live ? copy.cta.appStore : copy.cta.soon;
    const className = `btn btn-${variant}`;

    return live ? (
        <a className={className} href={site.appStoreUrl} target="_blank" rel="noreferrer">
            <AppleLogo />
            {label}
        </a>
    ) : (
        <a className={className} href="#get-app">
            <AppleLogo />
            {label}
        </a>
    );
}
