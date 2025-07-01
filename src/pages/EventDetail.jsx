import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import '../css/EventDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faSpinner } from '@fortawesome/free-solid-svg-icons';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Funzione per caricare i dati dell'evento
    const fetchEvent = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/events/${id}`);
            const eventData = response.data.data || response.data;
            console.log('Dati evento ricevuti:', {
                capacity: eventData.capacity,
                booked_seats: eventData.booked_seats || eventData.bookedSeats,
                available_seats: eventData.capacity - (eventData.booked_seats || eventData.bookedSeats || 0)
            });
            setEvent(eventData);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Effetto per il caricamento iniziale
    useEffect(() => {
        fetchEvent();
    }, [id]);

    // Effetto per il refresh automatico ogni 30 secondi
    useEffect(() => {
        const interval = setInterval(() => {
            if (!refreshing) {
                console.log('Aggiornamento automatico posti disponibili...');
                setRefreshing(true);
                fetchEvent();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [id, refreshing]);

    // Calcola i posti disponibili
    const bookedSeats = event?.booked_seats || event?.bookedSeats || 0;
    const availableSeats = event ? event.capacity - bookedSeats : 0;
    const isAvailable = availableSeats > 0;
    const seatsPercentage = event ? Math.round((availableSeats / event.capacity) * 100) : 0;

    // Funzione per formattare la data
    const formatDateTime = (dateTime) => {
        if (!dateTime) return { date: '', time: '' };
        const dt = new Date(dateTime);
        return {
            date: dt.toLocaleDateString('it-IT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            time: dt.toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const { date: formattedDate, time: formattedTime } = formatDateTime(event?.date_time);

    // Formatta il prezzo
    const formattedPrice = event && Number(event.price) > 0
        ? `€${Number(event.price).toFixed(2)}`
        : 'Gratuito';

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

    if (!event) return <div className="error-wrapper">Evento non trovato</div>;

    return (
        <div className="detail-container">
            <div className="event-header">
                <h1 className="event-title-detail">{event.title}</h1>
                <p className="event-description">{event.description}</p>
            </div>

            <img
                src={event.image ? `http://127.0.0.1:8000/storage/${event.image}` : '/placeholder-event.jpg'}
                alt={event.title}
                className="event-detail-image"
                onError={(e) => {
                    e.target.src = '/placeholder-event.jpg';
                }}
            />

            <div className="detail-section">
                <div className="detail">
                    <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{event.location}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Data:</span>
                        <span className="detail-value">{formattedDate}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Ora:</span>
                        <span className="detail-value">{formattedTime}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Prezzo:</span>
                        <span className="detail-value">{formattedPrice}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Categoria:</span>
                        <span
                            className="detail-value"
                            style={{ color: event.category?.color }}
                        >
                            {event.category?.name || "Nessuna categoria"}
                        </span>
                    </div>

                    {/* Sezione posti disponibili migliorata */}
                    <div className="detail-item">
                        <span className="detail-label">
                            <FontAwesomeIcon icon={faUsers} /> Posti:
                        </span>
                        <div className="seats-info">
                            <span className="detail-value">
                                {availableSeats} su {event.capacity}
                            </span>
                            <div className="seats-indicator">
                                <div
                                    className="seats-bar"
                                    style={{ width: `${seatsPercentage}%` }}
                                ></div>
                            </div>
                            {isAvailable ? (
                                <span className={`availability-badge ${seatsPercentage < 20 ? 'warning' : ''}`}>
                                    {seatsPercentage < 20 ? 'Ultimi posti!' : 'Disponibile!'}
                                </span>
                            ) : (
                                <span className="unavailable-badge">Esaurito</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="booking-section">
                {isAvailable ? (
                    <Link
                        to={`/events/${id}/bookings`}
                        className="book-button"
                    >
                        Prenota ora
                    </Link>
                ) : (
                    <button className="book-button" disabled>
                        Esaurito
                    </button>
                )}
                {refreshing && (
                    <div className="refreshing-notice">
                        <FontAwesomeIcon icon={faSpinner} spin /> Aggiornamento disponibilità...
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetail;