/**
 * The 12 signs as the app seeds them (`SampleZodiac.definitions`), with the Burmese names the
 * app prints on its posters, and the element colours the app uses for data.
 */
export const ELEMENT_COLORS = { fire: '#ec7d5b', earth: '#c49a3a', air: '#8e9be8', water: '#57a7d2' };

export const SIGNS = [
    { slug: 'aries', name: 'Aries', my: 'မိဿ', glyph: '♈', element: 'fire', start: [3, 21], end: [4, 19] },
    { slug: 'taurus', name: 'Taurus', my: 'ပြိဿ', glyph: '♉', element: 'earth', start: [4, 20], end: [5, 20] },
    { slug: 'gemini', name: 'Gemini', my: 'မေထုန်', glyph: '♊', element: 'air', start: [5, 21], end: [6, 20] },
    { slug: 'cancer', name: 'Cancer', my: 'ကရကဋ်', glyph: '♋', element: 'water', start: [6, 21], end: [7, 22] },
    { slug: 'leo', name: 'Leo', my: 'သိဟ်', glyph: '♌', element: 'fire', start: [7, 23], end: [8, 22] },
    { slug: 'virgo', name: 'Virgo', my: 'ကန်', glyph: '♍', element: 'earth', start: [8, 23], end: [9, 22] },
    { slug: 'libra', name: 'Libra', my: 'တူ', glyph: '♎', element: 'air', start: [9, 23], end: [10, 22] },
    { slug: 'scorpio', name: 'Scorpio', my: 'ဗြိစ္ဆာ', glyph: '♏', element: 'water', start: [10, 23], end: [11, 21] },
    { slug: 'sagittarius', name: 'Sagittarius', my: 'ဓနု', glyph: '♐', element: 'fire', start: [11, 22], end: [12, 21] },
    { slug: 'capricorn', name: 'Capricorn', my: 'မကာရ', glyph: '♑', element: 'earth', start: [12, 22], end: [1, 19] },
    { slug: 'aquarius', name: 'Aquarius', my: 'ကုံ', glyph: '♒', element: 'air', start: [1, 20], end: [2, 18] },
    { slug: 'pisces', name: 'Pisces', my: 'မိန်', glyph: '♓', element: 'water', start: [2, 19], end: [3, 20] },
];

/** Text presentation, so phones draw the glyph in the page's colour rather than as an emoji. */
export const glyph = (sign) => `${sign.glyph}︎`;

export function signFor(month, day) {
    return SIGNS.find(({ start, end }) => {
        if (start[0] === end[0]) {
            return month === start[0] && day >= start[1] && day <= end[1];
        }
        return (month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1]);
    });
}
