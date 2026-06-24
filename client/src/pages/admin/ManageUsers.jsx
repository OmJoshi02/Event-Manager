import { useState, useEffect } from 'react';
import { authAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { PageSpinner, SectionHeader, Badge, EmptyState, ConfirmModal } from '../../components/common/UI';
import Icon from '../../components/common/Icon';
import { fmt, getErrorMessage } from '../../utils/helpers';

export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [promoteTarget, setPromoteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    authAPI.getUsers()
      .then(r => { const d = r.data; setUsers(Array.isArray(d) ? d : (Array.isArray(d?.users) ? d.users : [])); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    setActionLoading(deleteTarget);
    try {
      await authAPI.deleteUser(deleteTarget);
      toast.success('User removed.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handlePromote = async () => {
    setActionLoading(promoteTarget);
    try {
      await authAPI.makeAdmin(promoteTarget);
      toast.success('User promoted to admin.');
      setPromoteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.collegeName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageSpinner />;

  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div>
      <SectionHeader
        eyebrow="Admin"
        title="Manage Users"
        subtitle="View all registered users, promote to admin or remove accounts."
      />

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Users', value: users.length,       color: 'var(--accent)' },
          { label: 'Admins',      value: adminCount,         color: '#7c3aed' },
          { label: 'Regular',     value: users.length - adminCount, color: 'var(--success)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card card-p-sm" style={{ minWidth: 120, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar mb-6" style={{ maxWidth: 420 }}>
        <Icon name="search" size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or college…" />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><Icon name="x" size={14} /></button>}
      </div>

      {filtered.length === 0
        ? <EmptyState icon="users" title="No users found" />
        : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>User</th><th>Mobile</th><th>College</th><th>Dept.</th><th>Role</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                          {fmt.initials(u.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{u.mobile || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.collegeName || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{u.department || '—'}</td>
                    <td><Badge status={u.role} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {u._id !== currentUser?._id && u.role !== 'admin' && (
                          <button
                            className="btn btn-xs"
                            style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent-muted)' }}
                            onClick={() => setPromoteTarget(u._id)}
                            disabled={actionLoading === u._id}
                            title="Make Admin"
                          >
                            <Icon name="crown" size={13} /> Admin
                          </button>
                        )}
                        {u._id !== currentUser?._id && (
                          <button
                            className="btn btn-xs"
                            style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid rgba(220,38,38,0.2)' }}
                            onClick={() => setDeleteTarget(u._id)}
                            disabled={actionLoading === u._id}
                            title="Delete User"
                          >
                            <Icon name="trash" size={13} />
                          </button>
                        )}
                        {u._id === currentUser?._id && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>You</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      {deleteTarget && (
        <ConfirmModal
          title="Remove User"
          message="Are you sure you want to remove this user? Their account and data will be permanently deleted."
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          danger
        />
      )}

      {promoteTarget && (
        <ConfirmModal
          title="Promote to Admin"
          message="This user will gain full admin access to the platform. Are you sure?"
          onConfirm={handlePromote}
          onClose={() => setPromoteTarget(null)}
        />
      )}
    </div>
  );
}
