import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import Icon from './Icon';
import PhoneFrame from './PhoneFrame';
import Phrase from './Phrase';
import Reveal from './Reveal';

/** Real exports from the app's wallpaper sheet (lock and home screen), in `public/wallpapers`. */
const STYLES = ['talisman', 'bloom', 'arch', 'lotus', 'pagoda', 'lanterns', 'festival', 'calendar', 'year', 'tarot'];
const HAS_HOME = new Set(STYLES.filter((style) => style !== 'talisman'));
const ADVANCE_MS = 3200;

const base = (style, screen) => `/wallpapers/${style}-${screen === 'home' && HAS_HOME.has(style) ? 'home' : 'lock'}`;

/**
 * The monthly wallpaper, shown the way the app previews it: the lock screen large, the home
 * screen beside it. It cycles through styles while on screen until someone picks one.
 */
export default function Wallpapers() {
    const { copy } = useLanguage();
    const text = copy.wallpapers;
    const [active, setActive] = useState(0);
    const [auto, setAuto] = useState(true);
    const sectionRef = useRef(null);
    const chipsRef = useRef(null);
    const style = STYLES[active];

    useEffect(() => {
        const node = sectionRef.current;
        if (!auto || !node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }
        let timer = null;
        const observer = new IntersectionObserver(([entry]) => {
            window.clearInterval(timer);
            if (entry.isIntersecting) {
                timer = window.setInterval(() => setActive((index) => (index + 1) % STYLES.length), ADVANCE_MS);
            }
        });
        observer.observe(node);

        return () => {
            observer.disconnect();
            window.clearInterval(timer);
        };
    }, [auto]);

    // Keep the chosen chip in view on phones, where the chips scroll sideways.
    useEffect(() => {
        const chip = chipsRef.current?.children[active];
        const row = chipsRef.current;
        if (chip && row && row.scrollWidth > row.clientWidth) {
            row.scrollTo({ left: chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' });
        }
    }, [active]);

    // Fetch the next pair ahead, so the crossfade never waits on the network.
    useEffect(() => {
        const next = STYLES[(active + 1) % STYLES.length];
        ['lock', 'home'].forEach((screen) => {
            const image = new Image();
            image.src = `${base(next, screen)}-360.webp`;
        });
    }, [active]);

    const pick = (index) => {
        setAuto(false);
        setActive(index);
    };

    return (
        <section ref={sectionRef} id="wallpapers" className="wallpapers on-plum" aria-labelledby="wallpapers-title">
            <div className="wallpapers-glow" aria-hidden="true" />
            <div className="container wallpapers-inner">
                <div className="wallpapers-copy">
                    <span className="eyebrow">{text.eyebrow}</span>
                    <h2 id="wallpapers-title" className="h2">
                        <Phrase text={text.title} />
                    </h2>
                    <p className="lead">
                        <Phrase text={text.intro} />
                    </p>

                    <p className="wallpapers-pick">{text.styleLabel}</p>
                    <div ref={chipsRef} className="wallpapers-chips" role="tablist" aria-label={text.styleLabel}>
                        {STYLES.map((key, index) => (
                            <button key={key} type="button" role="tab" aria-selected={index === active} className="wallpapers-chip" onClick={() => pick(index)}>
                                {text.styles[key]}
                            </button>
                        ))}
                    </div>
                    {auto && (
                        <div className="wallpapers-progress" aria-hidden="true">
                            <span key={active} style={{ animationDuration: `${ADVANCE_MS}ms` }} />
                        </div>
                    )}
                </div>

                <div className="wallpapers-stage" role="tabpanel" aria-live="polite">
                    <div className="wallpapers-phone wallpapers-phone-home">
                        <PhoneFrame key={`${style}-home`} base={base(style, 'home')} sizes={[360, 640]} alt={`${text.styles[style]} · ${text.home}`} />
                        <span className="wallpapers-label">{text.home}</span>
                    </div>
                    <div className="wallpapers-phone wallpapers-phone-lock">
                        <PhoneFrame key={`${style}-lock`} base={base(style, 'lock')} sizes={[360, 640]} alt={`${text.styles[style]} · ${text.lock}`} />
                        <span className="wallpapers-label">{text.lock}</span>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="wallpapers-points">
                    {text.points.map((point, index) => (
                        <Reveal key={point.title} className="wallpapers-point" delay={index * 70}>
                            <span className="feature-icon">
                                <Icon name={point.icon} />
                            </span>
                            <h3 className="feature-title">
                                <Phrase text={point.title} />
                            </h3>
                            <p className="feature-body">
                                <Phrase text={point.body} />
                            </p>
                        </Reveal>
                    ))}
                </div>
                <p className="wallpapers-plus">
                    <Icon name="sparkle" size={16} filled />
                    <span>
                        <Phrase text={text.plus} />
                    </span>
                </p>
            </div>

            <div className="wallpapers-strip" aria-hidden="true">
                <div className="wallpapers-strip-track">
                    {[...STYLES, ...STYLES].map((key, index) => (
                        <img key={`${key}-${index}`} src={`/wallpapers/${key}-lock-360.webp`} alt="" width="120" height="260" loading="lazy" decoding="async" />
                    ))}
                </div>
            </div>
        </section>
    );
}
