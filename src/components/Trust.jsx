import { useLanguage } from '../i18n';
import Phrase from './Phrase';
import Icon from './Icon';

export default function Trust() {
    const { trust } = useLanguage().copy;

    return (
        <section className="section section-tight" aria-labelledby="trust-title">
            <div className="container">
                <div className="section-head center">
                    <span className="eyebrow">
                        <Phrase text={trust.eyebrow} />
                    </span>
                    <h2 id="trust-title" className="h2">
                        <Phrase text={trust.title} />
                    </h2>
                </div>
                <div className="trust">
                    {trust.items.map((item) => (
                        <div key={item.title} className="trust-item">
                            <span className="feature-icon">
                                <Icon name={item.icon} />
                            </span>
                            <h3 className="feature-title">
                                <Phrase text={item.title} />
                            </h3>
                            <p className="feature-body">
                                <Phrase text={item.body} />
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
