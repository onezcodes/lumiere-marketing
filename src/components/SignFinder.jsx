import { useMemo, useState } from 'react';
import { DAYS, enemyOf, friendOf, mahaboteDay } from '../data/mahabote';
import { ELEMENT_COLORS, glyph, signFor } from '../data/zodiac';
import { useLanguage } from '../i18n';
import BirthdayPicker from './BirthdayPicker';
import Icon from './Icon';
import Phrase from './Phrase';
import ZodiacWheel from './art/ZodiacWheel';

const range = (sign) => {
    const month = (value) => new Date(2000, value - 1, 1).toLocaleString('en', { month: 'short' });
    return `${sign.start[1]} ${month(sign.start[0])} – ${sign.end[1]} ${month(sign.end[0])}`;
};

/** Birthday in, sign and Mahabote birth day out — computed here, nothing is sent anywhere. */
export default function SignFinder() {
    const { copy, lang } = useLanguage();
    const text = copy.finder;
    const [birthday, setBirthday] = useState('');
    const [afternoon, setAfternoon] = useState(false);

    const result = useMemo(() => {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthday);
        if (!match) {
            return null;
        }
        const [year, month, day] = match.slice(1).map(Number);
        const sign = signFor(month, day);
        const weekday = mahaboteDay(year, month, day, false);
        const mahabote = mahaboteDay(year, month, day, afternoon);
        return sign ? { sign, isWednesday: weekday === 'wednesday', mahabote } : null;
    }, [birthday, afternoon]);

    const my = lang === 'my';
    const dayName = (key) => (my ? DAYS[key].my : DAYS[key].en);

    return (
        <section className="section finder" aria-labelledby="finder-title">
            <div className="container finder-inner">
                <div className="finder-visual">
                    <ZodiacWheel highlight={result?.sign.slug} />
                    {result && (
                        <span className="finder-glyph" style={{ '--element': ELEMENT_COLORS[result.sign.element] }} aria-hidden="true">
                            {glyph(result.sign)}
                        </span>
                    )}
                </div>
                <div className="finder-copy">
                    <span className="eyebrow">
                        <Phrase text={text.eyebrow} />
                    </span>
                    <h2 id="finder-title" className="h2">
                        <Phrase text={text.title} />
                    </h2>
                    <p className="lead">
                        <Phrase text={text.intro} />
                    </p>

                    <div className="finder-form">
                        <BirthdayPicker value={birthday} onChange={setBirthday} label={<Phrase text={text.birthday} />} />
                        {result?.isWednesday && (
                            <fieldset className="finder-wednesday">
                                <legend>{text.wednesday}</legend>
                                <div className="segmented">
                                    <button type="button" aria-pressed={!afternoon} onClick={() => setAfternoon(false)}>
                                        {text.morning}
                                    </button>
                                    <button type="button" aria-pressed={afternoon} onClick={() => setAfternoon(true)}>
                                        {text.afternoon}
                                    </button>
                                </div>
                            </fieldset>
                        )}
                    </div>

                    <div className="finder-result" aria-live="polite">
                        {result ? (
                            <>
                                <div className="finder-card" style={{ '--element': ELEMENT_COLORS[result.sign.element] }}>
                                    <span className="finder-card-label">
                                        <Phrase text={text.sign} />
                                    </span>
                                    <span className="finder-card-title">
                                        {my ? result.sign.my : result.sign.name}
                                        <small>{my ? result.sign.name : result.sign.my}</small>
                                    </span>
                                    <span className="finder-card-meta">
                                        {range(result.sign)} · {text.element}: {text.elements[result.sign.element]}
                                    </span>
                                </div>
                                <div className="finder-card finder-card-dark">
                                    <span className="finder-card-label">
                                        <Phrase text={text.mahabote} />
                                    </span>
                                    <span className="finder-card-title">{dayName(result.mahabote)}</span>
                                    <dl className="finder-facts">
                                        <div>
                                            <dt>{text.animal}</dt>
                                            <dd>{my ? DAYS[result.mahabote].animalMy : DAYS[result.mahabote].animal}</dd>
                                        </div>
                                        <div>
                                            <dt>{text.direction}</dt>
                                            <dd>{my ? DAYS[result.mahabote].directionMy : DAYS[result.mahabote].direction}</dd>
                                        </div>
                                        <div>
                                            <dt>{text.friend}</dt>
                                            <dd>{dayName(friendOf(result.mahabote))}</dd>
                                        </div>
                                        <div>
                                            <dt>{text.enemy}</dt>
                                            <dd>{dayName(enemyOf(result.mahabote))}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <p className="finder-more">
                                    <Phrase text={text.more} />
                                </p>
                            </>
                        ) : (
                            <div className="finder-ghost">
                                <div className="finder-card finder-ghost-card" aria-hidden="true">
                                    <span className="finder-card-label">
                                        <Phrase text={text.sign} />
                                    </span>
                                    <span className="finder-ghost-bar" />
                                    <span className="finder-ghost-bar finder-ghost-bar-short" />
                                </div>
                                <div className="finder-card finder-card-dark finder-ghost-card" aria-hidden="true">
                                    <span className="finder-card-label">
                                        <Phrase text={text.mahabote} />
                                    </span>
                                    <span className="finder-ghost-bar" />
                                    <dl className="finder-facts">
                                        {[text.animal, text.direction, text.friend, text.enemy].map((fact) => (
                                            <div key={fact}>
                                                <dt>{fact}</dt>
                                                <dd>—</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                                <p className="finder-empty">
                                    <Icon name="sparkle" size={16} />
                                    <span>
                                        <Phrase text={text.empty} />
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
