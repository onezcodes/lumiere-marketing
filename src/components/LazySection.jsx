import { Suspense, useEffect, useRef, useState } from 'react';

/**
 * Mounts its children only once the reader scrolls within ~600px of it, so the code and data
 * for the live demos never load for someone who doesn't reach them.
 */
export default function LazySection({ id, children, minHeight = 600, fallback = null }) {
    const ref = useRef(null);
    const [near, setNear] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node || !('IntersectionObserver' in window)) {
            setNear(true);
            return undefined;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setNear(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '600px 0px' },
        );
        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} id={id} style={near ? undefined : { minHeight }}>
            {near && <Suspense fallback={fallback}>{children}</Suspense>}
        </div>
    );
}
