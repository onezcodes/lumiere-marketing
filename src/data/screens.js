/**
 * Bump after recapturing screens: it goes on every screenshot URL, so browsers and Cloudflare
 * (which keep /screens/* for a week) fetch the new pictures instead of the cached ones.
 */
export const SCREENS_VERSION = '2026-10-27';

/** Screens with a dark-appearance capture in public/screens/dark (see scripts/optimize-screens.sh). */
export const DARK_SCREENS = new Set([
    'birth-chart',
    'booking',
    'confirm-sign',
    'credits',
    'games',
    'home',
    'lumiere-element',
    'match',
    'match-mahabote',
    'match-matrix',
    'matrix',
    'messages',
    'my-reading',
    'onboarding',
    'personal-reading',
    'reader-profile',
    'readers',
    'tarot',
    'timing',
]);
