import { Fragment } from 'react';

/**
 * Text that may only wrap at its spaces. Burmese has no spaces between words, so browsers
 * break headings mid-phrase; the copy puts spaces between phrases and this keeps each whole.
 * The space sits outside the no-wrap span, so it stays a break point.
 */
export default function Phrase({ text }) {
    const parts = String(text).split(' ');

    return parts.map((part, index) => (
        <Fragment key={index}>
            {index > 0 && ' '}
            <span className="phrase">{part}</span>
        </Fragment>
    ));
}
