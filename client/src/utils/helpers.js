export const fmt = {
  date: (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  dateTime: (d) =>
    new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  price: (n) => (Number(n) === 0 ? 'Free' : `₹${Number(n).toLocaleString('en-IN')}`),
  initials: (name = '') => name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2),
  truncate: (str, n = 80) => (str?.length > n ? str.slice(0, n) + '...' : str),
};

export function statusBadgeClass(status) {
  const map = {
    upcoming:   'badge-upcoming',
    ongoing:    'badge-ongoing',
    completed:  'badge-completed',
    cancelled:  'badge-cancelled',
    paid:       'badge-paid',
    pending:    'badge-pending',
    failed:     'badge-failed',
    admin:      'badge-admin',
    user:       'badge-user',
    confirmed:  'badge-confirmed',
    free:       'badge-free',
  };
  return map[status?.toLowerCase()] || 'badge-gray';
}

export function eventBannerClass(status) {
  const map = {
    upcoming:  'event-card-banner',
    ongoing:   'event-card-banner event-card-banner-green',
    completed: 'event-card-banner event-card-banner-gray',
    cancelled: 'event-card-banner event-card-banner-gray',
  };
  return map[status?.toLowerCase()] || 'event-card-banner';
}

export function calcProfileCompletion(user) {
  if (!user) return 0;
  const fields = ['name', 'email', 'mobile', 'collegeName', 'department', 'year'];
  const filled = fields.filter((f) => user[f]).length;
  return Math.round((filled / fields.length) * 100);
}

export function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    'Something went wrong'
  );
}
