import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../common/UI';
import Icon from '../common/Icon';

export default function Navbar({ onMenuToggle }) {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [dropOpen, setDropOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  const isPublic = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 'var(--nav-h)',
      background: 'var(--bg-nav)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      zIndex: 200, transition: 'background 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '100%', padding: '0 24px' }}>
        {/* Left */}
        <div className="flex items-center gap-3">
          {isLoggedIn && !isPublic && (
            <button className="btn btn-ghost btn-icon hide-desktop" onClick={onMenuToggle}
              style={{ display: 'none' }} id="menu-toggle">
              <Icon name="menu" size={20} />
            </button>
          )}
          <Link to={isLoggedIn ? (isAdmin ? '/admin/dashboard' : '/dashboard') : '/'} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="zap" size={18} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Event<span style={{ color: 'var(--accent)' }}>Hub</span>
            </span>
          </Link>
        </div>

        {/* Public nav links */}
        {isPublic && !isLoggedIn && (
          <div className="flex items-center gap-2 hide-mobile">
            {['Features', 'About'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: 8, transition: 'var(--transition)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >{l}</a>
            ))}
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon"
            title={isDark ? 'Switch to light' : 'Switch to dark'}
            style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--bg-card)' }}
          >
            <Icon name={isDark ? 'sun' : 'moon'} size={17} />
          </button>

          {!isLoggedIn ? (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen((o) => !o)}
                className="flex items-center gap-2"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '6px 12px 6px 8px', cursor: 'pointer', transition: 'var(--transition)' }}
              >
                <Avatar name={user?.name} size="sm" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="hide-mobile">
                  {user?.name?.split(' ')[0]}
                </span>
                <Icon name="chevronDown" size={14} style={{ color: 'var(--text-muted)' }} />
              </button>

              {dropOpen && (
                <div
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-xl)',
                    padding: '8px', minWidth: 220, zIndex: 300,
                    animation: 'fadeInDown 0.18s ease',
                  }}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  {/* User info */}
                  <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                    <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`} style={{ marginTop: 6 }}>{user?.role}</span>
                  </div>
                  {/* Links */}
                  {[
                    { to: isAdmin ? '/admin/dashboard' : '/dashboard', icon: 'dashboard', label: 'Dashboard' },
                    { to: '/profile', icon: 'user', label: 'Profile' },
                    ...(isAdmin ? [{ to: '/admin/manage-events', icon: 'event', label: 'Manage Events' }] : [{ to: '/my-registrations', icon: 'ticket', label: 'My Registrations' }]),
                  ].map(({ to, icon, label }) => (
                    <Link key={to} to={to} onClick={() => setDropOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 'var(--r-md)', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500, transition: 'var(--transition)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-muted)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Icon name={icon} size={16} style={{ color: 'var(--text-muted)' }} />{label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: 6, paddingTop: 6 }}>
                    <button onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 'var(--r-md)', color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 500, width: '100%', background: 'none', border: 'none', cursor: 'pointer', transition: 'var(--transition)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Icon name="logout" size={16} />Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
