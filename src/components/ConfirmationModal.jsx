import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faTimes,
    faHome,
    faTicket,
    faCalendarDays,
    faCreditCard,
    faHashtag
} from '@fortawesome/free-solid-svg-icons';
import '../css/ConfirmationModal.css';

const ConfirmationModal = ({
    bookingDetails,
    onClose,
    onGoHome
}) => {
    return (
        <div className="modal-overlay">
            <div className="confirmation-modal">
                <button className="modal-close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="modal-content">
                    <div className="success-header">
                        <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                        <h2>Prenotazione Confermata!</h2>
                        <p>La tua prenotazione è stata elaborata con successo</p>
                    </div>

                    <div className="booking-summary">
                        <div className="summary-header">
                            <FontAwesomeIcon icon={faTicket} className="summary-icon" />
                            <h3>Dettagli Prenotazione</h3>
                        </div>

                        <div className="summary-grid">
                            <div className="summary-item">
                                <div className="item-icon">
                                    <FontAwesomeIcon icon={faHashtag} />
                                </div>
                                <div className="item-content">
                                    <span className="item-label">Codice Prenotazione</span>
                                    <span className="item-value">{bookingDetails.bookingId}</span>
                                </div>
                            </div>

                            <div className="summary-item">
                                <div className="item-icon">
                                    <FontAwesomeIcon icon={faTicket} />
                                </div>
                                <div className="item-content">
                                    <span className="item-label">Evento</span>
                                    <span className="item-value">{bookingDetails.eventTitle}</span>
                                </div>
                            </div>

                            <div className="summary-item">
                                <div className="item-icon">
                                    <FontAwesomeIcon icon={faCalendarDays} />
                                </div>
                                <div className="item-content">
                                    <span className="item-label">Data e Ora</span>
                                    <span className="item-value">
                                        {new Date(bookingDetails.eventDate).toLocaleDateString('it-IT', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="summary-item">
                                <div className="item-icon">
                                    <FontAwesomeIcon icon={faCreditCard} />
                                </div>
                                <div className="item-content">
                                    <span className="item-label">Metodo Pagamento</span>
                                    <span className="item-value">{bookingDetails.paymentMethod}</span>
                                </div>
                            </div>

                            <div className="summary-item">
                                <div className="item-icon">
                                    <FontAwesomeIcon icon={faTicket} />
                                </div>
                                <div className="item-content">
                                    <span className="item-label">Biglietti</span>
                                    <span className="item-value">{bookingDetails.tickets}</span>
                                </div>
                            </div>

                            <div className="summary-item total">
                                <div className="item-icon">
                                    <span className="euro-icon">€</span>
                                </div>
                                <div className="item-content">
                                    <span className="item-label">Totale Pagato</span>
                                    <span className="item-value">€{bookingDetails.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="next-steps">
                        <h4>Cosa fare ora?</h4>
                        <div className="steps-list">
                            <div className="step">
                                <span className="step-number">1</span>
                                <span className="step-text">Controlla la tua email per la conferma</span>
                            </div>
                            <div className="step">
                                <span className="step-number">2</span>
                                <span className="step-text">Salva il codice prenotazione</span>
                            </div>
                            <div className="step">
                                <span className="step-number">3</span>
                                <span className="step-text">Presenta il codice all'ingresso dell'evento</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            className="primary-button"
                            onClick={onGoHome}
                        >
                            <FontAwesomeIcon icon={faHome} className="button-icon" />
                            <span>Torna alla Home</span>
                        </button>
                        <button
                            className="secondary-button"
                            onClick={onClose}
                        >
                            <span>Chiudi</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;