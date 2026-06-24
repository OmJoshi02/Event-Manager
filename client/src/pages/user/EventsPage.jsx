import socket from "../../socket";
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { eventsAPI, registrationsAPI } from '../../api';
import { PageSpinner, SectionHeader, EmptyState, Modal } from '../../components/common/UI';
import EventCard from '../../components/EventCard';
import EventForm from '../../components/EventForm';
import Icon from '../../components/common/Icon';
import { getErrorMessage } from '../../utils/helpers';

const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

export default function EventsPage() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [createModal, setCreateModal] = useState(false);
  const [regLoading, setRegLoading] = useState(null);

  const load = () => {
    setLoading(true);
    eventsAPI.getAll()
      .then(r => setEvents(r.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {

  load();

  socket.on("eventCreated", (newEvent) => {

    console.log("New Event:", newEvent);

    setEvents(prev => [newEvent, ...prev]);

  }
);

  socket.on("eventUpdated", (updatedEvent) => {

    console.log("Updated Event:", updatedEvent);

    setEvents(prev =>
      prev.map(event =>
        event._id === updatedEvent._id
          ? updatedEvent
          : event
      )
    );

  });

  socket.on("eventDeleted", (eventId) => {

    console.log("Deleted Event:", eventId);

    setEvents(prev =>
      prev.filter(event =>
        event._id !== eventId
      )
    );

  });


  return () => {
    socket.off("eventCreated");
    socket.off("eventUpdated");
    socket.off("eventDeleted");
  };

}, []);

  const filtered = useMemo(() => {
    return events.filter(ev => {
      const matchStatus = filter === 'All' || ev.status?.toLowerCase() === filter.toLowerCase();
      const matchSearch = !search || ev.name?.toLowerCase().includes(search.toLowerCase()) || ev.venue?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [events, filter, search]);

  const handleRegister = async (eventId) => {
    setRegLoading(eventId);
    try {
      await registrationsAPI.register({ eventId });
      toast.success('Registered successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setRegLoading(null);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div>
      <SectionHeader
        eyebrow="Events"
        title="Browse Events"
        subtitle="Discover and register for upcoming campus events."
        action={isAdmin && (
          <button className="btn btn-primary" onClick={() => setCreateModal(true)}>
            <Icon name="plus" size={17} /> Create Event
          </button>
        )}
      />

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <Icon name="search" size={17} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events by name or venue…"
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2, display: 'flex' }}>
              <Icon name="x" size={15} />
            </button>
          )}
        </div>
        <div className="filter-chips">
          {FILTERS.map(f => (
            <button key={f} className={`chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 20 }}>
        Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> event{filtered.length !== 1 ? 's' : ''}
        {filter !== 'All' && ` · ${filter}`}
        {search && ` · "${search}"`}
      </p>

      {filtered.length === 0
        ? <EmptyState icon="event" title="No events found" sub="Try adjusting your search or filter criteria." />
        : (
          <div className="grid-auto">
            {filtered.map(ev => (
              <EventCard key={ev._id} event={ev} actions={
                !isAdmin && ev.status === 'upcoming' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleRegister(ev._id)}
                    disabled={regLoading === ev._id}
                  >
                    {regLoading === ev._id ? 'Registering…' : 'Register'}
                  </button>
                )
              } />
            ))}
          </div>
        )
      }

      {createModal && (
        <Modal title="Create New Event" onClose={() => setCreateModal(false)} wide>
          <EventForm onSave={() => { setCreateModal(false); toast.success('Event created!'); load(); }} onClose={() => setCreateModal(false)} />
        </Modal>
      )}
    </div>
  );
}
