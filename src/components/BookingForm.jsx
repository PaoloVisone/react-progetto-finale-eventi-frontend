import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import '../css/BookingForm.css';

const BookingForm = ({
    formData,
    onInputChange,
    onSubmit,
    event,
    availableSeats,
    totalPrice,
    status,
    message
}) => {
    return (
        <div className="booking-form-card">
            <h3 className="form-title">Completa la prenotazione</h3>

            <form onSubmit={onSubmit} className="booking-form">
                <div className="form-group">
                    <label className="form-label">Nome Completo*</label>
                    <div className="input-container">
                        <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={onInputChange}
                            className="form-input"
                            placeholder="Inserisci il tuo nome completo"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Email*</label>
                    <div className="input-container">
                        <input
                            type="email"
                            name="user_email"
                            value={formData.user_email}
                            onChange={onInputChange}
                            className="form-input"
                            placeholder="la.tua.email@esempio.it"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Telefono</label>
                    <div className="input-container">
                        <input
                            type="tel"
                            name="user_phone"
                            value={formData.user_phone}
                            onChange={onInputChange}
                            className="form-input"
                            placeholder="+39 123 456 7890"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Numero Biglietti*</label>
                    <div className="input-container">
                        <input
                            type="number"
                            name="tickets"
                            min="1"
                            max={event.capacity ? availableSeats : 10}
                            value={formData.tickets}
                            onChange={onInputChange}
                            className="form-input"
                            required
                        />
                    </div>
                </div>

                {event.price && (
                    <div className="price-summary-card">
                        <h4 className="summary-title">Riepilogo</h4>
                        <div className="summary-line">
                            <span>Biglietti ({formData.tickets}x)</span>
                            <span>€{event.price * formData.tickets}</span>
                        </div>
                        <div className="summary-total">
                            <span>Totale</span>
                            <span>€{totalPrice}</span>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="alert alert-error">{message}</div>
                )}

                <button
                    type="submit"
                    className="submit-button"
                >
                    <FontAwesomeIcon icon={faTicket} className="button-icon" />
                    <span>Procedi al pagamento</span>
                </button>
            </form>
        </div>
    );
};

export default BookingForm;