import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    return (
        <div className="event-card">
            <div className="event-card-content">
                <h3>{event.title}</h3>
                <p>{event.location}</p>
                <div className="event-detail">
                    <Link to={`/events/${event.id}`}>View Details</Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard