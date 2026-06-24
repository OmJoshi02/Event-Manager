import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Alert, Spinner } from '../../components/common/UI';
import Icon from '../../components/common/Icon';
import { getErrorMessage } from '../../utils/helpers';

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const { login, isAdmin }  = useAuth();
  const toast  = useToast();
  const navigate = useNavigate();

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Email and password are required'); return; }
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.07) 0%, transparent 60%)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Card */}
        <div className="card card-p-lg animate-scale-in">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--r-lg)', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="zap" size={22} style={{ color: '#fff' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Welcome back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to your EventHub account</p>
          </div>

          {error && <Alert>{error}</Alert>}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: error ? 16 : 0 }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="form-input-icon">
                <span className="input-icon"><Icon name="mail" size={16} /></span>
                <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="you@college.edu" autoComplete="email" />
              </div>
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center">
                <label className="form-label">Password</label>
              </div>
              <div className="form-input-icon">
                <span className="input-icon"><Icon name="shield" size={16} /></span>
                <input className="form-input" type={show ? 'text' : 'password'} name="password" value={form.password} onChange={handle} placeholder="••••••••" autoComplete="current-password" style={{ paddingRight: 42 }} />
                <button type="button" onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}>
                  <Icon name="eye" size={16} />
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <Spinner size={18} color="#fff" /> : <><Icon name="arrow" size={18} />Sign In</>}
            </button>
          </form>

          <div className="divider-label" style={{ margin: '20px 0' }}><span>New to EventHub?</span></div>

          <Link to="/register" className="btn btn-secondary btn-full" style={{ justifyContent: 'center' }}>
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
}
