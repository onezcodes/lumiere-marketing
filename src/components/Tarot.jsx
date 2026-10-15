import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import Phrase from './Phrase';
import AppStoreButton from './AppStoreButton';
import CardBack from './art/CardBack';
import Starfield from './art/Starfield';

const SPREAD_SIZE = 7;

function shuffle(deck) {
    const cards = [...deck];
    for (let index = cards.length - 1; index > 0; index -= 1) {
        const other = Math.floor(Math.random() * (index + 1));
        [cards[index], cards[other]] = [cards[other], cards[index]];
    }
    return cards.slice(0, SPREAD_SIZE);
}

const artUrl = (card) => `/tarot/${card.image}.webp`;
const preload = (card) => {
    const image = new Image();
    image.src = artUrl(card);
};

/**
 * The app's yes-or-no tarot, in the browser: the same 78-card deck and Burmese answers
 * (`SampleTarot`), a spread of seven face down, one pick, a flip. The deck (~36KB) loads
 * when this section mounts; a card's art only when it is hovered or chosen.
 */
export default function Tarot() {
    const { copy, lang } = useLanguage();
    const text = copy.tarot;
    const [deck, setDeck] = useState(null);
    const [failed, setFailed] = useState(false);
    const [spread, setSpread] = useState([]);
    const [picked, setPicked] = useState(null);
    const [question, setQuestion] = useState('');
    const [round, setRound] = useState(0);
    const resultRef = useRef(null);

    const load = useCallback(() => {
        setFailed(false);
        fetch('/tarot/deck.json')
            .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
            .then((cards) => {
                setDeck(cards);
                setSpread(shuffle(cards));
            })
            .catch(() => setFailed(true));
    }, []);

    useEffect(load, [load]);

    useEffect(() => {
        if (picked === null || !window.matchMedia('(max-width: 900px)').matches) {
            return undefined;
        }
        const timer = window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 1100);

        return () => window.clearTimeout(timer);
    }, [picked]);

    const card = picked === null ? null : spread[picked];
    const again = () => {
        setPicked(null);
        setRound((value) => value + 1);
        window.setTimeout(() => setSpread(shuffle(deck)), 260);
    };

    const positions = useMemo(
        () =>
            spread.map((_, index) => {
                const offset = index - (SPREAD_SIZE - 1) / 2;
                return { offset, lift: Math.abs(offset) * Math.abs(offset) * 3 };
            }),
        [spread],
    );

    return (
        <section className="tarot on-plum" aria-labelledby="tarot-title">
            <Starfield density={0.00012} />
            <div className="container tarot-inner">
                <div className="tarot-head">
                    <span className="eyebrow">
                        <Phrase text={text.eyebrow} />
                    </span>
                    <h2 id="tarot-title" className="h2">
                        <Phrase text={text.title} />
                    </h2>
                    <p className="lead">
                        <Phrase text={text.intro} />
                    </p>

                    {!card && (
                        <label className="tarot-question">
                            <span className="visually-hidden">{text.placeholder}</span>
                            <input type="text" maxLength={120} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={text.placeholder} />
                        </label>
                    )}
                </div>
                <div className="tarot-stage">
                    {failed ? (
                        <div className="tarot-status">
                            <p>
                                <Phrase text={text.failed} />
                            </p>
                            <button type="button" className="btn btn-ghost" onClick={load}>
                                {text.retry}
                            </button>
                        </div>
                    ) : !deck ? (
                        <p className="tarot-status">
                            <Phrase text={text.loading} />
                        </p>
                    ) : (
                        <>
                            <p className="tarot-prompt" aria-hidden={card !== null}>
                                {card ? '' : text.choose}
                            </p>
                            <div className={`tarot-fan ${card ? 'has-pick' : ''}`} key={round}>
                                {spread.map((item, index) => {
                                    const { offset, lift } = positions[index];
                                    const isPicked = picked === index;
                                    return (
                                        <button
                                            key={`${round}-${item.id}`}
                                            type="button"
                                            className={`tarot-card ${isPicked ? 'is-picked' : ''}`}
                                            style={{ '--offset': offset, '--lift': `${lift}px`, '--delay': `${index * 50}ms` }}
                                            onPointerEnter={() => picked === null && preload(item)}
                                            onFocus={() => picked === null && preload(item)}
                                            onClick={() => picked === null && setPicked(index)}
                                            disabled={picked !== null && !isPicked}
                                            aria-label={isPicked ? item.name : `${text.card} ${index + 1}`}
                                        >
                                            <span className="tarot-card-inner">
                                                <span className="tarot-face tarot-face-back">
                                                    <CardBack />
                                                </span>
                                                <span className="tarot-face tarot-face-front">{isPicked && <img src={artUrl(item)} alt="" width="280" height="480" decoding="async" />}</span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
                <div className="tarot-result-slot">
                    {card ? (
                        <div ref={resultRef} className={`tarot-result tarot-result-${card.verdict}`} aria-live="polite">
                            {question.trim() && (
                                <p className="tarot-asked">
                                    {text.youAsked}: “{question.trim()}”
                                </p>
                            )}
                            <span className="tarot-verdict">
                                <Phrase text={text.verdicts[card.verdict]} />
                            </span>
                            <h3 className="tarot-card-name">
                                <Phrase text={card.name} />
                            </h3>
                            <ul className="tarot-keywords">
                                {card.keywords.map((keyword) => (
                                    <li key={keyword}>
                                        <Phrase text={keyword} />
                                    </li>
                                ))}
                            </ul>
                            {lang === 'en' && (
                                <p className="tarot-lean">
                                    <Phrase text={text.leans[card.verdict]} />
                                </p>
                            )}
                            {text.answerNote && (
                                <p className="tarot-note">
                                    <Phrase text={text.answerNote} />
                                </p>
                            )}
                            <p className="tarot-answer" lang="my">
                                <Phrase text={card.answer} />
                            </p>
                            <div className="tarot-actions">
                                <button type="button" className="btn btn-spring" onClick={again}>
                                    {text.again}
                                </button>
                                <AppStoreButton variant="ghost" compact />
                            </div>
                            <p className="tarot-more">
                                <Phrase text={text.more} />
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
