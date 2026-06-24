import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/common/Icon';

export default function NotFound() {
  const { isLoggedIn, isAdmin } = useAuth();
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '7rem', fontWeight: 900, letterSpacing: '-0.05em', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: 16 }}>
          404
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: 12 }}>Page not found</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to={isLoggedIn ? (isAdmin ? '/admin/dashboard' : '/dashboard') : '/'} className="btn btn-primary btn-lg">
            <Icon name="home" size={18} /> Go Home
          </Link>
          <Link to="/events" className="btn btn-secondary btn-lg">Browse Events</Link>
        </div>
      </div>
    </div>
  );
}
