import socket from "../../socket";
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../../api';
import { PageSpinner, SectionHeader, Badge, EmptyState } from '../../components/common/UI';
import Icon from '../../components/common/Icon';
import { fmt } from '../../utils/helpers';

export default function EventRegistrations() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [regs, setRegs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');


const loadData = () => {
  setLoading(true);

  Promise.all([
    eventsAPI.getOne(id),
    registrationsAPI.getForEvent(id)
  ])
    .then(([evRes, regRes]) => {

      setEvent(evRes.data?.event || evRes.data || evRes);

      const r = regRes.data;

      setRegs(
        Array.isArray(r)
          ? r
          : (
              Array.isArray(r?.registrations)
                ? r.registrations
                : []
            )
      );

    })
    .finally(() => setLoading(false));
};

useEffect(() => {

  loadData();

  socket.on("newRegistration", (data) => {

    console.log("New Registration:", data);

    if (data.eventId === id) {
      loadData();
    }

  });

  socket.on("registrationCancelled", (data) => {

    console.log("Registration Cancelled:", data);

    if (data.eventId === id) {
      loadData();
    }

  });

  socket.on("paymentCompleted", () => {
    loadData();
});

  return () => {
    socket.off("newRegistration");
    socket.off("registrationCancelled");
    socket.off("paymentCompleted")
  };

}, [id]);

  if (loading) return <PageSpinner />;

  const filtered = regs.filter(r =>
    !search ||
    r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.userId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paidCount    = regs.filter(r => r.paymentStatus === 'paid').length;
  const pendingCount = regs.filter(r => r.paymentStatus === 'pending').length;
  const revenue      = regs.filter(r => r.paymentStatus === 'paid').reduce((a, r) => a + (event?.registrationFee || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Link to="/admin/manage-events" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Icon name="chevronLeft" size={16} /> Back to Events
        </Link>
      </div>

      <SectionHeader
        eyebrow="Admin · Event Registrations"
        title={event?.name || 'Event Registrations'}
        subtitle={event ? `${fmt.date(event.date)} · ${event.venue}` : ''}
      />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total', value: regs.length,    color: 'var(--accent)' },
          { label: 'Paid',  value: paidCount,       color: 'var(--success)' },
          { label: 'Pending', value: pendingCount,  color: 'var(--warning)' },
          { label: 'Revenue', value: fmt.price(revenue), color: 'var(--success)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card card-p-sm" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.625rem', fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar mb-4" style={{ maxWidth: 380 }}>
        <Icon name="search" size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><Icon name="x" size={14} /></button>}
      </div>

      {filtered.length === 0
        ? <EmptyState icon="users" title="No registrations yet" sub="Students who register for this event will appear here." />
        : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Mobile</th><th>College</th><th>Payment</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r._id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                          {(r.userId?.name || '?').slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{r.userId?.name || '—'}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.userId?.email || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.userId?.mobile || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.userId?.collegeName || '—'}</td>
                    <td><Badge status={r.paymentStatus || 'pending'} /></td>
                    <td><Badge status={r.registrationStatus || 'pending'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
}
