import { Link } from 'react-router-dom';
import '../css/EventCard.css';

const EventCard = ({ event }) => {
    return (
        <div className="card">
            {event.image && (
                <div className="event-card-image-container">
                    <img
                        src={`http://127.0.0.1:8000/storage/${event.image}`}
                        alt={event.title}
                        className="event-card-image"
                    />
                </div>
            )}

            <div className="event-card-overlay"></div>

            <div className="event-card-content">
                <h3>{event.title}</h3>
                <p className="event-home-location">{event.location}</p>
                <div className="event-detail">
                    <Link to={`/events/${event.id}`}>Dettagli Evento</Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;