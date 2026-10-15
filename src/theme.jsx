import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'lumiere-landing-theme';
const ThemeContext = createContext(null);
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function savedPreference() {
    if (typeof window === 'undefined') {
        return 'auto';
    }
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved === 'light' || saved === 'dark' ? saved : 'auto';
    } catch {
        return 'auto';
    }
}

/**
 * Light or dark, like the app's own Appearance setting: follows the device until someone
 * picks one (`auto` / `light` / `dark`). index.html applies the same rule before first paint.
 */
export function ThemeProvider({ children }) {
    const [preference, setPreference] = useState(savedPreference);
    const [deviceDark, setDeviceDark] = useState(() => typeof window !== 'undefined' && media().matches);
    // The prerendered HTML is drawn light. Hydrate as light too, then switch: a mismatch would
    // leave light screenshots in place. Colours are already right: index.html sets data-theme.
    const [hydrated, setHydrated] = useState(false);
    const actual = preference === 'auto' ? (deviceDark ? 'dark' : 'light') : preference;
    const theme = hydrated ? actual : 'light';

    useEffect(() => setHydrated(true), []);

    useEffect(() => {
        const query = media();
        const onChange = () => setDeviceDark(query.matches);
        query.addEventListener('change', onChange);

        return () => query.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        document.documentElement.dataset.theme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#150d13' : '#42273b');
    }, [theme, hydrated]);

    const choose = (next) => {
        setPreference(next);
        try {
            if (next === 'auto') {
                window.localStorage.removeItem(STORAGE_KEY);
            } else {
                window.localStorage.setItem(STORAGE_KEY, next);
            }
        } catch {
            // Not remembering the choice is fine.
        }
    };

    return <ThemeContext.Provider value={{ theme, preference: hydrated ? preference : 'auto', choose, toggle: () => choose(theme === 'dark' ? 'light' : 'dark') }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
}
