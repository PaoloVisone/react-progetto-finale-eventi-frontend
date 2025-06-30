import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import '../css/Eventi.css';
import { useNavigate } from 'react-router-dom';

const Eventi = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Filtri
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
        date: '',
        searchQuery: ''
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events`);
                const eventsData = response.data.data || response.data;
                setEvents(eventsData);
                setFilteredEvents(eventsData);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Applica i filtri
    useEffect(() => {
        let result = [...events];

        if (filters.category) {
            result = result.filter(event =>
                event.category?.name.toLowerCase() === filters.category.toLowerCase()
            );
        }

        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            result = result.filter(event =>
                event.price >= min && (!max || event.price <= max)
            );
        }

        if (filters.date) {
            const selectedDate = new Date(filters.date);
            result = result.filter(event =>
                new Date(event.date_time).toDateString() === selectedDate.toDateString()
            );
        }

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(event =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query)
            );
        }

        setFilteredEvents(result);
    }, [filters, events]);

    const handlePrenota = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            category: '',
            priceRange: '',
            date: '',
            searchQuery: ''
        });
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="eventi-page">
            <h1 className="page-title">Tutti gli Eventi</h1>

            <div className="eventi-container">
                {/* Sidebar filtri */}
                <aside className="filters-sidebar">
                    <div className="filters-header">
                        <h3>Filtri</h3>
                        <button onClick={resetFilters} className="reset-filters">Resetta</button>
                    </div>

                    <div className="filter-group">
                        <label>Cerca</label>
                        <input
                            type="text"
                            name="searchQuery"
                            value={filters.searchQuery}
                            onChange={handleFilterChange}
                            placeholder="Cerca eventi..."
                        />
                    </div>

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

                    <div className="filter-group">
                        <label>Data</label>
                        <input
                            type="date"
                            name="date"
                            value={filters.date_time}
                            onChange={handleFilterChange}
                        />
                    </div>
                </aside>

                {/* Lista eventi */}
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
                                            <span className="event-category" style={{ backgroundColor: event.category?.color || '#ccc' }}>
                                                {event.category?.name || "Nessuna categoria"}
                                            </span>
                                            <span className="event-date">{new Date(event.date_time).toLocaleDateString()}</span>
                                        </div>
                                        <p className="event-location">{event.location}</p>
                                        <p className="event-description">{event.description}</p>
                                        <div className="event-footer">
                                            <span className="event-price">€{event.price}</span>
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
    );
};

export default Eventi;