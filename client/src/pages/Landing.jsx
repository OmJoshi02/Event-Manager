import { Link } from 'react-router-dom';
import Icon from '../components/common/Icon';

const FEATURES = [
  { icon: 'event',      title: 'Discover Events',      desc: 'Browse upcoming workshops, fests, hackathons, and cultural events all in one place.' },
  { icon: 'ticket',     title: 'Instant Registration',  desc: 'Register for events in seconds with a single click. No paperwork, no hassle.' },
  { icon: 'payment',    title: 'Secure Payments',       desc: 'Pay registration fees online with UPI, card, or cash — fully secure and tracked.' },
  { icon: 'dashboard',  title: 'Admin Dashboard',       desc: 'Powerful tools for organizers to manage events, registrations, and revenue.' },
  { icon: 'chart',      title: 'Real-time Analytics',   desc: 'Live stats on registrations, revenue, and attendance at your fingertips.' },
  { icon: 'bell',       title: 'Stay Updated',          desc: 'Get notified about upcoming deadlines and event changes automatically.' },
];

const STATS = [
  { value: '500+', label: 'Events Hosted' },
  { value: '12K+', label: 'Registrations' },
  { value: '50+',  label: 'Colleges' },
  { value: '99%',  label: 'Satisfaction' },
];

export default function Landing() {
  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ minHeight: 'calc(100vh - var(--nav-h))', display: 'flex', alignItems: 'center', padding: '80px 0 60px', background: 'radial-gradient(ellipse at 60% 0%, rgba(37,99,235,0.08) 0%, transparent 60%)', position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent-light)', border: '1px solid var(--accent-muted)', borderRadius: 'var(--r-full)', padding: '6px 14px', marginBottom: 28 }}>
              <Icon name="zap" size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em' }}>
                The #1 Campus Event Platform
              </span>
            </div>

            <h1 className="animate-fade-in-up anim-delay-1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 24, color: 'var(--text-primary)' }}>
              Your Campus.<br />
              <span style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                All in One Place.
              </span>
            </h1>

            <p className="animate-fade-in-up anim-delay-2" style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
              Discover events, register instantly, track your participation, and manage everything from one powerful dashboard — built for students and organizers.
            </p>

            <div className="animate-fade-in-up anim-delay-3 flex gap-4 justify-center flex-wrap">
              <Link to="/register" className="btn btn-primary btn-xl" style={{ gap: 10 }}>
                Get Started Free
                <Icon name="arrow" size={18} />
              </Link>
              <Link to="/events" className="btn btn-secondary btn-xl">
                Browse Events
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-in-up anim-delay-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, maxWidth: 640, margin: '64px auto 0', background: 'var(--border)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ background: 'var(--bg-card)', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.03em' }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '96px 0', background: 'var(--bg-base)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
            <div className="page-eyebrow" style={{ marginBottom: 12 }}>Everything You Need</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 16 }}>
              Built for modern campus life
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
              From registration to analytics — everything event organizers and participants need, in one seamless platform.
            </p>
          </div>

          <div className="grid-3">
            {FEATURES.map(({ icon, title, desc }, i) => (
              <div key={title} className={`card card-p card-hover animate-fade-in-up anim-delay-${(i % 3) + 1}`}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-lg)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon name={icon} size={22} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / CTA ── */}
      <section id="about" style={{ padding: '80px 0', background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(255,255,255,.03) 0px, rgba(255,255,255,.03) 1px, transparent 1px, transparent 40px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.025em', marginBottom: 16 }}>
            Ready to transform your campus events?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.0625rem', marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
            Join thousands of students who manage and discover events through EventHub every day.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn btn-xl" style={{ background: '#fff', color: 'var(--accent)', border: 'none', fontWeight: 700 }}>
              Create Free Account
            </Link>
            <Link to="/login" className="btn btn-xl" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.5)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
