import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import EventCard from '../components/EventCard';


const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home">
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))
            }
        </div>
    )

}

export default Home;