import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventsAPI, registrationsAPI } from '../../api';
import { PageSpinner, SectionHeader, ProgressBar, Badge } from '../../components/common/UI';
import EventCard from '../../components/EventCard';
import Icon from '../../components/common/Icon';
import { fmt, calcProfileCompletion } from '../../utils/helpers';

export default function UserDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([eventsAPI.getAll(), registrationsAPI.getMine()])
      .then(([evRes, regRes]) => {
        const allEvents = evRes.data || [];
        setEvents(allEvents.filter(e => e.status === 'upcoming').slice(0, 3));
        const regList = regRes.data;
        setRegs(Array.isArray(regList) ? regList.slice(0, 4) : (Array.isArray(regList?.registrations) ? regList.registrations.slice(0, 4) : []));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  const completion = calcProfileCompletion(user);

  const quickActions = [
    { to: '/events',            icon: 'event',   label: 'Browse Events',     color: '#2563eb' },
    { to: '/my-registrations',  icon: 'ticket',  label: 'My Registrations',  color: '#7c3aed' },
    { to: '/profile',           icon: 'user',    label: 'Edit Profile',      color: '#059669' },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="User Dashboard"
        title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's what's happening on your campus today."
      />

      {/* Welcome + Profile completion */}
      <div className="grid-2 mb-6">
        {/* Welcome card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)', border: 'none', padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Good to see you</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}>{user?.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>{user?.email}</p>
              {user?.collegeName && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginTop: 4 }}>{user.collegeName}</p>}
            </div>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
              {fmt.initials(user?.name)}
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--r-full)' }}>
              {user?.role}
            </span>
            {user?.department && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--r-full)' }}>
                {user.department}
              </span>
            )}
          </div>
        </div>

        {/* Profile completion */}
        <div className="card card-p">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>Profile Completion</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Complete your profile for better experience</p>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{completion}%</div>
          </div>
          <ProgressBar value={completion} />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Name',       done: !!user?.name },
              { label: 'Email',      done: !!user?.email },
              { label: 'Mobile',     done: !!user?.mobile },
              { label: 'College',    done: !!user?.collegeName },
              { label: 'Department', done: !!user?.department },
              { label: 'Year',       done: !!user?.year },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2">
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: done ? 'var(--success-light)' : 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {done && <Icon name="check" size={10} style={{ color: 'var(--success)' }} />}
                </div>
                <span style={{ fontSize: '0.8125rem', color: done ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: done ? 500 : 400 }}>{label}</span>
                {!done && <Link to="/profile" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginLeft: 'auto' }}>Add</Link>}
              </div>
            ))}
          </div>
          {completion < 100 && (
            <Link to="/profile" className="btn btn-outline-accent btn-sm btn-full" style={{ marginTop: 16, justifyContent: 'center' }}>
              Complete Profile
            </Link>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-6">
        <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 14 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {quickActions.map(({ to, icon, label, color }) => (
            <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '12px 20px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', transition: 'var(--transition)', textDecoration: 'none', boxShadow: 'var(--shadow-xs)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = color; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 'var(--r-md)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={icon} size={17} style={{ color }} />
              </div>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Upcoming Events</h2>
          <Link to="/events" className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }}>View all →</Link>
        </div>
        {events.length === 0
          ? <div className="card card-p" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No upcoming events right now.</div>
          : <div className="grid-auto">{events.map(ev => <EventCard key={ev._id} event={ev} />)}</div>
        }
      </div>

      {/* Recent registrations */}
      {regs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Recent Registrations</h2>
            <Link to="/my-registrations" className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }}>View all →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Event</th><th>Date</th><th>Fee</th><th>Payment</th><th>Status</th></tr></thead>
              <tbody>
                {regs.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>{r.eventId?.name || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.eventId?.date ? fmt.date(r.eventId.date) : '—'}</td>
                    <td>{r.eventId ? fmt.price(r.eventId.registrationFee) : '—'}</td>
                    <td><Badge status={r.paymentStatus || 'pending'} /></td>
                    <td><Badge status={r.registrationStatus || 'pending'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
