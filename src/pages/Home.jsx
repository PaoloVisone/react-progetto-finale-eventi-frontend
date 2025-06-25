import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import EventCard from '../components/EventCard';
import '../css/Home.css'

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                // Log per capire la struttura della risposta
                setEvents(response.data.data || response.data);
                console.log('API response:', response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Auto-scroll del carousel
    useEffect(() => {
        if (!events || events.length === 0) return;

        const interval = setInterval(() => {
            setCurrent(prevCurrent =>
                prevCurrent < events.length - 1 ? prevCurrent + 1 : 0
            );
        }, 10000);

        return () => clearInterval(interval);
    }, [events.length]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!events || events.length === 0) {
        return <div>Nessun evento disponibile</div>;
    }

    return (
        <div className="home">
            <div className="carousel-container">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {events.map(event => (
                        <div key={event.id} className="carousel-slide">
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;