import Phrase from './Phrase';
import { useEffect, useState } from 'react';
import { DARK_SCREENS } from '../data/screens';
import { useTheme } from '../theme';
import { useLanguage } from '../i18n';
import Icon from './Icon';

/**
 * An iPhone outline drawn in CSS around a real app screenshot: public/screens/<screen>-360.webp
 * and -720.webp (made by `npm run screens`), so phones fetch the small one.
 * Until the file exists, a branded placeholder names the screen instead.
 */
export default function PhoneFrame({ screen, alt, className = '', eager = false, base, sizes = [360, 720] }) {
    const { copy } = useLanguage();
    const [missing, setMissing] = useState(false);
    const { theme } = useTheme();
    const path = base ?? (theme === 'dark' && DARK_SCREENS.has(screen) ? `/screens/dark/${screen}` : `/screens/${screen}`);

    // A new picture (theme switched) gets a fresh try before falling back to the placeholder.
    useEffect(() => setMissing(false), [path]);
    const [small, large] = sizes;

    return (
        <div className={`phone ${className}`}>
            <div className="phone-screen">
                {missing ? (
                    <div className="phone-placeholder" role="img" aria-label={alt}>
                        <img src="/brand/lumiere-mark.svg" alt="" width="56" height="56" />
                        <span className="phone-placeholder-name">
                            <Phrase text={alt} />
                        </span>
                        <span className="phone-placeholder-note">
                            <Icon name="sparkle" size={14} filled /> {copy.phone.placeholder}
                        </span>
                    </div>
                ) : (
                    <img
                        key={path}
                        src={`${path}-${small}.webp`}
                        srcSet={`${path}-${small}.webp ${small}w, ${path}-${large}.webp ${large}w`}
                        sizes="(max-width: 600px) 200px, 300px"
                        width="360"
                        height="782"
                        alt={alt}
                        loading={eager ? 'eager' : 'lazy'}
                        {...(eager ? { fetchpriority: 'high' } : {})}
                        decoding="async"
                        onError={() => setMissing(true)}
                    />
                )}
                {missing && <span className="phone-island" aria-hidden="true" />}
            </div>
        </div>
    );
}
