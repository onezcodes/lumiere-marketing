import { useLanguage } from '../i18n';
import Phrase from './Phrase';
import Icon from './Icon';
import Reveal from './Reveal';

const ACCENTS = ['#9ee493', '#8e9be8', '#ec7d5b', '#57a7d2', '#c49a3a'];

export default function Features() {
    const { features } = useLanguage().copy;

    return (
        <section id="features" className="section section-tint" aria-labelledby="features-title">
            <div className="container">
                <div className="section-head">
                    <span className="eyebrow">
                        <Phrase text={features.eyebrow} />
                    </span>
                    <h2 id="features-title" className="h2">
                        <Phrase text={features.title} />
                    </h2>
                </div>
                <div className="feature-groups">
                    {features.groups.map((group) => (
                        <div key={group.title} className="feature-group">
                            <h3 className="feature-group-title">
                                <span>
                                    <Phrase text={group.title} />
                                </span>
                            </h3>
                            <div className="feature-grid">
                                {group.items.map((item, index) => (
                                    <Reveal key={item.title} className="feature-card" delay={(index % 4) * 60} style={{ '--accent': ACCENTS[index % ACCENTS.length] }}>
                                        <span className="feature-icon">
                                            <Icon name={item.icon} />
                                        </span>
                                        <h4 className="feature-title">
                                            <Phrase text={item.title} />
                                        </h4>
                                        <p className="feature-body">
                                            <Phrase text={item.body} />
                                        </p>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
