import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content" style={{ paddingTop: 'var(--nav-h)' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
