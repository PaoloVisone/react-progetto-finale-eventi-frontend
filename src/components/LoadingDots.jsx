import '../css/LoadingDots.css';

const LoadingDots = () => {
    return (
        <div className="loading-container">
            <div className="loading-spinner">
                <div className="spinner-dot"></div>
                <div className="spinner-dot"></div>
                <div className="spinner-dot"></div>
            </div>
            <div className="loading-text">
                Caricamento eventi...
            </div>
        </div>
    );
};

export default LoadingDots;