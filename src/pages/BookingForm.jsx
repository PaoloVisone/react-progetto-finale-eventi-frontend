import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faCalendar, faSpinner, faMapMarkerAlt, faEuroSign, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../css/BookingForm.css';
import { API_BASE_URL } from '../api/config';

const BookingForm = () => {
    // Estrae l'ID evento dalla URL
    const { id } = useParams();
    const navigate = useNavigate();

    // Stato per i dettagli evento e loading
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // Stato per il form e gestione dello stato di submit
    const [formData, setFormData] = useState({
        event_id: id,
        user_name: '',
        user_email: '',
        user_phone: '',
        tickets: 1
    });
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    // Effetto per caricare i dettagli dell'evento
    useEffect(() => {
        console.log('Chiamata API per evento con id:', id);

        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events/${id}`);
                console.log('Risposta API:', response.data);
                setEventDetails(response.data.data || response.data);
            } catch (error) {
                console.error('Errore nel caricamento evento:', error);
                setMessage('Evento non trovato');
                navigate('/events');
            } finally {
                console.log('Caricamento evento completato');
                setLoading(false);
            }
        };

        if (id) {
            console.log('ID evento presente:', id);
            fetchEventDetails();
        } else {
            console.warn('ID evento non presente');
        }
    }, [id, navigate]);

    // VALIDAZIONE DINAMICA QUANTITÀ BIGLIETTI
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'tickets') {
            const requestedTickets = parseInt(value) || 1;
            const maxTickets = Math.min(10, eventDetails.capacity - eventDetails.booked_seats);

            setFormData(prev => ({
                ...prev,
                [name]: Math.max(1, Math.min(requestedTickets, maxTickets))
            }));

            // Avviso se l'utente prova a inserire più biglietti di quelli disponibili
            if (requestedTickets > maxTickets) {
                setMessage(`Massimo ${maxTickets} biglietti disponibili`);
                setStatus('warning');
            } else if (status === 'warning') {
                setMessage('');
                setStatus('idle');
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    // Gestione submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Preparazione dati con valori di default
        const payload = {
            event_id: parseInt(id, 10),
            user_name: formData.user_name || "Nome non fornito",
            user_email: formData.user_email || "email@default.com",
            user_phone: formData.user_phone || "",
            tickets: parseInt(formData.tickets, 10) || 1
        };

        // Verifica i dati prima dell'invio
        console.log("Payload prima dell'invio:", payload);

        // Validazione campi obbligatori
        if (!payload.user_name || !payload.user_email) {
            setStatus('error');
            setMessage('Compila tutti i campi obbligatori');
            return;
        }

        // Validazione email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.user_email)) {
            setStatus('error');
            setMessage('Inserisci un indirizzo email valido');
            return;
        }

        // Validazione posti disponibili
        const currentAvailableSeats = eventDetails.capacity - eventDetails.booked_seats;
        if (currentAvailableSeats < payload.tickets) {
            setStatus('error');
            setMessage(`Solo ${currentAvailableSeats} posti disponibili`);
            return;
        }

        setStatus('loading');

        try {
            const response = await axios.post(`${API_BASE_URL}/bookings`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Risposta completa dal backend:', response);

            if (response.data.success) {
                setStatus('success');
                setMessage('Prenotazione effettuata con successo!');

                // Aggiorna i posti prenotati localmente
                setEventDetails(prev => ({
                    ...prev,
                    booked_seats: prev.booked_seats + payload.tickets
                }));

                // Ricarica i dati dal server per sicurezza
                await refreshEventDetails();

                // Reset form
                setFormData({
                    event_id: id,
                    user_name: '',
                    user_email: '',
                    user_phone: '',
                    tickets: 1
                });
            } else {
                throw new Error(response.data.message || 'Errore sconosciuto dal server');
            }

        } catch (error) {
            console.error("Dettagli errore completo:", {
                request: payload,
                response: error.response?.data
            });

            setStatus('error');
            setMessage(
                error.response?.data?.message ||
                error.response?.data?.errors?.join(', ') ||
                'Errore durante la prenotazione'
            );
        }
    };

    // FUNZIONE PER RICARICARE I DETTAGLI EVENTO
    const refreshEventDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/events/${id}`);
            setEventDetails(response.data.data || response.data);
            console.log('Dati evento aggiornati:', response.data);
        } catch (error) {
            console.error('Errore nel refresh dei dati evento:', error);
        }
    };

    // CONTROLLO AUTOMATICO POSTI DISPONIBILI
    useEffect(() => {
        const interval = setInterval(() => {
            if (status !== 'loading') {
                refreshEventDetails();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [id, status]);

    // Calcola posti disponibili e prezzo totale
    const availableSeats = eventDetails ? eventDetails.capacity - eventDetails.booked_seats : 0;
    const totalPrice = eventDetails ? eventDetails.price * formData.tickets : 0;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <div className="loading-dot dot-1"></div>
                    <div className="loading-dot dot-2"></div>
                    <div className="loading-dot dot-3"></div>
                </div>
            </div>
        );
    }

    if (!eventDetails || !eventDetails.title) {
        console.log('Stato: eventDetails mancante o incompleto', eventDetails);
        return <div className="error-message">Dettagli evento non disponibili</div>;
    }

    return (
        <div className="booking-page">
            <div className="booking-container">
                <div className="page-header">
                    <FontAwesomeIcon icon={faCalendar} className="header-icon" />
                    <h1 className="page-title">Prenota il tuo posto</h1>
                </div>

                <div className="booking-content">
                    {/* Colonna sinistra - Dettagli evento */}
                    <div className="event-details-column">
                        <div className="event-image-book-container">
                            {eventDetails.image ? (
                                <img
                                    src={`http://127.0.0.1:8000/storage/${eventDetails.image}`}
                                    alt={eventDetails.title}
                                    className="event-image-book"
                                />
                            ) : (
                                <div className="event-image-placeholder">
                                    <FontAwesomeIcon icon={faCalendar} />
                                </div>
                            )}
                        </div>

                        {/* Informazioni evento */}
                        <div className="event-info-card">
                            <h2 className="event-title">{eventDetails.title}</h2>

                            {eventDetails.description && (
                                <p className="event-description">{eventDetails.description}</p>
                            )}

                            <div className="event-details-list">
                                <div className="detail-item">
                                    <FontAwesomeIcon icon={faCalendar} className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Data e ora</span>
                                        <span className="detail-value">
                                            {new Date(eventDetails.date_time).toLocaleDateString('it-IT', {
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

                                <div className="detail-item">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Luogo</span>
                                        <span className="detail-value">{eventDetails.location}</span>
                                    </div>
                                </div>

                                {eventDetails.price && (
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faEuroSign} className="detail-icon" />
                                        <div className="detail-content">
                                            <span className="detail-label">Prezzo per biglietto</span>
                                            <span className="detail-value">€{eventDetails.price}</span>
                                        </div>
                                    </div>
                                )}

                                {eventDetails.capacity && (
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faUsers} className="detail-icon" />
                                        <div className="detail-content">
                                            <span className="detail-label">Posti disponibili</span>
                                            <span className={`detail-value ${availableSeats < 5 ? 'seats-warning' : ''}`}>
                                                {availableSeats} su {eventDetails.capacity}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Colonna destra - Form prenotazione */}
                    <div className="booking-form-column">
                        <div className="booking-form-card">
                            <h3 className="form-title">Completa la prenotazione</h3>

                            <form onSubmit={handleSubmit} className="booking-form">
                                <div className="form-group">
                                    <label className="form-label">Nome Completo*</label>
                                    <div className="input-container">
                                        <input
                                            type="text"
                                            name="user_name"
                                            value={formData.user_name}
                                            onChange={handleInputChange}
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
                                            onChange={handleInputChange}
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
                                            onChange={handleInputChange}
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
                                            max={eventDetails.capacity ? availableSeats : 10}
                                            value={formData.tickets}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Riepilogo prezzo */}
                                {eventDetails.price && (
                                    <div className="price-summary-card">
                                        <h4 className="summary-title">Riepilogo</h4>
                                        <div className="summary-line">
                                            <span>Biglietti ({formData.tickets}x)</span>
                                            <span>€{eventDetails.price * formData.tickets}</span>
                                        </div>
                                        <div className="summary-total">
                                            <span>Totale</span>
                                            <span>€{totalPrice}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Messaggi di stato */}
                                {status === 'error' && (
                                    <div className="alert alert-error">{message}</div>
                                )}

                                {status === 'success' && (
                                    <div className="alert alert-success">{message}</div>
                                )}

                                {/* Pulsante submit */}
                                <button
                                    type="submit"
                                    className={`submit-button ${status === 'loading' ? 'loading' : ''}`}
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin className="button-icon" />
                                            <span>Elaborazione...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faTicket} className="button-icon" />
                                            <span>Conferma Prenotazione</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;