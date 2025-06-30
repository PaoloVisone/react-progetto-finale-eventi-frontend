import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import '../css/EventDetail.css';

const EventDetail = () => {
    // Recupera l'id dell'evento dalla URL
    const { id } = useParams();

    // Stato per i dati dell'evento e per il caricamento
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Effettua la richiesta API per ottenere i dettagli dell'evento
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Chiamata API per i dettagli dell'evento
                const response = await axios.get(`${API_BASE_URL}/events/${id}`);
                // Salva i dati dell'evento nello stato
                setEvent(response.data.data || response.data);
                console.log('Event detail API response:', response.data);
            } catch (error) {
                // Gestione errori di chiamata API
                console.error('Error fetching event:', error);
            } finally {
                // Fine caricamento
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // Calcola i posti disponibili e lo stato di disponibilità
    const availableSeats = event?.capacity - (event?.bookedSeats || 0);
    const isAvailable = availableSeats > 0;
    const seatsPercentage = event ? Math.round((availableSeats / event.capacity) * 100) : 0;

    // Formatta data e ora dell'evento
    const eventDateTime = event ? new Date(event.date_time) : new Date();
    const formattedDate = eventDateTime.toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = eventDateTime.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Formatta il prezzo dell'evento
    const formattedPrice = event && Number(event.price) > 0
        ? `€${Number(event.price).toFixed(2)}`
        : 'Gratuito';

    // Mostra il loader durante il caricamento
    if (loading) return <div className="loading-wrapper">Loading...</div>;
    // Mostra errore se l'evento non viene trovato
    if (!event) return <div className="error-wrapper">Event not found</div>;

    return (
        <div className="detail-container">
            {/* Header dell'evento */}
            <div className="event-header">
                {/* Categoria con colore dinamico */}
                <span
                    className="event-category"
                    style={{ backgroundColor: event.category?.color || '#ccc' }}
                >
                    {event.category?.name || "Nessuna categoria"}
                </span>
                <h1 className="event-title-detail">{event.title}</h1>
                <p className="event-description">{event.description}</p>
            </div>

            {/* Immagine dell'evento */}
            <img
                src={event.image ? `http://127.0.0.1:8000/storage/${event.image}` : '/placeholder-event.jpg'}
                alt={event.title}
                className="event-detail-image"
                onError={(e) => {
                    // Mostra immagine di default se c'è un errore di caricamento
                    e.target.src = '/placeholder-event.jpg';
                }}
            />

            {/* Sezione dettagli evento */}
            <div className="detail-section">
                <div className="detail">
                    {/* Location */}
                    <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{event.location}</span>
                    </div>
                    {/* Data */}
                    <div className="detail-item">
                        <span className="detail-label">Data:</span>
                        <span className="detail-value">{formattedDate}</span>
                    </div>
                    {/* Ora */}
                    <div className="detail-item">
                        <span className="detail-label">Ora:</span>
                        <span className="detail-value">{formattedTime}</span>
                    </div>
                    {/* Prezzo */}
                    <div className="detail-item">
                        <span className="detail-label">Prezzo:</span>
                        <span className="detail-value">{formattedPrice}</span>
                    </div>
                    {/* Categoria con colore dinamico */}
                    <div className="detail-item">
                        <span className="detail-label">Categoria:</span>
                        {/* Mostra il nome della categoria con il colore associato */}
                        <span
                            className="detail-value"
                            style={{ color: event.category.color }}
                        >
                            {event.category.name}
                        </span>
                    </div>
                    {/* Posti disponibili */}
                    <div className="detail-item">
                        <span className="detail-label">Posti:</span>
                        <span className="detail-value">
                            {availableSeats} su {event.capacity}
                            {/* Badge di disponibilità o esaurito */}
                            {isAvailable ? (
                                <span className={`availability-badge ${seatsPercentage < 20 ? 'warning' : ''}`}>
                                    {seatsPercentage < 20 ? 'Ultimi posti!' : 'Disponibile!'}
                                </span>
                            ) : (
                                <span className="unavailable-badge">Esaurito</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Sezione prenotazione */}
            <div className="booking-section">
                {isAvailable ? (
                    // Bottone prenota ora se ci sono posti disponibili
                    <Link
                        to={`/events/${id}/bookings`}
                        className="book-button"
                    >
                        Prenota ora
                    </Link>
                ) : (
                    // Bottone disabilitato se esaurito
                    <button className="book-button" disabled>
                        Esaurito
                    </button>
                )}
            </div>
        </div>
    );
};

export default EventDetail;