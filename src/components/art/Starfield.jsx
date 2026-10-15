import { useEffect, useRef } from 'react';

/**
 * A twinkling sky on a canvas: a few hundred dots and an occasional shooting star. Cheap by
 * design — it caps the pixel ratio, draws at ~30fps, stops when off screen or in a hidden
 * tab, and draws one still frame for people who ask for reduced motion.
 */
export default function Starfield({ density = 0.00018, className = '' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let stars = [];
        let shooting = null;
        let frame = 0;
        let visible = true;
        let last = 0;
        let width = 0;
        let height = 0;

        const resize = () => {
            const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            const count = Math.min(420, Math.round(width * height * density));
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.1 + 0.25,
                phase: Math.random() * Math.PI * 2,
                speed: 0.4 + Math.random() * 1.2,
                green: Math.random() < 0.12,
            }));
        };

        const draw = (time) => {
            context.clearRect(0, 0, width, height);
            for (const star of stars) {
                const alpha = reduced ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(star.phase + (time / 1000) * star.speed));
                context.globalAlpha = alpha;
                context.fillStyle = star.green ? '#9ee493' : '#daf7dc';
                context.beginPath();
                context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                context.fill();
            }
            if (!reduced) {
                if (!shooting && Math.random() < 0.004) {
                    shooting = { x: Math.random() * width * 0.7, y: Math.random() * height * 0.4, life: 0 };
                }
                if (shooting) {
                    shooting.life += 1;
                    const progress = shooting.life / 40;
                    const x = shooting.x + progress * 260;
                    const y = shooting.y + progress * 110;
                    const gradient = context.createLinearGradient(x - 90, y - 38, x, y);
                    gradient.addColorStop(0, 'rgba(218,247,220,0)');
                    gradient.addColorStop(1, 'rgba(218,247,220,0.9)');
                    context.globalAlpha = 1 - progress;
                    context.strokeStyle = gradient;
                    context.lineWidth = 1.4;
                    context.beginPath();
                    context.moveTo(x - 90, y - 38);
                    context.lineTo(x, y);
                    context.stroke();
                    if (progress >= 1) {
                        shooting = null;
                    }
                }
            }
            context.globalAlpha = 1;
        };

        const loop = (time) => {
            frame = requestAnimationFrame(loop);
            if (!visible || document.hidden || time - last < 33) {
                return;
            }
            last = time;
            draw(time);
        };

        resize();
        draw(0);
        const resizeObserver = new ResizeObserver(() => {
            resize();
            draw(performance.now());
        });
        resizeObserver.observe(canvas);
        const intersection = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
        });
        intersection.observe(canvas);
        if (!reduced) {
            frame = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            intersection.disconnect();
        };
    }, [density]);

    return <canvas ref={canvasRef} className={`starfield ${className}`} aria-hidden="true" />;
}
