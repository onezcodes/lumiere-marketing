import { useLanguage } from '../i18n';
import AppStoreButton from './AppStoreButton';
import Icon from './Icon';
import Phrase from './Phrase';
import PhoneFrame from './PhoneFrame';

export default function Plans() {
    const { plans } = useLanguage().copy;

    return (
        <section className="section plans-section" aria-labelledby="plans-title">
            <div className="container">
                <div className="section-head center">
                    <span className="eyebrow">
                        <Phrase text={plans.eyebrow} />
                    </span>
                    <h2 id="plans-title" className="h2">
                        <Phrase text={plans.title} />
                    </h2>
                </div>
                <div className="plans-layout">
                    <div className="plans">
                        {plans.items.map((plan) => (
                            <article key={plan.name} className={`plan ${plan.featured ? 'plan-featured on-plum' : ''}`}>
                                <div className="plan-head">
                                    <h3 className="plan-name">
                                        <Phrase text={plan.name} />
                                    </h3>
                                    {plan.badge && (
                                        <span className="chip">
                                            <Icon name="gift" size={14} />
                                            <span>
                                                <Phrase text={plan.badge} />
                                            </span>
                                        </span>
                                    )}
                                </div>
                                <p className="plan-price">
                                    <Phrase text={plan.price} />
                                </p>
                                <p className="plan-note">
                                    <Phrase text={plan.note} />
                                </p>
                                <ul className="check-list">
                                    {plan.points.map((point) => (
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
                                <div className="plan-cta">
                                    <AppStoreButton variant={plan.featured ? 'spring' : 'ghost'} compact />
                                </div>
                            </article>
                        ))}
                    </div>
                    <div className="plans-phone">
                        <PhoneFrame screen="welcome-plus" alt={plans.title} />
                    </div>
                </div>
                <div className="plans-credits">
                    <span className="plans-credits-icon" aria-hidden="true">
                        <Icon name="sparkle" size={22} filled />
                    </span>
                    <div className="plans-credits-text">
                        <h3>
                            <Phrase text={plans.credits.title} />
                        </h3>
                        <p>
                            <Phrase text={plans.credits.body} />
                        </p>
                    </div>
                    <ul className="plans-credits-facts">
                        {plans.credits.facts.map((fact) => (
                            <li key={fact}>
                                <Phrase text={fact} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
