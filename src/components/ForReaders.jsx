import { site } from '../content/site';
import { useLanguage } from '../i18n';
import Phrase from './Phrase';
import Icon from './Icon';
import PhoneFrame from './PhoneFrame';

export default function ForReaders() {
    const { readers } = useLanguage().copy;

    return (
        <section id="readers" className="section" aria-labelledby="readers-title">
            <div className="container">
                <div className="readers on-plum">
                    <div className="readers-copy">
                        <span className="eyebrow">
                            <Phrase text={readers.eyebrow} />
                        </span>
                        <h2 id="readers-title" className="h2">
                            <Phrase text={readers.title} />
                        </h2>
                        <p className="lead">
                            <Phrase text={readers.body} />
                        </p>
                        <ul className="check-list">
                            {readers.points.map((point) => (
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
                        <p className="readers-note">
                            <Phrase text={readers.note} />
                        </p>
                        <a className="btn btn-ghost" href={`mailto:${site.supportEmail}?subject=${encodeURIComponent('Reader invitation')}`}>
                            {readers.cta}
                        </a>
                    </div>
                    <div className="readers-visual">
                        <PhoneFrame screen="reader-profile" alt={readers.title} />
                    </div>
                </div>
            </div>
        </section>
    );
}
