import { Link } from 'react-router-dom';
import { Badge } from './common/UI';
import Icon from './common/Icon';
import { fmt, eventBannerClass } from '../utils/helpers';

export default function EventCard({ event, actions }) {
  return (
    <div className="event-card">
      <div className={eventBannerClass(event.status)} />
      <div className="event-card-body">
        <div className="flex items-center justify-between mb-2">
          <Badge status={event.status} />
          {event.registrationFee === 0
            ? <span className="badge badge-free">Free</span>
            : <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{fmt.price(event.registrationFee)}</span>
          }
        </div>
        <h3 className="event-card-title">{event.name}</h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }} className="line-clamp-2">
          {event.description}
        </p>
        <div className="event-card-meta">
          <div className="event-meta-row"><Icon name="calendar" size={14} />{fmt.date(event.date)}</div>
          <div className="event-meta-row"><Icon name="location" size={14} /><span className="truncate">{event.venue}</span></div>
          <div className="event-meta-row"><Icon name="users" size={14} />Max {event.maxParticipants} participants</div>
          {event.registrationDeadline && (
            <div className="event-meta-row"><Icon name="clock" size={14} />Deadline: {fmt.date(event.registrationDeadline)}</div>
          )}
        </div>
        <div className="event-card-footer">
          <span className={`event-price ${event.registrationFee === 0 ? 'event-price-free' : ''}`}>
            {fmt.price(event.registrationFee)}
          </span>
          <div className="flex gap-2">
            <Link to={`/events/${event._id}`} className="btn btn-secondary btn-sm">Details</Link>
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}
