import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../common/Icon';
import { Avatar } from '../common/UI';

const USER_NAV = [
  { to: '/dashboard',         icon: 'dashboard', label: 'Dashboard' },
  { to: '/events',            icon: 'event',     label: 'Browse Events' },
  { to: '/my-registrations',  icon: 'ticket',    label: 'My Registrations' },
  { to: '/profile',           icon: 'user',      label: 'Profile' },
];

const ADMIN_NAV = [
  { to: '/admin/dashboard',          icon: 'dashboard', label: 'Dashboard' },
  { to: '/events',                   icon: 'event',     label: 'Browse Events' },
  { to: '/admin/manage-events',      icon: 'edit',      label: 'Manage Events' },
  { to: '/admin/create-event',       icon: 'plus',      label: 'Create Event' },
  { to: '/admin/manage-users',       icon: 'users',     label: 'Manage Users' },
  { to: '/profile',                  icon: 'user',      label: 'Profile' },
];

export default function Sidebar({ open, onClose }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? ADMIN_NAV : USER_NAV;

  const handleLogout = () => { logout(); navigate('/'); };

  const sidebarContent = (
    <div style={{
      width: 'var(--sidebar-w)', background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflowY: 'auto',
    }}>
      {/* User info */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} size="md" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`} style={{ fontSize: '0.65rem' }}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 12px', flex: 1 }}>
        {isAdmin && (
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '4px 8px 8px' }}>
            Admin
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {links.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 'var(--r-md)',
                fontSize: '0.875rem', fontWeight: 500,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-light)' : 'transparent',
                transition: 'var(--transition)', textDecoration: 'none',
              })}
              onMouseEnter={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'var(--bg-muted)'; }}
              onMouseLeave={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'transparent'; }}
            >
              {({ isActive }) => (
                <>
                  <Icon name={icon} size={17} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout}
          className="flex items-center gap-3"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 500, transition: 'var(--transition)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-light)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Icon name="logout" size={17} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div style={{ position: 'fixed', top: 'var(--nav-h)', left: 0, bottom: 0, zIndex: 100 }} className="hide-mobile">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-overlay)' }} onClick={onClose} />
          <div style={{ position: 'relative', zIndex: 1, height: '100%', paddingTop: 'var(--nav-h)' }}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
