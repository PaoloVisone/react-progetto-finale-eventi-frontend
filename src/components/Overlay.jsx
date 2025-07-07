import { useState, useEffect } from 'react';
import '../css/Overlay.css';

const Overlay = ({ duration, showDots }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    useEffect(() => {
        // Blocca lo scroll quando l'overlay è montato
        document.body.classList.add('no-scroll');

        const timer = setTimeout(() => {
            setIsAnimatingOut(true);

            setTimeout(() => {
                setIsVisible(false);
                // Riabilita lo scroll quando l'overlay scompare
                document.body.classList.remove('no-scroll');
            }, 800);
        }, duration);

        return () => {
            clearTimeout(timer);
            // Pulizia: riabilita lo scroll se il componente viene smontato
            document.body.classList.remove('no-scroll');
        };
    }, [duration]);

    if (!isVisible) return null;

    return (
        <div className={`welcome-overlay ${isAnimatingOut ? 'fade-out' : ''}`}>
            <div className="welcome-content">
                <h1 className="site-name">Next<span className='logo-event'>Event</span></h1>
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