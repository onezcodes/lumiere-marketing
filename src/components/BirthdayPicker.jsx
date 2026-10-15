import { useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import Icon from './Icon';

const MIN_YEAR = 1920;
const YEARS_PER_PAGE = 12;
// Burmese names are spelled out here: Chrome ships no Burmese date data, so Intl falls back to
// English there. Weekday headers use the endings printed on Myanmar calendars.
const BURMESE = {
    months: ['ဇန်နဝါရီ', 'ဖေဖော်ဝါရီ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်', 'ဇူလိုင်', 'ဩဂုတ်', 'စက်တင်ဘာ', 'အောက်တိုဘာ', 'နိုဝင်ဘာ', 'ဒီဇင်ဘာ'],
    weekdays: ['တနင်္ဂနွေ', 'တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ'],
    headers: ['နွေ', 'လာ', 'ဂါ', 'ဟူး', 'တေး', 'ကြာ', 'နေ'],
    digits: (n) => String(n).replace(/\d/g, (d) => '၀၁၂၃၄၅၆၇၈၉'[d]),
};
const ENGLISH = {
    months: [...Array(12)].map((_, i) => new Date(2000, i, 1).toLocaleString('en', { month: 'long' })),
    weekdays: [...Array(7)].map((_, i) => new Date(2024, 8, 1 + i).toLocaleString('en', { weekday: 'long' })),
    headers: [...Array(7)].map((_, i) => new Date(2024, 8, 1 + i).toLocaleString('en', { weekday: 'narrow' })),
    digits: String,
};

const pad = (value) => String(value).padStart(2, '0');
const toValue = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`;
const daysIn = (year, month) => new Date(year, month + 1, 0).getDate();
const pageStart = (year) => year - ((year - MIN_YEAR) % YEARS_PER_PAGE);

function parse(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    return match ? { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) } : null;
}

/** Moves focus between a grid's buttons with the arrow keys, Home and End. */
function onGridKey(event, columns) {
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns };
    const buttons = [...event.currentTarget.querySelectorAll('button:not(:disabled)')];
    const index = buttons.indexOf(document.activeElement);
    if (index === -1) {
        return;
    }
    let next = null;
    if (event.key in steps) {
        next = buttons[index + steps[event.key]];
    } else if (event.key === 'Home') {
        next = buttons[0];
    } else if (event.key === 'End') {
        next = buttons[buttons.length - 1];
    }
    if (next) {
        event.preventDefault();
        next.focus();
    }
}

/**
 * The finder's birthday field: a branded trigger that opens a year → month → day panel, which is
 * quicker for a birth date than paging a calendar back month by month. Value is `YYYY-MM-DD`.
 */
export default function BirthdayPicker({ value, onChange, label }) {
    const { copy, lang } = useLanguage();
    const text = copy.finder.picker;
    const names = lang === 'my' ? BURMESE : ENGLISH;
    const id = useId();
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const panelRef = useRef(null);

    const today = new Date();
    const max = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
    const selected = parse(value);

    const [open, setOpen] = useState(false);
    const [view, setView] = useState('years');
    const [cursor, setCursor] = useState({ year: max.year - 25, month: 0 });
    const [yearPage, setYearPage] = useState(pageStart(max.year - 25));

    const number = names.digits;
    const monthName = (month, short = false) => (short && lang !== 'my' ? names.months[month].slice(0, 3) : names.months[month]);
    const weekdayOf = (year, month, day) => names.weekdays[new Date(year, month, day).getDay()];
    // "14 March 1996", or Burmese order "၁၉၉၆ မတ် ၁၄".
    const longDate = (year, month, day) => (lang === 'my' ? `${number(year)} ${monthName(month)} ${number(day)}` : `${day} ${monthName(month)} ${year}`);

    const show = (next) => {
        setOpen(true);
        if (selected) {
            setCursor({ year: selected.year, month: selected.month });
            setYearPage(pageStart(selected.year));
        }
        setView(next ?? (selected ? 'days' : 'years'));
    };

    const close = (refocus = true) => {
        setOpen(false);
        if (refocus) {
            triggerRef.current?.focus();
        }
    };

    // Focus the chosen option (or a sensible start) when the panel opens or changes view. Not on
    // paging, so the arrow buttons keep focus while they're pressed repeatedly.
    useEffect(() => {
        if (!open) {
            return;
        }
        const grid = panelRef.current?.querySelector('.bday-grid');
        const target = grid?.querySelector('[aria-pressed="true"]') ?? grid?.querySelector('[data-start]') ?? grid?.querySelector('button:not(:disabled)');
        target?.focus();
    }, [open, view]);

    // Close on a click outside.
    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const onPointer = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                close(false);
            }
        };
        document.addEventListener('pointerdown', onPointer);
        return () => document.removeEventListener('pointerdown', onPointer);
    }, [open]);

    const onPanelKey = (event) => {
        if (event.key === 'Escape') {
            event.stopPropagation();
            close();
        }
    };

    const pickYear = (year) => {
        setCursor({ year, month: year === max.year ? Math.min(cursor.month, max.month) : cursor.month });
        setView('months');
    };
    const pickMonth = (month) => {
        setCursor({ ...cursor, month });
        setView('days');
    };
    const pickDay = (day) => {
        onChange(toValue(cursor.year, cursor.month, day));
        close();
    };

    const shiftMonth = (delta) => {
        const date = new Date(cursor.year, cursor.month + delta, 1);
        setCursor({ year: date.getFullYear(), month: date.getMonth() });
    };

    const isAfterMax = (year, month, day = 1) => year > max.year || (year === max.year && (month > max.month || (month === max.month && day > max.day)));

    // Header: what the arrows page through, and whether they can.
    const nav = {
        years: {
            title: `${number(yearPage)} – ${number(Math.min(yearPage + YEARS_PER_PAGE - 1, max.year))}`,
            prev: yearPage > MIN_YEAR && (() => setYearPage(yearPage - YEARS_PER_PAGE)),
            next: yearPage + YEARS_PER_PAGE <= max.year && (() => setYearPage(yearPage + YEARS_PER_PAGE)),
        },
        months: {
            prev: cursor.year > MIN_YEAR && (() => setCursor({ ...cursor, year: cursor.year - 1 })),
            next: cursor.year < max.year && (() => setCursor({ ...cursor, year: cursor.year + 1 })),
        },
        days: {
            prev: (cursor.year > MIN_YEAR || cursor.month > 0) && (() => shiftMonth(-1)),
            next: !isAfterMax(cursor.year, cursor.month + 1) && (() => shiftMonth(1)),
        },
    }[view];

    const steps = ['years', 'months', 'days'];

    return (
        <div className="bday" ref={rootRef}>
            <span className="bday-label" id={`${id}-label`}>
                {label}
            </span>
            <button
                ref={triggerRef}
                type="button"
                className="bday-trigger"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-labelledby={`${id}-label ${id}-value`}
                onClick={() => (open ? close() : show())}
            >
                <span className="bday-trigger-icon">
                    <Icon name="calendar" size={20} />
                </span>
                <span className="bday-trigger-text" id={`${id}-value`}>
                    {selected ? (
                        <>
                            <strong>{longDate(selected.year, selected.month, selected.day)}</strong>
                            <small>{weekdayOf(selected.year, selected.month, selected.day)}</small>
                        </>
                    ) : (
                        <span className="bday-placeholder">{text.choose}</span>
                    )}
                </span>
                <Icon name="arrowRight" size={18} className="bday-chevron" />
            </button>

            {open && (
                <div ref={panelRef} className="bday-panel" role="dialog" aria-label={text.dialog} onKeyDown={onPanelKey}>
                    <ol className="bday-steps">
                        {steps.map((step, index) => {
                            const reached = index <= steps.indexOf(view);
                            return (
                                <li key={step}>
                                    <button type="button" aria-current={view === step ? 'step' : undefined} disabled={!reached} onClick={() => setView(step)}>
                                        {step === 'years' && reached && view !== 'years' ? number(cursor.year) : step === 'months' && view === 'days' ? monthName(cursor.month) : text.steps[index]}
                                    </button>
                                </li>
                            );
                        })}
                    </ol>

                    <div className="bday-nav">
                        <button type="button" className="bday-arrow" aria-label={text.previous} disabled={!nav.prev} onClick={nav.prev || undefined}>
                            <Icon name="arrowLeft" size={18} />
                        </button>
                        {view === 'years' && <span className="bday-title">{nav.title}</span>}
                        {view === 'months' && (
                            <button type="button" className="bday-title" onClick={() => setView('years')}>
                                {number(cursor.year)}
                            </button>
                        )}
                        {view === 'days' && (
                            <span className="bday-title">
                                <button type="button" onClick={() => setView('months')}>
                                    {monthName(cursor.month)}
                                </button>
                                <button type="button" onClick={() => setView('years')}>
                                    {number(cursor.year)}
                                </button>
                            </span>
                        )}
                        <button type="button" className="bday-arrow" aria-label={text.next} disabled={!nav.next} onClick={nav.next || undefined}>
                            <Icon name="arrowRight" size={18} />
                        </button>
                    </div>

                    {view === 'years' && (
                        <div className="bday-grid bday-grid-wide" role="group" aria-label={text.steps[0]} onKeyDown={(event) => onGridKey(event, 3)}>
                            {[...Array(YEARS_PER_PAGE)].map((_, i) => {
                                const year = yearPage + i;
                                return (
                                    <button
                                        key={year}
                                        type="button"
                                        disabled={year > max.year}
                                        aria-pressed={selected?.year === year}
                                        data-start={year === cursor.year ? '' : undefined}
                                        onClick={() => pickYear(year)}
                                    >
                                        {number(year)}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {view === 'months' && (
                        <div className="bday-grid bday-grid-wide" role="group" aria-label={text.steps[1]} onKeyDown={(event) => onGridKey(event, 3)}>
                            {[...Array(12)].map((_, month) => (
                                <button
                                    key={month}
                                    type="button"
                                    disabled={isAfterMax(cursor.year, month)}
                                    aria-pressed={selected?.year === cursor.year && selected.month === month}
                                    data-start={month === cursor.month ? '' : undefined}
                                    onClick={() => pickMonth(month)}
                                >
                                    {monthName(month, true)}
                                </button>
                            ))}
                        </div>
                    )}

                    {view === 'days' && (
                        <>
                            <div className="bday-weekdays" aria-hidden="true">
                                {names.headers.map((day, i) => (
                                    <span key={i}>{day}</span>
                                ))}
                            </div>
                            <div className="bday-grid bday-grid-days" role="group" aria-label={`${monthName(cursor.month)} ${number(cursor.year)}`} onKeyDown={(event) => onGridKey(event, 7)}>
                                {[...Array(new Date(cursor.year, cursor.month, 1).getDay())].map((_, i) => (
                                    <span key={`gap-${i}`} aria-hidden="true" />
                                ))}
                                {[...Array(daysIn(cursor.year, cursor.month))].map((_, i) => {
                                    const day = i + 1;
                                    const isToday = cursor.year === max.year && cursor.month === max.month && day === max.day;
                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            disabled={isAfterMax(cursor.year, cursor.month, day)}
                                            aria-pressed={selected?.year === cursor.year && selected.month === cursor.month && selected.day === day}
                                            aria-label={`${weekdayOf(cursor.year, cursor.month, day)}, ${longDate(cursor.year, cursor.month, day)}`}
                                            data-today={isToday ? '' : undefined}
                                            data-start={day === 1 ? '' : undefined}
                                            onClick={() => pickDay(day)}
                                        >
                                            {number(day)}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
