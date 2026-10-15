import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'lumiere-landing-theme';
const ThemeContext = createContext(null);
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function savedPreference() {
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
    const [deviceDark, setDeviceDark] = useState(() => media().matches);
    const theme = preference === 'auto' ? (deviceDark ? 'dark' : 'light') : preference;

    useEffect(() => {
        const query = media();
        const onChange = () => setDeviceDark(query.matches);
        query.addEventListener('change', onChange);

        return () => query.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#150d13' : '#42273b');
    }, [theme]);

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

    return <ThemeContext.Provider value={{ theme, preference, choose, toggle: () => choose(theme === 'dark' ? 'light' : 'dark') }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
}
