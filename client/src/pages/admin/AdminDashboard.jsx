import socket from "../../socket";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardAPI, eventsAPI } from "../../api";
import { PageSpinner, SectionHeader, Badge } from "../../components/common/UI";
import StatCard from "../../components/StatCard";
import Icon from "../../components/common/Icon";
import { fmt } from "../../utils/helpers";


function MiniBar({ value, max }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div style={{ flex: 1, minWidth: 60 }}>
      <div
        style={{
          height: 6,
          background: "var(--border)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background:
              "linear-gradient(90deg, var(--accent), #7c3aed)",
            borderRadius: 4,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [eventStats, setEventStats] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      dashboardAPI.getStats(),
      dashboardAPI.getEventStats(),
      eventsAPI.getAll(),
    ])
      .then(([s, es, ev]) => {
        setStats(s.data || s);

        const esList = es.data || es;

        setEventStats(
          Array.isArray(esList)
            ? esList.slice(0, 8)
            : []
        );

        const evList = ev.data || [];

        setRecentEvents(
          Array.isArray(evList)
            ? evList.slice(0, 5)
            : []
        );
      })
      .catch((err) => {
        console.error("Dashboard Load Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
    };
  useEffect(() => {
    loadData();

    socket.on("dashboardUpdated", () => {
      console.log("Dashboard Updated");
      loadData();
    });

    return () => {
      socket.off("dashboardUpdated");
    };
  }, []);

  if (loading) return <PageSpinner />;

  const maxReg = Math.max(
    ...eventStats.map((e) => e.registrations || 0),
    1
  );

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUser ?? stats?.totalUsers ?? 0,
      icon: "users",
      colorClass: "stat-blue",
      sub: "Registered accounts",
    },
    {
      label: "Total Events",
      value: stats?.totalEvents ?? 0,
      icon: "event",
      colorClass: "stat-purple",
      sub: "Created events",
    },
    {
      label: "Total Registrations",
      value:
        stats?.totalRegistration ??
        stats?.totalRegistrations ??
        0,
      icon: "ticket",
      colorClass: "stat-green",
      sub: "All sign-ups",
    },
    {
      label: "Total Revenue",
      value: `₹${(
        stats?.totalRevenue || 0
      ).toLocaleString("en-IN")}`,
      icon: "dollar",
      colorClass: "stat-yellow",
      sub: "Collected fees",
    },
  ];

  // KEEP EVERYTHING BELOW THIS SAME


  return (
    <div>
      <SectionHeader
        eyebrow="Admin Panel"
        title="Dashboard"
        subtitle="Platform-wide overview and performance metrics."
        action={
          <Link to="/admin/create-event" className="btn btn-primary">
            <Icon name="plus" size={17} /> New Event
          </Link>
        }
      />

      {/* Stat cards */}
      <div className="grid-4 mb-8">
        {statCards.map((s, i) => (
          <div key={s.label} className={`animate-fade-in-up anim-delay-${i + 1}`}>
            <StatCard {...s} />
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        {/* Event performance table */}
        <div className="card animate-fade-in-up anim-delay-2">
          <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Event Performance</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Registrations &amp; revenue per event</p>
            </div>
            <Link to="/admin/manage-events" className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }}>View all →</Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {eventStats.length === 0
              ? <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No event data yet.</div>
              : eventStats.map(ev => (
                <div key={ev._id || ev.eventName} style={{ padding: '12px 22px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.eventName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{ev.registrations || 0} registrations</div>
                  </div>
                  <MiniBar value={ev.registrations || 0} max={maxReg} />
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)', minWidth: 70, textAlign: 'right' }}>
                    ₹{(ev.revenue || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Recent events + quick links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Quick links */}
          <div className="card card-p animate-fade-in-up anim-delay-3">
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 14 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: '/admin/create-event',   icon: 'plus',      label: 'Create New Event',     color: 'var(--accent)' },
                { to: '/admin/manage-events',  icon: 'edit',      label: 'Manage Events',         color: '#7c3aed' },
                { to: '/admin/manage-users',   icon: 'users',     label: 'Manage Users',          color: 'var(--success)' },
                { to: '/events',               icon: 'eye',       label: 'View Public Events Page', color: 'var(--warning)' },
              ].map(({ to, icon, label, color }) => (
                <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 'var(--r-md)', background: 'var(--bg-muted)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', transition: 'var(--transition)', textDecoration: 'none', border: '1px solid transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = 'var(--bg-card)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--bg-muted)'; }}>
                  <Icon name={icon} size={17} style={{ color }} />
                  {label}
                  <Icon name="chevronRight" size={15} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent events */}
          <div className="card card-p animate-fade-in-up anim-delay-4">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Events</h3>
              <Link to="/admin/manage-events" className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }}>Manage →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentEvents.length === 0
                ? <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No events yet.</div>
                : recentEvents.map(ev => (
                  <div key={ev._id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: ev.status === 'upcoming' ? 'var(--accent)' : ev.status === 'ongoing' ? 'var(--success)' : 'var(--text-muted)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fmt.date(ev.date)}</div>
                    </div>
                    <Badge status={ev.status} />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
