import { ELEMENT_COLORS, SIGNS, glyph } from '../data/zodiac';
import { useLanguage } from '../i18n';
import AppleLogo from './AppleLogo';
import Icon from './Icon';
import Phrase from './Phrase';
import Reveal from './Reveal';

// One element per step, so the journey walks round the four elements of the wheel.
const ELEMENTS = ['fire', 'earth', 'air', 'water'];
const TAURUS = SIGNS.find((sign) => sign.slug === 'taurus');

/** Sign up: a tiny form with a username, a birthday and the Apple / Google shortcuts. */
function SignUpArt() {
    return (
        <div className="step-art-form">
            <span className="step-art-input">
                <b>@</b>
                <i className="step-art-line" style={{ width: '46%' }} />
                <i className="step-art-caret" />
            </span>
            <span className="step-art-input">
                <Icon name="calendar" size={14} />
                <i className="step-art-line" style={{ width: '58%' }} />
            </span>
            <span className="step-art-socials">
                <span>
                    <AppleLogo size={14} />
                </span>
                <span className="step-art-g">G</span>
            </span>
        </div>
    );
}

/** Confirm your sign: the sign's glyph in an orbit, with a tick. */
function ConfirmArt() {
    return (
        <div className="step-art-medallion">
            <span className="step-art-orbit" />
            <span className="step-art-glyph">{glyph(TAURUS)}</span>
            <span className="step-art-check">
                <Icon name="check" size={14} />
            </span>
        </div>
    );
}

/** Read your month: two reading cards fanned out, the front one with a few lines of text. */
function ReadArt() {
    return (
        <div className="step-art-cards">
            <span className="step-art-card step-art-card-back" />
            <span className="step-art-card">
                <span className="step-art-card-head">
                    <Icon name="moon" size={13} />
                    <i className="step-art-line" style={{ width: '40%' }} />
                </span>
                <i className="step-art-line" />
                <i className="step-art-line" style={{ width: '86%' }} />
                <i className="step-art-line" style={{ width: '64%' }} />
            </span>
            <span className="step-art-sparkle">
                <Icon name="sparkle" size={18} filled />
            </span>
        </div>
    );
}

/** Ask a reader: a question, the reader typing back, and a credit. */
function AskArt() {
    return (
        <div className="step-art-chat">
            <span className="step-art-bubble step-art-bubble-me">
                <i className="step-art-line" style={{ width: '70%' }} />
            </span>
            <span className="step-art-reply">
                <span className="step-art-avatar">
                    <Icon name="star" size={12} filled />
                </span>
                <span className="step-art-bubble step-art-typing">
                    <i />
                    <i />
                    <i />
                </span>
            </span>
            <span className="step-art-coin">
                <Icon name="sparkle" size={12} filled />
            </span>
        </div>
    );
}

const ART = [SignUpArt, ConfirmArt, ReadArt, AskArt];

export default function Steps() {
    const { steps } = useLanguage().copy;

    return (
        <section className="section steps-section" aria-labelledby="steps-title">
            <div className="container">
                <div className="section-head center">
                    <span className="eyebrow">
                        <Phrase text={steps.eyebrow} />
                    </span>
                    <h2 id="steps-title" className="h2">
                        <Phrase text={steps.title} />
                    </h2>
                </div>
                <ol className="steps">
                    {steps.items.map((step, index) => {
                        const Art = ART[index];
                        return (
                            <Reveal as="li" key={step.title} className="step" delay={index * 90} style={{ '--element': ELEMENT_COLORS[ELEMENTS[index]] }}>
                                <span className="step-node" aria-hidden="true">
                                    <span className="step-number">{index + 1}</span>
                                </span>
                                <div className="step-card">
                                    <div className="step-art" aria-hidden="true">
                                        <Art />
                                    </div>
                                    <div className="step-text">
                                        <h3 className="step-title">
                                            <Phrase text={step.title} />
                                        </h3>
                                        <p className="step-body">
                                            <Phrase text={step.body} />
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
