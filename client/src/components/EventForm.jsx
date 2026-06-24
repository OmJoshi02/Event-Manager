import { useForm, useAsync } from '../hooks';
import { eventsAPI } from '../api';
import { Alert, Spinner } from './common/UI';

const BLANK = { name: '', description: '', date: '', venue: '', registrationFee: 0, maxParticipants: 50, registrationDeadline: '', status: 'upcoming' };

export default function EventForm({ initial, onSave, onClose }) {
  const { values, handleChange, setValues } = useForm(
    initial
      ? { ...initial, date: initial.date?.slice(0, 16) ?? '', registrationDeadline: initial.registrationDeadline?.slice(0, 16) ?? '' }
      : BLANK
  );
  const { loading, error, run } = useAsync();

  const submit = () => run(async () => {
    if (!values.name || !values.date || !values.venue) throw new Error('Name, date and venue are required');
    const body = { ...values, registrationFee: Number(values.registrationFee), maxParticipants: Number(values.maxParticipants) };
    initial ? await eventsAPI.update(initial._id, body) : await eventsAPI.create(body);
    onSave();
  });

  const field = (label, name, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} name={name} value={values[name]} onChange={handleChange} placeholder={placeholder} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {error && <Alert>{String(error.message || error)}</Alert>}
      {field('Event Name *', 'name', 'text', 'Annual Tech Summit 2025')}
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-input" name="description" value={values.description} onChange={handleChange} placeholder="Describe the event..." rows={3} />
      </div>
      <div className="grid-2">
        {field('Date & Time *', 'date', 'datetime-local')}
        {field('Registration Deadline', 'registrationDeadline', 'datetime-local')}
      </div>
      {field('Venue *', 'venue', 'text', 'Main Auditorium, Block A')}
      <div className="grid-2">
        {field('Registration Fee (₹)', 'registrationFee', 'number')}
        {field('Max Participants', 'maxParticipants', 'number')}
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-input form-select" name="status" value={values.status} onChange={handleChange}>
          {['upcoming', 'ongoing', 'completed', 'cancelled'].map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 justify-end" style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading}>
          {loading ? <Spinner size={16} color="#fff" /> : null}
          {initial ? 'Save Changes' : 'Create Event'}
        </button>
      </div>
    </div>
  );
}
