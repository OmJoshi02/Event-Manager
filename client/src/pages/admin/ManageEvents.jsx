import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { PageSpinner, SectionHeader, Badge, EmptyState, Modal, ConfirmModal } from '../../components/common/UI';
import EventForm from '../../components/EventForm';
import Icon from '../../components/common/Icon';
import { fmt, getErrorMessage } from '../../utils/helpers';

export default function ManageEvents() {
  const toast = useToast();
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch]       = useState('');

  const load = () => {
    setLoading(true);
    eventsAPI.getAll().then(r => setEvents(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await eventsAPI.delete(deleteTarget);
      toast.success('Event deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const filtered = events.filter(ev =>
    !search || ev.name?.toLowerCase().includes(search.toLowerCase()) || ev.venue?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageSpinner />;

  return (
    <div>
      <SectionHeader
        eyebrow="Admin"
        title="Manage Events"
        subtitle="Edit, delete, and view registrations for all events."
        action={<Link to="/admin/create-event" className="btn btn-primary"><Icon name="plus" size={17} /> New Event</Link>}
      />

      {/* Search */}
      <div className="search-bar mb-6" style={{ maxWidth: 420 }}>
        <Icon name="search" size={17} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…" />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><Icon name="x" size={15} /></button>}
      </div>

      {filtered.length === 0
        ? <EmptyState icon="event" title="No events found" sub="Create your first event to get started." action={<Link to="/admin/create-event" className="btn btn-primary">Create Event</Link>} />
        : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ev => (
                  <tr key={ev._id}>
                    <td>
                      <div style={{ fontWeight: 700, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Max {ev.maxParticipants} seats</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{fmt.date(ev.date)}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.venue}</td>
                    <td style={{ fontWeight: 600, color: ev.registrationFee === 0 ? 'var(--success)' : 'var(--text-primary)' }}>{fmt.price(ev.registrationFee)}</td>
                    <td><Badge status={ev.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link to={`/admin/event-registrations/${ev._id}`} className="btn btn-ghost btn-icon-sm" title="View Registrations" style={{ color: 'var(--accent)' }}>
                          <Icon name="eye" size={15} />
                        </Link>
                        <button className="btn btn-ghost btn-icon-sm" title="Edit" onClick={() => setEditTarget(ev)} style={{ color: 'var(--warning)' }}>
                          <Icon name="edit" size={15} />
                        </button>
                        <button className="btn btn-ghost btn-icon-sm" title="Delete" onClick={() => setDeleteTarget(ev._id)} style={{ color: 'var(--danger)' }}>
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      {editTarget && (
        <Modal title={`Edit — ${editTarget.name}`} onClose={() => setEditTarget(null)} wide>
          <EventForm initial={editTarget} onSave={() => { setEditTarget(null); toast.success('Event updated!'); load(); }} onClose={() => setEditTarget(null)} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Event"
          message="Are you sure you want to delete this event? All registrations will also be removed. This cannot be undone."
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          danger
        />
      )}
    </div>
  );
}
