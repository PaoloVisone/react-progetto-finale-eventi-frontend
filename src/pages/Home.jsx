import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import { API_BASE_URL } from '../api/config';
import '../css/Home.css';

import '@fortawesome/fontawesome-free/css/all.css';

import LoadingDots from '../components/LoadingDots';
import LoadingDotsError from '../components/LoadingDotsError';
import EventCard from '../components/EventCard';
import Overlay from '../components/Overlay';

const Home = () => {
    // Stati per eventi, caricamento, errore, ricerca e filtro categoria
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Effettua la chiamata API per ottenere gli eventi
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await axios.get(`${API_BASE_URL}/events`);
                setEvents(data.data || data);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Errore nel caricamento degli eventi');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Filtra gli eventi in base a ricerca e categoria selezionata
    const getFilteredEvents = () => {
        return events.filter(event => {
            const matchesSearch = !searchTerm ||
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = !selectedCategory ||
                event.category?.name.toLowerCase() === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    };

    // Ottieni le categorie uniche dagli eventi
    const getUniqueCategories = () => {
        const categories = [...new Set(events.map(event => event.category?.name).filter(Boolean))];
        return categories;
    };

    // Reset dei filtri di ricerca e categoria
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
    };

    // Eventi filtrati e categorie uniche
    const filteredEvents = getFilteredEvents();
    const uniqueCategories = getUniqueCategories();

    if (loading) {
        return <LoadingDots />;
    }

    if (error || !events || events.length === 0) {
        return <LoadingDotsError error={error || "Nessun evento disponibile"} />;
    }


    return (
        <>
            {/* Overlay di benvenuto */}
            <Overlay duration={5000} showDots={true} />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Scopri esperienze
                            <span className="highlight"> indimenticabili</span>
                        </h1>
                        <p className="hero-subtitle">
                            Prenota i migliori eventi nella tua città e vivi momenti speciali
                        </p>
                        {/* Statistiche rapide */}
                        <div className="hero-stats">
                            <div className="stat-item">
                                <i className="fas fa-calendar-alt stat-icon"></i>
                                <span>{events.length}+ Eventi</span>
                            </div>
                            <div className="stat-item">
                                <i className="fas fa-map-marker-alt stat-icon"></i>
                                <span>Tutta Italia</span>
                            </div>
                            <div className="stat-item">
                                <i className="fas fa-star stat-icon"></i>
                                <span>Recensioni 5⭐</span>
                            </div>
                        </div>
                        {/* Bottone call-to-action */}
                        <Link to="/events" className="cta-button">
                            <span>Esplora ora</span>
                            <i className="fas fa-arrow-right cta-arrow"></i>
                        </Link>
                    </div>
                </div>
                <div className="hero-gradient"></div>
            </section>

            {/* Sezione di ricerca e filtri */}
            <section className="search-section">
                <div className="search-container">
                    <div className="search-header">
                        <h2 className="section-title">Trova il tuo evento perfetto</h2>
                        <p className="section-subtitle">Filtra per categoria o cerca per nome</p>
                    </div>

                    <div className="search-controls">
                        {/* Barra di ricerca */}
                        <div className="search-bar">
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Cerca eventi o località..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="clear-search"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>

                        {/* Filtri per categoria */}
                        <div className="category-filters">
                            <i className="fas fa-filter filter-icon"></i>
                            <div className="filter-buttons">
                                {/* Bottone per mostrare tutti */}
                                <button
                                    className={`category-filter ${!selectedCategory ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory('')}
                                >
                                    Tutti
                                </button>
                                {/* Bottoni per ogni categoria unica */}
                                {uniqueCategories.map(category => (
                                    <button
                                        key={category}
                                        className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sezione risultati */}
                    <div className="results-section">
                        {filteredEvents.length > 0 ? (
                            <>
                                {/* Header risultati e bottone reset filtri */}
                                <div className="results-header">
                                    <h3 className="results-title">
                                        {filteredEvents.length} {filteredEvents.length === 1 ? 'evento trovato' : 'eventi trovati'}
                                    </h3>
                                    {(searchTerm || selectedCategory) && (
                                        <button onClick={resetFilters} className="reset-btn">
                                            <i className="fas fa-times"></i>
                                            Cancella filtri
                                        </button>
                                    )}
                                </div>

                                <div className="results-container">
                                    <div className="results-stack">
                                        {filteredEvents.map((event, index) => (
                                            <div
                                                key={event.id}
                                                className={`result-card-wrapper ${index % 3 === 0 ? 'featured' : ''}`}
                                                style={{
                                                    '--card-index': index,
                                                    animationDelay: `${index * 0.1}s`
                                                }}
                                            >
                                                <EventCard event={event} compact />

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>

                        ) : (
                            // Nessun risultato trovato
                            <div className="no-results">
                                <div className="no-results-icon">
                                    <i className="fas fa-search"></i>
                                </div>
                                <h3>Nessun evento trovato</h3>
                                <p>Prova a modificare i filtri di ricerca</p>
                                <button onClick={resetFilters} className="reset-btn">
                                    <i className="fas fa-redo"></i>
                                    Cancella filtri
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;