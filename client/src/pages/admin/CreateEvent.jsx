import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { eventsAPI } from '../../api';
import { SectionHeader, Alert, Spinner } from '../../components/common/UI';
import { useForm, useAsync } from '../../hooks';
import Icon from '../../components/common/Icon';

const BLANK = { name: '', description: '', date: '', venue: '', registrationFee: 0, maxParticipants: 50, registrationDeadline: '', status: 'upcoming' };

export default function CreateEvent() {
  const navigate = useNavigate();
  const toast = useToast();
  const { values, handleChange } = useForm(BLANK);
  const { loading, error, run } = useAsync();

  const submit = (e) => {
    e.preventDefault();
    run(async () => {
      if (!values.name || !values.date || !values.venue) throw new Error('Name, date and venue are required');
      await eventsAPI.create({ ...values, registrationFee: Number(values.registrationFee), maxParticipants: Number(values.maxParticipants) });
      toast.success('Event created successfully!');
      navigate('/admin/manage-events');
    });
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <SectionHeader eyebrow="Admin" title="Create New Event" subtitle="Fill in the details to publish a new event." />

      <div className="card card-p-lg animate-scale-in">
        {error && <div style={{ marginBottom: 20 }}><Alert>{error}</Alert></div>}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Basic info */}
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Event Name *</label>
                <input className="form-input" name="name" value={values.name} onChange={handleChange} placeholder="Annual Tech Summit 2025" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" name="description" value={values.description} onChange={handleChange} placeholder="Describe the event, agenda, what participants can expect…" rows={4} />
              </div>
            </div>
          </div>

          <div style={{ border: 'none', borderTop: '1px dashed var(--border)', margin: '0' }} />

          {/* Logistics */}
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 14 }}>Logistics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Date &amp; Time *</label>
                  <input className="form-input" type="datetime-local" name="date" value={values.date} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Registration Deadline</label>
                  <input className="form-input" type="datetime-local" name="registrationDeadline" value={values.registrationDeadline} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Venue *</label>
                <input className="form-input" name="venue" value={values.venue} onChange={handleChange} placeholder="Main Auditorium, Block A, Ground Floor" />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed var(--border)' }} />

          {/* Registration */}
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 14 }}>Registration Settings</h3>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Registration Fee (₹)</label>
                <input className="form-input" type="number" name="registrationFee" value={values.registrationFee} onChange={handleChange} min={0} />
                <span className="form-hint">Set 0 for free events</span>
              </div>
              <div className="form-group">
                <label className="form-label">Max Participants</label>
                <input className="form-input" type="number" name="maxParticipants" value={values.maxParticipants} onChange={handleChange} min={1} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Event Status</label>
              <select className="form-input form-select" name="status" value={values.status} onChange={handleChange}>
                {['upcoming','ongoing','completed','cancelled'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? <Spinner size={16} color="#fff" /> : <><Icon name="plus" size={17} />Create Event</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
