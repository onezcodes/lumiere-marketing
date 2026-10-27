import { site } from './content/site.js';

/** 1 January 2027, 09:00–09:30 Myanmar time, as UTC for calendar apps. */
const LAUNCH_START = '20270101T023000Z';
const LAUNCH_END = '20270101T030000Z';

/**
 * A phone number or email, or null. Phone numbers keep a leading + and need 8–15 digits,
 * which covers Myanmar mobiles (09…, +959…).
 */
export function parseContact(raw) {
    const value = String(raw ?? '').trim();
    if (!value || value.length > 120) return null;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { kind: 'email', value: value.toLowerCase() };

    const digits = value.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) return null;
    if (!/^[+()\d][\d\s().+-]*$/.test(value)) return null;
    return { kind: 'phone', value: value.replace(/\s+/g, ' ') };
}

/** POST /api/notify. `save` persists one new entry. A filled honeypot (`company`) is ignored. */
export async function acceptNotify(payload, save) {
    if (payload && String(payload.company || '').trim()) return { status: 200, body: { ok: true } };

    const contact = parseContact(payload?.contact);
    if (!contact) return { status: 400, body: { error: 'invalid' } };

    await save({
        ...contact,
        lang: payload?.lang === 'my' ? 'my' : 'en',
        at: new Date().toISOString(),
    });
    return { status: 200, body: { ok: true } };
}

function icsEscape(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

/** A one-event calendar file for the launch moment. */
export function launchCalendar({ summary, description, url }) {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Lumiere//Launch//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:launch-2027-01-01@lumiere.onezcodes.com',
        `DTSTAMP:${LAUNCH_START}`,
        `DTSTART:${LAUNCH_START}`,
        `DTEND:${LAUNCH_END}`,
        `SUMMARY:${icsEscape(summary)}`,
        `DESCRIPTION:${icsEscape(description)}`,
        `URL:${icsEscape(url)}`,
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'DESCRIPTION:Lumiere opens',
        'TRIGGER:PT0M',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
    ];
    return lines.join('\r\n') + '\r\n';
}

export function launchPageUrl(lang) {
    return site.siteUrl.replace(/\/$/, '') + (lang === 'my' ? '/my/' : '/');
}

export function notifyMailUrl(contact, lang) {
    const subject = encodeURIComponent('Lumière launch list');
    const body = encodeURIComponent(`${contact}\nLanguage: ${lang === 'my' ? 'Burmese' : 'English'}`);
    return `mailto:${site.supportEmail}?subject=${subject}&body=${body}`;
}
