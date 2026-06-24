import Icon from './common/Icon';

export default function StatCard({ label, value, sub, icon, colorClass = 'stat-blue', trend }) {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-card-icon">
        <Icon name={icon} size={22} />
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      {sub && <div className="stat-card-trend">{sub}</div>}
      <div className="stat-card-bg">{trend}</div>
    </div>
  );
}
