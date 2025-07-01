import { useState, useEffect } from 'react';
import '../css/Overlay.css';

const Overlay = ({ siteName, tagline, duration, showDots }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimatingOut(true);

            // Rimuove completamente dopo l'animazione di fade-out
            setTimeout(() => {
                setIsVisible(false);
            }, 800);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!isVisible) return null;

    return (
        <div className={`welcome-overlay ${isAnimatingOut ? 'fade-out' : ''}`}>
            <div className="welcome-content">
                <h1 className="site-name">{siteName}</h1>
                <p className="site-tagline">{tagline}</p>
                {showDots && (
                    <div className="loading-dots">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overlay;