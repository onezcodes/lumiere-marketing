import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n';
import LaunchList from './LaunchList';
import Phrase from './Phrase';

/** 1 January 2027, 09:00 Myanmar time (Asia/Yangon, UTC+6:30). */
const LAUNCH_AT = Date.parse('2027-01-01T09:00:00+06:30');

const MY_DIGITS = '၀၁၂၃၄၅၆၇၈၉';

function timeUntilLaunch(now = Date.now()) {
    const remaining = Math.max(0, LAUNCH_AT - now);
    const totalSeconds = Math.floor(remaining / 1000);

    return {
        done: remaining === 0,
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
    };
}

function digits(value, lang) {
    const text = String(value).padStart(2, '0');
    return lang === 'my' ? text.replace(/\d/g, (digit) => MY_DIGITS[digit]) : text;
}

const UNITS = ['days', 'hours', 'minutes', 'seconds'];

export default function Countdown() {
    const { copy, lang } = useLanguage();
    const { countdown } = copy;
    const [time, setTime] = useState(null);

    useEffect(() => {
        const tick = () => setTime(timeUntilLaunch());
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, []);

    if (time?.done) {
        return <p className="countdown countdown-live">{countdown.live}</p>;
    }

    return (
        <div className={`countdown${time ? '' : ' countdown-pending'}`} role="timer" aria-label={`${countdown.label}, ${countdown.zone}`}>
            <p className="countdown-label">
                <Phrase text={countdown.label} />
                <span className="countdown-zone">
                    <Phrase text={countdown.zone} />
                </span>
            </p>
            <div className="countdown-units" aria-hidden={time ? undefined : true}>
                {UNITS.map((key) => (
                    <div className="countdown-unit" key={key}>
                        <span className="countdown-value">{time ? digits(time[key], lang) : '00'}</span>
                        <span className="countdown-name">{countdown[key]}</span>
                    </div>
                ))}
            </div>
            <LaunchList />
        </div>
    );
}
