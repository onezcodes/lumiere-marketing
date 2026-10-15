/**
 * Mahabote birth days as the app reads them (`MahaboteMatch`, `Copy+Match`): eight days,
 * Wednesday afternoon being Rahu, each with its animal, direction, friend and enemy.
 */
export const DAYS = {
    sunday: { en: 'Sunday', my: 'တနင်္ဂနွေ', animal: 'Garuda', animalMy: 'ဂဠုန်', direction: 'Northeast', directionMy: 'အရှေ့မြောက်' },
    monday: { en: 'Monday', my: 'တနင်္လာ', animal: 'Tiger', animalMy: 'ကျား', direction: 'East', directionMy: 'အရှေ့' },
    tuesday: { en: 'Tuesday', my: 'အင်္ဂါ', animal: 'Lion', animalMy: 'ခြင်္သေ့', direction: 'Southeast', directionMy: 'အရှေ့တောင်' },
    wednesday: { en: 'Wednesday (morning)', my: 'ဗုဒ္ဓဟူး (မနက်)', animal: 'Tusked elephant', animalMy: 'ဆင်', direction: 'South', directionMy: 'တောင်' },
    rahu: { en: 'Rahu (Wednesday afternoon)', my: 'ရာဟု (ဗုဒ္ဓဟူး ညနေ)', animal: 'Tuskless elephant', animalMy: 'ဟိုင်း', direction: 'Northwest', directionMy: 'အနောက်မြောက်' },
    thursday: { en: 'Thursday', my: 'ကြာသပတေး', animal: 'Rat', animalMy: 'ကြွက်', direction: 'West', directionMy: 'အနောက်' },
    friday: { en: 'Friday', my: 'သောကြာ', animal: 'Guinea pig', animalMy: 'ပူး', direction: 'North', directionMy: 'မြောက်' },
    saturday: { en: 'Saturday', my: 'စနေ', animal: 'Naga', animalMy: 'နဂါး', direction: 'Southwest', directionMy: 'အနောက်တောင်' },
};

const ENEMIES = [
    ['sunday', 'thursday'],
    ['monday', 'friday'],
    ['tuesday', 'saturday'],
    ['wednesday', 'rahu'],
];
const FRIENDS = [
    ['sunday', 'wednesday'],
    ['monday', 'thursday'],
    ['tuesday', 'friday'],
    ['saturday', 'rahu'],
];

const partner = (day, pairs) => pairs.find((pair) => pair.includes(day))?.find((other) => other !== day) ?? day;

export const friendOf = (day) => partner(day, FRIENDS);
export const enemyOf = (day) => partner(day, ENEMIES);

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/** `afternoon` only matters on a Wednesday, which splits into morning and Rahu. */
export function mahaboteDay(year, month, day, afternoon = false) {
    const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
    return weekday === 'wednesday' && afternoon ? 'rahu' : weekday;
}
