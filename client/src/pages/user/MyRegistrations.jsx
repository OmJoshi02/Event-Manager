import { useState, useEffect } from 'react';
import { registrationsAPI, paymentsAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { PageSpinner, SectionHeader, Badge, EmptyState, ConfirmModal, Modal, Alert, Spinner } from '../../components/common/UI';
import Icon from '../../components/common/Icon';
import { fmt, getErrorMessage } from '../../utils/helpers';

function PaymentModal({ reg, onClose, onSuccess }) {
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const isFree = Number(reg.eventId?.registrationFee) === 0;

  const METHODS = [
    { id: 'upi',        emoji: '📱', label: 'UPI' },
    { id: 'card',       emoji: '💳', label: 'Card' },
    { id: 'netbanking', emoji: '🏦', label: 'Net Banking' },
    { id: 'cash',       emoji: '💵', label: 'Cash at Venue' },
  ];

  const pay = async () => {
    setLoading(true); setError('');
    try {
      await paymentsAPI.pay(reg._id, { paymentMethod: method, amount: reg.eventId?.registrationFee });
      toast.success('Payment successful!');
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Complete Payment" onClose={onClose}>
      {/* Summary */}
      <div style={{ background: 'var(--bg-muted)', borderRadius: 'var(--r-lg)', padding: 18, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 10 }}>{reg.eventId?.name}</div>
        {[
          ['Date',   reg.eventId?.date ? fmt.date(reg.eventId.date) : '—'],
          ['Venue',  reg.eventId?.venue || '—'],
          ['Amount', fmt.price(reg.eventId?.registrationFee)],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
            <span style={{ fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: 'var(--accent)', fontSize: '1.125rem' }}>{fmt.price(reg.eventId?.registrationFee)}</span>
        </div>
      </div>

      {isFree ? (
        <Alert type="success">This event is free — just confirm to complete registration.</Alert>
      ) : (
        <>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 12 }}>Select Payment Method</p>
          <div className="grid-2" style={{ gap: 10, marginBottom: 20 }}>
            {METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                style={{ padding: '14px', border: `2px solid ${method === m.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--r-lg)', background: method === m.id ? 'var(--accent-light)' : 'var(--bg-card)', cursor: 'pointer', transition: 'var(--transition)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{m.emoji}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: method === m.id ? 'var(--accent)' : 'var(--text-primary)' }}>{m.label}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {error && <div style={{ marginBottom: 14 }}><Alert>{error}</Alert></div>}

      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={pay} disabled={loading}>
          {loading ? <Spinner size={16} color="#fff" /> : (isFree ? 'Confirm Registration' : `Pay ${fmt.price(reg.eventId?.registrationFee)}`)}
        </button>
      </div>
    </Modal>
  );
}

export default function MyRegistrations() {
  const toast = useToast();
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [payTarget, setPayTarget] = useState(null);

  const load = () => {
  setLoading(true);

  registrationsAPI.getMine()
    .then(r => {
      console.log("API RESPONSE:", r.data);

      const data = r.data;

      setRegs(
        Array.isArray(data)
          ? data
          : (
              Array.isArray(data?.registrations)
                ? data.registrations
                : []
            )
      );
    })
    .finally(() => setLoading(false));
};

  useEffect(() => { load(); }, []);

  const handleCancel = async () => {
    try {
      await registrationsAPI.cancel(cancelTarget);
      toast.success('Registration cancelled.');
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div>
      <SectionHeader
        eyebrow="My Account"
        title="My Registrations"
        subtitle="Track all events you've signed up for and manage payments."
      />

      {regs.length === 0
        ? <EmptyState icon="ticket" title="No registrations yet" sub="Browse events and register to see them here." />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {regs.map(r => (
              <div key={r._id} className="card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  {/* Color stripe */}
                  <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: r.paymentStatus === 'paid' ? 'var(--success)' : r.paymentStatus === 'failed' ? 'var(--danger)' : 'var(--warning)', flexShrink: 0 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{r.eventId?.name || 'Unknown Event'}</h3>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          {r.eventId?.date && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                              <Icon name="calendar" size={13} style={{ color: 'var(--accent)' }} />
                              {fmt.date(r.eventId.date)}
                            </span>
                          )}
                          {r.eventId?.venue && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                              <Icon name="location" size={13} style={{ color: 'var(--accent)' }} />
                              {r.eventId.venue}
                            </span>
                          )}
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            <Icon name="dollar" size={13} style={{ color: 'var(--accent)' }} />
                            {r.eventId ? fmt.price(r.eventId.registrationFee) : '—'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                        <Badge status={r.paymentStatus || 'pending'} />
                        <Badge status={r.registrationStatus || 'pending'} />
                        {r.paymentStatus === 'pending' && r.eventId?.registrationFee > 0 && (
                          <button className="btn btn-success btn-sm" onClick={() => setPayTarget(r)}>
                            <Icon name="payment" size={14} /> Pay Now
                          </button>
                        )}
                        <button className="btn btn-sm" onClick={() => setCancelTarget(r._id)}
                          style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid rgba(220,38,38,0.2)' }}>
                          <Icon name="x" size={14} /> Cancel
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Registration ID: <span style={{ fontFamily: 'monospace' }}>{r._id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {cancelTarget && (
        <ConfirmModal
          title="Cancel Registration"
          message="Are you sure you want to cancel this registration? This action cannot be undone."
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
          danger
        />
      )}

      {payTarget && (
        <PaymentModal reg={payTarget} onClose={() => setPayTarget(null)} onSuccess={() => { setPayTarget(null); load(); }} />
      )}
    </div>
  );
}
