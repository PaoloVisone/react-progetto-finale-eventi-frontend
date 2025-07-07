import '../css/LoadingDotsError.css';

import '@fortawesome/fontawesome-free/css/all.css';


const LoadingDotsError = ({ error }) => {
    return (
        <div className="error-container">
            <div className="error-content">
                <i className="fas fa-exclamation-triangle error-icon"></i>
                <h2>Oops! Qualcosa è andato storto</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    <i className="fas fa-redo"></i>
                    Riprova
                </button>
            </div>
        </div>
    );
};

export default LoadingDotsError;