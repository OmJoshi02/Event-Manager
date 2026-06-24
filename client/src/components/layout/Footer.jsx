import { Link } from 'react-router-dom';
import Icon from '../common/Icon';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '48px 0 32px', marginTop: 'auto' }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: 40 }}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="zap" size={16} style={{ color: '#fff' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>
                Event<span style={{ color: 'var(--accent)' }}>Hub</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 240 }}>
              The all-in-one platform for college event discovery, registration, and management.
            </p>
          </div>
          {[
            { heading: 'Platform', links: [{ to: '/events', label: 'Browse Events' }, { to: '/login', label: 'Sign In' }, { to: '/register', label: 'Get Started' }] },
            { heading: 'Features', links: [{ label: 'Event Management' }, { label: 'Online Registration' }, { label: 'Analytics' }] },
            { heading: 'Connect', links: [{ label: 'Support' }, { label: 'Documentation' }, { label: 'Contact' }] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 14, color: 'var(--text-primary)' }}>{heading}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(({ to, label }) => (
                  <span key={label}>
                    {to ? (
                      <Link to={to} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                      >{label}</Link>
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                      >{label}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} EventHub. Built for campus communities.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Made with ❤️ for college students
          </p>
        </div>
      </div>
    </footer>
  );
}
