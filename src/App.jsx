import AppGuide from './components/AppGuide';
import Faq from './components/Faq';
import Features from './components/Features';
import Footer from './components/Footer';
import ForReaders from './components/ForReaders';
import GetApp from './components/GetApp';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Plans from './components/Plans';
import Steps from './components/Steps';
import Trust from './components/Trust';
import Wallpapers from './components/Wallpapers';
import LazySection from './components/LazySection';
import { lazy } from 'react';

const Tarot = lazy(() => import('./components/Tarot'));
const SignFinder = lazy(() => import('./components/SignFinder'));
import { LanguageProvider } from './i18n';
import { ThemeProvider } from './theme';

export default function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <Header />
                <main>
                    <Hero />
                    <Highlights />
                    <LazySection id="tarot" minHeight={760}>
                        <Tarot />
                    </LazySection>
                    <LazySection id="finder" minHeight={640}>
                        <SignFinder />
                    </LazySection>
                    <Wallpapers />
                    <Features />
                    <Steps />
                    <AppGuide />
                    <Plans />
                    <ForReaders />
                    <Trust />
                    <Faq />
                    <GetApp />
                </main>
                <Footer />
            </LanguageProvider>
        </ThemeProvider>
    );
}
