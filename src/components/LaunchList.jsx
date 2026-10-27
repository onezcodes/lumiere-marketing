import { useEffect, useId, useState } from 'react';
import { site } from '../content/site';
import { useLanguage } from '../i18n';
import { launchCalendar, launchPageUrl, notifyMailUrl, parseContact } from '../launch';
import Icon from './Icon';

const STORAGE_KEY = 'lumiere-launch-notified';
const listeners = new Set();

function readNotified() {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return false;
    }
}

function rememberNotified() {
    try {
        window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
        // Forgetting the thank-you state is fine.
    }
    listeners.forEach((listener) => listener());
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.left = '-9999px';
        document.body.appendChild(area);
        area.select();
        const copied = document.execCommand('copy');
        area.remove();
        return copied;
    }
}

export default function LaunchList() {
    const { copy, lang } = useLanguage();
    const { launch } = copy;
    const fieldId = useId();
    const [contact, setContact] = useState('');
    const [company, setCompany] = useState('');
    const [status, setStatus] = useState('idle');
    const [shared, setShared] = useState(false);
    const [shareNote, setShareNote] = useState('');

    useEffect(() => {
        if (readNotified()) setStatus('done');
        const onChange = () => setStatus('done');
        listeners.add(onChange);
        return () => listeners.delete(onChange);
    }, []);

    useEffect(() => {
        if (!shared) return undefined;
        const id = window.setTimeout(() => setShared(false), 2000);
        return () => window.clearTimeout(id);
    }, [shared]);

    function addToCalendar() {
        const page = launchPageUrl(lang);
        const file = launchCalendar({
            summary: launch.calendarTitle,
            description: `${launch.shareText}\n${page}`,
            url: page,
        });
        const blob = new Blob([file], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'lumiere-opens.ics';
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    async function share() {
        const page = launchPageUrl(lang);
        const text = `${launch.shareText} ${page}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: 'Lumière', text: launch.shareText, url: page });
                return;
            }
        } catch (error) {
            if (error?.name === 'AbortError') return;
        }
        if (await copyText(text)) {
            setShareNote('');
            setShared(true);
            return;
        }
        setShareNote(text);
    }

    async function submit(event) {
        event.preventDefault();
        if (!parseContact(contact)) {
            setStatus('invalid');
            return;
        }
        setStatus('sending');
        try {
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ contact, lang, company }),
            });
            const isJson = (response.headers.get('content-type') || '').includes('application/json');
            if (response.ok && isJson) {
                rememberNotified();
                setStatus('done');
                return;
            }
            if (!isJson || response.status === 404 || response.status === 503) {
                const link = document.createElement('a');
                link.href = notifyMailUrl(contact, lang);
                link.click();
                setStatus('mail');
                return;
            }
        } catch {
            const link = document.createElement('a');
            link.href = notifyMailUrl(contact, lang);
            link.click();
            setStatus('mail');
            return;
        }
        setStatus('failed');
    }

    return (
        <div className="launch">
            <div className="countdown-tools">
                <button type="button" className="countdown-tool" onClick={addToCalendar}>
                    <Icon name="calendar" size={16} /> {launch.calendar}
                </button>
                <button type="button" className="countdown-tool" onClick={share}>
                    <Icon name="share" size={16} /> {shared ? launch.shared : launch.share}
                </button>
            </div>
            {shareNote && (
                <p className="notify-note" role="status">
                    {shareNote}
                </p>
            )}
            {status === 'done' ? (
                <p className="notify-done" role="status">
                    {launch.done}
                </p>
            ) : (
                <form className="notify" onSubmit={submit} noValidate>
                    <label className="notify-label" htmlFor={fieldId}>
                        {launch.label}
                    </label>
                    <div className="notify-form">
                        <input
                            id={fieldId}
                            name="contact"
                            type="text"
                            autoComplete="on"
                            autoCapitalize="off"
                            spellCheck="false"
                            maxLength={120}
                            placeholder={launch.placeholder}
                            value={contact}
                            aria-invalid={status === 'invalid' || undefined}
                            onChange={(event) => {
                                setContact(event.target.value);
                                if (status === 'invalid' || status === 'failed') setStatus('idle');
                            }}
                        />
                        <input
                            className="visually-hidden"
                            tabIndex={-1}
                            autoComplete="off"
                            name="company"
                            value={company}
                            aria-hidden="true"
                            onChange={(event) => setCompany(event.target.value)}
                        />
                        <button className="btn btn-spring" type="submit" disabled={status === 'sending'}>
                            {status === 'sending' ? launch.sending : launch.button}
                        </button>
                    </div>
                    <p className="notify-note" role="status">
                        {status === 'invalid' && launch.invalid}
                        {status === 'failed' && launch.failed}
                        {status === 'mail' && launch.mail}
                        {(status === 'idle' || status === 'sending') && (
                            <>
                                {launch.note}{' '}
                                <a href={site.privacyUrl}>{copy.footer.privacy}</a>
                            </>
                        )}
                    </p>
                </form>
            )}
        </div>
    );
}
