/** The back of a Lumière tarot card: plum, a spring hairline frame, sun and moon around the L. */
export default function CardBack() {
    return (
        <svg className="card-back" viewBox="0 0 120 200" aria-hidden="true">
            <rect x="0" y="0" width="120" height="200" rx="10" fill="#42273b" />
            <rect x="6" y="6" width="108" height="188" rx="6" fill="none" stroke="#9ee493" strokeOpacity="0.55" strokeWidth="1" />
            <rect x="10" y="10" width="100" height="180" rx="4" fill="none" stroke="#daf7dc" strokeOpacity="0.18" strokeWidth="0.75" />
            <g stroke="#daf7dc" strokeOpacity="0.16" strokeWidth="0.6" fill="none">
                {Array.from({ length: 12 }, (_, index) => (
                    <line key={index} x1="60" y1="100" x2={60 + 46 * Math.cos((index * Math.PI) / 6)} y2={100 + 46 * Math.sin((index * Math.PI) / 6)} />
                ))}
                <circle cx="60" cy="100" r="46" />
                <circle cx="60" cy="100" r="30" />
            </g>
            <circle cx="60" cy="100" r="18" fill="#2d1b29" stroke="#9ee493" strokeOpacity="0.7" strokeWidth="1" />
            <path d="M55 91 V109 H66" fill="none" stroke="#daf7dc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M68 88 c.4 3 1.4 4 4.4 4.4 c-3 .4 -4 1.4 -4.4 4.4 c-.4 -3 -1.4 -4 -4.4 -4.4 c3 -.4 4 -1.4 4.4 -4.4Z" fill="#9ee493" />
            <circle cx="60" cy="30" r="7" fill="none" stroke="#9ee493" strokeOpacity="0.8" strokeWidth="1" />
            <path d="M64 166 a8 8 0 1 1 -6 -12 a6 6 0 0 0 6 12Z" fill="#daf7dc" fillOpacity="0.75" />
        </svg>
    );
}
