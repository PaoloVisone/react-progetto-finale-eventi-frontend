import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendar,
    faMapMarkerAlt,
    faEuroSign,
    faUsers
} from '@fortawesome/free-solid-svg-icons';

// Componenti esterni
import LoadingDots from '../components/LoadingDots';
import LoadingDotsError from '../components/LoadingDotsError';
import BookingForm from '../components/BookingForm';
import PaymentForm from '../components/PaymentForm';
import ConfirmationModal from '../components/ConfirmationModal';

import '../css/Booking.css';
import { API_BASE_URL } from '../api/config';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [paymentStep, setPaymentStep] = useState('form');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [formData, setFormData] = useState({
        event_id: id,
        user_name: '',
        user_email: '',
        user_phone: '',
        tickets: 1
    });
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    // Carica i dettagli dell'evento
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events/${id}`);
                setEvent(response.data.data || response.data);
            } catch (error) {
                console.error('Errore nel caricamento evento:', error);
                setMessage('Evento non trovato');
                navigate('/events');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEventDetails();
    }, [id, navigate]);

    // Gestione cambiamento form
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'tickets') {
            const requestedTickets = parseInt(value) || 1;
            const maxTickets = Math.min(80, event.capacity - event.booked_seats);

            setFormData(prev => ({
                ...prev,
                [name]: Math.max(1, Math.min(requestedTickets, maxTickets))
            }));

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

    // Validazione form e passaggio a pagamento
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validazione campi obbligatori
        if (!formData.user_name || !formData.user_email) {
            setStatus('error');
            setMessage('Compila tutti i campi obbligatori');
            return;
        }

        // Validazione formato email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
            setStatus('error');
            setMessage('Inserisci un indirizzo email valido');
            return;
        }

        // Controlla disponibilità posti
        const currentAvailableSeats = event.capacity - event.booked_seats;
        if (currentAvailableSeats < formData.tickets) {
            setStatus('error');
            setMessage(`Solo ${currentAvailableSeats} posti disponibili`);
            return;
        }

        // Tutto ok, procedi al pagamento
        setPaymentStep('payment');
        setStatus('idle');
    };

    // Mappa i metodi di pagamento frontend -> backend
    const mapPaymentMethodToBackend = (method) => {
        switch (method) {
            case 'credit': return 'credit_card';
            case 'paypal': return 'paypal';
            case 'bank': return 'bank_transfer';
            default: return null;
        }
    };

    // Processo di pagamento
    const processPayment = async () => {
        setPaymentProcessing(true);
        setStatus('loading');

        try {
            // Prepara i dati per il backend
            const payload = {
                ...formData,
                event_id: parseInt(id, 10),
                tickets: parseInt(formData.tickets, 10),
                payment_method: mapPaymentMethodToBackend(paymentMethod)
            };

            // Invia i dati al backend
            const response = await axios.post(`${API_BASE_URL}/bookings`, payload);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Errore nel server');
            }

            // Crea i dettagli per la conferma
            const bookingData = {
                ...response.data.data,
                eventTitle: event.title,
                eventDate: event.date_time,
                totalPrice: event.price * payload.tickets,
                paymentMethod: getPaymentMethodName(paymentMethod)
            };

            // Invia email di conferma (se necessario)
            await sendConfirmationEmail(bookingData);

            // Aggiorna stato e mostra conferma
            setBookingDetails(bookingData);
            setPaymentStep('confirmation');
            setStatus('success');

            // Aggiorna posti disponibili
            setEvent(prev => ({
                ...prev,
                booked_seats: prev.booked_seats + payload.tickets
            }));

        } catch (error) {
            console.error("Errore nel pagamento:", error);
            setStatus('error');
            setMessage(
                error.response?.data?.message ||
                error.message ||
                'Errore durante il pagamento'
            );
        } finally {
            setPaymentProcessing(false);
        }
    };

    // Converte il metodo di pagamento in nome leggibile
    const getPaymentMethodName = (method) => {
        switch (method) {
            case 'credit': return 'Carta di credito';
            case 'paypal': return 'PayPal';
            case 'bank': return 'Bonifico bancario';
            default: return method;
        }
    };

    // Funzione per invio email (con EmailJS)
    const sendConfirmationEmail = async (bookingData) => {
        try {
            const templateParams = {
                to_name: bookingData.user_name,
                to_email: bookingData.user_email,
                event_name: bookingData.eventTitle,
                event_date: new Date(bookingData.eventDate).toLocaleDateString('it-IT', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                tickets: bookingData.tickets,
                total_price: bookingData.totalPrice.toFixed(2),
                booking_id: bookingData.id,
                payment_method: bookingData.paymentMethod
            };

            // Esempio con EmailJS - sostituisci con i tuoi ID
            if (window.emailjs) {
                await window.emailjs.send(
                    'YOUR_SERVICE_ID',
                    'YOUR_TEMPLATE_ID',
                    templateParams,
                    'YOUR_USER_ID'
                );
                console.log('Email inviata con successo');
            }
        } catch (error) {
            console.error('Errore nell\'invio dell\'email:', error);
        }
    };

    // Gestione chiusura modal
    const handleCloseModal = () => {
        setPaymentStep('form');
        setPaymentMethod('');
        setBookingDetails(null);
    };

    // Gestione ritorno alla home
    const handleGoHome = () => {
        handleCloseModal();
        navigate('/');
    };

    // Gestione ritorno al form
    const handleGoBackToForm = () => {
        setPaymentStep('form');
        setPaymentMethod('');
        setStatus('idle');
        setMessage('');
    };

    // Calcoli ausiliari
    const availableSeats = event ? event.capacity - event.booked_seats : 0;
    const totalPrice = event ? event.price * formData.tickets : 0;

    if (loading) {
        return <LoadingDots />;
    }

    if (!event || !event.title) {
        return <LoadingDotsError />;
    }

    return (
        <div className="booking-page">
            {/* Modal di conferma */}
            {paymentStep === 'confirmation' && bookingDetails && (
                <ConfirmationModal
                    bookingDetails={bookingDetails}
                    onClose={handleCloseModal}
                    onGoHome={handleGoHome}
                />
            )}

            <div className="booking-container">
                <div className="page-booking-header">
                    <FontAwesomeIcon icon={faCalendar} className="header-icon" />
                    <h1 className="page-title">
                        {paymentStep === 'form' ? 'Prenota il tuo posto' :
                            paymentStep === 'payment' ? 'Completa il pagamento' : ''}
                    </h1>
                </div>

                <div className="booking-content">
                    {/* Colonna sinistra - Dettagli evento */}
                    <div className="event-details-column">
                        <div className="event-image-book-container">
                            {event.image ? (
                                <img
                                    src={event.image ? `http://127.0.0.1:8000/storage/${event.image}` : '/placeholder-event.jpg'}
                                    alt={event.title}
                                    className="event-image-book"
                                />
                            ) : (
                                <div className="event-image-placeholder">
                                    <FontAwesomeIcon icon={faCalendar} />
                                </div>
                            )}
                        </div>

                        <div className="event-info-card">
                            <h2 className="event-title">{event.title}</h2>

                            {event.description && (
                                <p className="event-description">{event.description}</p>
                            )}

                            <div className="event-details-list">
                                <div className="detail-item">
                                    <FontAwesomeIcon icon={faCalendar} className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Data e ora</span>
                                        <span className="detail-value">
                                            {new Date(event.date_time).toLocaleDateString('it-IT', {
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
                                        <span className="detail-value">{event.location}</span>
                                    </div>
                                </div>

                                {event.price && (
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faEuroSign} className="detail-icon" />
                                        <div className="detail-content">
                                            <span className="detail-label">Prezzo per biglietto</span>
                                            <span className="detail-value">€{event.price}</span>
                                        </div>
                                    </div>
                                )}

                                {event.capacity && (
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faUsers} className="detail-icon" />
                                        <div className="detail-content">
                                            <span className="detail-label">Posti disponibili</span>
                                            <span className={`detail-value ${availableSeats < 5 ? 'seats-warning' : ''}`}>
                                                {availableSeats} su {event.capacity}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Colonna destra - Contenuto dinamico */}
                    <div className="booking-form-column">
                        {paymentStep === 'form' && (
                            <BookingForm
                                formData={formData}
                                onInputChange={handleInputChange}
                                onSubmit={handleSubmit}
                                event={event}
                                availableSeats={availableSeats}
                                totalPrice={totalPrice}
                                status={status}
                                message={message}
                            />
                        )}

                        {paymentStep === 'payment' && (
                            <PaymentForm
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                onProcessPayment={processPayment}
                                onGoBack={handleGoBackToForm}
                                paymentProcessing={paymentProcessing}
                                formData={formData}
                                totalPrice={totalPrice}
                                status={status}
                                message={message}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;