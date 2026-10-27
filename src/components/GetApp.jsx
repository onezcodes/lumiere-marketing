import { useLanguage } from '../i18n';
import Phrase from './Phrase';
import AppStoreButton from './AppStoreButton';
import Countdown from './Countdown';
import GooglePlayButton from './GooglePlayButton';
import Starfield from './art/Starfield';
import ZodiacWheel from './art/ZodiacWheel';

export default function GetApp() {
    const { copy } = useLanguage();

    return (
        <section id="get-app" className="get-app on-plum">
            <Starfield density={0.00014} />
            <ZodiacWheel className="get-app-wheel" />
            <div className="container get-app-inner">
                <img src="/brand/lumiere-app-icon-email.png" alt="" width="96" height="96" className="get-app-icon" loading="lazy" />
                <h2 className="h2">
                    <Phrase text={copy.hero.title} />
                </h2>
                <p className="lead">
                    <Phrase text={copy.cta.iphone} />
                </p>
                <Countdown />
                <div className="get-app-actions">
                    <AppStoreButton variant="spring" />
                    <GooglePlayButton />
                </div>
            </div>
        </section>
    );
}
