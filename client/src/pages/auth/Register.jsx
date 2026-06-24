import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Alert, Spinner } from '../../components/common/UI';
import Icon from '../../components/common/Icon';
import { getErrorMessage } from '../../utils/helpers';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.password) { setError('All fields are required'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      await register({ name: form.name, email: form.email, mobile: form.mobile, password: form.password });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name',     name: 'name',     type: 'text',     icon: 'user',    placeholder: 'Priya Sharma' },
    { label: 'Email Address', name: 'email',    type: 'email',    icon: 'mail',    placeholder: 'you@college.edu' },
    { label: 'Mobile Number', name: 'mobile',   type: 'tel',      icon: 'phone',   placeholder: '9876543210' },
    { label: 'Password',      name: 'password', type: show ? 'text' : 'password', icon: 'shield',  placeholder: 'Min 6 characters' },
    { label: 'Confirm Password', name: 'confirm', type: show ? 'text' : 'password', icon: 'shield', placeholder: 'Re-enter password' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.07) 0%, transparent 60%)' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div className="card card-p-lg animate-scale-in">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--r-lg)', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="star" size={22} style={{ color: '#fff' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Create your account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join thousands of students on EventHub</p>
          </div>

          {error && <div style={{ marginBottom: 16 }}><Alert>{error}</Alert></div>}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {fields.map(({ label, name, type, icon, placeholder }) => (
              <div className="form-group" key={name}>
                <label className="form-label">{label}</label>
                <div className="form-input-icon" style={{ position: 'relative' }}>
                  <span className="input-icon"><Icon name={icon} size={15} /></span>
                  <input
                    className="form-input"
                    type={type} name={name}
                    value={form[name]}
                    onChange={handle}
                    placeholder={placeholder}
                    style={{ paddingLeft: 40 }}
                  />
                  {(name === 'password') && (
                    <button type="button" onClick={() => setShow(s => !s)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <Icon name="eye" size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? <Spinner size={18} color="#fff" /> : <><Icon name="arrow" size={18} />Create Account</>}
            </button>
          </form>

          <div className="divider-label" style={{ margin: '20px 0' }}><span>Already have an account?</span></div>
          <Link to="/login" className="btn btn-secondary btn-full" style={{ justifyContent: 'center' }}>Sign in instead</Link>
        </div>
      </div>
    </div>
  );
}
