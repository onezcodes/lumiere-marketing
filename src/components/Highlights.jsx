import { useLanguage } from '../i18n';
import Phrase from './Phrase';
import Icon from './Icon';
import PhoneFrame from './PhoneFrame';
import Reveal from './Reveal';

export default function Highlights() {
    const { highlights } = useLanguage().copy;

    return (
        <section className="section" aria-labelledby="highlights-title">
            <div className="container">
                <div className="section-head center">
                    <span className="eyebrow">
                        <Phrase text={highlights.eyebrow} />
                    </span>
                    <h2 id="highlights-title" className="h2">
                        <Phrase text={highlights.title} />
                    </h2>
                    <p className="lead">
                        <Phrase text={highlights.intro} />
                    </p>
                </div>
                <div className="highlights">
                    {highlights.items.map((item, index) => (
                        <Reveal key={item.screen} className={`highlight ${index % 2 ? 'is-flipped' : ''}`}>
                            <div className={`highlight-visual ${item.backScreen ? 'has-back' : ''}`}>
                                <span className="highlight-glow" aria-hidden="true" />
                                <span
                                    className="orbit-planet"
                                    style={{ '--planet': ['var(--water)', 'var(--fire)', 'var(--air)', 'var(--earth)'][index % 4], animationDuration: `${36 + index * 8}s` }}
                                    aria-hidden="true"
                                />
                                {item.backScreen && <PhoneFrame screen={item.backScreen} alt="" className="highlight-phone-back" />}
                                <PhoneFrame screen={item.screen} alt={item.title} className="highlight-phone-front" />
                            </div>
                            <div className="highlight-copy">
                                <span className="chip">
                                    <Phrase text={item.tag} />
                                </span>
                                <h3 className="highlight-title">
                                    <Phrase text={item.title} />
                                </h3>
                                <p className="highlight-body">
                                    <Phrase text={item.body} />
                                </p>
                                <ul className="check-list">
                                    {item.points.map((point) => (
                                        <li key={point}>
                                            <span className="check-dot">
                                                <Icon name="check" size={14} />
                                            </span>
                                            <span>
                                                <Phrase text={point} />
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
