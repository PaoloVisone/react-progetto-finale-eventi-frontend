import axios from 'axios';
import LoadingDots from '../components/LoadingDots';
import LoadingDotsError from '../components/LoadingDotsError';
import EventCard from '../components/EventCard';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../api/config';
import '../css/Eventi.css';

const Eventi = () => {
    // Stati per la lista eventi, eventi filtrati, caricamento e slide corrente del carousel
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [error, setError] = useState(null);

    // Stato per i filtri di ricerca
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
        date: '',
        searchQuery: ''
    });

    // Chiamata API per ottenere tutti gli eventi
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events`);
                const eventsData = response.data.data || response.data;
                setEvents(eventsData);
                setFilteredEvents(eventsData);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Errore nel caricamento degli eventi');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Applica i filtri ogni volta che filters o events cambiano
    useEffect(() => {
        let result = [...events];

        // Filtro per categoria
        if (filters.category) {
            result = result.filter(event =>
                event.category?.name.toLowerCase() === filters.category.toLowerCase()
            );
        }

        // Filtro per fascia di prezzo
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            result = result.filter(event =>
                event.price >= min && (!max || event.price <= max)
            );
        }

        // Filtro per data
        if (filters.date) {
            const selectedDate = new Date(filters.date);
            result = result.filter(event =>
                new Date(event.date_time).toDateString() === selectedDate.toDateString()
            );
        }

        // Filtro per ricerca testuale
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(event =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query)
            );
        }

        setFilteredEvents(result);
    }, [filters, events]);

    // Naviga al dettaglio evento quando si clicca "Prenota"
    const handlePrenota = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    // Gestione cambiamento dei filtri
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Reset di tutti i filtri
    const resetFilters = () => {
        setFilters({
            category: '',
            priceRange: '',
            date: '',
            searchQuery: ''
        });
    };

    // Scroll automatico del carousel degli eventi in evidenza
    useEffect(() => {
        if (events.length === 0) return;
        const interval = setInterval(() => {
            setCurrent(prev => (prev < events.length - 1 ? prev + 1 : 0));
        }, 4000); // Cambia slide ogni 4 secondi
        return () => clearInterval(interval);
    }, [events.length]);

    if (loading) {
        return <LoadingDots />;
    }

    if (error || !events || events.length === 0) {
        return <LoadingDotsError error={error || "Nessun evento disponibile"} />;
    }

    return (
        <>
            <div className="home-container">

                {/* Carousel eventi in evidenza */}
                {events.length > 0 && (
                    <section className="featured-section">
                        <div className="featured-header">
                            <h2 className="section-title">Eventi in evidenza</h2>
                            <p className="section-subtitle">I migliori eventi selezionati per te</p>
                        </div>
                        <div className="carousel-container">
                            {/* Track del carousel che si sposta in base a current */}
                            <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
                                {events.map(event => (
                                    <div key={event.id} className="carousel-slide">
                                        <EventCard event={event} />
                                    </div>
                                ))}
                            </div>
                            {/* Indicatori per selezionare manualmente la slide */}
                            <div className="carousel-indicators">
                                {events.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`indicator ${current === index ? 'active' : ''}`}
                                        onClick={() => setCurrent(index)} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
            <div className="eventi-page">
                <div className="page-header">
                    <FontAwesomeIcon icon={faTicket} className="header-icon" />
                    <h1 className="page-title">Seleziona il tuo Evento</h1>
                </div>
                <div className="eventi-container">
                    {/* Sidebar filtri */}
                    <aside className="filters-sidebar">
                        <div className="filters-header">
                            <h3>Filtri</h3>
                            <button onClick={resetFilters} className="reset-filters">Resetta</button>
                        </div>

                        {/* Filtro ricerca testuale */}
                        <div className="filter-group">
                            <label>Cerca</label>
                            <input
                                type="text"
                                name="searchQuery"
                                value={filters.searchQuery}
                                onChange={handleFilterChange}
                                placeholder="Cerca eventi..." />
                        </div>

                        {/* Filtro per categoria */}
                        <div className="filter-group">
                            <label>Categoria</label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tutte</option>
                                <option value="concerti">Concerti</option>
                                <option value="teatro">Teatro</option>
                                <option value="sport">Sport</option>
                                <option value="arte">Arte</option>
                            </select>
                        </div>

                        {/* Filtro per fascia di prezzo */}
                        <div className="filter-group">
                            <label>Fascia di prezzo</label>
                            <select
                                name="priceRange"
                                value={filters.priceRange}
                                onChange={handleFilterChange}
                            >
                                <option value="">Qualsiasi</option>
                                <option value="0-20">0-20 €</option>
                                <option value="20-50">20-50 €</option>
                                <option value="50-100">50-100 €</option>
                                <option value="100-">Oltre 100 €</option>
                            </select>
                        </div>

                        {/* Filtro per data */}
                        <div className="filter-group">
                            <label>Data</label>
                            <input
                                type="date"
                                name="date"
                                value={filters.date_time}
                                onChange={handleFilterChange} />
                        </div>
                    </aside>

                    {/* Lista eventi filtrati */}
                    <main className="events-list-container">
                        {filteredEvents.length === 0 ? (
                            <div className="no-results">Nessun evento trovato con i filtri selezionati</div>
                        ) : (
                            <div className="events-list">
                                {filteredEvents.map(event => (
                                    <div key={event.id} className="event-card">
                                        <div className="event-image">
                                            <img src={`http://127.0.0.1:8000/storage/${event.image}`} alt={event.title} />
                                        </div>
                                        <div className="event-details">
                                            <h2>{event.title}</h2>
                                            <div className="event-meta">
                                                {/* Badge categoria con colore dinamico */}
                                                <span className="event-category" style={{ backgroundColor: event.category?.color || '#ccc' }}>
                                                    {event.category?.name || "Nessuna categoria"}
                                                </span>
                                                <span className="event-date">{new Date(event.date_time).toLocaleDateString()}</span>
                                            </div>
                                            <p className="event-location">{event.location}</p>
                                            <p className="event-description">{event.description}</p>
                                            <div className="event-footer">
                                                <span className="event-price">€{event.price}</span>
                                                {/* Bottone prenota */}
                                                <button
                                                    onClick={() => handlePrenota(event.id)}
                                                    className="prenota-button"
                                                >
                                                    Prenota
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default Eventi;