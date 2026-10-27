/** Small line icons, drawn on a 24px grid in the brand's stroke style. */
const PATHS = {
    moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
    sun: (
        <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
    ),
    cards: (
        <>
            <rect x="3" y="6" width="11" height="15" rx="2" transform="rotate(-8 8.5 13.5)" />
            <rect x="10" y="4" width="11" height="15" rx="2" transform="rotate(8 15.5 11.5)" />
        </>
    ),
    wheel: (
        <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6" />
        </>
    ),
    compass: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
    image: (
        <>
            <rect x="5" y="2" width="14" height="20" rx="3" />
            <path d="m5 16 4-4 3 3 2-2 5 5" />
            <circle cx="14.5" cy="7.5" r="1.5" />
        </>
    ),
    people: (
        <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
            <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
        </>
    ),
    scroll: (
        <>
            <path d="M7 3h11a2 2 0 0 1 2 2v1H9" />
            <path d="M18 6v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2h10v2a2 2 0 0 0 2 2" />
            <path d="M7 3a2 2 0 0 0-2 2v12M9 10h6M9 13.5h4" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M3 10h18M8 3v4M16 3v4M8 14h2M14 14h2M8 17.5h2" />
        </>
    ),
    share: (
        <>
            <circle cx="6" cy="12" r="2.2" />
            <circle cx="17" cy="6.5" r="2.2" />
            <circle cx="17" cy="17.5" r="2.2" />
            <path d="m8 11 7-3.5M8 13l7 3.5" />
        </>
    ),
    chat: <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1Z" />,
    bag: (
        <>
            <path d="M5 8h14l-1 13H6L5 8Z" />
            <path d="M9 10V6a3 3 0 0 1 6 0v4" />
        </>
    ),
    ticket: (
        <>
            <path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 0 0 4v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2Z" />
            <path d="M14 5v14" strokeDasharray="2 2.5" />
        </>
    ),
    flame: <path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-1.5-2-1.5-3C7 10 6 12.5 6 15a6 6 0 0 0 6 6Z" />,
    star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    repeat: <path d="M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3" />,
    gift: (
        <>
            <rect x="3" y="8" width="18" height="5" rx="1" />
            <path d="M5 13v8h14v-8M12 8v13M12 8C10 4 6.5 4.5 7.5 7c.5 1 2.5 1 4.5 1ZM12 8c2-4 5.5-3.5 4.5-1-.5 1-2.5 1-4.5 1Z" />
        </>
    ),
    shield: <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z" />,
    lock: (
        <>
            <rect x="4" y="10" width="16" height="11" rx="3" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14.5v2.5" />
        </>
    ),
    info: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v6M12 7.5v.5" />
        </>
    ),
    question: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.4M12 16.8v.2" />
        </>
    ),
    bars: <path d="M5 20v-6M10 20V9M15 20v-8M20 20V5M3 20h18" />,
    qr: (
        <>
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <path d="M14 14h2v2M20 14v.01M18 18h2v2M14 20h.01M16 18v2" />
        </>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    sparkle: <path d="M12 2c.6 5 2.4 7.4 8 8-5.6.6-7.4 3-8 8-.6-5-2.4-7.4-8-8 5.6-.6 7.4-3 8-8Z" />,
    arrowLeft: <path d="M15 5 8 12l7 7" />,
    arrowRight: <path d="m9 5 7 7-7 7" />,
    plus: <path d="M12 5v14M5 12h14" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
};

export default function Icon({ name, size = 24, className, filled = false }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke={filled ? 'none' : 'currentColor'}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {PATHS[name]}
        </svg>
    );
}
