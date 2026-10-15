import { ELEMENT_COLORS, SIGNS, glyph } from '../../data/zodiac';

const polar = (radius, degrees) => {
    const angle = ((degrees - 90) * Math.PI) / 180;
    return [200 + radius * Math.cos(angle), 200 + radius * Math.sin(angle)];
};

const TICKS = Array.from({ length: 72 }, (_, index) => {
    const long = index % 6 === 0;
    const [x1, y1] = polar(long ? 176 : 181, index * 5);
    const [x2, y2] = polar(186, index * 5);
    return { x1, y1, x2, y2, long };
});

/** The zodiac as a slowly turning wheel: ticks, the twelve houses and their glyphs. All SVG. */
export default function ZodiacWheel({ className = '', highlight }) {
    return (
        <svg className={`zodiac-wheel ${className}`} viewBox="0 0 400 400" aria-hidden="true">
            <defs>
                <radialGradient id="wheel-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#9ee493" stopOpacity="0.22" />
                    <stop offset="70%" stopColor="#9ee493" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="200" fill="url(#wheel-glow)" />
            <g className="zodiac-wheel-spin">
                <circle cx="200" cy="200" r="186" className="wheel-line" />
                <circle cx="200" cy="200" r="150" className="wheel-line" />
                <circle cx="200" cy="200" r="112" className="wheel-line wheel-line-faint" />
                <circle cx="200" cy="200" r="46" className="wheel-line wheel-line-faint" />
                {TICKS.map(({ long, ...line }, index) => (
                    <line key={index} {...line} className={long ? 'wheel-tick wheel-tick-long' : 'wheel-tick'} />
                ))}
                {SIGNS.map((sign, index) => {
                    const [x1, y1] = polar(112, index * 30);
                    const [x2, y2] = polar(186, index * 30);
                    const [gx, gy] = polar(168, index * 30 + 15);
                    const [dx, dy] = polar(131, index * 30 + 15);
                    const active = highlight === sign.slug;
                    return (
                        <g key={sign.slug}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} className="wheel-line" />
                            <text x={gx} y={gy} className={`wheel-glyph ${active ? 'is-active' : ''}`} textAnchor="middle" dominantBaseline="central">
                                {glyph(sign)}
                            </text>
                            <circle cx={dx} cy={dy} r={active ? 6 : 3} fill={ELEMENT_COLORS[sign.element]} opacity={active ? 1 : 0.85} />
                        </g>
                    );
                })}
                <path d="M200 120 L210 190 L280 200 L210 210 L200 280 L190 210 L120 200 L190 190 Z" className="wheel-star" />
            </g>
        </svg>
    );
}
