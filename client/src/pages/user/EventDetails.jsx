import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { eventsAPI, registrationsAPI } from '../../api';
import { PageSpinner, Badge, Alert } from '../../components/common/UI';
import Icon from '../../components/common/Icon';
import { fmt, getErrorMessage } from '../../utils/helpers';

export default function EventDetails() {
  const { id } = useParams();
  const { isLoggedIn, isAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [regDone, setRegDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    eventsAPI.getOne(id)
      .then(r => setEvent(r.data?.event || r.data || r))
      .catch(() => navigate('/events'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setRegLoading(true); setError('');
    try {
      await registrationsAPI.register({ eventId: id });
      setRegDone(true);
      toast.success('Successfully registered!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!event) return null;

  const info = [
    { icon: 'calendar', label: 'Date & Time',    value: fmt.dateTime(event.date) },
    { icon: 'location', label: 'Venue',           value: event.venue },
    { icon: 'users',    label: 'Max Participants', value: event.maxParticipants },
    { icon: 'clock',    label: 'Reg. Deadline',   value: event.registrationDeadline ? fmt.dateTime(event.registrationDeadline) : 'Not set' },
    { icon: 'dollar',   label: 'Registration Fee', value: fmt.price(event.registrationFee) },
  ];

  const bannerColors = { upcoming: ['#2563eb','#7c3aed'], ongoing: ['#059669','#0d9488'], completed: ['#64748b','#94a3b8'], cancelled: ['#dc2626','#9f1239'] };
  const [c1, c2] = bannerColors[event.status] || bannerColors.upcoming;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Back */}
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm mb-6" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="chevronLeft" size={16} /> Back to Events
      </button>

      {/* Hero banner */}
      <div style={{ height: 180, borderRadius: 'var(--r-2xl)', background: `linear-gradient(135deg, ${c1}, ${c2})`, marginBottom: 28, display: 'flex', alignItems: 'flex-end', padding: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(255,255,255,.04) 0, rgba(255,255,255,.04) 1px, transparent 1px, transparent 40px)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Badge status={event.status} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: '#fff', marginTop: 10, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            {event.name}
          </h1>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        {/* Left: details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Description */}
          <div className="card card-p">
            <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 12 }}>About this Event</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.9375rem' }}>
              {event.description || 'No description provided.'}
            </p>
          </div>

          {/* Info grid */}
          <div className="card card-p">
            <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 16 }}>Event Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {info.map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={icon} size={17} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginTop: 2 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: register card */}
        <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 20px)' }}>
          <div className="card card-p">
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: event.registrationFee === 0 ? 'var(--success)' : 'var(--accent)', letterSpacing: '-0.03em' }}>
                {fmt.price(event.registrationFee)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Registration Fee</div>
            </div>

            {error && <div style={{ marginBottom: 14 }}><Alert>{error}</Alert></div>}

            {regDone ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Icon name="checkCircle" size={26} style={{ color: 'var(--success)' }} />
                </div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>You're registered!</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>Check My Registrations for details.</div>
                <Link to="/my-registrations" className="btn btn-secondary btn-full" style={{ justifyContent: 'center' }}>
                  View Registrations
                </Link>
              </div>
            ) : isAdmin ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Admins manage events from the dashboard.</div>
            ) : event.status !== 'upcoming' ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Registration is closed for this event.</div>
            ) : (
              <button className="btn btn-primary btn-full btn-lg" onClick={handleRegister} disabled={regLoading}>
                {regLoading ? 'Registering…' : <><Icon name="ticket" size={18} />Register Now</>}
              </button>
            )}

            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[`📅 ${fmt.date(event.date)}`, `📍 ${event.venue}`, `👥 Max ${event.maxParticipants} seats`].map(t => (
                <div key={t} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>{t}</div>
              ))}
            </div>
          </div>

          {isAdmin && (
            <Link to="/admin/manage-events" className="btn btn-secondary btn-full mt-4" style={{ justifyContent: 'center' }}>
              <Icon name="edit" size={16} /> Manage this Event
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
