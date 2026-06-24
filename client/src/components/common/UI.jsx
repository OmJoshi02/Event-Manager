import { useEffect } from 'react';
import Icon from './Icon';

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 22, color }) {
  return (
    <div
      style={{
        width: size, height: size, flexShrink: 0,
        border: `2.5px solid var(--border)`,
        borderTopColor: color || 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        display: 'inline-block',
      }}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <Spinner size={36} />
    </div>
  );
}

// ─── Alert ───────────────────────────────────────────────────────────────────
export function Alert({ type = 'error', children }) {
  const iconMap = { error: 'alertCircle', success: 'checkCircle', warning: 'alertCircle', info: 'info' };
  return (
    <div className={`alert alert-${type}`}>
      <Icon name={iconMap[type]} size={16} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{children}</span>
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, wide, children, footer }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', h);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box${wide ? ' modal-box-lg' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div style={{ padding: '0 28px 24px', borderTop: '1px solid var(--border)', paddingTop: 16 }}>{footer}</div>}
      </div>
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
import { statusBadgeClass } from '../../utils/helpers';
export function Badge({ status, children }) {
  return <span className={`badge ${statusBadgeClass(status)}`}>{children || status}</span>;
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ icon = 'event', title, sub, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><Icon name={icon} size={30} /></div>
      <div className="empty-state-title">{title}</div>
      {sub && <div className="empty-state-sub">{sub}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
export function ConfirmModal({ title, message, onConfirm, onClose, danger }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{message}</p>
      <div className="flex gap-3 justify-end">
        <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
        <button className={`btn btn-sm ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </Modal>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
export function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <div>
          {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-muted mt-1" style={{ textAlign: 'right' }}>{pct}%</div>
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
import { fmt } from '../../utils/helpers';
export function Avatar({ name, size = 'md' }) {
  return <div className={`avatar avatar-${size}`}>{fmt.initials(name)}</div>;
}
