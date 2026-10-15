import { useLanguage } from '../i18n';
import { useTheme } from '../theme';
import Icon from './Icon';

/** The header's ☀/☾ button: shows the mode it switches to. */
export function ThemeButton() {
    const { theme, toggle } = useTheme();
    const { copy } = useLanguage();
    const label = theme === 'dark' ? copy.theme.toLight : copy.theme.toDark;

    return (
        <button type="button" className="theme-btn" onClick={toggle} aria-label={label} title={label}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
        </button>
    );
}

/** Light / Dark / Auto, for the footer: Auto goes back to following the device. */
export function ThemeChoice() {
    const { preference, choose } = useTheme();
    const { copy } = useLanguage();

    return (
        <div className="lang-toggle lang-toggle-dark" role="group" aria-label={copy.theme.label}>
            {['light', 'dark', 'auto'].map((option) => (
                <button key={option} type="button" aria-pressed={preference === option} onClick={() => choose(option)}>
                    {copy.theme[option]}
                </button>
            ))}
        </div>
    );
}
