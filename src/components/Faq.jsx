import { useLanguage } from '../i18n';
import Phrase from './Phrase';
import Icon from './Icon';

export default function Faq() {
    const { faq } = useLanguage().copy;

    return (
        <section id="faq" className="section section-tint" aria-labelledby="faq-title">
            <div className="container faq-layout">
                <div className="section-head">
                    <span className="eyebrow">
                        <Phrase text={faq.eyebrow} />
                    </span>
                    <h2 id="faq-title" className="h2">
                        <Phrase text={faq.title} />
                    </h2>
                </div>
                <div className="faq">
                    {faq.items.map((item) => (
                        <details key={item.q} className="faq-item">
                            <summary>
                                <span>
                                    <Phrase text={item.q} />
                                </span>
                                <Icon name="plus" className="faq-icon" />
                            </summary>
                            <p>
                                <Phrase text={item.a} />
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
