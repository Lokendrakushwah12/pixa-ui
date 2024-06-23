import React, { useRef, useState, useEffect } from "react";

const EmojiExplosion = ({ emoji, children, count = 5, duration = 1000 }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const particles = useRef([]);

    const handleMouseDown = (e) => {
        if (!isAnimating && containerRef.current) {
            setIsAnimating(true);

            const { clientX, clientY } = e;

            const generateParticle = () => {
                const size = Math.random() * 25 + 20;
                const speedHorz = Math.random() * 10;
                const speedUp = Math.random() * 25;
                const spinVal = Math.random() * 360;
                const spinSpeed = Math.random() * 5 * (Math.random() <= 0.5 ? -1 : 1);
                const direction = Math.random() <= 0.5 ? -1 : 1;
                const opacity = 1;
                
                const left = clientX - size / 2;
                const top = clientY - size / 2;

                const particle = document.createElement("div");
                particle.innerHTML = `<div style="font-size: ${size}px; opacity: ${opacity};">${emoji}</div>`;
                particle.style.position = "absolute";
                particle.style.transform = `translate3d(${left}px, ${top}px, 0px) rotate(${spinVal}deg)`;

                if (containerRef.current) {
                    containerRef.current.appendChild(particle);
                }

                particles.current.push({
                    direction,
                    element: particle,
                    left,
                    top,
                    size,
                    speedHorz,
                    speedUp,
                    spinSpeed,
                    spinVal,
                    opacity,
                    lifespan: duration,
                });
            };

            const refreshParticles = () => {
                particles.current.forEach((p) => {
                    p.left -= p.speedHorz * p.direction;
                    p.top -= p.speedUp;
                    p.speedUp = Math.min(p.size, p.speedUp - 1);
                    p.spinVal += p.spinSpeed;
                    p.opacity = Math.max(0, p.opacity - 1 / (p.lifespan / 60));
                    p.size -= 0.5;

                    if (p.top >= Math.max(window.innerHeight, document.body.clientHeight) + p.size || p.opacity <= 0) {
                        particles.current = particles.current.filter((o) => o !== p);
                        p.element.remove();
                    }

                    if (p.element) {
                        p.element.style.cssText = [
                            "position:absolute",
                            "will-change:transform",
                            `top:${p.top}px`,
                            `left:${p.left}px`,
                            `transform:rotate(${p.spinVal}deg) scale(0.5)`,
                            `opacity:${p.opacity}`,
                            `font-size:${p.size}px`,
                        ].join(";");
                    }
                });
            };

            const loop = () => {
                refreshParticles();
                if (particles.current.length > 0) {
                    animationFrameRef.current = requestAnimationFrame(loop);
                } else {
                    setIsAnimating(false);
                }
            };

            const onAnimationEnd = () => {
                cancelAnimationFrame(animationFrameRef.current);
                particles.current.forEach((p) => p.element.remove());
                particles.current = [];
                setIsAnimating(false);
            };

            for (let i = 0; i < count; i++) {
                generateParticle();
            }
            loop();

            setTimeout(() => {
                onAnimationEnd();
            }, duration);
        }
    };

    useEffect(() => {
        const container = containerRef.current;

        if (container) {
            container.addEventListener("mousedown", handleMouseDown);
        }

        return () => {
            if (container) {
                container.removeEventListener("mousedown", handleMouseDown);
            }
        };
    }, [emoji, count, duration, isAnimating]);

    return React.cloneElement(children, { ref: containerRef, disabled: isAnimating });
};

export default EmojiExplosion;
