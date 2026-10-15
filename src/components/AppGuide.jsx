import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import Phrase from './Phrase';
import Icon from './Icon';
import PhoneFrame from './PhoneFrame';

/**
 * The walkthrough: a numbered list of steps beside one phone on wide screens; on phones the
 * same steps become a swipeable row of cards, each with its own screenshot.
 */
/**
 * Whether the phone layout applies, so only one layout (and its screenshots) is rendered.
 * Starts wide, like the prerendered HTML, and checks the screen once mounted.
 */
function useNarrow(query = '(max-width: 820px)') {
    const [narrow, setNarrow] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        const onChange = () => setNarrow(media.matches);
        onChange();
        media.addEventListener('change', onChange);

        return () => media.removeEventListener('change', onChange);
    }, [query]);

    return narrow;
}

export default function AppGuide() {
    const { guide } = useLanguage().copy;
    const narrow = useNarrow();
    const [active, setActive] = useState(0);
    const trackRef = useRef(null);
    const current = guide.items[active];
    const last = guide.items.length - 1;

    const go = (index) => {
        const next = Math.max(0, Math.min(last, index));
        setActive(next);
        const track = trackRef.current;
        const card = track?.children[next];
        if (card && track.scrollWidth > track.clientWidth) {
            track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const track = trackRef.current;
        if (!track) {
            return undefined;
        }
        const onScroll = () => {
            const width = track.children[0]?.getBoundingClientRect().width ?? 1;
            setActive(Math.round(track.scrollLeft / (width + 16)));
        };
        track.addEventListener('scroll', onScroll, { passive: true });

        return () => track.removeEventListener('scroll', onScroll);
    }, [narrow]);

    return (
        <section id="guide" className="section section-tint" aria-labelledby="guide-title">
            <div className="container">
                <div className="section-head">
                    <span className="eyebrow">
                        <Phrase text={guide.eyebrow} />
                    </span>
                    <h2 id="guide-title" className="h2">
                        <Phrase text={guide.title} />
                    </h2>
                    <p className="lead">
                        <Phrase text={guide.intro} />
                    </p>
                </div>

                {!narrow && (
                    <div className="guide-desktop">
                        <ol className="guide-list" role="tablist" aria-orientation="vertical" aria-label={guide.title}>
                            {guide.items.map((item, index) => (
                                <li key={item.screen} role="presentation">
                                    <button
                                        type="button"
                                        role="tab"
                                        id={`guide-tab-${index}`}
                                        aria-selected={index === active}
                                        aria-controls="guide-panel"
                                        className={`guide-item ${index === active ? 'is-active' : ''}`}
                                        onClick={() => setActive(index)}
                                    >
                                        <span className="guide-number">{String(index + 1).padStart(2, '0')}</span>
                                        <span>
                                            <span className="guide-item-title">
                                                <Phrase text={item.title} />
                                            </span>
                                            {index === active && (
                                                <span className="guide-item-body">
                                                    <Phrase text={item.body} />
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ol>
                        <div id="guide-panel" role="tabpanel" aria-labelledby={`guide-tab-${active}`} className="guide-stage">
                            <span className="guide-stage-glow" aria-hidden="true" />
                            <PhoneFrame key={current.screen} screen={current.screen} alt={current.title} className="guide-phone" />
                            <div className="guide-controls">
                                <button type="button" className="icon-btn" onClick={() => go(active - 1)} disabled={active === 0}>
                                    <Icon name="arrowLeft" />
                                    <span className="visually-hidden">
                                        <Phrase text={guide.previous} />
                                    </span>
                                </button>
                                <span className="guide-count">
                                    {guide.step} {active + 1} / {guide.items.length}
                                </span>
                                <button type="button" className="icon-btn" onClick={() => go(active + 1)} disabled={active === last}>
                                    <Icon name="arrowRight" />
                                    <span className="visually-hidden">
                                        <Phrase text={guide.next} />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {narrow && (
                    <div className="guide-mobile">
                        <ol ref={trackRef} className="guide-track" aria-label={guide.title}>
                            {guide.items.map((item, index) => (
                                <li key={item.screen} className="guide-card">
                                    <PhoneFrame screen={item.screen} alt={item.title} className="guide-card-phone" />
                                    <span className="guide-number">
                                        {guide.step} {index + 1}
                                    </span>
                                    <h3 className="guide-item-title">
                                        <Phrase text={item.title} />
                                    </h3>
                                    <p className="guide-item-body">
                                        <Phrase text={item.body} />
                                    </p>
                                </li>
                            ))}
                        </ol>
                        <div className="guide-dots">
                            {guide.items.map((item, index) => (
                                <button key={item.screen} type="button" aria-label={`${guide.step} ${index + 1}`} aria-current={index === active ? 'step' : undefined} onClick={() => go(index)} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
