import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authAPI } from '../../api';
import { SectionHeader, Alert, Spinner, ProgressBar, Avatar } from '../../components/common/UI';
import Icon from '../../components/common/Icon';
import { fmt, calcProfileCompletion, getErrorMessage } from '../../utils/helpers';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    collegeName: user?.collegeName || '',
    department:  user?.department  || '',
    year:        user?.year        || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user || data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const completion = calcProfileCompletion({ ...user, ...form });

  const readonlyFields = [
    { icon: 'user',  label: 'Full Name',    value: user?.name },
    { icon: 'mail',  label: 'Email Address', value: user?.email },
    { icon: 'phone', label: 'Mobile Number', value: user?.mobile },
    { icon: 'shield',label: 'Account Role',  value: user?.role },
  ];

  return (
    <div style={{ maxWidth: 780 }}>
      <SectionHeader eyebrow="Account" title="My Profile" subtitle="Manage your personal and academic information." />

      {/* Profile card */}
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)', border: 'none', padding: 28 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)', flexShrink: 0, border: '3px solid rgba(255,255,255,0.3)' }}>
            {fmt.initials(user?.name)}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>{user?.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: 10 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[user?.role, user?.collegeName, user?.department, user?.year ? `Year ${user.year}` : null].filter(Boolean).map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--r-full)' }}>{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>Profile Completion</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{completion}%</div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${completion}%`, background: '#fff', borderRadius: 4, transition: 'width 0.6s ease' }} />
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20, alignItems: 'start' }}>
        {/* Read-only info */}
        <div className="card card-p">
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 18 }}>Account Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {readonlyFields.map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={icon} size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginTop: 1 }}>{value || <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Not set</span>}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-muted)', borderRadius: 'var(--r-md)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="info" size={14} /> Name, email and mobile cannot be changed here.
          </div>
        </div>

        {/* Editable form */}
        <div className="card card-p">
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 18 }}>Academic Details</h3>
          {error && <div style={{ marginBottom: 14 }}><Alert>{error}</Alert></div>}
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">College / University</label>
              <div className="form-input-icon">
                <span className="input-icon"><Icon name="building" size={15} /></span>
                <input className="form-input" name="collegeName" value={form.collegeName} onChange={handle} placeholder="MIT College of Engineering" style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Department / Branch</label>
              <div className="form-input-icon">
                <span className="input-icon"><Icon name="graduation" size={15} /></span>
                <input className="form-input" name="department" value={form.department} onChange={handle} placeholder="Computer Engineering" style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Current Year</label>
              <select className="form-input form-select" name="year" value={form.year} onChange={handle}>
                <option value="">Select Year</option>
                {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? <Spinner size={16} color="#fff" /> : <><Icon name="check" size={16} />Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
