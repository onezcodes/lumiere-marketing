import { SIGNS, glyph } from '../data/zodiac';
import { useLanguage } from '../i18n';
import Phrase from './Phrase';
import AppStoreButton from './AppStoreButton';
import GooglePlayButton from './GooglePlayButton';
import Icon from './Icon';
import PhoneFrame from './PhoneFrame';
import Starfield from './art/Starfield';
import ZodiacWheel from './art/ZodiacWheel';

function SignMarquee() {
    const { lang } = useLanguage();
    const items = [...SIGNS, ...SIGNS];

    return (
        <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
                {items.map((sign, index) => (
                    <span key={`${sign.slug}-${index}`} className={`marquee-item element-${sign.element}`}>
                        <span className="marquee-glyph">{glyph(sign)}</span>
                        {lang === 'my' ? sign.my : sign.name}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function Hero() {
    const { copy, lang } = useLanguage();
    const { hero } = copy;

    return (
        <section id="top" className="hero on-plum">
            <div className="hero-aurora" aria-hidden="true" />
            <Starfield />
            <div className="container hero-grid">
                <div className="hero-copy">
                    <span className="hero-eyebrow">
                        <Icon name="sparkle" size={14} filled /> {hero.eyebrow}
                    </span>
                    <h1 className="hero-title">
                        <Phrase text={hero.title} />
                    </h1>
                    <p className="hero-subtitle">
                        <Phrase text={hero.subtitle} />
                    </p>
                    <div className="hero-actions">
                        <AppStoreButton variant="spring" />
                        <GooglePlayButton />
                        <a className="btn btn-ghost" href="#tarot">
                            <Icon name="cards" size={20} /> {copy.tarot.title}
                        </a>
                    </div>
                    <ul className="hero-badges">
                        {hero.badges.map((badge) => (
                            <li key={badge}>
                                <Icon name="check" size={16} />{' '}
                                <span>
                                    <Phrase text={badge} />
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hero-visual">
                    <ZodiacWheel className="hero-wheel" />
                    <PhoneFrame screen="home" alt={lang === 'my' ? 'Lumière ပင်မစာမျက်နှာ' : 'Lumière home screen'} className="hero-phone hero-phone-back" eager />
                    <PhoneFrame screen="my-reading" alt={lang === 'my' ? 'Lumière လစဉ်ဟောစာတမ်း' : 'Lumière monthly reading'} className="hero-phone hero-phone-front" eager />
                    <span className="glass-chip glass-chip-1">
                        <span className="glass-dot" style={{ background: 'var(--air)' }} />
                        <span>{hero.floats.reading}</span>
                    </span>
                    <span className="glass-chip glass-chip-2">
                        <Icon name="cards" size={16} />
                        {hero.floats.tarot}
                    </span>
                    <span className="glass-chip glass-chip-3">
                        <Icon name="compass" size={16} />
                        {hero.floats.mahabote}
                    </span>
                </div>
            </div>
            <SignMarquee />
        </section>
    );
}
