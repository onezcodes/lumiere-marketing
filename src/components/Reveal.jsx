import { useEffect, useRef, useState } from 'react';

/** Fades its children in the first time they scroll into view. */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, style, children, ...rest }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node || !('IntersectionObserver' in window)) {
            setVisible(true);
            return undefined;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -10% 0px' },
        );
        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <Tag ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ ...style, transitionDelay: `${delay}ms` }} {...rest}>
            {children}
        </Tag>
    );
}
